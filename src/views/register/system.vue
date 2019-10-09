<template>
 <div class="systemPage">
     <el-col :span="24">
         <el-card class="box-card card_height">
                    <el-row>
                        <el-col :span="24">
                            <el-input placeholder="输入名称" style="width: 300px" v-model="queryName"></el-input>
                            <el-button icon="el-icon-search" type="primary" @click="loadSystems">搜索</el-button>
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
                                    label="系统代码"
                                    sortable
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="系统名称"
                                    sortable
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="uri"
                                    label="服务地址">
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
       <!-- 弹窗 -->
        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="50%" @close="cancel">
            <el-form :model="system" :rules="formRules" ref="systemForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="代码" prop="code">
                    <el-input auto-complete="off" :disabled="formDisabled"
                              v-model="system.code"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input auto-complete="off" v-model="system.name"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="type">
                    <el-select v-model="system.type" placeholder="请选择类别" style="width:100%"> 
                        <el-option v-for="code in sysTypes" :label="code.text" :value="code.key"
                                   :key="code.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地址" prop="otherCode">
                    <el-input auto-complete="off" v-model="system.uri"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input auto-complete="off" v-model="system.description"></el-input>
                </el-form-item>
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
                version: 'system',
                tableData: [],
                sysTypes: [],
                dialogFormVisible: false,// 显示新建项窗体
                currentPage: 1,// 分页器当前显示页
                pageSize: 10,
                total: 0,
                system: {},
                formDisabled: false,
                formTitle: '系统注册',
                queryName: null,
                formRules: {
                    code: [
                        {required: true, message: '请输入代码', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            showForm(row) {
                if (!!row.id) {
                    this.system = row;
                    this.formDisabled = true;
                    this.formTitle = '系统注册-编辑';
                } else {
                    this.system = {};
                    this.formDisabled = false;
                    this.formTitle = '系统注册-创建';
                }
                this.dialogFormVisible = true
            },
            cancel() {
                this.dialogFormVisible = false;
                this.system = {};
                this.$refs['systemForm'].clearValidate();
            },
            // 分页器修改一页显示条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.loadSystems();
            },
            // 分页器修改当前页显示
            handleCurrentChange(val) {
                this.currentPage = val;
                this.loadSystems();
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
            loadSystems() {
                axios({
                    url: this.baseUrl+'system',
                    method: 'get',
                    headers: {},
                    params: {
                        sort: "",
                        page: this.currentPage,
                        limit: this.pageSize,
                        // code: "",
                        name: this.queryName
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
                this.$refs['systemForm'].validate((valid) => {
                    if (valid) {
                        if (!!this.system.id) {
                            axios({
                                url: this.baseUrl+'system',
                                method: 'put',
                                headers: {},
                                data: this.system
                            }).then(res => {
                                let data = res.data;
                                if (data.success) {
                                    this.loadSystems();
                                    this.cancel();
                                    this.$notify({
                                        title: '系统注册-编辑',
                                        message: '编辑成功',
                                        type: 'success'
                                    });
                                } else {
                                    if(!!data.errMsg){
                                        this.$notify.error({
                                            title: '系统注册-编辑',
                                            message: '编辑失败原因'+data.errMsg,
                                            duration: 0
                                        });
                                    }else{
                                        this.$notify.error({
                                            title: '系统注册-编辑',
                                            message: '编辑失败!',
                                            duration: 0
                                        });
                                    }
                                }
                            })
                        } else {
                            axios({
                                url: this.baseUrl+'system',
                                method: 'post',
                                headers: {},
                                data: this.system
                            }).then(res => {
                                let data = res.data;
                                if (data.success) {
                                    this.loadSystems();
                                    this.cancel();
                                    this.$notify({
                                        title: '系统注册-创建',
                                        message: '创建成功',
                                        type: 'success'
                                    });
                                } else {
                                    if(!!data.errMsg){
                                        this.$notify.error({
                                            title: '系统注册-创建',
                                            message: '创建失败原因'+data.errMsg,
                                            duration: 0
                                        });
                                    }else{
                                        this.$notify.error({
                                            title: '系统注册-创建',
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

            }, deleteData(id) {//删除
                axios({
                    url: this.baseUrl+'system/' + id,
                    method: 'delete',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.loadSystems();
                        this.$notify({
                            title: '系统注册-删除',
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        if(!!data.errMsg){
                            this.$notify.error({
                                title: '系统注册-删除',
                                message: '删除失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '系统注册-删除',
                                message: '删除失败!',
                                duration: 0
                            });
                        }
                    }
                })
            }
        },
        created: function () {
            // 初始化参数
            this.loadSystems();
            this.loadDics('sys.system.type', this.sysTypes);
        }
    }
</script>
<style scoped>

    .dialogLabel label {
        line-height: 35px
    }

    .systemPage{
        height: 96%;
        overflow: auto;
    }
    .card_height{
        min-height: calc(100vh - 103px);
    }
</style>
