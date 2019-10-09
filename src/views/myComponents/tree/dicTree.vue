<template>
    <div>
         <el-row>
            <el-dropdown @command="addGroupOrDic"
                            icon="el-icon-add">
                <el-button type="primary">
                    <i class="el-icon-plus"></i>
                </el-button> 
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="group">分组</el-dropdown-item>
                    <el-dropdown-item command="dic">字典</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
                <el-button type="primary" @click="editGroupOrDic" icon="el-icon-edit"></el-button>
            <el-button @click="deleteGroupOrDic" type="danger" icon="el-icon-delete" style="margin-left:0px"></el-button>
        </el-row>
        <el-row style="margin-top:10px">
            <el-col :span="24">
                <el-input v-model="filterGroupName" placeholder="输入名称"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-tree ref="dicGroupTree" highlight-current :icon-class="'el-icon-folder'"
                        :data="dicGroups" :props="{label:'name'}" :filter-node-method="filterDics" node-key="id" :default-expanded-keys="defaultExpand" 
                        @node-click="groupSelected">
                    <span class="span-ellipsis" slot-scope="{ node, data }">
                            <el-tooltip class="item" effect="dark" :content="node.label" placement="bottom" :open-delay='1000'>
                            <span >{{ node.label }}</span>
                        </el-tooltip>
                    </span>
            </el-tree>
        </el-row>
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
			<el-form :rules="dicDialog.addDicRules" ref="addDicForm" :model="newDic" label-width="80px">
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
				<el-form-item class="dialog_button">
					<el-button @click="closeDicDialog">取消</el-button>
					<el-button type="primary" @click="saveDic(dicDialog.action)">保存</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    props: [
        'versionType',
        'versionValue'
    ],
    data: function () {
         // 验证字典代码唯一
	        var validDicCodeUnique = (rule, value, callback) => {
	            var cts = contails(this.dicGroups, 'code', 'children', value);
	            if (cts) {
	                callback(new Error("该代码已存在"));
	            } else {
	                callback();
	            }
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
        // var versionType = 'standard';
        return {
            dicGroups:[],
            // 当前版本
            version: this.versionValue,
            // 版本列表
            versions: [],
             // 根分组代码
            parentGroup: this.versionType,
            // 版本类型
            vType: this.versionType,
            // 当前已激活版本
            activedVerson: null,
            // 显示已作废字典分组
            showVoidedGroup: false,
            defaultExpand:[],
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
            filterGroupName:'',
            defaultExpand:[],
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
                active: true,
                scope: null,
                version: this.version,
                sortNo: null,
                type: this.versionType
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
                active: true,
                visible: true,
                type: this.versionType
            },
        }
    },
    methods:{
        // 过滤字典（字典组）
        filterDics(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        // 选中分组
        groupSelected(data, node, self) {
            if ("dic" == data.type) {
                this.selectedDic = data;
                this.selectedGroup = null;
                this.$emit('update:treeSelect',data);
            } else if ("group" == data.type) {
                this.selectedGroup = data;
                this.selectedDic = null;
            }
        },
         // 加载字典分组树
        loadDicGroups() {
            let _that=this
            // this.parentGroup='standard'
            axios({
                url: this.baseUrl+'dicGroup/tree',
                method: 'get',
                headers: {},
                params: {
                    parentCode: _that.parentGroup,
                    active: _that.showVoidedGroup ? null : true,
                    version: _that.version,
                    withDic:true
                }
            }).then(res => {
                let data = res.data;
                if (data.success) {
                    _that.dicGroups=[]
                    data.content.forEach(g => _that.dicGroups.push(g));
                    _that.selectedDic = null;
                    _that.selectedGroup = null;
                    _that.selectedItem = null;
                    _that.defaultExpand=[]
                    _that.defaultExpand.push(_that.dicGroups[0].children[0].children[0].id)
                }
            })
        },
        // 加载字典版本
        loadVersions() {
            axios({
                url: this.baseUrl+'version',
                method: 'get',
                headers: {},
                params: {
                    type: this.vType
                }
            }).then(res => {
                let data = res.data;
                if (data.success) {
                    this.versions.splice(0, this.versions.length);
                    data.content.forEach(v => {
                        this.versions.push(v)
                        if (v.active) {
                            this.activedVerson = v.version;
                            this.version = v.version;
                        }
                    });
                }
            }).catch(e => {
                console.error(e);
            })
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
                        active: true,
                        scope: null,
                        version: this.version,
                        sortNo: null
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
                        active: true,
                        visible: true
                    };
                    this.dicDialog.show = true;
                    break;
                default:
                    console.error("command不正确");
                    break;
            }
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
	                    url: this.baseUrl+'dic/' + this.selectedDic.id,
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
	                            url: this.baseUrl+'dicGroup/' + this.selectedGroup.id,
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
	                            url: this.baseUrl+'dic/' + this.selectedDic.id,
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
                                url: this.baseUrl+'dicGroup',
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
    },

    created() {
	        // 初始化参数
            this.loadVersions();
	        if (this.version) {
	            this.loadDicGroups();
	        }
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
	                // this.dicItemsData.currentPage = 1;
	                // this.loadItems();
	            } else {
	                // this.dicItemsData.items.splice(0, this.dicItemsData.items.length);
	                // this.dicItemsData.totalItems = 0;
	            }
	        },
    }
}
</script>
<style >
    .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    font-size: 14px;
}
</style>