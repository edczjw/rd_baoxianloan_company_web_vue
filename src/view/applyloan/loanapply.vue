<template>
    <div class="goods-wapper">
        <div class="heading-top">
        <el-row>
        <el-col :span="24">借款申请</el-col>
        </el-row>
        </div>
        <el-card class="box-card">
            <div class="applymo">
                <div class="keyong">当前可用额度： {{this.availableCredit}}</div>
                <el-form
                    ref="loginform"
                    :model="this.checkform"
                    status-icon
                    label-width="85px"
                    class="demo-ruleForm"
                    size="mini"
                >
                <el-row :gutter="24">
                    <el-col :span="17">
                    <el-form-item label="借款金额" prop="applyLimit">
                        <el-input class="ell" placeholder="借款金额请输入整数" v-model.trim="checkform.applyLimit">
                        <template slot="prepend">
                            <i class="el-icon-edit"></i>
                        </template>
                        </el-input>
                    </el-form-item>
                    </el-col>

                </el-row>

                    <el-row :gutter="24">
                        <el-col :span="17">
                        <el-form-item label="验证码" prop="verifyCode">
                            <el-input
                            class="ell"
                            placeholder="请输入验证码"
                            v-model.trim="checkform.verifyCode"
                            >
                            <template slot="prepend">
                                <i class="el-icon-view"></i>
                            </template>
                            </el-input>
                        </el-form-item>
                        </el-col>

                        <el-col :span="7">
                            <el-button icon="el-icon-mobile-phone" :disabled="disabled=!show" type="primary" size="mini" @click="send()">
                            <span v-show="show">获取验证码</span>
                            <span v-show="!show" class="count">{{count}} s</span>
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div class="submit-image">
                <el-upload
                    class="upload-demo"
                    drag
                    :limit="5"
                    :http-request="Upload"
                    :file-list='fileList'
                    :on-exceed="handleExceed"
                    :before-upload="beforeAvatarUpload"
                    :on-change="handleChange"
                    action=""
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip"> * 只能上传jpg/png/bmp/jpeg格式</div>
                    <div slot="tip" class="el-upload__tip">（2份以内（含），每份20M以内（含））</div>
                    </el-upload>
                    <el-progress v-if="videoFlag" :percentage="videoUploadPercent" style="margin-top:30px;"></el-progress>
                    
            </div>

            <div class="dibu">

            <div class="checkbox">
                <el-checkbox prop="agreementStatus" v-model="agreementStatus">已同意并愿意接受 
                    <router-link to="">
                    《借款协议》
                    </router-link> 
                </el-checkbox>          
            </div>
                <el-button type="success" @click="submit()">提交</el-button>
            </div>
        </el-card>

       
    </div>
