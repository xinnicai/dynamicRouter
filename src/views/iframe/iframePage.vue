<template>
    <div style="height:auto;" class="onepage iframePage">
        <el-card class="box-card" style="width:100%">
            <iframe id="show-iframe" frameborder="0" scrolling="yes" style="background-color:transparent; position：absolute;width: 100%;
                    height:100%; top: 0;left:0;bottom:0;" :src='iframeSrc' @load="setInframeHeight" :style="iframeStyle"></iframe>
        </el-card>
      </div> 
</template>
<script>
import axios from 'axios'
	export default {
     data: function () {
            return {
                iframeSrc:'',
                 timer: '',
                 iframeStyle:{}
            }
     },
     methods:{
         setInframeHeight(){
            const oIframe = document.getElementById('show-iframe');
            const deviceWidth = document.documentElement.clientWidth;
            const deviceHeight = document.documentElement.clientHeight;
            oIframe.style.height = (Number(deviceHeight)) -160+ 'px';
            this.iframeStyle = {height: (Number(deviceHeight))-200 + 'px'}
         },
        
     },
      mounted() {
          this.timer = setTimeout(this.setInframeHeight(), 1000);
        /**
         * iframe-宽高自适应显示   
         */
         //数字是页面布局高度差，其中的100可以根据自己的界面进行调整
   
    },
    watch: {
        
    $route: {
        
      handler(route) {
        this.redirect = route.query && route.query.redirect
        if(route.meta.type === 'iframe') {
             this.iframeSrc=route.meta.uri
        }
     
      },
      immediate: true
    }
  },
    beforeDestroy() {
      clearInterval(this.timer);
    }
}
</script>