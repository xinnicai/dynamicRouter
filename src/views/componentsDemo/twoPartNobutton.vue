<template>
    <div>
        <el-row :gutter="12">
            <el-col :span="4">
                <el-card>
                    <RegionTree :organType="'region'" v-on:update:RegiontreeSelect="getTreeData"></RegionTree>
                </el-card>
            </el-col>
            <el-col :span="20" style="padding-right: 0px;">
                <el-card class="BaseCrud">
                    <BaseCrud ref="table" @download="download" :apiService="userService" :grid-config="configData.gridConfig" :tableParams="tableParams" :grid-btn-config="configData.gridBtnConfig"
                            :grid-data="testData"
                            :form-config="configData.formConfig" :form-data="configData.formModel" :grid-edit-width="200" :selectTreeData="selectTreeData"
                            form-title="字典项" :is-async="true">
                    </BaseCrud>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import RegionTree from '@/views/myComponents/tree/regionTree.vue/'
import BaseCrud from '@/views/myComponents/table/table.vue'
import HeadAction from '@/views/myComponents/headAction/headHandle.vue'
import {UserApiService} from '@/utils/user.js'
export default {
    components: {
      RegionTree,
      BaseCrud,
      HeadAction
    },
    data () {
      return {
        testData: [],
        // 配置表格参数
        configData: {
          gridConfig: [
            {label: '机构代码',prop:'code'},
            {label: '机构名称', prop: 'name'},
            {label: '登记号', prop: 'registerNumber'},
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
        // 表格url
        userService: 'organization',
        selectedHead:'system',
        tableParams:{
          version: '',
          dicCode: '',
        },
        selectTreeData:[]
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
      },
      getTreeData:function(data){
        // 设置获取表格参数
          this.tableParams.regionCode=data.code
          this.tableParams.organType=''
          this.tableParams.code=''
          this.tableParams.version=this.selectedHead
          this.$refs.table.getData()
          this.selectTreeData=data
      }
    }
}
</script>
<style>
  .el-tree{
    min-height: calc(100vh - 160px);
    max-height: calc(100vh - 160px);
    overflow: auto;
}
.BaseCrud{
  min-height: calc(100vh - 115px);
  max-height: calc(100vh - 115px);
  overflow: auto;
}
</style>