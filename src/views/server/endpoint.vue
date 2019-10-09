<template>
		<div>
		<el-row :gutter="12">
			<el-col :span="5">
				 <el-card class="box-card">
	                <el-row>
						<el-button type="primary" @click="addGroupOrDic" icon="el-icon-document-add"></el-button>
						<el-button type="primary" @click="editGroupOrDic" icon="el-icon-edit"></el-button>
	                    <el-button @click="deleteGroupOrDic" type="danger" icon="el-icon-delete" style="margin-left:0px"></el-button>
	                </el-row>
	                <el-row style="margin-top:10px">
	                    <el-col :span="24">
	                        <el-input v-model="filterGroupName" placeholder="输入名称" style="width: 100%"></el-input>
	                    </el-col>
	                </el-row>
	                <el-row style="margin-top:10px">
	                    <el-tree class="filter-tree" ref="dicGroupTree" highlight-current default-expand-all
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
				 <el-card class="box-card">
	                <el-row>
	                    <el-col :span="24">
	                        <el-input placeholder="输入名称" v-model="dicItemsData.searchName"
	                                  style="width: 300px"></el-input>
	                        <el-button icon="el-icon-search" type="primary" @click="loadItems">搜索</el-button>
							<el-button type="primary" @click="addItem">服务注册</el-button>
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
	                            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
	                        <el-table-column
	                                prop="key"
	                                label="编码"
	                                sortable
	                                width="80">
	                        </el-table-column>
	                        <el-table-column
	                                prop="text"
	                                label="服务名称"
	                                sortable
	                                width="120">
	                        </el-table-column>
	                        <el-table-column
	                                prop="publishUrl"
	                                label="发布地址"
								    width="120">
	                        </el-table-column>
							<el-table-column
									prop="serviceType"
									label="服务类型"
									width="60">
							</el-table-column>
							<el-table-column
									prop="url"
									label="目标地址"
									width="200">
							</el-table-column>
							<el-table-column width="80" prop="runStatus" label="运行状态" show-overflow-tooltip>
								<template scope="scope">
									<span v-if="scope.row.runStatus==0" style="color:green;">正常</span>
									<span v-if="scope.row.runStatus==1" style="color:red;">异常</span>
								</template>
							</el-table-column>
							<el-table-column width="80" prop="status" label="发布状态" show-overflow-tooltip>
								<template scope="scope">
									<span v-if="scope.row.status==0" style="color:red;">未发布</span>
									<span v-if="scope.row.status==1" style="color:green;">已发布</span>
								</template>
							</el-table-column>
	                        <el-table-column label="操作">
	                            <template slot-scope="scope">
									<el-button  v-if="scope.row.status==0" size="mini" type="success" @click="publish(scope.$index, scope.row)">发布</el-button>
									<el-button  v-if="scope.row.status==1" size="mini" type="success" @click="stop(scope.$index, scope.row)">停用</el-button>
									<el-button v-if="scope.row.status==0" size="mini" type="primary" @click="editItem(scope.$index, scope.row)" >编辑</el-button>
									<el-button v-if="scope.row.status==1" size="mini" type="primary" disabled >编辑</el-button>
									<el-button  v-if="scope.row.status==0" slot="reference" size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
									<el-button  v-if="scope.row.status==1" slot="reference" size="mini" type="danger" disabled >删除</el-button>
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
	      	<!-- 新建/编辑分组 -->
		<el-dialog :title="groupDialog.title" :visible.sync="groupDialog.show" width="65%" @close="closeGroupDialog">
			<el-form :rules="groupDialog.addGroupRules" ref="addGroupForm" :model="newGroup" label-width="100px">
				<el-form-item label="所属类别" prop="parentCode">
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
					<el-button type="primary" @click="saveGroup(groupDialog.action)">保存</el-button>
					<el-button @click="closeGroupDialog">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 新建/编辑项 -->
		<el-dialog :title="itemDialog.title" :visible.sync="itemDialog.show" width="65%" @close="closeItemDialog">
			<el-form :rules="itemDialog.itemRules" ref="addItemForm" :model="newItem" label-width="100px">
				<el-form-item label="所属类别" prop="dicCode">
					<el-input v-model="newItem.dic.name" disabled></el-input>
				</el-form-item>
				<el-form-item label="父项" prop="dicCode" v-if="newItem.parent">
					<el-input v-model="newItem.parent.text" disabled></el-input>
				</el-form-item>
				<el-form-item label="代码" prop="key">
					<el-input v-model="newItem.key" :disabled="'edit'==itemDialog.action"></el-input>
				</el-form-item>
				<el-form-item label="服务名称" prop="text">
					<el-input v-model="newItem.text" :disabled="'edit'==itemDialog.action"></el-input>
				</el-form-item>
				<el-form-item label="发布url" prop="publishUrl">
					<el-input v-model="newItem.publishUrl">
						<template slot="prepend">http://127.0.0.1:8282/services/</template>
					</el-input>
				</el-form-item>
				<el-form-item label="服务类型" prop="serviceType">
					<el-select v-model="newItem.serviceType" placeholder="请选择" style="width:100%">
						<el-option
								v-for="item in tagOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="目标url" prop="url">
					<el-input v-model="newItem.url"></el-input>
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
</template>
<script>
	import axios from 'axios'
	export default {
	    data() {
	        // 验证字典代码唯一
	        var validDicCodeUnique = (rule, value, callback) => {
	            var cts = contails(this.dicGroups, 'code', 'children', value);
	            if (cts) {
	                callback(new Error("该代码已存在"));
	            } else {
	                callback();
	            }
	        };
	        // 验证服务代码唯一
	        var validItemKeyUnique = (rule, value, callback) => {
	            axios({
	                url: this.baseUrl+'endpoint/key',
	                method: 'get',
	                params: {
	                    dicCode: this.selectedGroup.code,
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
           // 验证服务名称唯一
            var validItemTextUnique = (rule, value, callback) => {
                axios({
                    url: this.baseUrl+'endpoint/text',
                    method: 'get',
                    params: {
                        text: value
                    }
                }).then(res => {
                    if (res.data.content) {
                        callback(new Error("该名称已存在"));
                    } else {
                        callback();
                    }
                })
            };
          // 验证服务发布地址唯一
            var validItemPublishUrlUnique = (rule, value, callback) => {
                axios({
                    url: this.baseUrl+'endpoint/publishUrl',
                    method: 'get',
                    params: {
                        publishUrl: value
                    }
                }).then(res => {
                    if (res.data.content) {
                        callback(new Error("该地址已存在"));
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
	
	        return {
	            /**
	             *  头部数据
	             * */
	            // 根分组代码
	            parentGroup: "root",

	            /**
	             * 左侧栏数据
	             * */
	            // 显示新增/编辑分组编辑框
	            showGroupDialog: false,
	            // 选中分组
	            selectedGroup: null,
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
	                sortNo: null
	            },

	            // 服务项dialog
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
                            {validator: validItemTextUnique, trigger: 'blur'}
	                    ],
                        publishUrl: [
                            {required: true, message: '发布地址不能为空', trigger: 'blur'},
                            {validator: validItemPublishUrlUnique, trigger: 'blur'}
                        ]
	                }
	            },
	            selectedItem: null,
	            //
	            newItem: {
	                dic: this.selectedGroup | {},
	                key: null,
	                text: null,
	                unit: null,
	                description: null,
	                parent: null,
	                hasChildren: false
	            },
	            //服务部分数据
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
	            },
                tagOptions:[{
                    value: 'soap',
                    label: 'soap'
                },{
                    value: 'rest',
                    label: 'rest'
                },
				]
	
	        }
	    },
	    methods: {
	        /**
	         * 左侧方法
	         */
	        // 加载服务组树
	        loadDicGroups() {
	            axios({
	                url: this.baseUrl+'GroupCtg/tree',
	                method: 'get',
	                headers: {},
	                params: {
	                    parentCode: this.parentGroup,

	                }
	            }).then(res => {
	                let data = res.data;
	                if (data.success) {
	                    this.dicGroups.splice(0, this.dicGroups.length);
	                    data.content.forEach(g => this.dicGroups.push(g));
	                    this.selectedItem = null;
	                    this.selectedGroup = null;
	                }
	            })
	        },
	        // 过滤组
	        filterDics(value, data) {
	            if (!value) return true;
	            return data.name.indexOf(value) !== -1;
	        },
	        // 选中组
	        groupSelected(data, node, self) {
	            if ("group" == data.type) {
	                this.selectedGroup = data;
	            }
	        },
	        // 添加组
	        addGroupOrDic(command) {
	            if (!this.selectedGroup) {
	                this.$message.error('请选择所属类别');
	                return;
	            }

				this.groupDialog.title = '新增类别';
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
					sortNo: null
				};
				// this.$refs['addGroupForm'].clearValidate();
				this.groupDialog.show = true;

	        },
	        // 保存组
	        saveGroup(action) {
	            switch (action) {
	                case 'edit':
	                    axios({
	                        url: this.baseUrl+'GroupCtg',
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
	                                url: this.baseUrl+'GroupCtg',
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
	        // 取消保存组
	        closeGroupDialog() {
	            this.groupDialog.show = false;
	            this.$refs['addGroupForm'].clearValidate();
	        },
	        // 编辑组
	        editGroupOrDic() {
	            if (this.selectedGroup) {
	                this.groupDialog.title = '编辑类别';
	                this.groupDialog.action = 'edit';
	                axios({
	                    url: this.baseUrl+'GroupCtg/' + this.selectedGroup.id,
	                    method: 'get'
	                }).then(res => {
	                    this.newGroup = res.data.content;
	                    this.groupDialog.show = true;
	                });
	            }  else {
	                this.$message.error("请先选择类别");
	            }
	        },
	        deleteGroupOrDic() {
	            if (this.selectedGroup) {
	                this.$confirm('将删除当前类别及包含内容，是否继续？', '确认', {
	                    confirmButtonText: '确定',
	                    cancelButtonText: '取消',
	                    type: 'warning'
	                }).then((command) => {
	                    if ('confirm' == command) {
	                        axios({
	                            url: this.baseUrl+'GroupCtg/' + this.selectedGroup.id,
	                            method: 'delete'
	                        }).then(res => {
	                            if(res.data.content == "0"){
                                    this.$message.error("无法删除该类别，请先删除此类别下内容");
								}
	                            this.loadDicGroups();
	                        })
	                    }
	                }).catch((e) => {
	                    // 取消
	                })
	            }  else {
	                this.$message.error("请选择要删除的类别");
	            }
	        },
	
	        /**
	         *
	         */
	        // 加载服务
	        loadItems() {
	            if (!this.selectedGroup) {
	                this.$message.error('请选择类别');
	                return;
	            }
	            axios({
	                url: this.baseUrl+'endpoint',
	                method: 'get',
	                headers: {},
	                params: {
	                    dicCode: this.selectedGroup.code,
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
	        // 添加服务
	        addItem(command) {
	            if (!this.selectedGroup) {
	                this.$message.error('请选择类别');
	                return;
	            }

	                    this.itemDialog.title = '服务注册';
	                    this.itemDialog.action = 'create';
	                    this.newItem = {
	                        dic: this.selectedGroup,
	                        key: null,
	                        text: null,
	                        unit: null,
	                        description: null,
	                        parent: null,
	                        hasChildren: false
	                    };
	                    this.itemDialog.show = true;

	        },
	        // 编辑服务
	        editItem(index, data) {
	            this.newItem = data;
	            this.newItem.dic = this.selectedGroup;
	            this.itemDialog.title='编辑服务注册项';
	            this.itemDialog.action='edit';
	            this.itemDialog.show = true;
	        },
	        // 选中服务
	        selectItem(data) {
	            this.selectedItem = data;
	        },
	        // 保存服务
	        saveItem(action) {
	            switch (action) {
	                case 'edit':
	                    axios({
	                        url: this.baseUrl+'endpoint',
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
	                                url:this.baseUrl+'endpoint',
	                                method:'post',
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
            // 发布服务
            publish(index, data) {
                        axios({
                            url: this.baseUrl+'endpoint/publish',
                            method: 'post',
                            data: data
                        }).then(res => {
                            this.loadItems();
                        })
            },
            // 停止服务
            stop(index, data) {
                axios({
                    url: this.baseUrl+'endpoint/stop',
                    method: 'post',
                    data: data
                }).then(res => {
                    this.loadItems();
                })
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
	                        url: this.baseUrl+'endpoint/' + data.id,
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
			this.loadDicGroups();
	    },
	    watch: {
	        /**
	         * 左侧
	         */

	        // 字典组名称
	        filterGroupName: function (val) {
	            this.$refs.dicGroupTree.filter(val);
	        },
	        // 被选组
            selectedGroup: function () {
	            if (this.selectedGroup) {
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

    .el-main {
        top: 15px;
        position: relative;
        padding: 16px;
        left: 6px;
    }

    .dialogLabel label {
        line-height: 35px
    }
	.box-card{
		min-height: calc(100vh - 110px);
	}

</style>