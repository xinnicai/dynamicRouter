<template>
    <div>
		<el-row :gutter="16">
			<el-col :span="5">
				<el-card class="box-card card_height">
                    <el-row style="margin-top:10px">
                        <el-col :span="24">
                            <el-input v-model="groupOrDicName" placeholder="输入名称" style="width: 100%"></el-input>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px">
                        <el-tree class="filter-tree" ref="dicGroupTree"
                                 :data="organs" :props="{label:'label'}" :filter-node-method="filterDics"
                                 @node-click="handleNodeClick">
                                  <span class="span-ellipsis" slot-scope="{ node, data }">
									 <el-tooltip class="item" effect="dark" :content="node.label" placement="bottom" :open-delay="1000">
										<span >{{ node.label }}</span>
									</el-tooltip>
								</span>
                        </el-tree>
                        
                    </el-row>
                </el-card>
			</el-col>
			<el-col :span="19">
				 <el-card class="box-card card_height">
                    <el-row>
                        <el-col :span="24">
                            <el-input placeholder="输入名称" style="width: 300px" v-model="queryName"></el-input>
                            <el-button icon="el-icon-search" type="primary" @click="loadOffices">搜索</el-button>
                            <el-button icon="el-icon-plus" type="primary" style="margin-left: 10px" @click="showForm">
                                新增项
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px">
                        <el-table
                                :data="tableData"
                                style="width: 100%;margin-bottom: 20px;"
                                row-key="id"
                                border>
                            <el-table-column
                                    prop="code"
                                    label="科室代码"
                                    sortable
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="科室名称"
                                    sortable
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="officeType"
                                    label="科室类型">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="showForm(scope.row)">编辑
                                    </el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDelete(scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-row style="margin-top: 10px;margin-bottom:20px;float: right;">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="[10, 20, 30, 40]"
                                :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="total">
                        </el-pagination>
                    </el-row>

                </el-card>
			</el-col>
		</el-row>
          <!-- 弹窗 -->
        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="65%" @close="cancel">
            <el-form :model="office" :rules="formRules" ref="officeForm" label-width="100px" class="demo-ruleForm">
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="科室代码" prop="code">
                            <el-input auto-complete="off" style="width:150px" :disabled="formDisabled"
                                      v-model="office.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="科室名称" prop="name">
                            <el-input auto-complete="off" style="width:150px" v-model="office.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="科室类型" prop="officeType">
                            <el-select v-model="office.officeType" placeholder="请选择科室类型" style="width:150px">
                                <el-option v-for="code in officeTypes" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="其他代码">
                            <el-input auto-complete="off" style="width:150px" v-model="office.otherCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属机构" prop="organCode">
                            <treeselect v-model="office.organCode" @input="loadOfficeTree"
                                        :clearable="true"
                                        :searchable="true"
                                        :disabled="false"
                                        :options="organs"
                                        :limit="3"
                                        :max-height="200"
                                        :placeholder="'请选择机构'"
                                        style="width:150px"
                                        :noChildrenText="' '"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="上级科室">
                            <treeselect v-model="office.parentCode"
                                        :clearable="true"
                                        :searchable="true"
                                        :disabled="false"
                                        :options="officeTrees"
                                        :limit="3"
                                        :max-height="200"
                                        :placeholder="'请选择上级科室'"
                                        style="width:150px"
                                        :noChildrenText="' '"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="其他名称">
                            <el-input auto-complete="off" style="width:150px" v-model="office.otherName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="地址">
                            <el-input auto-complete="off" style="width:250px" v-model="office.address"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="电子邮箱">
                            <el-input auto-complete="off" style="width:150px" v-model="office.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话">
                            <el-input auto-complete="off" style="width:150px" v-model="office.telphone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="科室描述">
                            <el-input auto-complete="off" style="width:150px" v-model="office.description"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="拼音助记">
                            <el-input auto-complete="off" style="width:150px" :disabled="formDisabled"
                                      v-model="office.pycode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="成立时间">
                            <el-date-picker style="width:150px" v-model="office.createDate" type="date"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <!--                <el-col :span="8">-->
                    <!--                    <el-col :span="9">-->
                    <!--                        <label class="">版本</label>-->
                    <!--                    </el-col>-->
                    <!--                    <el-col :span="15">-->
                    <!--                        <el-select :disabled="formDisabled" v-model="office.version" placeholder="请选择版本"-->
                    <!--                                   style="width:150px">-->
                    <!--                            <el-option v-for="code in versions" :label="code.description" :value="code.version"-->
                    <!--                                       :key="code.version"></el-option>-->
                    <!--                        </el-select>-->
                    <!--                    </el-col>-->
                    <!--                </el-col>-->
                    <el-col :span="8">
                        <el-form-item label="排序">
                            <el-input auto-complete="off" style="width:150px" v-model="office.orderNum"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="dialogLabel" v-if="visible">
                    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
                        <el-tab-pane label="上级科室" name="first">
                            <el-table ref="singleTable" :data="parentOffices"
                                      highlight-current-row @current-change="handleCurrentChange"
                                      style="width: 100%">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column property="code" label="机构代码" width="120"></el-table-column>
                                <el-table-column property="name" label="机构名称" width="120"></el-table-column>
                                <el-table-column property="registerNumber" label="登记号"></el-table-column>
                                <el-table-column property="classifyCode" label="机构分类"></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="下级科室" name="second">
                            <el-table ref="singleTable" :data="subOffices"
                                      highlight-current-row @current-change="handleCurrentChange"
                                      style="width: 100%">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column property="code" label="机构代码" width="120"></el-table-column>
                                <el-table-column property="name" label="机构名称" width="120"></el-table-column>
                                <el-table-column property="registerNumber" label="登记号"></el-table-column>
                                <el-table-column property="classifyCode" label="机构分类"></el-table-column>
                            </el-table>
                            <el-pagination @current-change="subCurrentChange"
                                           :current-page="subCurrentPage"
                                           :page-size="10"
                                           layout="total, prev, pager, next, jumper"
                                           :total="subTotal">
                            </el-pagination>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
                <el-form-item class="dialog_button">
                    <el-button @click="cancel()">取 消</el-button>
                    <el-button type="primary" @click="save()">提 交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
	</div>
</template>

<script>
   import axios from 'axios'
	export default {
        data: function () {
            return {
                // 字典组或字典名称
                groupOrDicName: null,
                visible: false,
                version: 'system', // 当前版本
                versions: [],
                checked: true,
                tableData: [],
                dialogFormVisible: false,// 显示新建项窗体
                activeName: 'first',
                currentPage: 1,// 分页器当前显示页
                pageSize: 10,
                total: 0,
                subTotal: 0,
                parentOffices: [], //上级
                subOffices: [], //下级
                orgCode: '',//当前机构
                organs: [], //机构
                officeTypes: [],//科室类型
                office: {},
                formDisabled: false,
                formTitle: '科室注册',
                subCurrentPage: 1,
                officeTrees: [],
                queryName: null,
                formRules: {
                    code: [
                        { required: true, message: '请输入科室代码', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入科室名称', trigger: 'blur' }
                    ],
                    officeType: [
                        { required: true, message: '请选择科室类型', trigger: 'change' }
                    ],
                    organCode: [
                        { required: true, message: '请选择所属机构', trigger: 'change' }
                    ]
                }
            }
        },
        methods: {
            handleNodeClick(data) {
                this.orgCode = data.id;
                this.loadOffices();
            },
            showForm(row) {
                if (!!row.id) {
                    this.office = row;
                    this.visible = true;
                    this.activeName= 'first';
                    this.parentOffices= []; //上级
                    this.subOffices= []; //下级
                    this.loadParentOffices();
                    this.formDisabled = true;
                    this.formTitle = '科室注册-编辑';
                } else {
                    this.office = {
                        version: this.version
                    };
                    if(!!this.orgCode){
                        this.office.organCode = this.orgCode;
                    }
                    this.visible = false;
                    this.formDisabled = false;
                    this.formTitle = '科室注册-创建';
                }
                this.loadOfficeTree(this.office.organCode);
                this.dialogFormVisible = true
            },
            cancel() {
                this.dialogFormVisible = false;
                this.office = {};
                this.$refs['officeForm'].clearValidate();
            },
            // 分页器修改一页显示条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.loadOffices();
            },
            // 分页器修改当前页显示
            handleCurrentChange(val) {
                this.currentPage = val;
                this.loadOffices();
            },
            handleTabClick(tab) {
                let name = tab.name;
                if (name == 'first') {
                    this.loadParentOffices();
                } else if (name == 'second') {
                    this.loadSubsTable();
                }
            }, subCurrentChange(val) {
                this.subCurrentPage = val;
                this.loadSubsTable();
            },
            handleDelete(row) {
                this.$confirm('是否删除【' + row.name + '】?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteData(row.id);
                }).catch(() => {

                });
            },
            // 加载字典版本
            loadVersions() {
                axios({
                    url: this.baseUrl+'version',
                    method: 'get',
                    headers: {},
                    params: {
                        type: "sys.admin"
                    }
                }).then(res => {
                    var data = res.data;
                    if (data.success) {
                        this.versions.splice(0, this.versions.length);
                        data.content.forEach(v => {
                            this.versions.push(v);
                            if (v.active) {
                                this.version = v.version;
                            }
                        });
                    }
                }).catch(e => {
                    console.error(e);
                })
            },
            // 过滤字典（字典组）
            filterDics(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            loadOffices() {
                axios({
                    url: this.baseUrl+'office',
                    method: 'get',
                    headers: {},
                    params: {
                        sort: "",
                        page: this.currentPage,
                        limit: this.pageSize,
                        name: this.queryName,
                        code: "",
                        organType: "",
                        version: this.version,
                        organCode: this.orgCode
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        let content = data.content;
                        this.tableData.splice(0, this.tableData.length);
                        content.content.forEach(g => this.tableData.push(g));
                        this.total = content.totalElements;
                    }
                })
            },
            save() {
                this.$refs['officeForm'].validate((valid) => {
                    if (valid) {
                        if (!!this.office.id) {
                            axios({
                                url: this.baseUrl+'office',
                                method: 'put',
                                headers: {},
                                data: this.office
                            }).then(res => {
                                let data = res.data;
                                if (data.success) {
                                    this.loadOffices();
                                    this.cancel();
                                    this.$notify({
                                        title: '科室注册-编辑',
                                        message: '编辑成功',
                                        type: 'success'
                                    });
                                } else {
                                    if(!!data.errMsg){
                                        this.$notify.error({
                                            title: '科室注册-编辑',
                                            message: '编辑失败原因：'+data.errMsg,
                                            duration: 0
                                        });
                                    }else{
                                        this.$notify.error({
                                            title: '科室注册-编辑',
                                            message: '编辑失败!',
                                            duration: 0
                                        });
                                    }
                                }
                            })
                        } else {
                            axios({
                                url: this.baseUrl+'office',
                                method: 'post',
                                headers: {},
                                data: this.office
                            }).then(res => {
                                let data = res.data;
                                if (data.success) {
                                    this.loadOffices();
                                    this.cancel();
                                     this.$notify({
                                        title: '科室注册-创建',
                                        message: '创建成功',
                                        type: 'success'
                                    });
                                } else {
                                    if(!!data.errMsg){
                                        this.$notify.error({
                                            title: '科室注册-创建',
                                            message: '创建失败原因：'+data.errMsg,
                                            duration: 0
                                        });
                                    }else{
                                        this.$notify.error({
                                            title: '科室注册-创建',
                                            message: '创建失败!',
                                            duration: 0
                                        });
                                    }
                                }
                            })
                        }
                    }
                })

            },
            loadOrgTree() {
                axios({
                    url: this.baseUrl+'organization/' + this.version + '/tree',
                    method: 'get',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.organs.splice(0, this.organs.length);
                        // data.content.forEach(g => this.organs.push(g));
                        this.organs=this.convertData(data.content,'code','name')
                    }
                })
            }, loadOfficeTree(code) {
                if (!!code) {
                    axios({
                        url: this.baseUrl+'office/tree',
                        method: 'post',
                        headers: {},
                        data: {
                            version: this.version,
                            organCode: code
                        }
                    }).then(res => {
                        let data = res.data;
                        if (data.success) {
                            this.officeTrees.splice(0, this.officeTrees.length);
                            // data.content.forEach(g => this.officeTrees.push(g));
                            this.officeTrees=this.convertData(data.content,'code','name')
                        }
                    })
                }
            },
            loadDics(dicCode, dics) {
                axios({
                    url: this.baseUrl+'dicItem/tree',
                    method: 'get',
                    headers: {},
                    params: {
                        dicCode: dicCode,
                        active:true
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        dics.splice(0, dics.length);
                        data.content.forEach(g => dics.push(g));
                    }
                })
            }, loadParentOffices() {//加载上级
                axios({
                    url: this.baseUrl+'office/' + this.office.id + '/parent',
                    method: 'get',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.parentOffices.splice(0, this.parentOffices.length);
                        data.content.forEach(g => this.parentOffices.push(g));
                    }
                })
            }, loadSubsTable() {//加载下级
                axios({
                    url: this.baseUrl+'office',
                    method: 'get',
                    headers: {},
                    params: {
                        page: this.subCurrentPage,
                        limit: 10,
                        version: this.version,
                        parentCode: this.office.code
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        let content = data.content;
                        this.subOffices.splice(0, this.subOffices.length);
                        content.content.forEach(g => this.subOffices.push(g));
                        this.subTotal = content.totalElements;
                    }
                })
            }, deleteData(id) {//删除
                axios({
                    url: this.baseUrl+'office/' + id,
                    method: 'delete',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.loadOffices();
                        this.$notify({
                            title: '科室注册-删除',
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        if(!!data.errMsg){
                            this.$notify.error({
                                title: '科室注册-删除',
                                message: '删除失败原因：'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '科室注册-删除',
                                message: '删除失败!',
                                duration: 0
                            });
                        }
                    }
                })
            },convertData(listData,id,label){
                let nodeData=[]
                for(let i=0;i< listData.length;i++){
                    if(listData[i].children==0){
                        nodeData.push( {
                            label:listData[i][label],
                            id:listData[i][id]
                        })
                    }else{
                        nodeData.push({
                            label:listData[i][label],
                            id:listData[i][id],
                            children:this.convertData(listData[i].children,id,label)
                        })
                    }
                }
                return nodeData
            }

        },
        created: function () {
            // 初始化参数
            // this.loadVersions();
            // if (this.version) {
            this.loadOrgTree();
            this.loadDics('officeType', this.officeTypes);
            // }
        },
        watch: {
            // 当前版本变动时，字典组列表重新加载
            version: function () {
                this.loadOrgTree();
                // this.loadOffices();
                this.loadDics('officeType', this.officeTypes);
            },
            // 字典（组）名称
            groupOrDicName: function (val) {
                this.$refs.dicGroupTree.filter(val);
            }
        }
    }
</script>
<style scoped>
    .officePage{
         padding:10px;
		margin-top:10px;
    }

    .dialogLabel label {
        line-height: 35px
    }

    .card_height{
        min-height: calc(100vh - 110px);
    }
    .dialogLabel {
        margin-top: 0px;
    }
</style>
