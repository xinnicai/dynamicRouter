<template>
    <div class="rolePage">
        <el-card class="box-card card_height">
            <el-row>
                <el-col :span="24">
                    <label>名称：</label>
                    <el-input placeholder="输入名称" style="width: 200px" v-model="queryName"></el-input>
                    <!--                    <label style="margin-left:8px;">状态：</label>-->
                    <!--                    <el-input placeholder="输入名称" style="width: 200px"></el-input>-->
                    <el-button icon="el-icon-search" type="primary" @click="getTableData">搜索</el-button>
                    <el-button icon="el-icon-plus" type="primary" style="margin-left: 10px"
                               @click="dialogForm2Visible=true" >
                        新增项
                    </el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top:10px">
                <el-table
                        :data="tableData"
                        style="width: 100%;margin-bottom: 20px;"
                        row-key="id"
                        border
                        >
                    <el-table-column
                            prop="name"
                            label="权限名称"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="organCode"
                            label="机构">
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            label="描述">
                    </el-table-column>
                    <!--                    <el-table-column-->
                    <!--                            prop="status"-->
                    <!--                            label="状态">-->
                    <!--                             <template slot-scope="scope">-->
                    <!--                            <div slot="reference" class="name-wrapper" style="text-align:center">-->
                    <!--                                <span v-if="scope.row.status===1">正常</span>-->
                    <!--                                <span v-if="scope.row.status===0">异常</span>-->
                    <!--                            </div>-->
                    <!--                        </template>  -->
                    <!--                    </el-table-column>-->
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
        <!-- 新建项 -->
        <el-dialog title="新增权限" :visible.sync="dialogForm2Visible" width="55%" @close="initformdata">
            <el-form label-width="100px" :model="newOrg" :rules="formRules" ref="roleForm">
                <el-form-item label="唯一识别码" prop="code">
                    <el-input v-model="newOrg.code"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="newOrg.name"></el-input>
                </el-form-item>
                <el-form-item label="上级机构">
                    <treeselect v-model="newOrg.organ"
                                :clearable="true"
                                :searchable="true"
                                :disabled="false"
                                :options="parentOrgs"
                                :limit="3"
                                :max-height="200"
                                :placeholder="'请选择上级机构'"
                                style="width:100%"
                                :noChildrenText="' '"
                    />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="newOrg.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="拥有权限" prop="roleList">
                    <el-table
                            :data="roleTableData"
                            style="width: 100%;margin-bottom: 20px;"
                            row-key="id"
                            :border="false"
                            :show-header="false"
                            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                        <el-table-column
                                prop="name"
                                label="权限名称"
                                sortable
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="actionList"
                                label="姓名"
                                sortable
                        >
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <el-row>
                                        <el-col :span="4">
                                            <el-checkbox :indeterminate="scope.row.isIndeterminate"
                                                         v-model="scope.row.checkAll"
                                                         @change="handleCheckAllChange(scope.row)">全选
                                            </el-checkbox>
                                        </el-col>
                                        <el-col :span="20">
                                            <el-checkbox-group v-model="scope.row.checked"
                                                               @change="handleCheckedCitiesChange(scope.row)">
                                                <el-checkbox v-for="item in scope.row.actionList" :label="item.code"
                                                             :key="item.code">{{item.name}}
                                                </el-checkbox>
                                            </el-checkbox-group>
                                        </el-col>
                                    </el-row>

                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item class="dialog_button">
                    <el-button @click="cancelNewOrg()">取 消</el-button>
                    <el-button type="primary" @click="saveOrg('add')">提 交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑框-->
        <el-dialog title="编辑权限" :visible.sync="dialogFormVisible" width="55%" @close="initformdata">
            <el-form label-width="100px" :model="updateOrg" :rules="formRules" ref="roleForm">
                <el-form-item label="唯一识别码">
                    <el-input v-model="updateOrg.code" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="updateOrg.name"></el-input>
                </el-form-item>
                <el-form-item label="上级机构">
                    <treeselect v-model="updateOrg.organ"
                                :clearable="true"
                                :searchable="true"
                                :disabled="false"
                                :options="parentOrgs"
                                :limit="3"
                                :max-height="200"
                                :placeholder="'请选择上级机构'"
                                style="width:100%"
                                :noChildrenText="' '"
                    />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="updateOrg.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="拥有权限" prop="roleList">
                    <el-table
                            :data="roleTableData"
                            style="width: 100%;margin-bottom: 20px;"
                            row-key="id"
                            :border="false"
                            :show-header="false"
                            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                        <el-table-column
                                prop="name"
                                label="权限名称"
                                sortable
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="actionList"
                                label="姓名"
                                sortable
                        >
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <el-row>
                                        <el-col :span="4">
                                            <el-checkbox :indeterminate="scope.row.isIndeterminate"
                                                         v-model="scope.row.checkAll"
                                                         @change="handleCheckAllChange(scope.row)">全选
                                            </el-checkbox>
                                        </el-col>
                                        <el-col :span="20">
                                            <el-checkbox-group v-model="scope.row.checked"
                                                               @change="handleCheckedCitiesChange(scope.row)">
                                                <el-checkbox v-for="item in scope.row.actionList" :label="item.code"
                                                             :key="item.code">{{item.name}}
                                                </el-checkbox>
                                            </el-checkbox-group>
                                        </el-col>
                                    </el-row>

                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item class="dialog_button">
                    <el-button @click="cancelNewOrg()">取 消</el-button>
                    <el-button type="primary" @click="saveOrg('update')">提 交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>


