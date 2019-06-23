<template>
    <div class="container">

        <div class="home-box animated zoomIn">
            <h1  class="animated zoomIn">
                欢
                迎
                您
                使
                用
                </h1>
            <h2 class="animated zoomIn">
                民
                盛
                小
                贷
                </h2>
            <h3 class="animated zoomIn">
                保
                险
                佣
                金
                贷
                企
                业
                端
                </h3>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    mounted() {
    },
    methods: {
       
    },
}
</script>
<style lang="less" scoped>
.container{
    position: relative;
    width:100%;
    height: 0;
    padding-bottom: 48%;
    font-family: '黝黑';
}
.home-box{
    position: absolute;
    top: 24%;
    left: 30%;
    text-align: center;
    padding: 50px;
}
.home-box h1{
    color:rgb(228, 105, 83);
    margin-bottom: 20px;
    font-size: 52px;
}
.home-box h2{
    color:rgba(221, 144, 44, 0.822);
    margin-bottom: 20px;
    font-size: 48px;
}
.home-box h3{
    color:rgba(24, 190, 240, 0.849);
    margin-bottom: 20px;
    font-size: 36px;
}
</style>
