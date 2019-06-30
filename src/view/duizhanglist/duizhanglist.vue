<template>
    <div class="goods-wapper">
        <div class="heading-top">
        <el-row>
        <el-col :span="24">对账报表</el-col>
        </el-row>
        </div>
        <el-card class="box-card">
            <div class="search">
            <el-form ref="form" :model="form" size="mini" label-width="100px">
                <el-row :gutter="30">
                    <el-col :span="6">
                        <el-form-item label="报表日期">
                            <el-date-picker
                                v-model="form.beginDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择开始日期">
                                </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="至">
                            <el-date-picker
                                v-model="form.endDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择结束日期">
                                </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-button size="mini" type="primary" @click="make()">
                        生成报表</el-button>
                        <el-button size="mini" type="primary" @click="search()">
                        查询报表</el-button>
                        <el-button size="mini" type="primary" @click="resetForm('form')">
                        重置
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
            </div>

              <el-table :data="tableData"  border 
                size="mini" stripe style="width: 100%;">
                    <el-table-column prop="fileName" label="文件名称" align="center"> </el-table-column>
                    <el-table-column prop="createTime" label="生成时间" align="center"> </el-table-column>
                    <el-table-column prop="downloadUrl" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="download(scope.row.downloadUrl,scope.row.fileName,scope.row.createTime)">下载报表</el-button>
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
            filePath:"",
            form:{
                beginDate:"",
                endDate:"",
                pageIndex:1,
                pageSize:50
            }
        }
    },
    mounted() {
        // this.getlist();
    },
    methods: {
        download(path,filename,time){
            let data={
                filePath:path 
          } 
          const url = this.$store.state.domain +"/biz/download";
                this.$http.post(url, data , {
                    responseType: 'blob',
                    emulateJSON:true
                }).then(res => {
                let blob = new Blob([res.data], {
                    type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                })
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob);
                } else {
                    let elink = document.createElement('a');
                    elink.download = time+filename+'.xls';
                    elink.style.display = 'none';
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    document.body.removeChild(elink);
                }
            }).catch(err => {
                console.warn(err);
            });     
    },

        // 搜索功能
      search() {
        this.getlist();
      },
        make(){
            this.form.channelCd = sessionStorage.getItem("channelCd");
            this.$axios({
                        method: 'post',
                        url: this.$store.state.domain +"/biz/createReport",
                        data: this.form,
                    })
                    .then(
                        response => {
                        if(response.data.code==0){
                             this.$message.success(response.data.detail.result+"，请点击查询报表按钮获取报表。");
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
                        url: this.$store.state.domain +"/biz/getReport",
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
</style>

