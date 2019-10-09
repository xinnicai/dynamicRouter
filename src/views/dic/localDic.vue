<template>
    <div>
        <el-row style="margin-bottom:10px">
           <el-col :span="24">
                    <div id="dic-header">
                        <el-select v-model="version" placeholder="请选择本地字典" style="width:210px;">
                            <el-option v-for="(v, index) in versions" :lable="v.version" :value="v.version"
                                    :key="v.id"></el-option>
                        </el-select>
                        <el-button style="margin-left:10px" @click="addVersionDialog.show = true">新增本地字典
                        </el-button>
                        <!-- TODO 导入本地字典 -->
                        <!--<el-button type="primary" style="margin-left:10px" @click="">导入本地字典
                        </el-button>-->
                    </div>
                </el-col>
        </el-row>
        <el-row :gutter="16">
            <el-col :span="5">
                <el-card class="box-card leftCard">
                    <el-row>
                        <el-dropdown @command="addGroupOrDic">
                            <el-button type="primary">
                                <i class="el-icon-plus"></i>
                            </el-button> 
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="group">分组</el-dropdown-item>
                                <el-dropdown-item command="dic">字典</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button type="primary" @click="editGroupOrDic" icon="el-icon-edit" ></el-button>
	                    <el-button @click="deleteGroupOrDic" type="danger" icon="el-icon-delete" style="margin-left:0px"></el-button>
                    </el-row>
                    <el-row style="margin-top:10px">
                        <el-col :span="24">
                            <el-input v-model="filterGroupName" placeholder="输入名称"></el-input>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px">
                        <el-tree class="filter-tree" ref="dicGroupTree" highlight-current icon-class='el-icon-folder' default-expand-all
                                 :data="dicGroups" :props="{label:'name'}" :filter-node-method="filterDics"
                                 @node-click="groupSelected">
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
                 <el-card class="box-card rightCard">
                    <el-row>
                        <el-col :span="24">
                            <el-input placeholder="输入名称" v-model="dicItemsData.searchName"
                                      style="width: 180px"></el-input>
                            <el-button icon="el-icon-search" type="primary" @click="loadItems"></el-button>
                            <el-dropdown @command="addItem">
                                <el-button type="primary">
									新增<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="item">项</el-dropdown-item>
                                    <el-dropdown-item command="subItem">子项</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
