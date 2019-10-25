<template>
  <div class="navbar">
    <div style="width:200px;float:left;position:relative;top:10px;">
       <img :src="sysConfig.logoSrc"
            style="width:40px;margin-left: 8px;"/>
        <span style="color:#fff;font-size:22px;font-weight:600;line-height: 60px; position: relative; top: -12px;">{{sysConfig.title.value}}</span>
    </div>
   
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <!-- <breadcrumb/> -->
    <span style="float:right;position:relative;right: 100px;cursor: pointer;" @click="tranform()"><img src="@/assets/image/transform.png" style="width: 16px;margin-right: 4px;">切换用户</span>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img src="@/assets/image/userImg4.jpg" class="user-avatar">
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>主页</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">登出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import axios from 'axios'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data(){
    return {
      sysConfig:{
        title:{
          value:'主数据管理平台'
        }
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
       axios({
          url: this.baseUrl+'/auth/casLogout',
          method: 'get',
          headers: {}
        }).then(res => {

        })
        axios({
          url: 'http://10.8.0.143:7080/cas/logout',
          method: 'get',
          headers: {}
        }).then(res => {
            this.$router.push({ path: this.redirect || '/login' })
        })
         this.$store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
      // this.$store.dispatch('LogOut').then(() => {
      //   debugger
      //   this.$router.push({ path: this.redirect || '/login' })
      //   location.reload() // 为了重新实例化vue-router对象 避免bug
      // })
    },
    getSysConfig() {
                axios({
                    url: this.baseUrl+'config/getActive',
                    method: 'get',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.sysConfig = data.content;
                        let title = '主数据管理';
                        if (!!this.sysConfig.title) {
                            title = this.sysConfig.title.value;
                        } else {
                            this.sysConfig.title.value = title;
                        }
                        // 修改图标
                        // var link = document.getElementById('iconlink');
                        if(!!this.sysConfig.logo){
                          this.sysConfig.logoSrc=this.baseUrl+'config/'+this.sysConfig.logo.id+'/file'
                        }else{
                          this.sysConfig.logoSrc='@/assets/image/zg_logo_white.jpg'
                        }
                        
                        var link = document.querySelector("link[rel*='icon']") || document.createElement('link')
                        link.type = 'image/x-icon';
                        link.rel = 'shortcut icon';
                        link.href = this.baseUrl+'config/'+this.sysConfig.logo.id+'/file';
                        window.document.title = title;
                    }
                })
            },
            tranform(){
              this.$router.push({ path: this.redirect || '/prefix' })
            }
  },
  mounted () {
    this.getSysConfig()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 60px;
  line-height: 60px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  background: linear-gradient(to right, rgb(31, 143, 247), rgb(2, 52, 165));
  color:#fff;
  .hamburger-container {
    line-height: 65px;
    height: 60px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 60px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 10px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  .el-dropdown{
    color: #fff;
  }
}
</style>

