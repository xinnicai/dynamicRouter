<template>
  <div>
    <el-row style="margin-bottom:10px">
      <el-col :span="24">
			<!-- <el-card class="box-card"> -->
				<div id="dic-header">
					<el-select v-model="version" placeholder="请选择字典版本" style="width:210px;">
						<el-option v-for="(v, index) in versions" :lable="v.version" :value="v.version"
								:key="v.id"></el-option>
					</el-select>
					<el-button style="margin-left:10px" @click="console.log(newVersion);addVersionDialog.show = true">新增版本
					</el-button>
					<el-button v-if="this.version != this.activedVerson">激活版本</el-button>
				</div>
			<!-- </el-card> -->
		</el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="5">
        <el-card class="box-card leftCard" >
			<el-row>
				<el-dropdown @command="addGroupOrDic"
								icon="el-icon-add">
					<el-button type="primary">
						<i class="el-icon-document-add"></i>
					</el-button> 
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="group">分组</el-dropdown-item>
						<el-dropdown-item command="dic">字典</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
					<el-button type="primary" @click="editGroupOrDic" icon="el-icon-edit"></el-button>
				<el-button @click="deleteGroupOrDic" type="danger" icon="el-icon-delete" style="margin-left:0px"></el-button>
				<!-- <el-button-group>
					<el-button type="primary" icon="el-icon-edit" @click="editGroupOrDic"></el-button>
					<el-button type="primary" icon="el-icon-delete" @click="deleteGroupOrDic"></el-button>
				</el-button-group> -->
			</el-row>
			<el-row style="margin-top:10px">
				<el-col :span="24">
					<el-input v-model="filterGroupName" placeholder="输入名称"></el-input>
				</el-col>
			</el-row>
			<el-row style="margin-top:10px"  class="filter-tree el-tree">
				<el-tree ref="dicGroupTree" highlight-current icon-class='el-icon-folder'
							:data="dicGroups" :props="{label:'name'}" :filter-node-method="filterDics" node-key="id" :default-expanded-keys="defaultExpand" 
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

				</el-col>
			</el-row>
			<el-row style="margin-top:10px">
				<el-table
						:data="dicItemsData.items"
						style="width: 100%;margin-bottom: 20px;"
						row-key="key"
						highlight-current-row
						@current-change="selectItem"
						border
						default-expand-all
						:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
					<el-table-column
							prop="key"
							label="编码"
							sortable
							width="180">
					</el-table-column>
					<el-table-column
							prop="text"
							label="名称"
							sortable
							width="180">
					</el-table-column>
					<el-table-column
							prop="unit"
							label="单位">
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button
									size="mini"
									@click="editItem(scope.$index, scope.row)">编辑
							</el-button>
							<el-button v-if="!scope.row.hasChildren"
										size="mini"
										type="danger"
										@click="deleteItem(scope.$index, scope.row)">删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
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
    <!-- 新建版本 -->
		<el-dialog :title="addVersionDialog.title" :visible.sync="addVersionDialog.show" width="65%" @close="closeVersionDialog">
			<el-form :rules="addVersionDialog.addVersionRules" ref="addVisionForm" :model="newVersion" label-width="80px">
				<el-form-item label="源版本">
					<el-select v-model="newVersion.sourceVersion" placeholder="请选择字典版本" style="width:100%">
						<el-option v-for="(v, index) in versions" :lable="v.version" :value="v.version"
								   :key="v.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="新版本" prop="version">
					<el-input v-model="newVersion.version"></el-input>
				</el-form-item>
				<el-form-item label="是否激活">
					<el-checkbox v-model="newVersion.active" style="margin-left: 10px"></el-checkbox>
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
					<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="newItem.description">
					</el-input>
				</el-form-item>
				<el-form-item class="dialog_button">
					<el-button @click="closeItemDialog">取消</el-button>
					<el-button type="primary" @click="saveItem(itemDialog.action)">保存</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
  </div>
  <!-- </el-container> --></template>