<!--                            <el-button-group>
                                <el-button @click="">自动对照</el-button>
                                <el-button @click="">保存</el-button>
                            </el-button-group>-->
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px">
                        <el-col :span="24">
                            <el-table
                                    :data="dicItemsData.items"
                                    style="width: 100%;margin-bottom: 20px;"
                                    row-key="key"
                                    highlight-current-row
                                    @current-change="selectItem"
                                    border
                                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                                <el-table-column
                                        prop="key"
                                        label="编码"
                                        sortable>
                                </el-table-column>
                                <el-table-column
                                        prop="text"
                                        label="名称"
                                        sortable>
                                </el-table-column>
                                <el-table-column
                                        prop="unit"
                                        label="单位">
                                </el-table-column>
                                <el-table-column
                                        prop="transferKey"
                                        label="标准编码">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.transferKey" placeholder="标准字典" @change="scope.row.changed=true">
                                            <el-option v-for="item in standardItems" :lable="item.text" :value="item.key"
                                                       :key="item.key">
                                                <span style="float: left">{{item.key}}--{{ item.text }}</span>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="200px">
                                    <template slot-scope="scope">
                                        <el-button-group>
                                            <el-button icon="el-icon-edit"
                                                       size="mini"
                                                       @click="editItem(scope.$index, scope.row)">
                                            </el-button>
                                            <el-button icon="el-icon-delete" v-if="!scope.row.hasChildren"
                                                       size="mini"
                                                       type="danger"
                                                       @click="deleteItem(scope.$index, scope.row)">
                                            </el-button>
                                        </el-button-group>
                                        <el-button-group v-if="scope.row.changed">
                                            <el-button type="success" icon="el-icon-check" size="mini" title="保存" @click="saveItemTransfer(scope.row)"></el-button>
                                            <el-button type="warning" icon="el-icon-refresh-left" size="mini" tile="重置" @click="resetItemTransfer(scope.row)"></el-button>
                                        </el-button-group>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 10px;margin-bottom:20px;float: right;">
                        <el-pagination
                                @size-change="loadItems"
                                @current-change="loadItems"
                                :current-page.sync="dicItemsData.currentPage"
                                :page-sizes="[10, 25, 50, 100]"
                                :page-size.sync="dicItemsData.limit"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="dicItemsData.totalItems">
                        </el-pagination>
                    </el-row>

                </el-card>
            </el-col>
        </el-row>
           <el-dialog :title="addVersionDialog.title" :visible.sync="addVersionDialog.show" width="65%"
                   @close="closeVersionDialog">
            <el-form :rules="addVersionDialog.addVersionRules" ref="addVisionForm" :model="newVersion"
                     label-width="80px">
                <el-form-item label="源字典">
                    <el-select v-model="newVersion.sourceVersion" placeholder="请选择字典" style="width:100%">
                        <el-option v-for="(v, index) in versions" :lable="v.version" :value="v.version"
                                   :key="v.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="新字典" prop="version">
                    <el-input v-model="newVersion.version"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="newVersion.description">
                    </el-input>
                </el-form-item>
                <el-form-item class="dialog_button">
                    <el-button type="primary" @click="addVersion('addVisionForm')">创建</el-button>
                    <el-button @click="addVersionDialog.show = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 新建/编辑分组 -->
        <el-dialog :title="groupDialog.title" :visible.sync="groupDialog.show" width="65%" @close="closeGroupDialog">
            <el-form :rules="groupDialog.addGroupRules" ref="addGroupForm" :model="newGroup" label-width="80px">
                <el-form-item label="所属分组" prop="parentCode">
                    <el-input v-if="newGroup.parent" v-model="newGroup.parent.name" disabled></el-input>
                    <el-input v-if="!newGroup.parent" disabled></el-input>
                </el-form-item>
                <el-form-item label="代码" prop="code">
                    <el-input v-model="newGroup.code" :disabled="'edit'==groupDialog.action"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="newGroup.name"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="newGroup.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="排序编号" prop="sortNo">
                    <el-input type="number" v-model="newGroup.sortNo"></el-input>
                </el-form-item>
                <el-form-item class="dialog_button">
                    <el-button @click="closeGroupDialog">取消</el-button>
                    <el-button type="primary" @click="saveGroup(groupDialog.action)">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 新建/编辑字典 -->
        <el-dialog :title="dicDialog.title" :visible.sync="dicDialog.show" width="65%" @close="closeDicDialog">
            <el-form :rules="dicDialog.addDicRules" ref="addDicForm" :model="newDic" label-width="120px">
                <el-form-item label="所属分组" prop="groupCode">
                    <el-input v-model="newDic.group.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="代码" prop="code">
                    <el-input v-model="newDic.code"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="newDic.name"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="newDic.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="标准字典版本">
                    <el-select v-model="newDic.transferDicVersion" placeholder="请选择版本" @change="loadStandardDicTree">
                        <el-option v-for="(v, index) in standardVersions" :lable="v.version" :value="v.version"
                                   :key="v.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标准字典">
                    <el-cascader v-model="newDic.transferDicCode"
                                 :options="standardDics" :show-all-levels="false"
                                 :props="{value: 'code',label: 'name'}"
                                 clearable filterable></el-cascader>
                </el-form-item>
                <el-form-item class="dialog_button">
                    <el-button @click="closeDicDialog">取消</el-button>
                    <el-button type="primary" @click="saveDic(dicDialog.action)">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 新建/编辑项 -->
        <el-dialog :title="itemDialog.title" :visible.sync="itemDialog.show" width="65%" @close="closeItemDialog">
            <el-form :rules="itemDialog.itemRules" ref="addItemForm" :model="newItem" label-width="80px">
                <el-form-item label="所属字典" prop="dicCode">
                    <el-input v-model="newItem.dic.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="父项" prop="dicCode" v-if="newItem.parent">
                    <el-input v-model="newItem.parent.text" disabled></el-input>
                </el-form-item>
                <el-form-item label="代码" prop="key">
                    <el-input v-model="newItem.key" :disabled="'edit'==itemDialog.action"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="text">
                    <el-input v-model="newItem.text"></el-input>
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="newItem.unit"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="newItem.description"></el-input>
                </el-form-item>
                <el-form-item label="标准字典">
                    <el-select v-model="newItem.transferKey" placeholder="请选择标准字典">
                        <el-option v-for="item in standardItems" :lable="item.text" :value="item.key"
                                   :key="item.key">
                            <span style="float: left">{{item.key}}--{{ item.text }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="dialog_button">
                    <el-button @click="closeItemDialog">取消</el-button>
                    <el-button type="primary" @click="saveItem(itemDialog.action)">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>

</template>
<script>
import axios from 'axios'
	export default {
        data() {
            // 验证版本唯一
            var validVersionUnique = (rule, value, callback) => {
                this.versions.forEach(v => {
                    if (v.version == value) {
                        callback(new Error("该字典已存在"))
                    } else {
                        callback();
                    }
                })
            };
            // 验证字典代码唯一
            var validDicCodeUnique = (rule, value, callback) => {
                var cts = contails(this.dicGroups, 'code', 'children', value);
                if (cts) {
                    callback(new Error("该代码已存在"));
                } else {
                    callback();
                }
            };
            // 验证字典项代码唯一
            var validItemKeyUnique = (rule, value, callback) => {
                axios({
                    url: this.baseUrl+'dicItem/key',
                    method: 'get',
                    params: {
                        version: this.version,
                        dicCode: this.selectedDic.code,
                        key: value
                    }
                }).then(res => {
                    if (res.data.content) {
                        callback(new Error("该代码已存在"));
                    } else {
                        callback();
                    }
                })
            };
            // 验证是否存在
            var contails = (ary, pro, children, value) => {
                var cts = false;
                for (let i = 0; i < ary.length; i++) {
                    let a = ary[i];
                    if (value == a[pro]) {
                        cts = true;
                    } else if (a[children]) {
                        cts = contails(a[children], pro, children, value);
                    }
                    if (cts) {
                        return cts;
                    }
                }
                return cts;
            };

            // 字典类型
            var dicType = "localDic";

            return {
                /**
                 *  头部数据
                 * */
                dicType: dicType,
                // 当前版本
                version: null,
                // 版本列表
                versions: [],
                // 标准字典版本
                standardVersion: null,
                // 标准字典版本列表
                standardVersions: [],
                // 标准字典
                standardDics: [],
                // 标准字典项
                standardItems:[],

                // 新版本
                newVersion: {
                    type: dicType,
                    version: null,
                    description: null,
                    active: true,
                    sourceVersion: null,
                },
                // 新增版本Dialog属性
                addVersionDialog: {
                    title: '新增本地字典',
                    show: false,
                    addVersionRules: {
                        version: [
                            {required: true, message: "请填写字典名", trigger: "blur"},
                            {validator: validVersionUnique, trigger: "blur"}
                        ]
                    },
                },

                /**
                 * 左侧栏数据
                 * */
                // 显示已作废字典分组
                showVoidedGroup: false,
                // 显示新增/编辑分组编辑框
                showGroupDialog: false,
                // 选中分组
                selectedGroup: null,
                // 选中字典
                selectedDic: null,
                // 过滤用分组名
                filterGroupName: '',
                // 字典组
                dicGroups: [],
                // 字典组Dialog属性
                groupDialog: {
                    title: '',
                    action: 'create',
                    show: false,
                    addGroupRules: {
                        code: [
                            {required: true, message: '代码不能为空', trigger: 'blur'},
                            {validator: validDicCodeUnique, trigger: 'blur'}
                        ],
                        name: [
                            {required: true, message: '名称不能为空', trigger: 'blur'},
                        ]
                    },
                },
                // 新分组
                newGroup: {
                    parent: {},
                    parentCode: null,
                    code: null,
                    name: null,
                    description: null,
                    visible: true,
                    active: false,
                    scope: null,
                    version: this.version,
                    sortNo: null,
                    type: dicType
                },
                // 字典dialog属性
                dicDialog: {
                    title: '',
                    show: false,
                    action: 'create',
                    addDicRules: {
                        code: [
                            {required: true, message: '代码不能为空', trigger: 'blur'},
                            {validator: validDicCodeUnique, trigger: 'blur'}
                        ],
                        name: [
                            {required: true, message: '名称不能为空', trigger: 'blur'},
                        ]
                    }
                },
                // 新字典
                newDic: {
                    group: {},
                    version: this.version,
                    code: null,
                    name: null,
                    description: null,
                    classify: null,
                    active: false,
                    visible: true,
                    transferDicCode: null,
                    transferDicVersion: this.standardVersion,
                    type: dicType
                },

                // 字典项dialog
                itemDialog: {
                    show: false,
                    title: '',
                    itemRules: {
                        key: [
                            {required: true, message: '代码不能为空', trigger: 'blur'},
                            {validator: validItemKeyUnique, trigger: 'blur'}
                        ],
                        text: [
                            {required: true, message: '名称不能为空', trigger: 'blur'},
                        ]
                    }
                },
                selectedItem: null,
                //
                newItem: {
                    version: this.version,
                    dic: this.selectedDic | {},
                    key: null,
                    text: null,
                    unit: null,
                    description: null,
                    parent: null,
                    hasChildren: false,
                    type: dicType,
                    active:false
                },
                //字典项部分数据
                dicItemsData: {
                    // 搜索条件
                    searchName: '',
                    // 显示已作废
                    showVoidedItems: false,
                    //当前页
                    currentPage: 1,
                    // 分页数量
                    limit: 25,
                    // 字典项
                    items: [],
                    // 总项数
                    totalItems: 0,
                }

            }
        },
        methods: {
            /**
             * 头部方法
             */
            // 加载字典版本
            loadVersions() {
                axios({
                    url: this.baseUrl+'version',
                    method: 'get',
                    headers: {},
                    params: {
                        type: this.dicType
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.versions.splice(0, this.versions.length);
                        data.content.forEach(v => {
                            this.versions.push(v);
                            //TODO 若当前版本的有效域和当前角色所属机构一致，则默认选中
                            if (v.scope) {
                                this.version = v.version;
                            }
                        });
                    }
                }).catch(e => {
                    console.error(e);
                })
            },
            // 加载标准字典版本
            loadStandardVersions() {
                axios({
                    url: this.baseUrl+'version',
                    method: 'get',
                    params: {
                        type: 'standard'
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.standardVersions.splice(0, this.standardVersions.length);
                        data.content.forEach(v => {
                            this.standardVersions.push(v);
                            if (v.active) {
                                this.standardVersion = v.version;
                                this.loadStandardDicTree(this.standardVersion);
                            }
                        })
                    }
                })
            },
            // 加载标准字典
            loadStandardDicTree(version) {
                axios({
                    url: this.baseUrl+'dicGroup/tree',
                    method: 'get',
                    headers: {},
                    params: {
                        parentCode: 'standard',
                        type: 'standard',
                        version: version,
                        withDic: true
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.standardDics.splice(0, this.standardDics.length);
                        data.content.forEach(g => this.standardDics.push(g));
                    }
                })
            },
            // 新增版本
            addVersion(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios({
                            url: this.baseUrl+'version',
                            method: 'post',
                            headers: '',
                            data: this.newVersion
                        }).then(res => {
                            this.newVersion = {
                                type: this.dicType,
                                version: null,
                                description: null,
                                active: false,
                                sourceVersion: null,
                            };
                            this.loadVersions();
                        });
                        this.closeVersionDialog();
                    } else {
                        this.addVersionDialog.show = true;
                    }
                });
            },
            closeVersionDialog() {
                this.addVersionDialog.show = false;
                this.$refs['addVisionForm'].clearValidate();
            },


            /**
             * 左侧方法
             */
            // 加载字典分组树
            loadDicGroups() {
                axios({
                    url: this.baseUrl+'dicGroup/tree',
                    method: 'get',
                    headers: {},
                    params: {
                        parentCode: this.dicType,
                        type: this.dicType,
                        version: this.version,
                        withDic: true
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.dicGroups.splice(0, this.dicGroups.length);
                        data.content.forEach(g => this.dicGroups.push(g));
                        this.selectedItem = null;
                        this.selectedGroup = null;
                        this.selectedDic = null;
                    }
                })
            },
            // 过滤字典（字典组）
            filterDics(value, data) {
                if (!value) return true;
                if (null == data || null == data.name) {
                } else {
                    return data.name.indexOf(value) !== -1;
                }
            },
            // 选中分组
            groupSelected(data, node, self) {
                if ("dic" == data.type) {
                    this.selectedDic = data;
                    this.selectedGroup = null;
                } else if ("group" == data.type) {
                    this.selectedGroup = data;
                    this.selectedDic = null;
                }
            },
            // 添加字典或字典组
            addGroupOrDic(command) {
                if (!this.selectedGroup) {
                    this.$message.error('请选择所属分组');
                    return;
                }
                switch (command) {
                    case "group":
                        this.groupDialog.title = '新增分组';
                        this.groupDialog.action = 'create';
                        this.newGroup = {
                            parent: this.selectedGroup,
                            parentCode: this.selectedGroup.code,
                            code: null,
                            name: null,
                            description: null,
                            visible: true,
                            active: false,
                            version: this.version,
                            sortNo: null,
                            type: this.dicType
                        };
                        // this.$refs['addGroupForm'].clearValidate();
                        this.groupDialog.show = true;
                        break;
                    case "dic":
                        this.dicDialog.title = '新增字典';
                        this.dicDialog.action = 'create';
                        this.newDic = {
                            group: this.selectedGroup,
                            version: this.version,
                            code: null,
                            name: null,
                            description: null,
                            classify: null,
                            active: false,
                            visible: true,
                            transferDicCode: ["standard","nhdd","nhdd.WS364.3","CV02.01.101"],
                            transferDicVersion: this.standardVersion,
                            type: this.dicType
                        };
                        this.dicDialog.show = true;
                        break;
                    default:
                        console.error("command不正确");
                        break;
                }
            },
            // 添加字典组
            saveGroup(action) {
                switch (action) {
                    case 'edit':
                        axios({
                            url: this.baseUrl+'dicGroup',
                            method: 'put',
                            headers: {},
                            data: this.newGroup
                        }).then(res => {
                            this.loadDicGroups();
                        });
                        this.closeGroupDialog();
                        break
                    case 'create':
                        this.$refs['addGroupForm'].validate((valid) => {
                            if (valid) {
                                axios({
                                    url: 'dicGroup',
                                    method: 'post',
                                    headers: {},
                                    data: this.newGroup
                                }).then(res => {
                                    this.loadDicGroups();
                                });
                                this.closeGroupDialog();
                            } else {
                                this.groupDialog.show = true;
                            }
                        })
                        break;
                    default:
                        break;
                }

            },
            // 取消保存字典组
            closeGroupDialog() {
                this.groupDialog.show = false;
                this.$refs['addGroupForm'].clearValidate();
            },
            // 添加字典
            saveDic(action) {
                switch (action) {
                    case 'edit':
                        this.newDic.groupCode = this.newDic.group.code;
                        if (this.newDic.transferDicCode) {
                            this.newDic.transferDicCode = this.newDic.transferDicCode[this.newDic.transferDicCode.length - 1]
                        }
                        axios({
                            url: this.baseUrl+'dic',
                            method: 'put',
                            headers: {},
                            data: this.newDic
                        }).then(rew => {
                            this.loadDicGroups();
                        })
                        this.closeDicDialog();
                        break;
                    case 'create':
                        this.$refs['addDicForm'].validate((valid) => {
                            if (valid) {
                                this.newDic.groupCode = this.newDic.group.code;
                                if (this.newDic.transferDicCode) {
                                    this.newDic.transferDicCode = this.newDic.transferDicCode[this.newDic.transferDicCode.length - 1]
                                }
                                axios({
                                    url: this.baseUrl+'dic',
                                    method: 'post',
                                    headers: {},
                                    data: this.newDic
                                }).then(rew => {
                                    this.loadDicGroups();
                                })
                                this.closeDicDialog();
                            } else {
                                this.dicDialog.show = true
                            }
                        })
                        break;
                    default:
                        break;
                }
            },
            closeDicDialog() {
                this.dicDialog.show = false;
                this.$refs['addDicForm'].clearValidate();
            },
            // 编辑字典组或字典
            editGroupOrDic() {
                if (this.selectedGroup) {
                    this.groupDialog.title = '编辑分组';
                    this.groupDialog.action = 'edit';
                    axios({
                        url: this.baseUrl+'dicGroup/' + this.selectedGroup.id,
                        method: 'get'
                    }).then(res => {
                        this.newGroup = res.data.content;
                        this.groupDialog.show = true;
                    });
                } else if (this.selectedDic) {
                    this.dicDialog.title = '编辑字典';
                    this.dicDialog.action = 'edit';
                    axios({
                        url: 'dic/' + this.selectedDic.id,
                        method: 'get'
                    }).then(res => {
                        this.newDic = res.data.content;
                        this.dicDialog.show = true;
                    })
                } else {
                    this.$message.error("请先选择字典或字典组");
                }
            },
            deleteGroupOrDic() {
                if (this.selectedGroup) {
                    this.$confirm('将删除当前分组及包含内容，是否继续？', '确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then((command) => {
                        if ('confirm' == command) {
                            axios({
                                url: 'dicGroup/' + this.selectedGroup.id,
                                method: 'delete'
                            }).then(res => {
                                this.loadDicGroups();
                            })
                        }
                    }).catch((e) => {
                        // 取消
                    })
                } else if (this.selectedDic) {
                    this.$confirm('将删除当前分组及包含内容，是否继续？', '确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then((command) => {
                        if ('confirm' == command) {
                            axios({
                                url: 'dic/' + this.selectedDic.id,
                                method: 'delete'
                            }).then(res => {
                                this.loadDicGroups();
                            })
                        }
                    }).catch((e) => {
                        // 取消
                    })
                } else {
                    this.$message.error("请选择要删除的字典组或字典");
                }
            },

            /**
             *
             */
            // 加载字典项
            loadItems() {
                if (!this.selectedDic) {
                    this.$message.error('请选择字典');
                    return;
                }
                axios({
                    url: this.baseUrl+'dicItem',
                    method: 'get',
                    headers: {},
                    params: {
                        version: this.version,
                        dicCode: this.selectedDic.code,
                        text: this.dicItemsData.searchName,
                        sort: [],
                        page: this.dicItemsData.currentPage,
                        limit: this.dicItemsData.limit
                    }
                }).then(res => {
                    res = res.data;
                    this.dicItemsData.totalItems = res.content.totalElements;
                    this.dicItemsData.items.splice(0, this.dicItemsData.items.length);
                    res.content.content.forEach(item => {
                        item.oldKey=item.transferKey;
                        this.dicItemsData.items.push(item)
                    });
                    this.selectedItem = null;
                })
            },
            // 加载标准字典
            loadStandardItems() {
                if (!this.selectedDic) {
                    this.$message.error('请选择字典');
                    return;
                }
                if (this.selectedDic.transferDicCode) {
                    axios({
                        url: this.baseUrl+'dicItem/all',
                        method: 'get',
                        headers: {},
                        params: {
                            version: this.selectedDic.transferDicVersion,
                            dicCode: this.selectedDic.transferDicCode
                        }
                    }).then(res => {
                        res = res.data;
                        this.standardItems.splice(0, this.standardItems.length)
                        res.content.forEach(item => {
                            this.standardItems.push(item)
                        });
                    })
                }
            },
            // 添加项
            addItem(command) {
                if (!this.selectedDic) {
                    this.$message.error('请选择字典');
                    return;
                }
                switch (command) {
                    case "item":
                        this.itemDialog.title = '新增字典项';
                        this.itemDialog.action = 'create';
                        this.newItem = {
                            version: this.version,
                            dic: this.selectedDic,
                            key: null,
                            text: null,
                            unit: null,
                            description: null,
                            parent: null,
                            hasChildren: false,
                            type: this.dicType,
                            active: false
                        };
                        this.itemDialog.show = true;
                        break;
                    case 'subItem':
                        if (!this.selectedItem) {
                            this.$message.error('请选择字典项');
                            return;
                        }
                        this.itemDialog.title = '新增子项';
                        this.itemDialog.action = 'create';
                        this.newItem = {
                            version: this.version,
                            dic: this.selectedDic,
                            key: null,
                            text: null,
                            unit: null,
                            description: null,
                            parent: this.selectedItem,
                            hasChildren: false,
                            type: this.dicType,
                            active: false
                        };
                        this.itemDialog.show = true;
                        break;
                    default:
                        console.error("command不正确");
                        break;
                }
            },
            // 编辑字典项
            editItem(index, data) {
                this.newItem = data;
                this.newItem.dic = this.selectedDic;
                this.itemDialog.title = '编辑字典项';
                this.itemDialog.action = 'edit';
                this.itemDialog.show = true;
            },
            // 选中项
            selectItem(data) {
                this.selectedItem = data;
            },
            // 保存字典项对照
            saveItemTransfer(item) {
                item.oldKey = item.transferKey;
                item.changed = false;
                item.transferVersion = this.standardVersion;

                axios({
                    url: this.baseUrl+'dicItem',
                    method: 'put',
                    data: item
                }).then(res => {
                    let data=res.data;
                    if(data.success){
                        this.$notify({
                            title: '编辑编码-本地字典',
                            message: '编辑成功',
                            type: 'success'
                        });
                    }else{
                        if(!!data.errMsg){
                            this.$notify.error({
                                title: '编辑编码-本地字典',
                                message: '编辑失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '编辑编码-本地字典',
                                message: '编辑失败!',
                                duration: 0
                            });
                        }
                    }
                })
                
            },
            // 重置字典项对照
            resetItemTransfer(item) {
                item.transferKey = item.oldKey;
                item.changed = false;
            },
            // 保存字典项
            saveItem(action) {
                switch (action) {
                    case 'edit':
                        axios({
                            url: this.baseUrl+'dicItem',
                            method: 'put',
                            data: this.newItem
                        }).then(res => {
                            this.loadItems();
                        })
                        this.closeItemDialog();
                        break;
                    case 'create':
                        this.$refs['addItemForm'].validate((valid) => {
                            if (valid) {
                                this.newItem.dicCode = this.newItem.dic.code;
                                if (this.newItem.parent) {
                                    this.newItem.parentCode = this.newItem.parent['key'] | null;
                                }
                                axios({
                                    url: this.baseUrl+'dicItem',
                                    method: 'post',
                                    data: this.newItem
                                }).then(res => {
                                    this.loadItems();
                                })
                                this.closeItemDialog();
                            } else {
                                this.itemDialog.show = false;
                            }
                        })
                        break;
                    default:
                        break;
                }
            },
            // 关闭itemDialog
            closeItemDialog() {
                this.itemDialog.show = false;
                this.$refs['addItemForm'].clearValidate();
            },
            // deleteItem
            deleteItem(index, data) {
                this.$confirm('将删除当前字典项，是否继续？', '确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((command) => {
                    if ('confirm' == command) {
                        axios({
                            url: this.baseUrl+'dicItem/' + data.id,
                            method: 'delete'
                        }).then(res => {
                            this.loadItems();
                        })
                    }
                }).catch((e) => {
                    // 取消
                })
            }
        },
        created() {
            // 初始化参数
            this.loadVersions();
            if (this.version) {
                this.loadDicGroups();
            }
            this.loadStandardVersions();
        },
        watch: {
            /**
             * 顶部
             */
            // 当前版本变动时，字典组列表重新加载
            version: function () {
                this.loadDicGroups();
            },


            /**
             * 左侧
             */
            // 显示已作废字典（字典组）
            showVoidedGroup: function () {
                this.loadDicGroups();
            },
            // 字典组名称
            filterGroupName: function (val) {
                this.$refs.dicGroupTree.filter(val);
            },
            // 被选中字典组
            selectedGroup: function () {
            },
            // 被选中字典
            selectedDic: function () {
                if (this.selectedDic) {
                    // 字典被选中是，加载字典项
                    this.dicItemsData.currentPage = 1;
                    this.loadItems();
                    // 加载标准字典
                    this.loadStandardItems();
                } else {
                    this.dicItemsData.items.splice(0, this.dicItemsData.items.length);
                    this.dicItemsData.totalItems = 0;
                }
            },
            standardVersion: function () {
                if (this.standardVersion) {
                    this.loadStandardDicTree(this.standardVersion);
                }
            }

        }
    }
</script>
<style scoped>
   .localDicPage{
		padding:10px;
		margin-top:10px;
	}
    .dialogLabel label {
        line-height: 35px
    }
   .rightCard{
       min-height: calc(100vh - 145px);
       /*max-height:calc(100vh - 180px);*/
   }
   .leftCard{
       min-height: calc(100vh - 145px);
       max-height:calc(100vh - 145px);
   }
     .el-tree {
        max-height:calc(100vh - 250px);
        overflow-x: auto;
        overflow-y: auto;
    }
    .span-ellipsis {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        }
</style>