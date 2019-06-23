<template>
  <div class="topBanner">
    <div class="side-tit">
      <!-- <p class='left'><img src="../assets/1.png"/><b class="fg">供应链金融服务平台</b> -->
      <p class='left'><b class="fg">保费佣金贷-企业端</b>
      </p>
    </div>
    <p class='right' @click="goBack" title="安全退出">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shouye"></use>
      </svg></p>
    <p class='right' title="用户名">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-atm"></use>
      </svg>{{this.userName}}</p>
    <p class='right' @click="screenfull" title="全屏显示">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-quanping6"></use>
      </svg></p>
    <p class='right' @click="tabcontrol" title="折叠菜单栏">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zhankai1"></use>
      </svg></p>
    
  </div>
</template>
<script>

import screenfull from 'screenfull'
export default {
  data(){
      return{
      userName:'',
      isFullscreen: false
    }
  },
  mounted() {
    this.getName();
    // this.tologin();//判断是否登陆
      window.onresize = () => {
            // 全屏下监控是否按键了ESC
            if (!this.checkFull()) {
              // 全屏下按键esc后要执行的动作
              this.isFullscreen = false
            }
          }
       },
  methods: {
    tologin(){
      if(this.userName=='' || this.userName==null){
        console.log(this.userName)
        this.$message.error('请进行登录!')
        this.$router.push("/login")
      }
    },
    //获取用户名，vue 本地存储数据 sessionStorage
    getName() {
      let userName = sessionStorage.getItem("username");
      this.userName = userName;
    },

    //返回上一页
    lastpage(){
      window.history.go(-1);
    },
     /**
     * 全屏事件
     */
    screenfull() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'Your browser does not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
      this.isFullscreen = true
    },
    /**
     * 是否全屏并按键ESC键的方法
     */
    checkFull() {
      var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      // to fix : false || undefined == undefined
      if (isFull === undefined) {
          isFull = false
      }
      return isFull
    },

    //退出登陆
    goBack() {
      var _this = this;
      this.$confirm('确认退出吗?', '提示', {
        //type: 'warning'
      }).then(() => {
        // sessionStorage.removeItem('user');
        sessionStorage.setItem("name", 'str');//本地存储用户名
        this.$router.push('/login');
      }).catch(() => {

      });
      // this.$router.push("/login");
    },

    //折叠
    tabcontrol(){
      this.$store.state.isLeftHiden=!this.$store.state.isLeftHiden;
    }
  }
};
</script>

<style scoped>
* {
  font-family: '黑体';

  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.roulink{
  font-size: 12px;
}
.roulink:hover{
  color: rgba(223, 186, 20, .842);
}
.topBanner {
  line-height: 66px;

  position: fixed;
  left: 0;
  right: 0;
  z-index: 99;

  width: 100%;
  height: 66px;
  background: #fff;
  border-bottom: 1px solid rgba(207, 206, 206, 0.596);
}

p {
  padding-left: 20px;
}

.left {
  float: left;
  height: 65px;
  padding-top: 2px;
  font-weight: bolder;
  background: #fff;
}
.left img{
  width: 55px;
}
.left .fg{
  float: right;
  font-family: '黝黑';
  font-size: 24px;
  color: #1682c0;
  padding-left: 10px;
  padding-right: 15px;
}
.left .icon-tip{
  width: 40px;
  height: 66px;
}

.right {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 12px;

  float: right;

  margin-right: 6px;

  cursor: pointer;
  color: rgb(189, 40, 219);

}


svg {
  width: 32px;
  height: 32px;
  padding: 3px 8px;
  color: rgb(80, 78, 78);
}

svg:hover {
  color: #1682c0;
}
</style>
