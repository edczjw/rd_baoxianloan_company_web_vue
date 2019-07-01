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
                    还款状态：  {{this.status}}
                </el-col>
                <el-col :span="8">
                    剩余还款天数：  <span style="color:red">{{detail.surplusRepayDates}}</span>
                </el-col>
                <el-col :span="8">
                    借款总金额(元)：  {{detail.loanInitPrin}}
                </el-col>
                </el-row>

                <el-row>
                <el-col :span="8">
                    借款时间：  {{detail.borrowTime}}
                </el-col>
                <el-col :span="8">
                    已还总金额(元)：  {{detail.paidTotalMoney}}
                </el-col>
                <el-col :span="8">
                    剩余总金额(元)：  {{detail.surplusTotalMoney}}
                </el-col>
                </el-row>

                <el-row>
                <el-col :span="8">
                    已还本金(元)：  {{detail.paidPrincipal}}
                </el-col>
                <el-col :span="8">
                    剩余未还本金(元)：  {{detail.surplusPrincipal}}
                </el-col>
                <el-col :span="8">
                    已还利息(元)：  {{detail.paidInterest}}
                </el-col>
                </el-row>

                <el-row>
                <el-col :span="8">
                    剩余未还利息(元)：  {{detail.surplusInterest}}
                </el-col>
                <el-col :span="8">
                    已还罚息(元)：  {{detail.paidPenalty}}
                </el-col>
                <el-col :span="8">
                    剩余未还罚息(元)：  {{detail.surplusPenalty}}
                </el-col>
                </el-row>
                <el-row>
                <el-col :span="8">
                    逾期天数：  {{detail.overdueDates}}
                </el-col>
                <el-col :span="8">
                    借款合同：
                    <template>
                        <span v-if="detail.contUrl=='' || detail.contUrl==null">无</span>
                        <span v-else>
                        <a href="detail.contUrl" target="_blank">点击查看合同</a>
                        </span>
                    </template>
                </el-col>
                </el-row>
                </div>
                
                <div class="smit" v-if="smitshow">
                            <div class="ed">还款本金(元)：
                                <el-input class="input" size="mini" v-model="form.repayPrincipal" placeholder="还款金额(如200)"
                                @blur="htick()"></el-input>
                            </div>
                            <p>  还款本金(元)：{{details.repayPrincipal}}</p>
                            <p>  还款利息(元)：{{details.repayInterest}}</p>
                            <p>  本次还款总金额(元)：{{details.repayTotalMoney}}</p>
                        <el-button style="width:100%;margin-top:10px;" type="success" @click="submit()">提交</el-button>

                </div>
                </el-card>

  </div>
</template>
<script>
export default {
  data() {
    return {
        smitshow:true,
        status:"",
        detail:{
        },

        details:{

        },
        form:{  
            repayPrincipal:""
        }
    };
  },
  mounted() {
      this.getshow()
      this.getdetail();
  },
  methods: {
      submit(){
          if(this.form.repayPrincipal < this.detail.surplusPrincipal){
              
          this.$axios({
                        method: 'post',
                        url: this.$store.state.domain +"/biz/repay",
                        data: {
                            processNo:this.$route.query.processNo,
                            repayPrincipal:this.form.repayPrincipal,
                            repayInterest:this.details.repayInterest,
                            repaySvcFee:this.details.repaySvcFee,
                            repayPenalty:this.details.repayPenalty,
                            repayTotalMoney:this.details.repayTotalMoney
                        }
                    })
                    .then(
                        response => {
                        if(response.data.code==0){
                            this.$message.success('恭喜你，提交成功！');
                        }else{
                            this.$message.error(response.data.msg);
                        }
                        },
                        response => {
                        console.log(response);
                        }
                     )
          }
          else{
              this.$message.error('还款本金不得大于剩余未还本金！')
          }
      },
      htick(){
             this.$axios({
                        method: 'post',
                        url: this.$store.state.domain +"/biz/repayTrial",
                        data: {
                            processNo:this.$route.query.processNo,
                            repayPrincipal:this.form.repayPrincipal
                        }
                    })
                    .then(
                        response => {
                        if(response.data.code==0){
                            this.details = response.data.detail.result
                        }else{
                            this.$message.error(response.data.msg);
                        }
                        },
                        response => {
                        console.log(response);
                        }
                     )
      },
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
            this.status=this.$route.query.status
             this.$axios({
                        method: 'post',
                        url: this.$store.state.domain +"/biz/order/getDetail",
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
    width: 67%;
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
    width: 32%;
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
