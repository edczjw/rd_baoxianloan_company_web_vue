<template>
    <div class="goods-wapper">
        <div class="heading-top">
        <el-row>
        <el-col :span="24">我的订单</el-col>
        </el-row>
        </div>
        <el-card class="box-card">
            <div class="search">
            <el-form ref="form"  size="mini" :model="form" label-width="100px">
                <el-row :gutter="30">
                <el-col :span="6">
                <el-form-item label="订单状态"  prop="status">
                    <el-select size="mini" v-model="form.status" placeholder="请选择订单状态" clearable>
                    <el-option v-for="item in statuslist"
                        :key="item.type"
                        :label="item.desc"
                        :value="item.type"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>

                <el-col :span="2">
                        <el-button type="primary" @click="search()" size="mini">
                      搜索</el-button>
                </el-col>
                <el-col :span="2">
                        <el-button size="mini" type="primary" @click="resetForm('form')">
                        重置
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
            </div>

              <el-table :data="tableData"  border
                size="small" stripe style="width: 100%;">
                    <el-table-column prop="processNo" label="订单编号" align="center"> </el-table-column>
                    <el-table-column prop="applyLimit" label="借款金额（元）" align="center"> </el-table-column>
                    <el-table-column prop="applyTerm" label="借款天数（天）" align="center"></el-table-column>
                    <el-table-column prop="status" label="订单状态" align="center"> </el-table-column>
                    <el-table-column prop="remainTerm"  label="剩余还款天数" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.remainTerm <=30? 'term':'terms'">{{scope.row.remainTerm}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="订单时间" align="center"> </el-table-column>
                    <el-table-column prop="contractUrl" label="合同信息" align="center">
                        <template slot-scope="scope">
                            <a :href="scope.row.contractUrl" target="_blank">查看</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operation" label="操作" align="center">
                        <!-- 点击某个客户姓名查看详情 -->
                        <template slot-scope="scope">
                            <el-button type="text" size="small"
                            @click="gouserdetail(scope.row.processNo,scope.row.operation,scope.row.status,scope.row.applyLimit)">
                            {{scope.row.operation}}</el-button>
                        </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分页 -->
          <el-card>
            <el-pagination background style="text-align:center" 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="this.form.pageIndex"
             :page-sizes="[20,50,100]"  
             :page-size="this.form.pageSize" 
             layout="total, sizes, prev, pager, next" 
             :total="count"><!--这是显示总共有多少数据-->
            </el-pagination>
          </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            count:0,//总条数
            statuslist:[],
            tableData:[],

            form:{
                channelCd:"",
                status:"",
                pageIndex:1,//初始页
                pageSize: 50,//显示当前行的条数
            }
        }
    },
    mounted() {
        this.getlist();
        this.getstatuslist();
    },
    methods: {
        // 搜索功能
      search() {
        this.getlist();
      },

      // 重置功能
      resetForm(formName) {
        this.$refs[formName].resetFields();
        // this.getlist();
      },

        //点击操作跳转
        gouserdetail(processNo,operation,status,applyLimit){
            this.$router.push({
                path:"/orderbasedetail",
                query:{
                    processNo:processNo,
                    operation:operation,
                    status:status,
                    applyLimit:applyLimit
                    }
                })
        },

        getstatuslist(){
            this.$axios({
                        method: 'post',
                        url: this.$store.state.domain +"/biz/getOrderStateList"
                    })
                    .then(
                        response => {
                        if(response.data.code==0){
                             this.statuslist = response.data.detail.result;
                        }else{
                            this.$message.error(response.data.msg);
                        }
                        },
                        response => {
                        console.log(response);
                        }
                     )
        },
        getlist(){
            this.form.channelCd = sessionStorage.getItem("channelCd");
            this.$axios({
                        method: 'post',
                        url: this.$store.state.domain +"/biz/getOrderState",
                        data: this.form,
                    })
                    .then(
                        response => {
                        if(response.data.code==0){
                             this.tableData = response.data.detail.result.pageList;
                             this.form.pageSize = response.data.detail.result.pageSize
                             this.form.pageIndex = response.data.detail.result.pageIndex
                             this.count = response.data.detail.result.count
                        }else{
                            this.$message.error(response.data.msg);
                        }
                        },
                        response => {
                        console.log(response);
                        }
                     )
        },

        // 初始每页数据数pagesize
      handleSizeChange(psize) {
        // 改变每页显示的条数
        this.form.pageSize = psize;
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.form.pageIndex =1;
        this.getlist();
      },

      // 初始页currentPage
      handleCurrentChange(pindex) {
        this.form.pageIndex = pindex;
        this.getlist();
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
}
.term{
    color: red;
}

.terms{
    color: black;
}
</style>

