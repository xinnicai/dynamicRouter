<template>
   <div class="login">
        <div class="container">
            <div class="containerHead">

            </div>
            <el-card>
                <div class="cardContain">
                    <div class="formHead">
                        <el-col :span="12">
                            <h2 class="session-form__title">
                                <span>登录</span>
                            </h2>
                        </el-col>
<!--                        <el-col :span="12" class="rightField">-->
<!--                              <span class="pull-right">-->
<!--                                  没有帐号？-->
<!--                                  <a href="/signup">点此注册</a>-->
<!--                              </span>-->
<!--                        </el-col>-->
                    </div>
                    <el-form :model="formLabelAlign" :rules="rules" ref="loginForm">
                        <el-form-item prop="account">
                            <el-input v-model="formLabelAlign.account" placeholder="手机/邮箱/个人空间地址" @keyup.enter.native="handleLogin"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="formLabelAlign.password" placeholder="请输入密码" show-password @keyup.enter.native="handleLogin"></el-input>
                        </el-form-item>
<!--                        <el-form-item>-->
<!--                            <el-col :span="12">-->
<!--                                <el-checkbox v-model="formLabelAlign.rememberMe">记住我</el-checkbox>-->
<!--                            </el-col>-->
<!--                            <el-col :span="12" class="rightField">-->
<!--                                <a href="" class="session__toggle-button">短信验证登录</a>-->
<!--                            </el-col>-->
<!--                        </el-form-item>-->
                        <el-form-item>
                            <el-button type="primary" style="width:303px" @click.native.prevent="handleLogin" >登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <div style="text-align: center">
<!--                        <a href="/password/new" class="forget-password">已有账号，忘记密码？</a>-->
                    </div>
                    <div style="text-align: center;padding: 24px 0;">
                        <a href="auth/isLogin" class="forget-password">
                            <!--                            <img src="image/wechat.png" width="24px">-->
                            <i class="el-icon-mouse"></i>
                            <span style="color: #323232;font-size: 16px;">使用认证中心登录</span>
                        </a>
                    </div>
<!--                    <div class="field">-->
<!--                        <div class="ui horizontal divider session-login__oauth-title">-->
<!--                        <span class="text-muted">-->
<!--                        其他方式登录-->
<!--                        </span>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <el-row :gutter="20">-->
<!--                        <el-col :span="6">-->
<!--                            <a href="https://gitee.com/auth/wechat">-->
<!--                                <img src="image/wechat.png" width="24px">-->
<!--                            </a>-->
<!--                        </el-col>-->
<!--                        <el-col :span="6">-->
<!--                            <a href="https://gitee.com/auth/qq_connect">-->
<!--                                <img src="image/icon_QQ.png" width="24px">-->
<!--                            </a>-->
<!--                        </el-col>-->
<!--                        <el-col :span="6">-->
<!--                            <a>-->
<!--                                <img src="image/more.png" width="24px">-->
<!--                            </a>-->
<!--                        </el-col>-->
<!--                    </el-row>-->
                </div>

            </el-card>
        </div>
    </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      formLabelAlign: {
          account: '',
          password: '',
          rememberMe: false
      },
      rules: {
          account: [
              {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
              {required: true, message: '请输入密码', trigger: 'blur'}
          ]
      }
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.formLabelAlign).then(() => {
            debugger
            this.loading = false
            this.$router.push({ path: '/prefix' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // this.$refs['loginForm'].validate((valid) => {
      //       if (valid) {
      //           axios({
      //               url: this.baseUrl+'auth/login',
      //               method: 'post',
      //               headers: {},
      //               data: this.formLabelAlign
      //           }).then(res => {
      //               let data = res.data;
      //               if (data.success) {
      //                 debugger
      //                   this.loading = false
      //                   this.$router.push({ path: this.redirect || '/' })
      //               } else {
      //                   this.$notify.error({
      //                       title: '登录失败',
      //                       message: !!data.errMsg ? data.errMsg : '登录失败，请重试',
      //                       duration: 5000
      //                   });
      //               }
      //           })
      //       }
      //   });
    },
    login(){}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
body, html {
        overflow: hidden;
        margin: 0;
        padding: 0;
    }

    #app {
        margin: 0;
        padding: 0;
    }

    #app, body, html {
        width: 100%;
        height: 100%;
    }

    .login {
        width: 100%;
        height: 100%;
        background-image: url(image/loginImg.jpg);
        background-size: cover;
        background-position: 50%;
        position: relative;
        margin-top: -20px;
    }

    .container {
        width: 535px;
        padding: 0 20px;
        margin: 0 auto;
    }

    .cardContain {
        padding: 50px 75px 48px;
        position: relative;
    }

    .formHead {
        margin-bottom: 24px;
    }

    h2 {
        font-size: 1.714rem;
    }

    a {
        text-decoration: none;
        cursor: pointer;
        color: #005980;
        font-size: 14px;
    }

    .pull-right {
        line-height: 68px;
    }

    .rightField {
        float: right;
        text-align: right;
        font-size: 14px;
    }

    .ui.horizontal.list {
        display: inline-block;
        font-size: 0em;
    }

    .ui.horizontal.divider:before, .ui.horizontal.divider:after {
        // background-image: url(image/horiLine.png);
    }

    .ui.horizontal.divider:before {
        background-position: right 1em top 50%;
    }

    .ui.horizontal.divider:before, .ui.horizontal.divider:after {
        content: '';
        display: table-cell;
        position: relative;
        top: 50%;
        width: 50%;
        background-repeat: no-repeat;
    }

    .text-muted {
        color: #8c92a4;
    }

    .ui.horizontal.session-login__oauth-title {
        font-weight: normal;
    }

    .ui.horizontal.divider {
        display: table;
        white-space: nowrap;
        height: auto;
        margin: '';
        line-height: 1;
        text-align: center;
    }

    .ui.divider {
        margin: 1rem 0rem;
        line-height: 1;
        height: 0em;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: rgba(0, 0, 0, 0.85);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .field {
        margin-top: 24px;
        font-size: 14px;
    }

    .containerHead {
        margin: 20px 0;
        height: calc(15vh);
    }
    .el-input__inner {
      line-height: 40px;
      height: 40px; 
  }
  .el-button{
      padding: 12px 20px !important;
  }
</style>
