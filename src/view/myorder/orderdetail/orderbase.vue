<template>
  <div>
      <div class="heading-top">
        <el-row>
        <el-col :span="24">订单详情</el-col>
        </el-row>
        </div>
                <el-card class="box-card">
                
                <div class="tap" ref="abc">
                <el-row>
                <el-col :span="8">
                    还款状态：{{detail.enterpriseName}}
                </el-col>
                <el-col :span="8">
                    剩余还款天数：<span style="color:red">5{{detail.socialCode}}</span>
                </el-col>
                <el-col :span="8">
                    借款总金额（元）：{{detail.registeredAddress}}
                </el-col>
                </el-row>

                <el-row>
                <el-col :span="8">
                    借款时间：{{detail.businessAddress}}
                </el-col>
                <el-col :span="8">
                    已还总金额（元）：{{detail.registeredCapital}}
                </el-col>
                <el-col :span="8">
                    剩余总金额（元）：{{detail.paidCapital}}
                </el-col>
                </el-row>

                <el-row>
                <el-col :span="8">
                    已还本金（元）：{{detail.startingDate}}
                </el-col>
                <el-col :span="8">
                    剩余未还本金（元）：{{detail.endingDate}}
                </el-col>
                <el-col :span="8">
                    已还利息（元）：{{detail.legalName}}
                </el-col>
                </el-row>

                <el-row>
                <el-col :span="8">
                    剩余未还利息（元）：{{detail.legalIdCard}}
                </el-col>
                <el-col :span="8">
                    已还罚息（元）：{{detail.legalPhone}}
                </el-col>
                <el-col :span="8">
                    剩余未还罚息（元）：{{detail.cardNo}}
                </el-col>
                </el-row>
                <el-row>
                <el-col :span="8">
                    逾期天数：{{detail.bankName}}
                </el-col>
                <el-col :span="8">
                    借款合同：{{detail.accountName}}
                </el-col>
                </el-row>
                </div>
                
                <div class="smit" v-if="smitshow">
                            <div class="ed">还款本金(元)：<el-input class="input" size="mini" v-model="form.name" placeholder="还款金额(如200)"></el-input>
                            </div>
                            <p>  还款本金(元)：{{detail.accountName}}</p>
                            <p>  还款利息(元)：{{detail.accountName}}</p>
                            <!-- <p>  冲销罚息(元)：{{detail.accountName}}</p> -->
                            <p>  本次还款总金额(元)：{{detail.accountName}}</p>
                        <el-button style="width:100%;margin-top:10px;" type="success">提交</el-button>

                </div>
                </el-card>

  </div>
</template>
<script>
export default {
  data() {
    return {
        smitshow:true,
        detail:{},

        form:{

        }
    };
  },
  mounted() {
      this.getshow()
    //   this.getdetail();
  },
  methods: {
        getshow(){
            if(this.$route.query.operation == '去还款'){
                this.smitshow=true
            }else{
                this.smitshow=false
                //vue 修改元素样式
                this.$refs.abc.style.width = '100%';
            }
        },
        getdetail(){
             this.$axios({
                        method: 'post',
                        url: this.$store.state.domain +"/biz/order/orderEnterpriseInfo",
                        data: {
                            processNo:this.$route.query.processNo
                        }
                    })
                    .then(
                        response => {
                        if(response.data.code==0){
                            this.detail = response.data.detail.result
                        }else{
                            this.$message.error(response.data.msg);
                        }
                        },
                        response => {
                        console.log(response);
                        }
                     )
        }
  },
  watch: {},
  components: {}
};
</script>

 <style lang='less' scoped>
.box-card{
    border-top: 3px solid rgba(15, 182, 160, 0.849);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 30px 0;
    font-family: '苹方';
}
.set-wapper{
    width:100%;
    height: 0;
    position: relative;
    padding-bottom: 80%;
}
.el-col h4{
    padding: 20px 0;
    color: rgba(241, 160, 38, 0.767);
    font-size: 22px;
    font-weight: bolder;
    border-bottom:1px solid #eee;
}
.tap {
    width: 70%;
    float: right;
}
.tap .el-row{
    margin:20px 0;
    font-size: 14px;
    font-family: '苹方';
    border-bottom: 1px dashed rgba(139, 187, 231, 0.541);
    padding: 10px 0 0px 20px;
    
}
.smit{
    width: 27%;
    color: rgb(235, 153, 47);
    border-radius: 10px;
    background: rgb(239, 241, 241);
    padding: 30px;
    font-size: 14px;
    p{
        line-height: 30px;
    }

}
.ed .el-input{
    width: 56%;
}
</style>
