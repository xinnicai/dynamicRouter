<template>
    <div>
        <el-card class="box-card">
            <el-row>
                <el-col :span="24">
                    <label >账号 </label>
                    <el-input placeholder="搜索登录账号" style="width: 200px" v-model="queryName"></el-input>
                    <label >动作 </label>
<!--                            <el-input placeholder="搜索动作" style="width: 300px" v-model="actionName"></el-input>-->
                    <el-select clearable="true" v-model="action" placeholder="请选择动作">
                        <el-option v-for="action in actions" :label="action.audActionName" :value="action.audAction"
                                    :key="action.audAction"></el-option>
                    </el-select>

<!--                            <el-button icon="el-icon-search" type="primary" @click="loadSystems">搜索</el-button>-->
                    <label >日志时间  从</label>
                    <el-date-picker
                            v-model="startTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择" style="width:150px">
                    </el-date-picker>
                    <label>至</label>
                    <el-date-picker
                            v-model="endTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择" style="width:150px">
                    </el-date-picker>
                    <el-button icon="el-icon-search" type="primary" @click="loadSystems">搜索</el-button>
<!--                            <el-button type="primary" @click="loadSystems" style="margin-left: 16px">搜索</el-button>-->
                </el-col>
                <el-col :span="24">
<!--                            style="margin-left: 16px"-->

                </el-col>
            </el-row>
            <el-row style="margin-top:10px">
                <el-table
                        :data="tableData"
                        style="width: 100%;margin-bottom: 20px;"
                        row-key="id"
                        border>
                    <!-- <el-table-column
                            prop="id"
                            label="ID"
                            width="80">
                    </el-table-column>-->
                    <el-table-column
                            prop="audActionName"
                            label="动作"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="audDate"
                            label="日志记录时间"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="audUser"
                            label="登录账号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="userName"
                            label="用户"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="audClientIp"
                            label="客户端IP"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="audResource"
                            label="日志内容"
                            with="100">
                    </el-table-column>
                        <el-table-column label="详情">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        @click="logDetailForm(scope.row)">查看
                                </el-button>
                            </template>
                        </el-table-column>
                </el-table>
            </el-row>
            <el-row style="margin-top: 10px;margin-bottom:30px;float: right;">
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
        <!-- 弹窗 -->
        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="50%" @close="cancel">
            <el-form :model="system" :rules="formRules" ref="systemForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="动作" prop="audActionName">
                    <el-input readonly="true" auto-complete="off" :disabled="formDisabled"
                              v-model="system.audActionName"></el-input>
                </el-form-item>
                <el-form-item label="日志记录时间" prop="audDate">
                    <el-input readonly="true" auto-complete="off" v-model="system.audDate"></el-input>
                </el-form-item>

                <el-form-item label="登录账号" prop="audUser">
                    <el-input readonly="true" auto-complete="off" v-model="system.audUser"></el-input>
                </el-form-item>
                <el-form-item label="用户" prop="userName">
                    <el-input readonly="true" auto-complete="off" v-model="system.userName"></el-input>
                </el-form-item>
                <el-form-item label="客户端IP" prop="audClientIp">
                    <el-input readonly="true" auto-complete="off" v-model="system.audClientIp"></el-input>
                </el-form-item>
                <el-form-item label="日志内容" prop="audClientIp">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" readonly="true" auto-complete="off" v-model="system.audResource"></el-input>
                </el-form-item>
                <el-form-item class="dialog_button">
                    <el-button @click="cancel()">关  闭</el-button>
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
                version: 'V2019',
                startTime:null,
                endTime:null,
                tableData: [],
                actions:[],
                dialogFormVisible: false,// 显示新建项窗体
                currentPage: 1,// 分页器当前显示页
                pageSize: 10,
                total: 0,
                sysTypes:[],
                system: {},
                formDisabled: false,
                formTitle: '系统注册',
                queryName: null,
                action:null,
                formRules: {
                   /* code: [
                        {required: true, message: '请输入代码', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ]*/
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
            logDetailForm(row){
                this.system=row;
                this.formTitle="日志详情";
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
                    url: this.baseUrl+'logAudit/list',
                    method: 'get',
                    headers: {},
                    params: {
                        sort: "",
                        page: this.currentPage,
                        size: this.pageSize,
                        endTime:this.endTime,
                        startTime:this.startTime,
                        // code: "",
                        account: this.queryName,
                        action:  this.action
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
            loadActions(){
                axios({
                    url: this.baseUrl+'logAudit/actions',
                    method: 'get',
                    headers: {},
                    params: {

                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                         this.actions = data.content;
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
            this.loadActions();//加载登录动作搜索框
        }
    }
</script>
<style scoped>
    body {
        display: block;
        margin: 0px;
        padding: 10px 4px;
        background-color: #fafafa;
    }

    .el-header {
        padding: 0 10px;
    }

    .el-aside {
        top: 30px;
        position: relative;
        left: 10px
    }

    .dialogLabel label {
        line-height: 35px
    }

    .ssologPage{
        top: 11px;
        position: relative;
        height: 98%;
        padding-left: 6px !important;
    }
</style>
