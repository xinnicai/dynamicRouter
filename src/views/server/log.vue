<template>
    <div>
		<el-row :gutter="12">
			<el-col :span="5">
				 <el-card class="box-card">
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
                            <el-input placeholder="输入搜索信息" v-model="logItemsData.searchName"
                                      style="width: 300px"></el-input>
                            <el-button icon="el-icon-search" type="primary" @click="loadLog">搜索</el-button>
                            <el-dropdown trigger="click">
                                <el-button type="primary" @click="selectedDic2">
                                    选择服务<i class="el-icon-arrow-down"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown" v-if="!!dicItemsData.items && dicItemsData.items.length > 0">
                                    <template v-for="item in dicItemsData.items">
                                        <el-dropdown-item  @click.native="loadLogPara(item.publishUrl)">{{ item.text }}</el-dropdown-item>
                                    </template>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                    </el-row>

                    <el-row style="margin-top:10px">
                        <el-table
                                :data="logItemsData.items"
                                style="width: 100%;margin-bottom: 20px;"
                                row-key="key"
                                highlight-current-row
                                @current-change="selectItem"
                                border
                                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                            <el-table-column
                                    prop="serverName"
                                    label="服务名称"
                                    sortable
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="timestamp"
                                    label="记录时间"
                                    sortable
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    prop="client"
                                    label="客户端IP"
                                    >
                            </el-table-column>
                            <el-table-column
                                    prop="status"
                                    label="服务状态"
                                    width="120">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="showForm(scope.row)">查看日志
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-row style="margin-top: 10px;margin-bottom:20px;float: right;">
                        <el-pagination
                                @size-change="loadLog"
                                @current-change="loadLog"
                                :current-page.sync="logItemsData.currentPage"
                                :page-sizes="[10, 25, 50, 100]"
                                :page-size.sync="logItemsData.limit"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="logItemsData.totalItems">
                        </el-pagination>
                    </el-row>
    
                </el-card>
			</el-col>
		</el-row>
         <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="60%"
            >
            <el-form ref="form" :model="logData" label-width="80px">
                <el-form-item label="服务名称">
                    <el-input v-model="logData.serverName" readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="记录时间">
                    <el-input v-model="logData.timestamp" readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="信息">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="logData.message" readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="响应信息">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="logData.response" readonly="true"></el-input>
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
        data() {

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
                // 显示已作废字典分组
                showVoidedGroup: false,
                // 选中分组
                selectedGroup: null,
                // 过滤用分组名
                filterGroupName: '',
                // 字典组
                dicGroups: [],


                selectedItem: null,

                //字典项部分数据
                dicItemsData: {
                    // 搜索条件
                    searchName: '',
                    // 显示已作废
                    showVoidedItems: false,
                    //当前页
                    currentPage: 1,
                    // 分页数量
                    limit: 100,
                    // 字典项
                    items: [],
                    // 总项数
                    totalItems: 0,
                },
                //日志项名称
                logItemName: null,
                //字典项部分数据
                logItemsData: {
                    // 搜索条件
                    searchName: '',
                    //当前页
                    currentPage: 1,
                    // 分页数量
                    limit: 25,
                    // 字典项
                    items: [],
                    // 总项数
                    totalItems: 0,
                },
                // 查看日志弹出框
                dialogVisible:false,
                logData:{

                },
                showModalTimes:0
    
            }
        },
        // computed :{
        //  rowclass(row,index){
        //      return {"height":"7.1vh"}
        //  }
        // },
        methods: {

            /**
             * 左侧方法
             */
            // 加载字典分组树
            loadDicGroups() {
                axios({
                    url: this.baseUrl+'GroupCtg/tree',
                    method: 'get',
                    headers: {},
                    params: {
                        parentCode: this.parentGroup,
                        active: this.showVoidedGroup ? null : true,

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
            // 过滤字典（字典组）
            filterDics(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            // 选中分组
            groupSelected(data, node, self) {
                if ("group" == data.type) {
                    this.selectedGroup = data;
                }
            },
            selectedDic2() {
                if (!this.selectedGroup) {
                    this.$message.error('请选择服务组');
                    return;
                }
            },

                      /**
             *
             */
            // 加载字典项
            loadItems() {
                if (!this.selectedGroup) {
                    this.$message.error('请选择服务组');
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

            loadLogPara(publishUrl) {
                this.logItemName = publishUrl;
                this.loadLog();
            },
            /**
             *
             */
            // 加载字典项
            loadLog() {
                axios({
                    url: this.baseUrl+'serverlog',
                    method: 'get',
                    headers: {},
                    params: {
                        serverName: this.logItemName,
                        message: this.logItemsData.searchName,
                        page: this.logItemsData.currentPage,
                        limit: this.logItemsData.limit
                    }
                }).then(res => {
                    res = res.data;
                    this.logItemsData.totalItems = res.content.totalElements;
                    this.logItemsData.items.splice(0, this.logItemsData.items.length);
                    res.content.content.forEach(item => {
                        this.logItemsData.items.push(item)
                    });
                    this.selectedItem = null;
                })
            },

            // 选中项
            selectItem(data) {
                this.selectedItem = data;
            },
            // 显示查看窗口
            showForm(data){
                this.showModalTimes++
                this.dialogVisible=true
                this.logData=data
                // editor插件只需创建一次
                if(this.showModalTimes===1){
                    //  this.createEditor();
                }
                
            },
            cancel(){
                this.dialogVisible=false
            }

        },
        created() {
            // 初始化参数
                this.loadDicGroups();
                
                
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


