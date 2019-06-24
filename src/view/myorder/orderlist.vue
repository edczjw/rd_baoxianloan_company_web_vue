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
                <el-col :span="8">
                <el-form-item label="订单状态">
                    <el-select size="mini" v-model="form.region" placeholder="请选择订单状态">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>

                <el-col :span="2">
                    <div class="di">
                        <el-button size="mini" type="primary" @click="resetForm('searchform')">
                        重置
                        </el-button>
                    </div>
                    </el-col>
                </el-row>
            </el-form>
            </div>

              <el-table :data="tableData"  border
                size="mini" stripe style="width: 100%;">
                    <el-table-column prop="processNo" label="订单编号" align="center"> </el-table-column>
                    <el-table-column prop="applyLimit" label="借款金额（元）" align="center"> </el-table-column>
                    <el-table-column prop="applyTerm" label="借款天数（天）" align="center"></el-table-column>
                    <el-table-column prop="status" label="订单状态" align="center"> </el-table-column>
                    <el-table-column prop="createTime"  label="剩余还款天数" align="center">
                        <template slot-scope="scope">
                            <span  style="color:red;">{{scope.row.createTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="订单时间" align="center"> </el-table-column>
                    <el-table-column prop="status" label="合同信息" align="center"></el-table-column>
                    <el-table-column prop="operation" label="操作" align="center">
                        <!-- 点击某个客户姓名查看详情 -->
                        <template slot-scope="scope">
                            <el-button type="text" size="small"
                            @click="gouserdetail(scope.row.operation,scope.row.status)">
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

            tableData:[{
                createTime:5,
                operation:'去还款'
            },{
                createTime:5,
                operation:'查看'
            }],

            form:{
            }
        }
    },
    mounted() {
        // this.getlist();
    },
    methods: {
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

        getlist(){
            this.searchform.enterpriseNo = sessionStorage.getItem("enterpriseNo");
            this.$axios({
                        method: 'post',
                        url: this.$store.state.domain +"/biz/order/list",
                        data: this.searchform,
                    })
                    .then(
                        response => {
                        if(response.data.code==0){
                             this.tableData = response.data.detail.result.pageList;
                             this.searchform.pageSize = response.data.detail.result.pageSize
                             this.searchform.pageIndex = response.data.detail.result.pageIndex
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
        this.searchform.pageSize = psize;
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.searchform.pageIndex =1;
        this.getlist();
      },

      // 初始页currentPage
      handleCurrentChange(pindex) {
        this.searchform.pageIndex = pindex;
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
</style>