<script>
	import axios from 'axios'
	export default {
        data: function () {
            // 验证code唯一
            var validatorCode = (rule, value, callback) => {
                axios({
                    url: this.baseUrl+'role/isExist',
                    method: 'post',
                    data: {
                        code: value,
                    }
                }).then(res => {
                    if (res.data.content) {
                        callback(new Error("该代码已存在"));
                    } else {
                        callback();
                    }
                })
            };
            return {
                // 字典组或字典名称
                groupOrDicName: null,
                version: 'system', // 当前版本
                versions: [],
                tableData: [],
                roleTableData: [],
                dialogFormVisible: false,// 显示新建项窗体
                activeName: 'first',
                currentPage: 1,// 分页器当前显示页
                pageSize: 10,
                total: 0,
                regionLevels: [],//行政区划级别
                region: {
                    version: this.version
                },
                formDisabled: false,
                formTitle: '区划注册',
                queryName: null,
                regionTrees: [],
                formRules: {
                    code: [
                        {required: true, message: '请输入代码', trigger: 'blur'},
                        {validator: validatorCode, required: true, trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                },
                dialogForm2Visible: false,
                newOrg: {},
                updateOrg: {},
                // 权限表数据
                permissionCodes: [],
                resourceCodes: [],
                parentOrgs: [], //上级机构
                version: 'system'
            }
        },
        methods: {
            // 分页器修改一页显示条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.loadRegions();
            },
            // 分页器修改当前页显示
            handleCurrentChange(val) {
                this.currentPage = val;
                this.loadRegions();
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
            cancelNewOrg() {
                this.dialogForm2Visible = false;
            },
            handleCheckAllChange(value) {
                this.leaploop(this.roleTableData, value, 'checkAll')
            },
            // 处理权限多选数据转换
            handleCheckedCitiesChange(value) {
                this.leaploop(this.roleTableData, value, 'check')
            },
            leaploop(arr, value, flag) {
                for (let obj of arr) {
                    if (obj.children !== undefined && obj.children.length > 0) {
                        this.leaploop(obj.children, value, flag)
                    }
                    if (obj.id == value.id) {
                        if (flag == 'check') {
                            obj.checkAll = value.checked.length === obj.actionList.length;
                            obj.isIndeterminate = value.checked.length > 0 && value.checked.length < obj.actionList.length;
                        } else if (flag == 'checkAll') {
                            obj.checked = value.checkAll ? obj.actions : [];
                            obj.isIndeterminate = false;
                        }

                    }
                }

            },
            // 获取权限列表信息
            loadParentOotions() {
                axios({
                    url: this.baseUrl+'resource/bimp/tree',
                    method: 'get',
                    headers: {},
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.roleTableData = []
                        this.roleTableData = this.convertPermissionData(data.content, this.roleTableData)
                        console.log(this.roleTableData)
                    }
                })
            },
            // 转换权限数据
            convertPermissionData(arr, dics) {
                let rootData = []
                for (let obj of arr) {
                    let actions = []
                    obj.permissions.forEach(element => {
                        actions.push(element.code)
                    });
                    if (!!obj.children && obj.children.length > 0) {
                        let listData = {
                            id: obj.code,
                            name: obj.text,
                            actionList: obj.permissions,
                            actions: actions,
                            checked: [],
                            checkAll: false,
                            isIndeterminate: null,
                            children: this.convertPermissionData(obj.children, dics.children)
                        }
                        rootData.push(listData)
                    } else {
                        let listData = {
                            id: obj.code,
                            name: obj.text,
                            actionList: obj.permissions,
                            actions: actions,
                            checked: [],
                            checkAll: false,
                            isIndeterminate: null
                        }
                        rootData.push(listData)
                    }

                }
                return rootData
            },
            // 提交新增权限数据
            saveOrg(flag) {
                this.$refs['roleForm'].validate((valid) => {
                    this.resourceCodes = []
                    this.permissionCodes = []
                    this.getPermissionCode(this.roleTableData)
                    if (valid && flag === 'add') {
                        axios({
                            url: this.baseUrl+'role',
                            method: 'post',
                            headers: '',
                            data: {
                                permissionCodes: this.permissionCodes,
                                resourceCodes: this.resourceCodes,
                                role: {
                                    code: this.newOrg.code,
                                    name: this.newOrg.name,
                                    organCode: this.newOrg.organ,
                                    description: this.newOrg.description,
                                    system: 'bimp',
                                }
                            }
                        }).then(res => {
                            let data = res.data;
                            if (data.success) {
                                this.$notify({
                                    title: '角色管理-新增',
                                    message: '新增成功原因',
                                    type: 'success'
                                });
                                this.dialogForm2Visible = false;
                                this.getTableData()
                            } else {
                                if(!!data.errMsg){
                                    this.$notify.error({
                                        title: '角色管理-新增',
                                        message: '新增失败原因'+data.errMsg,
                                        duration: 0
                                    });
                                }else{
                                    this.$notify.error({
                                        title: '角色管理-新增',
                                        message: '新增失败!',
                                        duration: 0
                                    });
                                }
                                this.dialogForm2Visible = true;
                            }

                        });
                    }
                    if (valid && flag === 'update') {
                        axios({
                            url: this.baseUrl+'role',
                            method: 'put',
                            headers: '',
                            data: {
                                permissionCodes: this.permissionCodes,
                                resourceCodes: this.resourceCodes,
                                role: {
                                    code: this.updateOrg.code,
                                    name: this.updateOrg.name,
                                    organCode: this.updateOrg.organ,
                                    description: this.updateOrg.description,
                                    system: 'bimp',
                                    id: this.updateOrg.id

                                }
                            }
                        }).then(res => {
                            let data = res.data;
                            if (data.success) {
                                this.$notify({
                                    title: '角色管理-编辑',
                                    message: '编辑成功',
                                    type: 'success'
                                });
                                this.dialogFormVisible = false;
                                this.getTableData()
                            } else {
                                this.dialogFormVisible = false;
                                if(!!data.errMsg){
                                    this.$notify.error({
                                        title: '角色管理-编辑',
                                        message: '编辑失败原因'+data.errMsg,
                                        duration: 0
                                    });
                                }else{
                                    this.$notify.error({
                                        title: '角色管理-编辑',
                                        message: '编辑失败!',
                                        duration: 0
                                    });
                                }
                            }

                        });
                    }
                });
            },
            // 获取权限列表数据
            getPermissionCode(arr) {
                for (obj of arr) {
                    if (obj.checked !== undefined && obj.checked.length > 0) {
                        this.resourceCodes.push(obj.id)
                        obj.checked.forEach(element => {
                            this.permissionCodes.push(element)

                        });
                    }
                    if (obj.children !== undefined && obj.children.length > 0) {
                        this.getPermissionCode(obj.children)
                    }


                }
            },
            // 获取列表数据
            getTableData() {
                axios({
                    url: this.baseUrl+'role',
                    method: 'get',
                    headers: {},
                    params: {
                        name: this.queryName,
                        page: this.currentPage,
                        limit: this.pageSize,
                        system: 'bimp',
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        let content = data.content;
                        this.tableData.splice(0, this.tableData.length);
                        content.content.forEach(g => this.tableData.push(g));
                        console.log(this.tableData)
                        this.total = content.totalElements;
                    }
                })
            },
            // 打开编辑窗口
            showForm(data) {
                this.dialogFormVisible = true;
                this.updateOrg.code = data.code;
                this.updateOrg.name = data.name;
                this.updateOrg.organ = data.organ;
                this.updateOrg['id'] = data.id
                axios({
                    url: this.baseUrl+'role/permission',
                    method: 'post',
                    headers: '',
                    data: {
                        code: data.code,
                        system: 'bimp'
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.getUpdatePermisson(data.content, this.roleTableData)
                    }

                });
            },
            // 处理编辑框中权限数据
            getUpdatePermisson(data, objarr) {
                for (let obj of objarr) {
                    if (obj.children !== undefined && obj.children.length > 0) {
                        this.getUpdatePermisson(data, obj.children)
                    }
                    if (data.length === 0) {
                        obj.checked = [];
                        obj.checkAll = false;
                        obj.isIndeterminate = null;
                    } else {
                        for (let key in data) {
                            if (key === obj.id) {
                                obj.checked = data[key]
                                obj.checkAll = obj.checked.length === obj.actionList.length;
                                obj.isIndeterminate = obj.checked.length > 0 && obj.checked.length < obj.actionList.length;
                            }
                        }
                    }

                }
            },
            // 关闭弹出框初始化数据
            initformdata() {
                let data = [];
                this.getUpdatePermisson(data, this.roleTableData)
                this.newOrg = {};
                this.updateOrg = {};
            },
            // 关闭弹出框
            cancelNewOrg() {
                this.dialogFormVisible = false;
                this.dialogForm2Visible = false;
            },
            // 删除角色
            deleteData(id) {
                axios({
                    url: this.baseUrl+'role/' + id,
                    method: 'delete',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.getTableData();
                        this.$notify({
                            title: '角色管理-删除',
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        if(!!data.errMsg){
                            this.$notify.error({
                                title: '角色管理-删除',
                                message: '删除失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '角色管理-删除',
                                message: '删除失败!',
                                duration: 0
                            });
                        }
                    }
                })
            },
            // 获取上级机构数据
            loadOrgTree() {
                axios({
                    url: this.baseUrl+'organization/' + this.version + '/tree',
                    method: 'get',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.parentOrgs.splice(0, this.parentOrgs.length);
                        this.parentOrgs = this.convertData(data.content, 'code', 'name')
                    }
                })
            },
            // 将数据转为tree-select格式
            convertData(listData, id, label) {
                let nodeData = []
                for (let i = 0; i < listData.length; i++) {
                    if (listData[i].children == 0) {
                        nodeData.push({
                            label: listData[i][label],
                            id: listData[i][id]
                        })
                    } else {
                        nodeData.push({
                            label: listData[i][label],
                            id: listData[i][id],
                            children: this.convertData(listData[i].children, id, label)
                        })
                    }
                }
                return nodeData
            }

        },
        created: function () {
            // 初始化参数
            this.loadParentOotions();
            this.getTableData();
            this.loadOrgTree();
        },
        watch: {}
    }
</script>
<style scoped>
    .rolePage {
        font-size: 14px;
        height: 96%;
        overflow: auto;
    }

    .modalRow {
        margin-bottom: 16px;
    }

    .handleButton {
        margin-left: 26% !important;
    }

    .card_height {
        min-height: calc(100vh - 110px);
    }
</style>