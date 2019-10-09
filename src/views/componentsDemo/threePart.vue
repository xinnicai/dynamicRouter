<template>
    <div class="threePart">
        <el-row :guitter="12" style="margin-bottom:10px">
            <el-col :span="24">
                <HeadAction :name="selectedHead" v-on:update:select="getNewName"></HeadAction>
            </el-col>
        </el-row>
        <el-row :gutter="12">
            <el-col :span="4">
                <el-card>
                    <DicTree ref="dicTree" :versionType="'standard'" :versionValue="selectedHead" v-on:update:treeSelect="getTreeData"></DicTree>
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
import DicTree from '@/views/myComponents/tree/dicTree.vue/'
import BaseCrud from '@/views/myComponents/table/table.vue'
import HeadAction from '@/views/myComponents/headAction/headHandle.vue'
import {USER_CONFIG} from './threePartConfig'
import {UserApiService} from '@/utils/user.js'
export default {
    components: {
      DicTree,
      BaseCrud,
      HeadAction
    },
    data () {
      return {
        testData: [],
        configData: USER_CONFIG,
        userService: 'dicItem',
        selectedHead:'标准字典2019',
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
      getNewName: function(newName){
          this.selectedHead = newName;
          this.$refs.dicTree.version=newName
      },
      getTreeData:function(data){
          this.tableParams.dicCode=data.code
          this.tableParams.version=this.selectedHead
          this.$refs.table.getData()
          this.selectTreeData=data
      }
    }
}
</script>
<style>
  .threePart .el-tree{
    min-height: calc(100vh - 270px)!important;
    max-height: calc(100vh - 270px)!important;
    overflow: auto;
}
  .threePart .BaseCrud{
  min-height: calc(100vh - 155px)!important;
  max-height: calc(100vh - 155px)!important;
  overflow: auto;
}
</style>