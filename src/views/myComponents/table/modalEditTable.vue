<template>
 <div>
   <el-row>
    <el-col class="crud-header" :span="24">
        <el-button type="primary" size="mini" v-if="gridBtnConfig.create" @click="add()">新增        
      </el-button>
     </el-col>
     <el-col :span="24">
       <el-table size="mini" :data="showGridData" border style="width: 100%" highlight-current-row>
         <el-table-column type="index"></el-table-column>
         <el-table-column
            v-for="(item,index) in gridConfig"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            show-overflow-tooltip
            :width="item.width?item.width:''">
           <template slot-scope="scope">
             <span v-if="item.render">
                <el-select v-if="scope.row.isSet&&item.type==='active'" v-model="scope.row[item.prop]" placeholder="请选择">
                        <el-option
                        label="激活"
                        :value="true">
                        </el-option>
                        <el-option
                        label="不激活"
                        :value="false">
                        </el-option>
                    </el-select>
               <Cell
                v-else
                :row="scope.row"
                :column="item"
                :index="scope.$index"
                :render="item.render">
                 
                </Cell>

             </span>
                <span v-if="scope.row.isSet">
                    <el-select v-if="item.type==='select'" v-model="scope.row[item.prop]" placeholder="请选择">
                        <el-option v-for="(v, index) in sourceVisionData" :lable="v.version" :value="v.version"
                                    :key="v.id"></el-option>
                    </el-select>
                    <el-input v-if="item.type==='input'" size="mini" placeholder="请输入内容" v-model="scope.row[item.prop]">
                    </el-input>
                </span>
                <span v-if="!scope.row.isSet&&!item.render">{{scope.row[item.prop]}}</span>
           </template>
         </el-table-column>
         <el-table-column label="操作" width="250">
           <template slot-scope="scope">
             <!-- <span class="el-tag el-tag--success el-tag--mini" style="cursor: pointer;" @click.stop="saveRow(scope.row,scope.$index)">
               确定
             </span>
             <span class="el-tag el-tag--primary el-tag--mini" style="cursor: pointer;" @click="editRow(scope.row,scope.$index)">
               编辑
             </span>
             <span class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteRow(scope.$index,master_user.data)">
               删除
             </span> -->
             <el-button size="mini" v-if="scope.row.save===true" type="primary" @click="saveRow(scope.row,scope.$index)">保存</el-button>
            <!-- <el-button size="mini" v-if="scope.row.save!=true" type="primary" @click="editRow(scope.row,scope.$index)">编辑</el-button> -->
            <el-button size="mini" v-if="scope.row.active===false" type="primary" @click="active(scope.row)">激活</el-button>
            <el-button size="mini" v-if="gridBtnConfig.delete" type="danger" @click="deleteRow(scope.$index,scope.row)">删除</el-button>
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
     </el-col>
   </el-row>
 </div>
</template>

<script>
  import Cell from './expand';
  import axios from 'axios'
 export default {
   name: '',
    components: {
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
      'selectTreeData',
      // 新增数据内容
      'pushTableData',
      // 源版本数据
      'sourceVisionData'
    ],
   data() {
     return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
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
   methods: {
     add() {
       for (let i of this.showGridData) {
         if (i.isSet) return this.$message.warning("请先保存当前编辑项");
       }
       let j = {
            module:'standard',
            version:'',
            description:'',
            active:false,
            sourceVersion:'',
            status:'1',
            scope:null,
            dataType:'new',
            save:true,
            isSet:true,
       };
       this.showGridData.push(j);
    //    this.master_user.sel = JSON.parse(JSON.stringify(j));
     },
     saveRow(row, index) { //保存
       let data = JSON.parse(JSON.stringify(this.showGridData));
       for (let k in data) {
         row[k] = data[k] //将sel里面的value赋值给这一行。ps(for....in..)的妙用，细心的同学发现这里我并没有循环对象row
       }
       row.isSet = false;
       row.save=false;
       debugger

        axios({
                url: this.baseUrl+this.apiService,
                method: 'post',
                headers: '',
                data: row[index]
            }).then(res => {
                
                this.getData();
            });
     },
     editRow(row) { //编辑
       for (let i of this.showGridData) {
         if (i.isSet) return this.$message.warning("请先保存当前编辑11项");
       }
       this.master_user.sel = row
       row.isSet = true
     },
    //  激活
     active(row){
        //  
     },
     deleteRow(index, rows) { //删除
       rows.splice(index, 1)
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
                this.showGridData=[]
                if(!data.content.content){
                //   this.showGridData = data.content;
                  data.content.forEach(e => {
                      e['isSet']=false
                      this.showGridData.push(e)
                  });
                 
                  this.dataTotal = data.content.length;
                  this.listLoading = false;
                }else{
                  this.showGridData = data.content.content;
                  this.dataTotal = data.content.totalElements;
                  this.listLoading = false;
                }
                
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
   },
    mounted() {
      this.getData();
    },
     watch: {
      // 防止表格预置数据不成功，涉及生命周期问题
      gridData() {
        this.showGridData = this.gridData;
      }
    }
 }
</script>

<style lang="scss">
 .el-table-add-row {
   margin-top: 10px;
   width: 100%;
   height: 34px;
   border: 1px dashed #c1c1cd;
   border-radius: 3px;
   cursor: pointer;
   justify-content: center;
   display: flex;
   line-height: 34px;
 }
 .crud-header{
     margin-bottom: 10px;
 }
 .crud-pagination{
   float: right;
   margin-top: 10px;
 }
</style>