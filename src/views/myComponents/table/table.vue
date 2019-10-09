<template>
  <div class="crud">
     <!--crud头部，包含可操作按钮-->
    <el-row class="crud-header">
      <el-col :span="10" v-if="gridBtnConfig.find">
          <el-input placeholder="输入名称" style="width: 300px" v-model="queryName"></el-input>
          <el-button icon="el-icon-search" type="primary" size="mini" @click="getData">搜索</el-button>
      </el-col>
      <el-button type="primary" size="mini" v-if="gridBtnConfig.create" @click="createOrUpdate(null)">新增        
      </el-button>
      <el-dropdown @command="addGroupOrDic"
									 icon="el-icon-add">
        <el-button type="primary" size="mini">
            <i class="el-icon-document-add"></i>新增
        </el-button> 
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="group">分组</el-dropdown-item>
          <el-dropdown-item command="dic">字典</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <!--crud主体内容区，展示表格内容-->
    <el-table
      :data="showGridData"
      border
      highlight-current-row
      @current-change="selectItem"
      v-loading="listLoading"
      style="width: 100%">
      <el-table-column
        v-for="(item,index) in gridConfig"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        show-overflow-tooltip
        :width="item.width?item.width:''">
       <template slot-scope="scope">
          <Cell
            v-if="item.render"
            :row="scope.row"
            :column="item"
            :index="scope.$index"
            :render="item.render"></Cell>
          <span v-else>{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" v-if="!hideEditArea" label="操作" :width="gridEditWidth?gridEditWidth:200">
        <template slot-scope="scope">
          <el-button size="mini" v-if="gridBtnConfig.update" type="primary"
                     @click="createOrUpdate(scope.row)">修改
          </el-button>
          <el-button size="mini" v-if="gridBtnConfig.delete" type="danger" @click="remove(scope.row)">删除</el-button>
          <el-button size="mini" v-if="gridBtnConfig.view" type="primary" @click="view(scope.row)">查看</el-button>
          <!--扩展按钮-->
          <!-- <el-button size="mini" @click="handleEmit(item.emitName, scope.row)"
                     v-if="gridBtnConfig.expands && gridBtnConfig.expands.length>0"
                     v-for="(item,index) in gridBtnConfig.expands" :key="index" :type="item.type?item.type:'primary'">
            {{item.name}}
          </el-button> -->
        </template>
      </el-table-column>

    </el-table>

    <!--crud的分页组件-->
    <div class="crud-pagination">
      <!--如果不是异步请求展示数据，需要隐藏分页-->
      <el-pagination
        v-if="isAsync"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="currentPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataTotal">
      </el-pagination>
    </div>

    <!--crud按钮触发的表单弹窗-->
    <BaseDialogForm :title="dialogTitle" ref="dialogForm" :config="formConfig" :form-data="formModel"
                    @submit="dialogSubmit"></BaseDialogForm>
  </div>
</template>

<script>
  import BaseDialogForm from './BaseDialogForm/index.vue'
  import Cell from './expand';
  import axios from 'axios'

  export default {
    name: "base-crud",
    components: {
      BaseDialogForm,
      Cell 
    },
    props: [
      // 表单标题，例如用户、角色
      'formTitle',
      // 表单配置
      'formConfig',
      // 表单的model数据
      'formData',
      // 表格配置
      'gridConfig',
      // 表格按钮配置
      'gridBtnConfig',
      // 表格死数据
      'gridData',
      // 数据接口
      'apiService',
      // 判断是否是异步数据
      'isAsync',
      //  表格编辑区域宽度
      'gridEditWidth',
      //  是否隐藏表格操作
      'hideEditArea',
      // 表格参数
      'tableParams',
      // 选中树数据
      'selectTreeData'
    ],
    data() {
      return {
        // 新增修改模态框title
        dialogTitle: '',
        // 展示的表格数据，数据来源可能是父组件传递的固定数据，可能是接口请求数据
        showGridData: [],
        // 当前页码
        currentPage: 1,
        // 每页显示数量
        currentPageSize: 10,
        // 列表数据总数
        dataTotal: 0,
        // 表单数据
        formModel: {},
        //  表格:加载状态
        listLoading: false,
        // 搜索名称
        queryName:''
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      addGroupOrDic(){


      },
      loadRegions(){

      },
      // 选中项
      selectItem(data) {
          this.selectedItem = data;
      },
      // 获取列表数据
      getData() {
        this.listLoading = true;
        this.tableParams.page=this.currentPage;
        this.tableParams.limit=this.currentPageSize;
        this.tableParams.text=this.queryName;
        axios({
            url: this.baseUrl+this.apiService,
            method: 'get',
            headers: {},
            params: this.tableParams
        }).then(res => {
            var data = res.data;
            if (data.success) {
                this.showGridData = data.content.content;
                this.dataTotal = data.content.totalElements;
                this.listLoading = false;
            }
        }).catch(e => {
            console.error(e);
        })

        // this.apiService.list(params).then(res => {

        //   this.showGridData = res.data.list;
        //   this.dataTotal = res.data.total;
        //   this.listLoading = false;
        // }, err => {
        //   this.listLoading = false;
        // });
      },
      createOrUpdate(item) {
        this.$refs.dialogForm.resetForm();
        // 新增时，模态框数据需要拷贝基础定义的数据模型，修改时，直接拷贝当前行数据
        this.formModel = item ? Object.assign({}, item) : Object.assign({}, this.formData) ;
        this.formModel.dic=this.selectTreeData.name
        this.dialogTitle = (item ? '修改' : '新增') + this.formTitle;

        this.$refs.dialogForm.showDialog();
      },
      // 处理相应父组件的事件方法
      handleEmit(emitName,row) {
        this.$emit(emitName, row);
      },
      handleCurrentChange(page) {
        this.currentPage = page;
        this.getData();
      },
      handleSizeChange(size) {
        this.currentPageSize = size;
        this.getData();
      },
      // 模态框数据提交
      dialogSubmit(data) {
        this.apiService[data.userId ? 'update' : 'create'](data).then(res => {
          this.getData();
          this.$message.success(this.dialogTitle + '成功！');
        })
      },
      remove(data) {
        //  处理删除逻辑
      },
      view(data){
        // 处理查看详情逻辑
      }
    },
    watch: {
      // 防止表格预置数据不成功，涉及生命周期问题
      gridData() {
        this.showGridData = this.gridData;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .crud {
    .crud-header {
      margin-bottom: 10px;
      line-height: 40px;
    }

    .crud-pagination {
      text-align: right;
      margin-top: 10px;
    }
  }
</style>