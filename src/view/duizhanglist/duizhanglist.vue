<template>
    <div class="goods-wapper">
        <div class="heading-top">
        <el-row>
        <el-col :span="24">对账报表</el-col>
        </el-row>
        </div>
        <el-card class="box-card">
            <div class="search">
            <el-form ref="form" :model="form" label-width="120px">
                <el-row :gutter="30">
                    <el-col :span="6">
                        <el-form-item label="选择报表日期：">
                            <el-date-picker
                                v-model="value1"
                                type="date"
                                placeholder="选择开始日期">
                                </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="至：">
                            <el-date-picker
                                v-model="value1"
                                type="date"
                                placeholder="选择结束日期">
                                </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-button type="primary" @click="search()">
                        搜索</el-button>
                        <el-button type="primary" @click="resetForm('searchform')">
                        重置
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
            </div>

              <el-table :data="tableData"  border
                size="medium" stripe style="width: 100%;">
                    <el-table-column prop="processNo" label="文件名称" align="center"> </el-table-column>
                    <el-table-column prop="status" label="生产时间" align="center"> </el-table-column>
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

            tableData:[],

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

