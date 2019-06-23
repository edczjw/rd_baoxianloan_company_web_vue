<template>
  <div class="wrapper">
    <h1>保费佣金贷-企业端</h1>
    <div class="login-box">
      <div class="switch">
        <h3>登录</h3> 
      </div>

      <div class="lo-mo">
      <el-form
        ref="loginform"
        :model="this.loginform"
        status-icon
        label-width="65px"
        class="demo-ruleForm"
      >
        <div class="login-content">
          <el-form-item label="账号" prop="username">
            <el-input class="ell" placeholder="请输入手机号" v-model.trim="loginform.username">
              <template slot="prepend">
                <i class="el-icon-edit"></i>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <div class="login-content">
          <el-row :gutter="24">
            <el-col :span="17">
              <el-form-item label="验证码" prop="password">
                <el-input
                  class="ell"
                  placeholder="请输入验证码"
                  v-model.trim="loginform.password"
                >
                  <template slot="prepend">
                    <i class="el-icon-view"></i>
                  </template>
                </el-input>
              </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-button icon="el-icon-mobile-phone" :disabled="disabled=!show" type="primary" size="medium" @click="send()">
                  <span v-show="show">获取验证码</span>
                  <span v-show="!show" class="count">{{count}} s</span>
                </el-button>
              </el-col>
          </el-row>
        </div>

        <div class="button-content">
          <el-button class="butt1" type="primary" size="medium" @click="login('loginform')">登录</el-button>
        </div>
      </el-form>
      </div>

    </div>
  </div>
</template>
<script>
import Router from "vue-router";
//引入jquery插件
import $ from "jquery";
export default {
  data() {
    // 确认密码校验
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.registform.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      show: true,  // 初始启用按钮
      count: '',   // 初始化次数
      timer: null,

      // 登录表单
      loginform: {
        username: "",
        password: ""
      },

      //输入框验证
      rules: {
        username: [
          { required: true, message: "账号不能为空。", trigger: "blur" },
          { max: 11, message: "长度 11 个字符。", trigger: "blur" },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的手机号码。",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空。", trigger: "blur" }
          // { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' }
        ],
        realpassword: [
          { required: true, message: "不能为空。", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ],
        agreementStatus: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    send(){   
      const TIME_COUNT = 60; //更改倒计时时间
            if (!this.timer) {
                this.count = TIME_COUNT;
                this.show = false;
                this.timer = setInterval(() => {
                  if (this.count > 0 && this.count <= TIME_COUNT) {
                    this.count--;
                  } else {
                    this.show = true;
                    clearInterval(this.timer);  // 清除定时器
                    this.timer = null;
                  }
                }, 1000)
              }
        },
    //登录
    login(formName) {
      this.show = true;
      clearInterval(this.timer);  // 清除定时器
      this.timer = null;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            method: "post",
            url: this.$store.state.domain + "/biz/user/login",
            data: this.loginform
          }).then(
            response => {
              if (response.data.code == 0) {
                //开户状态、用户名、企业编号
                var accountStatus = response.data.detail.accountStatus;
                var username = response.data.detail.username;

                //未开户时不返回
                if (
                  response.data.detail.enterpriseNo != "" ||
                  response.data.detail.enterpriseNo != null
                ) {
                  var enterpriseNo = response.data.detail.enterpriseNo;
                }

                console.log(username);

                //存储状态、用户名、企业编号
                sessionStorage.setItem("accountStatus", accountStatus);
                sessionStorage.setItem("username", username);
                sessionStorage.setItem("enterpriseNo", enterpriseNo);

                //登录成功
                this.$message({
                  message: "恭喜你" + response.data.msg,
                  type: "success"
                });

                if (accountStatus == 2) {
                  //已开户
                  this.$router.push("/mshome"); //跳转
                  console.log(accountStatus + "跳转到主页");
                } else if (accountStatus == 0) {
                  this.$router.push("/creatuser/creatus");
                  console.log(accountStatus + "创建账户");
                  this.$store.state.buttonshow = true; //隐藏开户提交按钮
                } else if (
                  accountStatus == 1 ||
                  accountStatus == 4 ||
                  accountStatus == 5
                ) {
                  this.$router.push("/creatuser/creatus");
                  console.log(accountStatus + "创建账户");
                  this.$store.state.buttonshow = false; //隐藏开户提交按钮
                } else if (accountStatus == 3) {
                  this.$router.push("/failcreatuser/failcreatus");
                  console.log(accountStatus + "创建账户失败");
                }
              } else {
                this.$message.error(response.data.msg);
              }
            },
            response => {
              console.log(response);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  computed: {},
  components: {}
};
</script>

<style lang='less' scoped>
.wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('http://photocdn.sohu.com/20150906/Img420479942.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}
h1 {
  text-align: center;
  color: #fff;
  font-size: 35px;
  font-weight: 700;
  text-shadow: 0 1px 1px #555;
  display: block;
  margin-block-start: 3.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
.login-box {
  background-color: #fff;
  position: relative;
  margin: 0 auto;
  width: 30%;
  height: 380px;
  margin-top: 70px;
  border: 1px solid black;
}
.switch {
  width: 100%;
  font-size: 28px;
  text-align: center;
  color: rgb(68, 65, 65);
  padding: 40px 40px 0 40px;
}
.lo-mo{
  padding:40px 50px;
}
.button-content{
  width: 100%;
  margin-top: 20px;
  text-align: center;
}
.butt1{
  width: 100%;
}
</style>
