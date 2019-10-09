<template>
  <div>
    <BaseCrud @download="download" :apiService="userService" :grid-config="configData.gridConfig" :grid-btn-config="configData.gridBtnConfig"
              :grid-data="testData"
              :form-config="configData.formConfig" :form-data="configData.formModel" :grid-edit-width="200"
              form-title="用户" :is-async="true">
    </BaseCrud>
  </div>
</template>

<script>
  import BaseCrud from './table.vue'
  import {USER_CONFIG} from './config'
  import {UserApiService} from '@/utils/user.js'

  export default {
    components: {
      BaseCrud
    },
    data () {
      return {
        testData: [],
        configData: USER_CONFIG,
        userService: UserApiService
      }
    },
    name: 'user-list',
    mounted () {
      this.testData = [
        {
          id: '1',
          tel: '15184318420',
          name: '小白',
          email: '412412@qq.com',
          status: '1',
          create_time: '2018-04-20',
          expand: '扩展信息一',
          role: ['2']
        },
        {
          id: '2',
          tel: '13777369283',
          name: '小红',
          email: '456465@qq.com',
          status: '0',
          create_time: '2018-03-23',
          expand: 'hashashashas',
          role: ['1']
        }
      ];
      
      console.log(this.userService)
    },
    methods: {
      download(row){
        console.log('点击了下载按钮',row);
      }
    }
  }
</script>