</template>
<script>
export default {
    data(){
        return{
            
            show: true,  // 初始启用按钮
            count: '',   // 初始化次数
            timer: null,
            agreementStatus:false,//勾选
            
            fileList:[],//文件容器
            videoFlag:false,//进度条
            videoUploadPercent:0,

            availableCredit:"",//可用额度

            // 登录表单
            searchform: {
                channelCd: ""
            },

            form:{
                account: "",
                smsType:2
            },

            checkform:{
                channelCd:"",
                applyLimit:"",
                agreementUrl:"",
                verifyCode:"",
            }
        }
    },
    mounted() {
        this.getavailableCredit();
    },
    methods: {
        getavailableCredit(){
        this.searchform.channelCd = sessionStorage.getItem("channelCd");
        this.$axios({
                    method: 'post',
                    url: this.$store.state.domain +"/biz/loan/availableCredit",
                    data:this.searchform
                })
                .then(
                    response => {
                    if(response.data.code==0){
                            this.availableCredit = response.data.detail.result.availableCredit;
                    }else{
                        this.$message.error(response.data.msg);
                    }
                    },
                    response => {
                    console.log(response);
                    }
                    )
        },

        send(){
            const TIME_COUNT = 180; //更改倒计时时间
                if (!this.timer) {
                    this.count = TIME_COUNT;
                    this.show = false;
                    this.form.account = sessionStorage.getItem("account");
                    
                    this.$axios({
                        method: 'post',
                        url: this.$store.state.domain +"/biz/user/getSmsVerification",
                        data:this.form
                    })
                    .then(
                        response => {
                            console.log(response);
                        },
                        response => {
                            console.log(response);
                        }
                    )
                    this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                        this.count--;
                    } else {
                        this.show = true;
                        clearInterval(this.timer);  // 清除定时器
                        this.timer = null;
                    }
                    }, 1000)
                }
        
        },

        submit(){
        if(this.agreementStatus==true){
        this.checkform.channelCd = sessionStorage.getItem("channelCd");
        this.$axios({
                    method: 'post',
                    url: this.$store.state.domain +"/biz/order/apply",
                    data:this.checkform
                })
                .then(
                    response => {
                    if(response.data.code==0){
                            console.log(response.data.msg);
                    }else{
                        this.$message.error(response.data.msg);
                    }
                    },
                    response => {
                    console.log(response.data.msg);
                    }
                    )
            }else{
                this.$message.error("必须勾选同意并接受借款协议！");
            }
        },

        beforeAvatarUpload(file) {
        const length = this.fileList.length <= 2;
        const isLt20M = file.size / 1024 / 1024 < 20;

        if (!length) {
          this.$message.error('此项上传文件数量不得大于2份，上传第3份文件失败！');
        }

        if (!isLt20M) {
          this.$message.error('上传文件大小不能超过 20MB，此文件上传失败!');
        }
        return length && isLt20M;
      },
        //对文件列表进行控制
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-2);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
        //上传
      Upload(file) {
          var _that=this;
        this.videoFlag= true;
        const OSS = require('ali-oss');
            let _self = this;
            var bucket;//OSS文件名称
            var region;
            var extranet;
            var accessKeyId;
            var accessKeySecret;
        this.$axios({
            method: 'post',
            url: this.$store.state.domain +"/biz/getOssProperties"
            })
            .then(
                response => {// 向后台发请求 拉取OSS相关配置
                    
                    //后端提供数据
                    const client = new OSS({
                        region: 'oss-cn-shenzhen',// 服务器集群地区
                        extranet: response.data.extranet,
                        accessKeyId:response.data.secretId, // OSS帐号
                        accessKeySecret:response.data.secretKey, // OSS 密码
                        bucket:response.data.bucket // 阿里云上存储的 Bucket
                        })

                    // 存储路径，并且给图片改成唯一名字
                    var fileName = file.file.name 

                    //后缀名
                    const suffix = fileName.substr(fileName.indexOf("."));

                    //时间戳
                    const obj=this.timestamp();

                    //时间戳
                    const obj2=this.timestamp1();

                    //获取企业编号
                    const channelCd = sessionStorage.getItem("channelCd");

                    const storeAs = 'test-bx/bxmeson/bxmsscloan/file/enterprise/'+obj+'/'+channelCd+'/cooperative/'+obj2+'-'
                    +fileName

                    this.checkform.agreementUrl='http://mssaas.oss-cn-shenzhen.aliyuncs.com/'+storeAs

                    //上传
                    client.multipartUpload(storeAs,file.file,{
                        progress:function (p) { //获取进度条的值
                            // console.log(p)
                            _that.videoUploadPercent = p*100
                            
                        }}).then(res => {
                        if(res.url!=null || res.url!=""){
                            
                            // console.log('服务器返回的文件url：')

                            //返回服务器文件url
                            // console.log(res.url)
                            this.videoFlag = false;
                            _that.videoUploadPercent = 0;
                            
                            this.$notify({
                            title: '上传结果',
                            type: 'success',
                            offset: 100,
                            dangerouslyUseHTMLString: true,
                            message: '<strong>'+file.file.name+'文件上传成功！</strong>',
                            position: 'bottom-right'
                            });
                        }

                            }).catch(err => {
                                this.$message.error('上传文件异常:'+err);
                                console.log('上传文件异常：');
                                console.log(err)
                        });
                        //失败  
                    },
                    //打印
                    response => {
                    console.log(response);
                    }
            )
    },
    //  时间戳
        timestamp(){  
            const time = new Date();  
            const y = time.getFullYear();  
            const m = time.getMonth()+1;  
            const d = time.getDate();  
            const h = time.getHours();  
            const mm = time.getMinutes();  
            const s = time.getSeconds();  
            return ""+y+'-'+this.Add0(m)+'-'+this.Add0(d);  
        },
        Add0:function(m){  
            return m<10?'0'+m : m;  
        } ,

        //  时间戳1
        timestamp1(){  
            const time = new Date();  
            const y = time.getFullYear();  
            const m = time.getMonth()+1;  
            const d = time.getDate();  
            const h = time.getHours();  
            const mm = time.getMinutes();  
            const s = time.getSeconds();  
            return ""+y+'-'+this.Add1(m)+'-'+this.Add1(d)+'_'+this.Add1(h)+this.Add1(mm)+this.Add1(s);  
        },
        Add1:function(m){  
            return m<10?'0'+m : m;  
        } ,
        //点击操作跳转
        gouserdetail(operation,status){
            this.$router.push({
                path:"/orderbasedetail",
                query:{
                    operation:operation,
                    status:status
                    }
                })
        },

        

    },
}
</script>
<style lang="less" scoped>
.goods-wapper{
    width:100%;
}
.box-card{
    border-top: 3px solid rgba(15, 182, 160, 0.849);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 40px;
}
.applymo{
    width: 55%;
    font-size: 14px;
    border-right: 1px solid #eee;
    float: left;
}
.keyong{
    font-family: '苹方';
    line-height: 20px;
    font-size: 18px;
    margin-bottom: 30px;
    color: rgb(240, 42, 35);
    cursor: pointer;
    padding: 20px 20px 10px 0;
    border-radius: 10px;
    width: 310px;
    text-align: center;
}
.submit-image{
    text-align: center;
    width: 45%;
    float: right;
}
.dibu{
    width: 100%;
    border-top:1px solid #eee;
    padding: 20px;
    margin-top: 330px;
    .el-button{
        width: 100%;
    }
    .checkbox{
        width: 100%;
        margin-bottom: 20px;
        text-align: center;
    }
}
</style>

