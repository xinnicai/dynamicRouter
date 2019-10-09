<template>
    <div class="powerPage">
        <el-card class="box-card card_height">
            <el-row>
                <el-col :span="24">
                    <label>名称：</label>
                    <el-input placeholder="输入名称" style="width: 200px" v-model="queryName"></el-input>
<!--                    <label style="margin-left:8px;">状态：</label>-->
<!--                    <el-input placeholder="输入名称" style="width: 200px"></el-input>-->
                    <el-button icon="el-icon-search" type="primary" @click="getTableData">搜索</el-button>
                    <el-button icon="el-icon-plus" type="primary" style="margin-left: 10px"
                               @click="dialogForm2Visible=true">
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
                            prop="text"
                            label="权限名称"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="permissions"
                            label="可操作权限">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag v-for="(item,index) in scope.row.permissions" size="medium" :key="item.code"
                                        style="margin-right:4px" v-if="index<3"> {{ item.name }}
                                            
                                </el-tag>
                                <span v-if="scope.row.permissions.length>4"><i class="el-icon-more"></i></span>
                                 <!-- <el-tag v-for="item in scope.row.permissions" size="medium" :key="item.code"
                                        style="margin-right:4px" >{{ item.name }}
                                </el-tag> -->
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="parentCode"
                            label="上级资源代码">
                    </el-table-column>
                    <el-table-column
                            prop="uri"
                            label="资源URI">
                    </el-table-column>
                    <el-table-column
                            prop="scopeTag"
                            label="范围标识">
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="handleUpdateData(scope.row)" >编辑
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
        <!-- 新建项 -->
        <el-dialog title="新增资源" :visible.sync="dialogForm2Visible" width="55%" :close-on-click-modal="false"
                   @close="cancelOrg('add')">
            <el-form label-width="100px" :model="newOrg" :rules="formRules" ref="powerForm">
                <el-form-item label="唯一识别码" prop="code">
                    <el-input v-model="newOrg.code"></el-input>
                </el-form-item>
                <el-form-item label="资源名称" prop="name">
                    <el-input v-model="newOrg.name"></el-input>
                </el-form-item>
                <el-form-item label="资源类型" prop="type">
                    <el-select v-model="newOrg.type" placeholder="请选择" @change="getParents(newOrg)">
                        <el-option
                                v-for="item in typeOptions"
                                :key="item.key"
                                :label="item.text"
                                :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源等级" v-if="newOrg.type==='A'">
                    <el-select v-model="newOrg.resource_level" placeholder="请选择" @change="getParents(newOrg)">
                        <el-option label="一级" value="1"></el-option>
                        <el-option label="二级" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源URI" v-if="newOrg.type!=='A'">
                    <el-input v-model="newOrg.uri"></el-input>
                </el-form-item>
                <el-form-item label="范围标识" v-if="newOrg.type!=='A'">
                    <el-select v-model="newOrg.scope_tag" placeholder="请选择">
                        <el-option
                                v-for="item in tagOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级资源">
                    <treeselect v-model="newOrg.parent_code"
                                :clearable="true"
                                :searchable="true"
                                :disabled="false"
                                :options="parentOptions"
                                :limit="3"
                                :max-height="200"
                                :placeholder="'请选择上级资源'"
                                style="width:100%"
                                :noChildrenText="' '"
                                @input="checkParentCode('add')"
                    />
                </el-form-item>
                <el-form-item label="排列序号">
                    <el-input-number v-model="newOrg.order_num" controls-position="right" :min="1" :max="99999999"
                                     style="width:100%"></el-input-number>
                    <div class="el-form-item__error" v-if="newOrg.parent_code_errSpan==true"
                         style="margin-left:8px;position: relative;margin-top:-60px;">
                        {{newOrg.parent_code_errInfo}}
                    </div>
                </el-form-item>

                <el-form-item label="赋予权限" prop="roleList" v-if="newOrg.type!=='A'">
                    <el-row :gutter="8" v-for="(item,index) in newOrg.roleList" :key="item.index"
                            :class="item.errSpan==false?'noErr':'hasErr'">
                        <el-col :span="9">
                            <el-input placeholder="code" v-model="item.code"
                                      @blur="checkCodeUnique(index,'add')"></el-input>
                            <div class="el-form-item__error" v-if="item.errSpan==true"
                                 style="margin-left:8px;position: relative;">
                                <span>{{item.errInfo}}</span>
                            </div>
                        </el-col>
                        <el-col :span="9">
                            <el-input placeholder="value" v-model="item.name"
                                      @blur="checkValueEmpty(index,'add')"></el-input>
                            <div class="el-form-item__error" v-if="item.errValueSpan==true"
                                 style="margin-left:8px;position: relative;">
                                <span>{{item.errValueInfo}}</span>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <el-button icon="el-icon-plus" circle @click="addRoleList('add')"></el-button>
                            <el-button icon="el-icon-minus" circle v-if="item.minus==true"
                                       @click="removeRoleList(index,'add')"></el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item class="dialog_button">
                    <el-button @click="cancelOrg('add')">取 消</el-button>
                    <el-button type="primary" @click="saveOrg('add')">提 交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑项 -->
        <el-dialog title="编辑资源" :visible.sync="dialogFormVisible" width="55%" :close-on-click-modal="false"
                   @close="cancelOrg('update')">
            <el-form label-width="100px" :model="updateOrg" :rules="formRules" ref="powerForm">
                <el-form-item label="唯一识别码">
                    <el-input v-model="updateOrg.code" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="资源名称" prop="name">
                    <el-input v-model="updateOrg.name"></el-input>
                </el-form-item>
                <el-form-item label="资源类型" prop="type">
                    <el-select v-model="updateOrg.type" placeholder="请选择" @change="getParents(updateOrg)">
                        <el-option
                                v-for="item in typeOptions"
                                :key="item.key"
                                :label="item.text"
                                :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源等级" v-if="updateOrg.type==='A'">
                    <el-select v-model="updateOrg.resource_level" placeholder="请选择" @change="getParents(updateOrg)">
                        <el-option label="一级" value="1"></el-option>
                        <el-option label="二级" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源URI" v-if="updateOrg.type!=='A'">
                    <el-input v-model="updateOrg.uri"></el-input>
                </el-form-item>
                <el-form-item label="范围标识" v-if="updateOrg.type!=='A'">
                    <el-select v-model="updateOrg.scope_tag" placeholder="请选择">
                        <el-option
                                v-for="item in tagOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级资源">
                    <treeselect v-model="updateOrg.parent_code"
                                :clearable="true"
                                :searchable="true"
                                :disabled="false"
                                :options="parentOptions"
                                :limit="3"
                                :max-height="200"
                                :placeholder="'请选择上级资源'"
                                style="width:100%"
                                :noChildrenText="' '"
                                @input="checkParentCode('update')"
                    />
                </el-form-item>
                <el-form-item label="排列序号">
                    <el-input-number v-model="updateOrg.order_num" controls-position="right" :min="1" :max="99999999"
                                     style="width:100%"></el-input-number>
                    <div class="el-form-item__error" v-if="updateOrg.parent_code_errSpan==true"
                         style="margin-left:8px;position: relative;margin-top:-60px;">
                        {{updateOrg.parent_code_errInfo}}
                    </div>
                </el-form-item>

                <el-form-item label="赋予权限" prop="roleList" v-if="updateOrg.type!=='A'">
                    <el-row :gutter="8" v-for="(item,index) in updateOrg.roleList" :key="item.index"
                            :class="item.errSpan==false?'noErr':'hasErr'">
                        <el-col :span="9">
                            <el-input placeholder="code" v-model="item.code"
                                      @blur="checkCodeUnique(index,'update')"></el-input>
                            <div class="el-form-item__error" v-if="item.errSpan==true"
                                 style="margin-left:8px;position: relative;">
                                <span>{{item.errInfo}}</span>
                            </div>
                        </el-col>
                        <el-col :span="9">
                            <el-input placeholder="value" v-model="item.name"
                                      @blur="checkValueEmpty(index,'update')"></el-input>
                            <div class="el-form-item__error" v-if="item.errValueSpan==true"
                                 style="margin-left:8px;position: relative;">
                                <span>{{item.errValueInfo}}</span>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <el-button icon="el-icon-plus" circle @click="addRoleList('update')"></el-button>
                            <el-button icon="el-icon-minus" circle v-if="item.minus==true"
                                       @click="removeRoleList(index,'update')"></el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item class="dialog_button">
                    <el-button @click="cancelOrg('update')">取 消</el-button>
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
                    url: this.baseUrl+'resource/isExist',
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
                systemCode: 'bimp',
                version: 'system', // 当前版本
                versions: [],
                // 表格数据
                tableData: [],
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
                    roleList: [
                        {required: true, message: '请输入代码', trigger: 'blur'},
                    ],
                    type: [
                        { required: true, message: '请选择资源类型', trigger: 'change' }
                    ]
                },
                // 新增数据窗口
                dialogForm2Visible: false,
                // 新增项数据
                newOrg: {
                    scope_tag: 'ORGAN',
                    roleList: [
                        {
                            code: '',
                            name: '',
                            minus: false,
                            errSpan: false,
                            errInfo: '',
                            errValueSpan: false,
                            errValueInfo: ''
                        }
                    ],
                    parent_code_errSpan: true,
                    parent_code_errInfo: ''
                },
                // 编辑窗口
                dialogFormVisible: false,
                updateOrg: {
                    roleList: [
                        {
                            code: '',
                            name: '',
                            minus: false,
                            errSpan: false,
                            errInfo: '',
                            errValueSpan: false,
                            errValueInfo: ''
                        }
                    ],
                    parent_code_errSpan: true,
                    parent_code_errInfo: ''
                },
                levelOptions: [{
                    value: '1',
                    label: '一级'
                }, {
                    value: '2',
                    label: '二级'
                }, {
                    value: '3',
                    label: '三级'
                }],
                typeOptions: [],
                tagOptions: [{
                    value: 'ORGAN',
                    label: '机构'
                },],
                parentOptions: [],

            }
        },
        methods: {
            // 分页器修改一页显示条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.getTableData();
            },
            // 分页器修改当前页显示
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getTableData();
            },
            handleDelete(row) {
                this.$confirm('是否删除【' + row.text + '】?', '提示', {
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
            addRoleList(flag) {
                if (flag === 'add') {
                    this.newOrg.roleList.push({
                        code: '',
                        name: '',
                        minus: true,
                        errSpan: false,
                        errInfo: '',
                        errValueSpan: false,
                        errValueInfo: ''
                    })
                } else if (flag === 'update') {
                    this.updateOrg.roleList.push({
                        code: '',
                        name: '',
                        minus: true,
                        errSpan: false,
                        errInfo: '',
                        errValueSpan: false,
                        errValueInfo: ''
                    })
                }

            },
            removeRoleList(index, flag) {
                if (flag === 'add') {
                    if (this.newOrg.roleList.length > 1) {
                        this.newOrg.roleList.splice(index, 1);
                    }
                } else if (flag === 'update') {
                    if (this.updateOrg.roleList.length > 1) {
                        this.updateOrg.roleList.splice(index, 1);
                    }
                }

            },
            // 检验code是否唯一
            checkCodeUnique(index, flag) {
                let obj
                if (flag === 'add') {
                    obj = this.newOrg
                } else if (flag === 'update') {
                    obj = this.updateOrg
                }
                if (obj.roleList[index].code != "") {
                    obj.roleList[index].errSpan = false;
                    obj.roleList[index].errInfo = "code已存在，请重新输入！"
                } else {
                    obj.roleList[index].errSpan = true;
                    obj.roleList[index].errInfo = "请输入code"
                }


            },
            // 验证权限value是否为空
            checkValueEmpty(index, flag) {
                let obj
                if (flag === 'add') {
                    obj = this.newOrg
                } else if (flag === 'update') {
                    obj = this.updateOrg
                }
                if (obj.roleList[index].name === "") {
                    obj.roleList[index].errValueSpan = true;
                    obj.roleList[index].errValueInfo = "请输入value"
                } else {
                    obj.roleList[index].errValueSpan = false;
                }
            },
            checkRoleList(modalFlag) {
                let obj
                if (modalFlag == "add") {
                    obj = this.newOrg
                } else if (modalFlag === 'update') {
                    obj = this.updateOrg
                }
                let flag = false;
                obj.roleList.forEach((element, index) => {
                    this.checkValueEmpty(index, modalFlag)
                    this.checkCodeUnique(index, modalFlag)
                    if (obj.roleList[index].errSpan == true || obj.roleList[index].errValueSpan == true) {
                        flag = false
                    } else {
                        flag = true
                    }
                });
                return flag
            },
            convertPostData(flag) {
                let obj
                if (flag == "add") {
                    obj = this.newOrg
                } else if (flag === 'update') {
                    obj = this.updateOrg
                }
                obj['permissions'] = []
                obj.roleList.forEach((element, index) => {
                    let data = {
                        code: element.code,
                        name: element.name,
                    }
                    obj.permissions.push(data)
                })
            },
            // 判断资源等级不等于1时，是否有上级资源
            checkParentCode(flag) {
                let checkHasParentCode, obj
                if (flag == "add") {
                    obj = this.newOrg
                } else {
                    obj = this.updateOrg
                }
                if (obj.resource_level !== '1' && obj.parent_code === "" || obj.resource_level !== '1' && obj.parent_code === undefined) {
                    obj.parent_code_errSpan = true;
                    obj.parent_code_errInfo = "请选择上级资源"
                    checkHasParentCode = false
                } else {
                    obj.parent_code_errSpan = false;
                    obj.parent_code_errInfo = ""
                    checkHasParentCode = true
                }
                return checkHasParentCode
            },
            saveOrg(flag) {
                let obj, postData, method
                let checkRoleLi1st = this.checkRoleList(flag);
                let checkParentCode = this.checkParentCode(flag);
                this.convertPostData(flag)
                if (flag == "add") {
                    obj = this.newOrg
                    if (obj.type === 'A') {
                        obj.permissions = [],
                            obj.uri = "",
                            obj.scope_tag = ""
                    }
                    method = 'post',
                        postData = {
                            code: obj.code,
                            parentCode: obj.parent_code,
                            permissions: obj.permissions,
                            scopeTag: obj.scope_tag,
                            sourceLevel: obj.source_level,
                            system: this.systemCode,
                            text: obj.name,
                            type: obj.type,
                            uri: obj.uri,
                            orderNum: obj.order_num
                        }
                } else if (flag === 'update') {
                    obj = this.updateOrg
                    if (obj.type === 'A') {
                        obj.permissions = [],
                            obj.uri = "",
                            obj.scope_tag = ""

                    }
                    method = 'put',
                        postData = {
                            code: obj.code,
                            parentCode: obj.parent_code,
                            permissions: obj.permissions,
                            scopeTag: obj.scope_tag,
                            sourceLevel: obj.source_level,
                            system: this.systemCode,
                            text: obj.name,
                            type: obj.type,
                            uri: obj.uri,
                            id: obj.id,
                            orderNum: obj.order_num
                        }
                }
                this.$refs['powerForm'].validate((valid) => {
                    if (valid && checkParentCode) {
                        axios({
                            url: this.baseUrl+'resource',
                            method: method,
                            headers: '',
                            data: postData
                        }).then(res => {
                            let data = res.data;
                            if (data.success) {
                                if (flag === 'add') {
                                    this.$notify({
                                        title: '资源管理-新增',
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    this.cancelOrg(flag)
                                } else {
                                    this.cancelOrg(flag)
                                    this.$notify({
                                        title: '资源管理-编辑',
                                        message: '编辑成功！',
                                        type: 'success'
                                    });
                                }
                                this.getTableData();
                                this.loadParentOotions();
                            }else {
                                if(!!data.errMsg){
                                    this.$notify.error({
                                        title: '错误',
                                        message: '操作失败原因'+data.errMsg,
                                        duration: 0
                                    });
                                }else{
                                    this.$notify.error({
                                        title: '错误',
                                        message: '操作失败!',
                                        duration: 0
                                    });
                                }
                            }

                        });
                    } else {
                        // this.dialogForm2Visible = true;
                    }
                });
            },
            // 获取表格数据
            getTableData() {
                axios({
                    url: this.baseUrl+'resource',
                    method: 'get',
                    headers: {},
                    params: {
                        text:this.queryName,
                        page: this.currentPage,
                        limit: this.pageSize,
                        system: this.systemCode,
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
            // 编辑窗口赋值
            handleUpdateData(data) {
                this.loadParentOotions(data.type,data.sourceLevel);
                this.dialogFormVisible = true;
                let roleList = []
                if (data.permissions.length === 0) {
                    let list = {
                        code: '',
                        name: '',
                        minus: false,
                        errSpan: false,
                        errInfo: '',
                        errValueSpan: false,
                        errValueInfo: ''
                    }
                    roleList.push(list);
                } else {
                    data.permissions.forEach((element, index) => {
                        let list
                        if (index === 0) {
                            list = {
                                code: element.code,
                                name: element.name,
                                minus: false,
                                errSpan: false,
                                errInfo: '',
                                errValueSpan: false,
                                errValueInfo: ''
                            }
                        } else {
                            list = {
                                code: element.code,
                                name: element.name,
                                minus: true,
                                errSpan: false,
                                errInfo: '',
                                errValueSpan: false,
                                errValueInfo: ''
                            }
                        }
                        roleList.push(list);
                    });
                }

                this.updateOrg = {
                    parent_code: data.parentCode,
                    scope_tag: data.scopeTag,
                    source_level: data.sourceLevel,
                    name: data.text,
                    type: data.type,
                    uri: data.uri,
                    code: data.code,
                    roleList: roleList,
                    id: data.id,
                    order_num: data.orderNum
                }

            },
            // 关闭窗口
            cancelOrg(flag) {
                if (flag === 'add') {
                    this.dialogForm2Visible = false
                    this.$refs.powerForm.resetFields();
                    // this.newOrg = {
                    //     scope_tag: 'ORGAN',
                    //     roleList: [
                    //         {
                    //             code: '',
                    //             name: '',
                    //             minus: false,
                    //             errSpan: false,
                    //             errInfo: '',
                    //             errValueSpan: false,
                    //             errValueInfo: ''
                    //         }
                    //     ],
                    //     parent_code_errSpan: true,
                    //     parent_code_errInfo: ''
                    // }
                } else if (flag === 'update') {
                    this.dialogFormVisible = false
                    this.$refs.powerForm.resetFields();
                    // this.updateOrg = {
                    //     roleList: [
                    //         {
                    //             code: '',
                    //             name: '',
                    //             minus: false,
                    //             errSpan: false,
                    //             errInfo: '',
                    //             errValueSpan: false,
                    //             errValueInfo: ''
                    //         }
                    //     ],
                    //     parent_code_errSpan: true,
                    //     parent_code_errInfo: ''
                    // }
                }
            },
            deleteData(id) {//删除
                axios({
                    url: this.baseUrl+'resource/' + id,
                    method: 'delete',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.getTableData();
                        this.loadParentOotions();
                        this.$notify({
                            title: '资源列表-删除',
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        if(!!data.errMsg){
                            this.$notify.error({
                                title: '资源列表-删除',
                                message: '删除失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '资源列表-删除',
                                message: '删除失败!',
                                duration: 0
                            });
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
                        active: true
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        dics.splice(0, dics.length);
                        data.content.forEach(g => dics.push(g));
                    }
                })
            },
            loadParentOotions(level) {
                let params = {
                    system: this.systemCode
                };
                if (!!level) {
                    params.level = level;
                }

                axios({
                    url: this.baseUrl+'resource/dir',
                    method: 'get',
                    headers: {},
                    params: params
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.parentOptions.splice(0, this.parentOptions.length);
                        this.parentOptions = this.convertData(data.content, 'code', 'text')
                    }
                })
            },
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
            },
            getParents(obj) {//根据资源等级切换可选上级资源
                let level = obj['resource_level'];
                let type = obj['type'];
                obj['parent_code'] = null;
                this.loadParentOptions(type,level);
            },
            loadParentOptions(type,level){
                if(type=='A'){
                    if (level == 1) {
                        this.parentOptions=[];
                    } else if (level == 2) {
                        this.loadParentOotions(1);
                    } else {
                        this.loadParentOotions();
                    }
                }else{
                    this.loadParentOotions();
                }
            }
        },
        created: function () {
            // 初始化参数
        },
        watch: {},
        mounted: function () {
            this.getTableData();
            this.loadParentOotions();
            this.loadDics('sys.resource.type', this.typeOptions);
        }
    }
</script>
<style scoped>
    .powerPage {
        font-size: 14px;
        height: 96%;
        overflow: auto;
    }

    .modalRow {
        margin-bottom: 16px;
    }

    .noErr {
        margin-bottom: 10px;
    }

    .hasErr {
        margin-bottom: 20px;
    }

    .el-select {
        width: 100%;
    }

    .el-input-number__decrease, .el-input-number__increase {
        top: 4px;
    }

    .el-input-number.is-controls-right .el-input-number__decrease {
        bottom: 4px;
    }

    .el-input-number.is-controls-right .el-input-number__increase {
        height: 16px;
    }

    .el-input-number.is-controls-right .el-input-number__decrease, .el-input-number.is-controls-right .el-input-number__increase {
        line-height: 14px;
    }

    .card_height {
        min-height: calc(100vh - 100px);
    }
</style>