<template>
<!-- template必须包裹一个div，否则会报错 -->
<div class="side" :class="{'side-menu' : this.$store.state.isLeftHiden}">
   <el-row>
      <el-col>
        <el-menu default-active="1" class="el-menu-vertical-demo" background-color="#fff" text-color="black" active-text-color="#1682c0"
        :collapse="this.$store.state.isLeftHiden">
        
            <router-link to="/orderlist" >
                <el-menu-item index="1">
                    <i class="el-icon-menu"></i>
                    <span slot="title">我的订单</span>
                </el-menu-item>
            </router-link>
            <router-link to="/loanapply" >
                <el-menu-item index="2">
                    <i class="el-icon-star-off"></i>
                    <span slot="title">借款申请</span>
                </el-menu-item>
            </router-link>
            <router-link to="/duizhanglist" >
                <el-menu-item index="3">
                    <i class="el-icon-setting"></i>
                    <span slot="title">对账报表</span>
                </el-menu-item>
            </router-link>

        </el-menu>
  </el-col>
   </el-row>
</div>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    methods: {
      
    }
  }
</script>

<style scoped  lang=less>
  .el-menu {
      border-color: #fff;
  }

/* 菜单 */
.side {
  position: fixed;

  width: 199px;
  height: 100%;
  transition: all .5s;
  background-color: #fff;
      border:1px solid rgba(223, 220, 220, 0.568);
}

.side-menu {
  width: 66px;
  transition: all .5s;
  background-color: #fff;
}

/* 修边 */
.el-menu {
  /* important的意义在于优先于它内部定义的样式 */
  margin: -.2px !important;
}

.el-menu-item {
  text-align: center;
}


</style>