<template>
  <!-- 样式在app.vue中 -->
  <div class="wrapper-inner" id="app">
    <!-- 返回顶部 -->
    <div id="dtop" class="gotop" title="返回顶部" @click="movetop">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-ico-top"></use>
      </svg>
      <div class="bg"></div>
      <div class="circle"></div>
    </div>

    <div class="top">
      <head-banner></head-banner>
    </div>
    <me-nu></me-nu>
    <div class="main-ten" :class="{'container-width':this.$store.state.isLeftHiden}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// 格式要特别注意字母大小写
import meNu from "../../components/menu";
import headBanner from "../../components/head";
import $ from "jquery";
export default {
  data() {
    return {
      userName: ""
    };
  },
  mounted() {
    this.getName();
    this.tologin();//判断是否登陆
    window.addEventListener("scroll", this.returntop, true); // 监听（绑定）滚轮滚动事件
  },
  methods: {
    tologin() {
      if (this.userName == "" || this.userName == null) {
        this.$message.error("请进行登录!");
        console.log(this.userName);
        this.$router.push("/login");
      }
    },
    //返回顶部
    returntop() {
      //返回顶部
      var htop = document.documentElement.scrollTop; //获取滚动高度
      //判断滚动条滚动长度
      if (htop > 350) {
        $(".gotop")
          .stop()
          .fadeIn();
      } else {
        $(".gotop")
          .stop()
          .fadeOut();
      }
    },
    movetop() {
      $("body,html").animate({ scrollTop: 0 }, 300);
    },
    openCenter() {
      if (this.userName == "admin") {
        this.$message({
          dangerouslyUseHTMLString: true, //表示提示的是html片段
          message:
            '<svg class="icon" aria-hidden="true"> <use xlink:href="#icon-jiqiren"></use> </svg> ' +
            "欢迎登陆您民盛报送系统！",
          type: "success",
          center: true
        });
      } else {
        this.$message({
          dangerouslyUseHTMLString: true,
          message:
            '<svg class="icon" aria-hidden="true"> <use xlink:href="#icon-shengqi"></use> </svg> ' +
            "请先登录！",
          type: "warning",
          center: true
        });
      }
    },

    //获取用户名，vue 本地存储数据 sessionStorage
    getName() {
      let userName = sessionStorage.getItem("account");
      this.userName = userName;
    }
  },
  watch: {},
  components: {
    meNu,
    headBanner
  }
};
</script>

<style lang='less'>
.top {
  width: 100%;
  height: 65px;
}

//右边部分整个大页面
.main-ten {
  margin-left: 200px;
  padding: 25px 25px;
  transition: all 0.5s;
}

// 右半部分扩张
.container-width {
  transition: all 0.5s;
  margin-left: 70px;
  padding: 10px 8px;
}

.wrapper-inner {
  width: 100%;
  height: 0;
  padding-bottom: 70%;

  background: rgb(238, 237, 237);
}

.icon {
  overflow: hidden;
  width: 3.1em;
  height: 3.1em;
  vertical-align: -0.9em;
  fill: currentColor;
  padding: 3px 5px;
}
</style>
