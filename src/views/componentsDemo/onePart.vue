<template>
  <div class="onePart">
      <el-card class="BaseCrud">
        <BaseCrud ref="table" @download="download" :apiService="userService" :grid-config="configData.gridConfig" :tableParams="tableParams" :grid-btn-config="configData.gridBtnConfig"
                :grid-data="testData"
                :form-config="configData.formConfig" :form-data="configData.formModel" :grid-edit-width="200" 
                form-title="字典项" :is-async="true">
        </BaseCrud>
      </el-card>
  </div>
</template>

<script>
  import BaseCrud from '@/views/myComponents/table/table.vue'
//   import {USER_CONFIG} from './threePartConfig'
  import {UserApiService} from '@/utils/user.js'

  export default {
    components: {
      BaseCrud
    },
    data () {
      return {
        testData: [],
         // 配置表格参数
        configData: {
          gridConfig: [
            {label: '区划代码',prop:'code'},
            {label: '区划名称', prop: 'name'},
            {label: '描述', prop: 'description'},
          ],
          // crud的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置
          formConfig: [
            {span: 24, label: '所属字典',prop:'dic', type: 'text',readonly:true},
            {span: 24, label: '代码',prop:'key', type: 'text',},
            {span: 24, label: '名称', prop: 'text', type: 'text'},
            {span: 24, label: '单位', prop: 'unit', type: 'text'},
            {span: 24, label: '说明', prop: 'desc', type: 'textarea'},],
          gridBtnConfig: {
            create: true, update: true, delete: true, view: false,
            find:true,
            addItem:true,
            expands: [
              { name: '下载按钮', emitName: 'download', type: 'primary' }
            ]},
            
          
          // 表单基础数据类型，需要预先赋值
          formModel: {
            id: '',
            tel: '',
            name: '',
            email: '',
            status: '',
            create_time: '',
            expand: '',
            roleIdList: []
          }
        },
        userService: 'region',
        tableParams:{
        },
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
      
      this.getTableData()
    },
    methods: {
      download(row){
        console.log('点击了下载按钮',row);
      },
      getTableData(){
            this.tableParams.code=''
            this.tableParams.version= 'system'
            this.$refs.table.getData()
      }
    }
  }
</script>
<style scoped>
.onePart .BaseCrud{
  min-height: calc(100vh - 105px)!important;
  max-height: calc(100vh - 105px)!important;
  overflow: auto;
}
</style>