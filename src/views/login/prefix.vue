<template>
   <el-container>
        <el-container style="height: 100%;">
            <el-header style="text-align: right; font-size: 12px">
                <el-row>
                    <el-dropdown>
                        <img
                                src="./image/userImg4.jpg"
                                class="user-avatar">
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>用户信息</el-dropdown-item>
                            <el-dropdown-item><a href="auth/casLogout" style="text-decoration:none">登出</a></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-row>
            </el-header>

            <el-main>
                <el-row :gutter="16">
                    <div class="card-body">
                        <el-col :span="5" v-for="item in roles">
                            <el-card @click.native="choose(item.code)">
                                <img src="./image/用户.png"/>
                                <h3>{{item.name}}</h3>
                                <p>{{item.description}}</p>
                                <!-- <a >登录</a> -->
                            </el-card>
                        </el-col>
                    </div>
                </el-row>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    return {
       roles: []
    }
  },
  watch: {},
  methods: {
     choose(obj) {
                axios({
                    url: 'current/chooseRole',
                    method: 'post',
                    headers: {},
                    data: {
                        "code": obj
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.$router.push({ path: this.redirect || '/' })
                        
                    } else {
                        if(!!data.errMsg){
                            this.$notify.error({
                                title: '角色选择',
                                message: '角色选择失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '角色选择',
                                message: '角色选择失败!',
                                duration: 0
                            });
                        }
                    }
                    
                })
            },
            getRoles() {
                axios({
                    url: 'current/roles',
                    method: 'get',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        let content = data.content;
                        if (!!content && content.length === 1) {
                            this.choose(content[0].code);
                        }
                        this.roles.splice(0, this.roles.length);
                        data.content.forEach(v => {
                            this.roles.push(v);
                        });
                    }
                })
            }
  },
  mounted() {
        this.getRoles();
    }
}
</script>

<style>
    html, body, .el-container {
        height: 100%;
    }

    body {
        display: block;
        margin: 0px;
        padding: 0px;
    }

    .el-main, .el-tabs, .el-tabs__content, .el-tab-pane {
        height: 100%;
    }

    .el-header {
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    }

    #app {
        width: 100%;
        /* height: calc(100vh); */
        height: 100%
    }

    .el-main {
        padding: 20px 0px;
        background-color: #f8f8f8
    }

    .el-card img {
        margin: 16px auto 20px;
    }

    .el-card h3 {
        margin: 0;
        font-size: 18px;
        color: #1f2f3d;
        font-weight: 400;
    }

    .el-card p {
        font-size: 14px;
        color: #99a9bf;
        padding: 0 25px;
        line-height: 20px;
    }

    .el-card a {
        height: 40px;
        line-height: 39px;
        font-size: 14px;
        color: #409eff;
        text-align: center;
        border: 0;
        border-top: 1px solid #eaeefb;
        padding: 0;
        cursor: pointer;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: #fff;
        border-radius: 0 0 5px 5px;
        transition: all .3s;
        text-decoration: none;
        display: block;
        position: relative;
    }

    .el-card a:hover {
        background-color: #409eff;
        color: #fff;
        border-radius: 5px;
    }

    .card-body {
        margin: 0 auto 110px;
        width: 1140px;
    }

    .el-card__body {
        text-align: center;
    }

    .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        margin-top: 8px;
    }
</style>