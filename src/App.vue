<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

/* 整体布局样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: '黑体';

  text-decoration: none;
}

html {
  height: 100%;
}

body {
  height: 100%;
}

#app {
  height: 100%;
}

/* 菜单路径 */
.heading-top{
    padding: 8px 15px;
    font-size: 12px;
    line-height: 24px;
    margin-bottom: 10px;
    background-color: #3384d4;
    border-radius: 4px;
    border: 1px solid #3384d4;
    color: #fff;
}

/* 返回顶部 */
.gotop {
  position: fixed;
  z-index: 9999;
  right: 23px;
  bottom: 33px;

  display: none;

  cursor: pointer;
  -webkit-transition: .3s;
          transition: .3s;
  -webkit-transition-timing-function: linear; /* Safari and Chrome */
          transition-timing-function: linear;

  opacity: .4;
  border-radius: 50%;
}
.bg{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute; 
    top: 0;
    left: 0;
    animation: pulse 5s infinite;
}
@keyframes pulse {
    0% {
        box-shadow: 0 0 6px 6px #fff;
    }
    50% {
        box-shadow: 0 0 6px 6px #57e9e9;
    }
    100% {
        box-shadow: 0 0 6px 6px #fff;
    }
}
.circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.gotop:hover {
  bottom: 38px;

  opacity: 1;
  
}
</style>
