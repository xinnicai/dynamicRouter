<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <!-- <el-container>
      <navbar/>
      <el-container>
         <sidebar class="sidebar-container"/>
        <div class="main-container">
          <tags-view />
          <app-main/>
        </div>
      </el-container>
    </el-container> -->
   <div>
     <navbar/>
   </div>
   <div>
      <sidebar class="sidebar-container"/>
      <div class="main-container">
        <tags-view />
        <app-main/>
      </div>
   </div>
    
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain,TagsView} from './components'
import ResizeMixin from './mixin/ResizeHandler'


export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    // needTagsView: state => this.$store.state.settings.tagsView,
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
   #app .hideSidebar .scroll-container{
        left: -10%;
  }
  #app  .app-main{
    width:100%;
  }
  #app .hideSidebar .app-main{
        top: -30px;
  }
    
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    font-size: 14px;
}
.el-table td, .el-table th {
    padding: 6px 0;
}
.main-container{
  position: relative;
  height: 100%;

}
.card_height{
    overflow-x: hidden;
    overflow-y: scroll;
}
.card_height::-webkit-scrollbar {
      display: none;
}
.el-tree::-webkit-scrollbar {
    display: none;
}
.rightCard::-webkit-scrollbar {
    display: none;
}
 .el-table__body tr>td .crud—input{
      -webkit-appearance: none;
        background-color: #FFF;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 96%;
        line-height: 30px;
        height: 30px;
        margin: 0 4px;
  }
  .el-submenu [class^=el-icon-]{
        margin-left: 15px;
  }
  .el-menu-item [class^=el-icon-]{
      margin-left: 15px;
  }
 
</style>
