<template>
    <div class="goods-wapper">
        <div class="heading-top">
        <el-row>
        <el-col :span="24"><i class="el-icon-d-arrow-right"></i>借款申请</el-col>
        </el-row>
        </div>
        <el-card class="box-card">
                <div class="keyong"><i class="el-icon-share"></i> 当前可用额度(元)： {{this.availableCredit}}</div>
            <div class="applymo">
                <el-form
                    ref="checkform"
                    :model="this.checkform"
                    status-icon
                    label-width="125px"
                    class="demo-ruleForm"
                    size="mini"
                    :rules="rules"
                >
                <el-row :gutter="24">
                    <el-col :span="17">
                    <el-form-item label="借款金额(元)" prop="applyLimit" :rules="rules.account">
                        <el-input size="mini" class="ell" placeholder="借款金额请输入整数" v-model.trim="checkform.applyLimit">
                        </el-input>
                    </el-form-item>
                    </el-col>

                </el-row>

                    <el-row :gutter="24">
                        <el-col :span="12">
                        <el-form-item label="验证码" prop="verifyCode">
                            <el-input
                            class="ell"
                            size="mini"
                            placeholder="验证码"
                            v-model.trim="checkform.verifyCode"
                            >
                            </el-input>
                        </el-form-item>
                        </el-col>

                        <el-col :span="6.5">
                            <el-button icon="el-icon-mobile-phone" :disabled="disabled=!show" type="primary" size="mini" @click="send()">
                            <span v-show="show">获取验证码</span>
                            <span v-show="!show" class="count">{{count}} s</span>
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
                
            </div>
            <div class="dibu">

            <div class="checkbox">
                <el-checkbox prop="agreementStatus" size="mini" v-model="agreementStatus">已同意并愿意接受 
                    <a href="https://yixiangweilai.oss-cn-shenzhen.aliyuncs.com/jiekuanxieyi/%E5%80%9F%E6%AC%BE%E5%90%88%E5%90%8C%EF%BC%88%E4%BC%81%E4%B8%9A%E7%BA%BF%E4%B8%8A%E7%89%88%EF%BC%89%EF%BC%8D%E6%98%93%E4%BA%AB%E9%A1%B9%E7%9B%AE%EF%BC%8D%E5%AE%9A%E7%A8%BF1.0%20%E4%B8%8D%E5%8E%BB%E6%A1%86%284%29%281%29%282%29.pdf" target="_blank">
                    《借款协议》</a>
                    
                </el-checkbox>          
            </div>
                <el-button type="success" size="small" @click="submit('checkform')">提交</el-button>
            </div>

            <div class="submit-image">
                <el-upload
                    class="upload-demo"
                    drag
                    accept="image/png, image/jpeg,image/bmp,image/jpg"
                    :limit="2"
                    :show-file-list=false
                    :http-request="Upload"
                    :file-list='fileList'
                    :on-exceed="handleExceed"
                    :before-upload="beforeAvatarUpload"
                    :on-change="handleChange"
                    action=""
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip tiip" slot="tip"> 仅限jpg/png/bmp/jpeg格式，2份以内(含)，每份20M以内(含)</div>
                    </el-upload>
                    <el-progress v-if="videoFlag" :percentage="videoUploadPercent" style="margin-top:30px;"></el-progress>
                    
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
            },

            //输入框验证
            rules: {
                account: [
                { required: true, message: "借款金额不能为空。", trigger: "blur" },
                { pattern: /^([0-9]{1,})$/, message: '请输入整数，不允许输入小数。', trigger: 'blur'},
                ]}
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
            const TIME_COUNT = 60; //更改倒计时时间
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
                            if(response.data.code==1){
                              this.$message.error(response.data.msg);
                              this.show = true;
                              clearInterval(this.timer);  // 清除定时器
                              this.timer = null;
                            }
                        },
                        response => {
                            console.log(response);
                            this.show = true;
                            clearInterval(this.timer);  // 清除定时器
                            this.timer = null;
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

        submit(formName){
            
      this.$refs[formName].validate((valid) => {
          if (valid) {
        if(this.availableCredit < this.checkform.applyLimit || this.checkform.applyLimit<1000 || this.checkform.applyLimit>500000)
        {   
            this.$confirm('申请借款金额不得高于当前可用额度，并且一次不得低于1000元，不得高于500000元.', '提示', {
          confirmButtonText: '确定',
          showCancelButton:false,
          type: 'warning'
        }).then(() => {

        }).catch(() => {

        });
           
           }else{
        if(this.agreementStatus==true ){
        this.checkform.channelCd = sessionStorage.getItem("channelCd");
        this.$axios({
                    method: 'post',
                    url: this.$store.state.domain +"/biz/order/apply",
                    data:this.checkform
                })
                .then(
                    response => {
                    if(response.data.code==0){
                        this.$message.success('恭喜你，提交'+response.data.msg);
                        
                        this.$router.push("/orderlist");//跳转
                    }else{
                        this.$message.error(response.data.msg);
                    }
                    },
                    response => {
                    console.log(response.data.msg);
                    }
                    )
            }else{
                this.$message.error("请阅读借款协议！");
            }
            
        }
        } else {
              console.log('error submit!!');
              return false;
            }
        })
        },

        beforeAvatarUpload(file) {
        const length = this.fileList.length <= 2;
        const isLt20M = file.size / 1024 / 1024 < 20;
        const isJPG = file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/bmp'||file.type === 'image/jpg';
        
        if (!isJPG) {
          this.$message.error('只能上传jpg/png/bmp/jpeg格式！');
        }

        if (!length) {
          this.$message.error('此项上传文件数量不得大于2份，上传第3份文件失败！');
        }

        if (!isLt20M) {
          this.$message.error('上传文件大小不能超过 20MB，此文件上传失败!');
        }
        return isJPG && length && isLt20M;
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

                    const storeAs = 'test/meson/'+channelCd+'/file/bxenterprise/'+obj+'/cooperative/'+obj2+'-'
                    +fileName

                    if(this.checkform.agreementUrl == ''){
                        this.checkform.agreementUrl='http://yixiangweilai.oss-cn-shenzhen.aliyuncs.com/'+storeAs
                    }else{
                        this.checkform.agreementUrl=this.checkform.agreementUrl+',http://yixiangweilai.oss-cn-shenzhen.aliyuncs.com/'+storeAs
                    }

                    console.log(this.checkform.agreementUrl)
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
    position: relative;
    border-top: 3px solid rgba(15, 182, 160, 0.849);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 50px 70px;
}
.applymo{
    position: relative;
    width: 60%;
    font-size: 14px;
    text-align: center;
    left: 0%;
    margin-top: 60px;
}
.keyong{
    position: absolute;
    top: 35px;
    left: 4%;
    font-family: '苹方';
    line-height: 22px;
    font-size: 17px;
    color: rgb(240, 42, 35);
    cursor: pointer;
    padding: 10px 20px 10px 10px;
    width: 32%;
    text-align: left;
    font-weight: bolder;
}
.tiip{
    text-align: left;
}
.submit-image{
    position: absolute;
    top: 25%;
    right: 10%;
    padding: 20px;
    text-align: center;
    border: 1px solid #eee;
}
.dibu{
    width: 45%;
    font-size: 12px !important;
    padding: 20px 10px;
    margin-top: 30px;
    border-top: 1px solid #eee;
    .el-button{
        position: relative;
        left: 35%;
        width: 25%;
    }
    .checkbox{
        margin-bottom: 20px;
        text-align: center;
    }
}
</style>