<script>
import axios from 'axios'
import { getList } from '@/api/dic'

	export default {
	    data(){
	        // 验证版本唯一
	        var validVersionUnique = (rule, value, callback) => {
	            this.versions.forEach(v => {
	                if (v.version == value) {
	                    callback(new Error("该版本已存在"))
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

	        var dicType = 'standard';
	
	        return {
	            /**
	             *  头部数据
	             * */
	            // 字典类型
				dicType: dicType,
	            // 当前已激活版本
	            activedVerson: null,
	            version:'',
	            // 版本列表
	            versions: [],
	
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
	                title: '新增版本',
	                show: false,
	                addVersionRules: {
	                    version: [
	                        {required: true, message: "请填写版本", trigger: "blur"},
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
	                active: true,
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
	                active: true,
	                visible: true,
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
	                limit: 10,
	                // 字典项
	                items: [],
	                // 总项数
	                totalItems: 0,
				},
				defaultExpand:[]
	
	        }
	    },
	    methods: {
	        /**
	         * 头部方法
	         */
	        // 加载字典版本
	        loadVersions() {
	            // axios({
	            //     url: this.baseUrl+'version',
	            //     method: 'get',
	            //     headers: {},
	            //     params: {
	            //         type: this.dicType
	            //     }
	            // }).then(res => {
	            //     let data = res.data;
	            //     if (data.success) {
	            //         this.versions.splice(0, this.versions.length);
	            //         data.content.forEach(v => {
	            //             this.versions.push(v)
	            //             if (v.active) {
	            //                 this.activedVerson = v.version;
	            //                 this.version = v.version;
	            //             }
	            //         });
	            //     }
	            // }).catch(e => {
	            //     console.error(e);
				// })
				let listQuery={
					type: this.dicType
				}

				getList(listQuery).then(response => {
					let data = response;
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
	        // 新增版本
	        addVersion(formName) {
	            this.$refs[formName].validate((valid) => {
	                if (valid) {
	                    // TODO 新建版本
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
	                            active: true,
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
	        closeVersionDialog(){
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
						withDic:true
	                }
	            }).then(res => {
	                let data = res.data;
	                if (data.success) {
	                    this.dicGroups.splice(0, this.dicGroups.length);
	                    data.content.forEach(g => this.dicGroups.push(g));
	                    this.selectedDic = null;
	                    this.selectedGroup = null;
						this.selectedItem = null;
						this.defaultExpand.push(this.dicGroups[0].children[0].children[0].id)
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
					this.$message({
						showClose: true,
						message: '请选择所属分组',
						type: 'warning'
					});
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
	                        active: true,
	                        visible: true,
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
							let data = res.data;
							if(data.success){
								this.$notify({
									title: '编辑字典组-标准字典',
									message: '编辑成功',
									type: 'success'
								});
							}else{
								if(!!data.errMsg){
									this.$notify.error({
										title: '编辑字典组-标准字典',
										message: '编辑失败原因'+data.errMsg,
										duration: 0
									});
								}else{
									this.$notify.error({
										title: '编辑字典组-标准字典',
										message: '编辑失败!',
										duration: 0
									});
								}
							}
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
									let data = res.data;
									if(data.success){
										this.$notify({
											title: '新增字典组-标准字典',
											message: '新增成功',
											type: 'success'
										});
									}else{
										if(!!data.errMsg){
											this.$notify.error({
												title: '新增字典组-标准字典',
												message: '新增失败原因'+data.errMsg,
												duration: 0
											});
										}else{
											this.$notify.error({
												title: '新增字典组-标准字典',
												message: '新增失败!',
												duration: 0
											});
										}
									}
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
							let data = res.data;
							if(data.success){
								this.$notify({
									title: '编辑字典组-标准字典',
									message: '编辑成功',
									type: 'success'
								});
							}else{
								if(!!data.errMsg){
									this.$notify.error({
										title: '编辑字典组-标准字典',
										message: '编辑失败原因'+data.errMsg,
										duration: 0
									});
								}else{
									this.$notify.error({
										title: '编辑字典组-标准字典',
										message: '编辑失败!',
										duration: 0
									});
								}
							}
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
									let data = res.data;
									if(data.success){
										this.$notify({
											title: '新增字典-标准字典',
											message: '新增成功',
											type: 'success'
										});
									}else{
										if(!!data.errMsg){
											this.$notify.error({
												title: '新增字典-标准字典',
												message: '新增失败原因'+data.errMsg,
												duration: 0
											});
										}else{
											this.$notify.error({
												title: '新增字典-标准字典',
												message: '新增失败!',
												duration: 0
											});
										}
									}
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
	                    url: this.baseUrl+'dic/' + this.selectedDic.id,
	                    method: 'get'
	                }).then(res => {
	                    this.newDic = res.data.content;
	                    this.dicDialog.show = true;
	                })
	            } else {
					this.$message({
						showClose: true,
						message: '请先选择字典或字典组',
						type: 'warning'
					});
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
								let data = res.data;
								if(data.success){
									this.$notify({
										title: '删除字典组-标准字典',
										message: '字典组删除成功！',
										type: 'success'
									});
								}else{
									if(!!data.errMsg){
										this.$notify.error({
											title: '删除字典组-标准字典',
											message: '删除失败原因'+data.errMsg,
											duration: 0
										});
									}else{
										this.$notify.error({
											title: '删除字典组-标准字典',
											message: '删除失败!',
											duration: 0
										});
									}
								}
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
								let data = res.data;
								if(data.success){
									this.$notify({
										title: '删除字典-标准字典',
										message: '字典组删除成功！',
										type: 'success'
									});
								}else{
									if(!!data.errMsg){
										this.$notify.error({
											title: '删除字典-标准字典',
											message: '删除失败原因'+data.errMsg,
											duration: 0
										});
									}else{
										this.$notify.error({
											title: '删除字典-标准字典',
											message: '删除失败!',
											duration: 0
										});
									}
								}
	                        })
	                    }
	                }).catch((e) => {
	                    // 取消
	                })
	            } else {
					this.$message({
						showClose: true,
						message: '请选择要删除的字典组或字典',
						type: 'warning'
					});
	            }
	        },
	
	        /**
	         *
	         */
	        // 加载字典项
	        loadItems() {
	            if (!this.selectedDic) {
	                this.$message({
						showClose: true,
						message: '请选择字典',
						type: 'warning'
					});
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
	                    this.dicItemsData.items.push(item)
	                });
	                this.selectedItem = null;
	            })
	        },
	        // 添加项
	        addItem(command) {
	            if (!this.selectedDic) {
					this.$message({
						showClose: true,
						message: '请选择字典',
						type: 'warning'
					});
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
							this.$message({
								showClose: true,
								message: '请选择字典项',
								type: 'warning'
							});
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
	            this.itemDialog.title='编辑字典项';
	            this.itemDialog.action='edit';
	            this.itemDialog.show = true;
	        },
	        // 选中项
	        selectItem(data) {
	            this.selectedItem = data;
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
							let data = res.data;
							if(data.success){
								this.$notify({
									title: '编辑字典项-标准字典',
									message: '字典编辑成功！',
									type: 'success'
								});
							}else{
								if(!!data.errMsg){
									this.$notify.error({
										title: '编辑字典项-标准字典',
										message: '编辑失败原因'+data.errMsg,
										duration: 0
									});
								}else{
									this.$notify.error({
										title: '编辑字典项-标准字典',
										message: '编辑失败!',
										duration: 0
									});
								}
							}
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
	                                url:this.baseUrl+'dicItem',
	                                method:'post',
	                                data: this.newItem
	                            }).then(res => {
									this.loadItems();
									this.$notify({
										title: '字典项保存',
										message: '字典项保存成功！',
										type: 'success'
									});
									let data = res.data;
									if(data.success){
										this.$notify({
											title: '新增字典项-标准字典',
											message: '字典项新增成功！',
											type: 'success'
										});
									}else{
										if(!!data.errMsg){
											this.$notify.error({
												title: '新增字典项-标准字典',
												message: '新增失败原因'+data.errMsg,
												duration: 0
											});
										}else{
											this.$notify.error({
												title: '新增字典项-标准字典',
												message: '新增失败!',
												duration: 0
											});
										}
									}
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
	        closeItemDialog(){
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
							let data = res.data;
							if(data.success){
								this.$notify({
									title: '删除字典项-标准字典',
									message: '字典项删除成功！',
									type: 'success'
								});
							}else{
								if(!!data.errMsg){
									this.$notify.error({
										title: '删除字典项-标准字典',
										message: '删除失败原因'+data.errMsg,
										duration: 0
									});
								}else{
									this.$notify.error({
										title: '删除字典项-标准字典',
										message: '删除失败!',
										duration: 0
									});
								}
							}
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
	            } else {
	                this.dicItemsData.items.splice(0, this.dicItemsData.items.length);
	                this.dicItemsData.totalItems = 0;
	            }
	        },
	
	    }
	}
</script>
<style scoped>
	.dicPage{
		padding:10px;
		margin-top: 10px;
		height: 100%;
		overflow: auto;
	}
    .dialogLabel label {
        line-height: 35px
    }

	.rightCard{
		min-height: calc(100vh - 156px);
		max-height:calc(100vh - 156px);
		overflow: auto;
	}
	.leftCard{
		min-height: calc(100vh - 180px);
		max-height:calc(100vh - 156px);
	}
	  .el-tree {
        max-height:calc(100vh - 260px);
        min-height:calc(100vh - 260px);
		overflow: auto;
    }
	
</style>