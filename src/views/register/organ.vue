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
                                 :data="regions" :props="{label:'label'}" :filter-node-method="filterDics"  :expand-on-click-node="false" :auto-expand-parent="true" node-key="id" :default-expanded-keys="defaultExpand"
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
                            <el-button icon="el-icon-search" type="primary" class="searchbox_button" @click="loadOrgs">搜索</el-button>
                            <el-button icon="el-icon-plus" type="primary" class="searchbox_button" @click="addList">
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
                                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                            <el-table-column
                                    prop="code"
                                    label="机构代码"
                                    sortable
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="机构名称"
                                    sortable
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="registerNumber"
                                    label="登记号">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="handleEdit(scope.$index, scope.row)">编辑
                                    </el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDelete(scope.$index, scope.row)">作废
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
                                :page-size="10"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="total">
                        </el-pagination>
                    </el-row>

                </el-card>
			</el-col>
		</el-row>
          <!-- 新建项 -->
        <el-dialog title="新建注册" :visible.sync="dialogForm2Visible" :model="newOrg" width="65%">
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">组织机构代码</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.code"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">机构名称</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.name"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">医院照片</label>
                    </el-col>
                    <el-col :span="15">
                        <img style="width: 160px;height:180px;position: absolute;"/>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">登记号</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.registerNumber"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">机构分类</label>
                    </el-col>
                    <el-col :span="15">
                        <el-select v-model="newOrg.classifyCode" placeholder="请选择机构分类" style="width:150px">
                            <el-option v-for="code in classifyCodes" :label="code.text" :value="code.key"
                                       :key="code.key"></el-option>
                        </el-select>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">机构类型</label>
                    </el-col>
                    <el-col :span="15">
                        <el-select v-model="newOrg.organType" placeholder="请选择机构类型" style="width:150px">
                            <el-option v-for="code in organTypes" :label="code.text" :value="code.key"
                                       :key="code.key"></el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="16">
                    <el-col :span="4" style="margin-right:8px">
                        <label class="">地址</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:250px" v-model="newOrg.address"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">行政区划</label>
                    </el-col>
                    <el-col :span="15">
                        <treeselect
                        :clearable="true"
                        :searchable="true"
                        :disabled="false"
                        :options="regions"
                        :limit="3"
                        :max-height="200"
                        :placeholder="'请选择'"
                        v-model="newOrg.regionCode"
                        style="width:150px"
                        :noChildrenText="' '"
                        />
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">联系电话</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.telphone"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">拼音助记</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.pycode"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">乡镇街道代码</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.streetCode"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">乡镇街道名称</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.streetName"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">主办单位</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.hostCode"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">上级机构</label>
                    </el-col>
                    <el-col :span="15">
                        <treeselect v-model="newOrg.parentCode"
                                    :clearable="true"
                                    :searchable="true"
                                    :disabled="false"
                                    :options="parentOrgs"
                                    :limit="3"
                                    :max-height="200"
                                    :placeholder="'请选择上级机构'"
                                    style="width:150px"
                                    :noChildrenText="' '"
                        />
                    </el-col>
                </el-col>
                <el-col :span="8">
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">隶属关系</label>
                    </el-col>
                    <el-col :span="15">
                        <el-select v-model="newOrg.subCode" placeholder="请选择隶属关系" style="width:150px">
                            <el-option v-for="code in subCodes" :label="code.text" :value="code.key"
                                       :key="code.key"></el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">机构第二名称</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.otherName"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">邮政编码</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.postCode"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">单位成立时间</label>
                    </el-col>
                    <el-col :span="15">
                        <el-date-picker style="width:150px" v-model="newOrg.foundDate" type="date"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期">
                        </el-date-picker>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">医院介绍</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.description"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">电子邮箱</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.email"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">单位网站</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.website"></el-input>
                    </el-col>
                </el-col>
<!--                <el-col :span="8">-->
<!--                    <el-col :span="9">-->
<!--                        <label class="">版本</label>-->
<!--                    </el-col>-->
<!--                    <el-col :span="15">-->
<!--                        <el-select v-model="newOrg.version" placeholder="请选择版本" style="width:150px">-->
<!--                            <el-option v-for="code in versions" :label="code.description" :value="code.version"-->
<!--                                       :key="code.version"></el-option>-->
<!--                        </el-select>-->
<!--                    </el-col>-->
<!--                </el-col>-->
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">排序</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="newOrg.orderNum"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog_button">
                <el-button @click="cancelNewOrg()">取 消</el-button>
                <el-button type="primary" @click="saveOrg()">提 交</el-button>
            </div>
        </el-dialog>
        <!-- 修改项 -->
        <el-dialog title="编辑注册" :visible.sync="dialogFormVisible" :model="editOrg" width="65%">
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">组织机构代码</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" :disabled="true"
                                  v-model="editOrg.code"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">机构名称</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.name"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">医院照片</label>
                    </el-col>
                    <el-col :span="15">
                        <img style="width: 160px;height:180px;position: absolute;"/>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">登记号</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.registerNumber"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">机构分类</label>
                    </el-col>
                    <el-col :span="15">
                        <el-select v-model="editOrg.classifyCode" placeholder="请选择机构分类" style="width:150px">
                            <el-option v-for="code in classifyCodes"
                                       :label="code.text"
                                       :value="code.key"
                                       :key="code.key"></el-option>
                        </el-select>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">机构类型</label>
                    </el-col>
                    <el-col :span="15">
                        <el-select v-model="editOrg.organType" placeholder="请选择机构类型" style="width:150px">
                            <el-option v-for="code in organTypes" :label="code.text" :value="code.key"
                                       :key="code.key"></el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="16">
                    <el-col :span="4" style="margin-right:8px">
                        <label class="">地址</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:250px" v-model="editOrg.address"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">行政区划</label>
                    </el-col>
                    <el-col :span="15">
                        <treeselect v-model="editOrg.regionCode"
                                :clearable="true"
                                :searchable="true"
                                :disabled="false"
                                :options="regions"
                                :limit="3"
                                :max-height="200"
                                :placeholder="'请选择'"
                                style="width:150px"
                                :noChildrenText="' '"
                        />
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">联系电话</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.telphone"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">拼音助记</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" :disabled="true"
                                  v-model="editOrg.pycode"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">乡镇街道代码</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.streetCode"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">乡镇街道名称</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.streetName"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">主办单位</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.hostCode"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">上级机构</label>
                    </el-col>
                    <el-col :span="15">
                        <treeselect v-model="editOrg.parentCode"
                                    :clearable="true"
                                    :searchable="true"
                                    :disabled="false"
                                    :options="parentOrgs"
                                    :limit="3"
                                    :max-height="200"
                                    :placeholder="'请选择上级机构'"
                                    style="width:150px"
                                    :noChildrenText="' '"
                        />
                    </el-col>
                </el-col>
                <el-col :span="8">
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">隶属关系</label>
                    </el-col>
                    <el-col :span="15">
                        <el-select v-model="editOrg.subCode" placeholder="请选择隶属关系" style="width:150px">
                            <el-option v-for="code in subCodes" :label="code.text" :value="code.key"
                                       :key="code.key"></el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">机构第二名称</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.otherName"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">邮政编码</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.postCode"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">单位成立时间</label>
                    </el-col>
                    <el-col :span="15">
                        <el-date-picker style="width:150px" v-model="editOrg.foundDate" type="date"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期">
                        </el-date-picker>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">医院介绍</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.description"></el-input>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">电子邮箱</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.email"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="dialogLabel">
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">单位网站</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.website"></el-input>
                    </el-col>
                </el-col>
<!--                <el-col :span="8">-->
<!--                    <el-col :span="9">-->
<!--                        <label class="">版本</label>-->
<!--                    </el-col>-->
<!--                    <el-col :span="15">-->
<!--                        <el-select disabled v-model="editOrg.version" placeholder="请选择版本" style="width:150px">-->
<!--                            <el-option v-for="code in versions" :label="code.description" :value="code.version"-->
<!--                                       :key="code.version"></el-option>-->
<!--                        </el-select>-->
<!--                    </el-col>-->
<!--                </el-col>-->
                <el-col :span="8">
                    <el-col :span="9">
                        <label class="">排序</label>
                    </el-col>
                    <el-col :span="15">
                        <el-input auto-complete="off" style="width:150px" v-model="editOrg.orderNum"></el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row class="dialogLabel">
                <el-tabs class="modal_tab" v-model="activeName" type="border-card" @tab-click="handleTabClick">
                    <el-tab-pane label="上级部门" name="first">
                        <el-table ref="singleTable" :data="parentOrgsTable"
                                  highlight-current-row @current-change="handleCurrentChange"
                                  style="width: 100%">
                            <el-table-column type="index" width="50"></el-table-column>
                            <el-table-column property="code" label="机构代码" width="120"></el-table-column>
                            <el-table-column property="name" label="机构名称" width="120"></el-table-column>
                            <el-table-column property="registerNumber" label="登记号"></el-table-column>
                            <el-table-column property="classifyCode" label="机构分类"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="下级部门" name="second">
                        <el-table ref="singleTable" :data="subOrgsTable"
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
                    <el-tab-pane label="包含科室" name="third">
                        <el-table ref="singleTable" :data="officesTable"
                                  highlight-current-row @current-change="handleCurrentChange"
                                  style="width: 100%">
                            <el-table-column type="index" width="50"></el-table-column>
                            <el-table-column property="code" label="机构代码" width="120"></el-table-column>
                            <el-table-column property="name" label="机构名称" width="120"></el-table-column>
                            <el-table-column property="registerNumber" label="登记号"></el-table-column>
                            <el-table-column property="classifyCode" label="机构分类"></el-table-column>
                        </el-table>
                        <el-pagination @current-change="officeCurrentChange"
                                       :current-page="officeCurrentPage"
                                       :page-size="10"
                                       layout="total, sizes, prev, pager, next, jumper"
                                       :total="officeTotal">
                        </el-pagination>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
            <div slot="footer"  class="dialog_button">
                <el-button @click="cancelEditOrg()">取 消</el-button>
                <el-button type="primary" @click="saveEdit()">提 交</el-button>
            </div>
        </el-dialog>
	</div>

</template>

<script>
// import TreeSelect from './components/treeSelect'
    import axios from 'axios'
	export default {
        // components: { 'tree-select':httpVueLoader('./components/treeSelect.vue') },
        data: function () {
            return {
               // 父分组ID
                parentId: null,
                // 显示已作废字典
                showVoidedDic: false,
                // 显示已作废字典项
                showVoidedItem: false,
                // 字典组或字典名称
                groupOrDicName: null,
                //行政区划
                regions: [],

                visible: false,
                // 当前版本
                version: 'system',
                versions: [],
                regionCode: '',//当前行政区划
                checked: true,
                tableData: [],
                parentOrgsTable: [],//包含上级机构
                subOrgsTable: [],//包含下级机构
                officesTable: [],//包含科室
                // 显示新建项窗体
                dialogFormVisible: false,
                // 显示编辑项窗体
                dialogForm2Visible: false,
                activeName: 'first',
                // 分页器当前显示页
                currentPage: 1,
                subCurrentPage: 1,
                officeCurrentPage: 1,
                total: 0,
                subTotal: 0,
                officeTotal: 0,
                newOrg: {},
                editOrg: {},
                classifyCodes: [], //机构分类
                subCodes: [], //隶属关系
                parentOrgs: [], //上级部门
                organTypes: [], //机构类型
                queryName: null,
                value: null,
                defaultExpand:[]
            }
        },
        methods: {
            handleNodeClick(data) {
                this.regionCode = data.id;
                this.loadOrgs();
            },
            // 显示新增项弹出框
            addList() {
                this.newOrg = {
                    version:this.version
                };
                if(!!this.regionCode){
                    this.newOrg.regionCode = this.regionCode;
                }

                this.loadOrgTree();
                this.dialogForm2Visible = true;
            },
            cancelNewOrg() {
                this.dialogForm2Visible = false;
                this.newOrg = {
                    version:this.version
                };
            },
            // 编辑项
            handleEdit(index, row) {
                this.editOrg = row;
                this.loadOrgTree();
                this.parentOrgsTable= [];
                this.subOrgsTable= [];
                this.officesTable=[];
                this.activeName = 'first';
                this.loadParentOrgsTable();
                this.dialogFormVisible = true
            },
            cancelEditOrg() {
                this.dialogFormVisible = false;
                this.editOrg = {};
            },
            // 分页器修改一页显示条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.loadOrgs();
            },
            // 分页器修改当前页显示
            handleCurrentChange(val) {
                this.currentPage = val;
                this.loadOrgs();
            },
            // 分页器修改当前页显示
            subCurrentChange(val) {
                this.subCurrentPage = val;
                this.loadSubOrgsTable();
            },
            // 分页器修改当前页显示
            officeCurrentChange(val) {
                this.officeCurrentPage = val;
                this.loadOfficesTable();
            },
            handleTabClick(tab) {
                let name = tab.name;
                if (name == 'first') {
                    this.loadParentOrgsTable();
                } else if (name == 'second') {
                    this.loadSubOrgsTable();
                } else if (name == 'third') {
                    this.loadOfficesTable();
                }
            },
            // 提交新增版本
            onSubmit() {

            },
            loadRegions() {
                axios({
                    url: this.baseUrl+'region/tree',
                    method: 'get',
                    headers: {},
                    params: {
                        version: this.version
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.regions.splice(0, this.regions.length);
                        this.regions=this.convertData(data.content,'code','name')
                        this.defaultExpand.push(this.regions[0].children[0].id)
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
            loadOrgs() {
                axios({
                    url: this.baseUrl+'organization',
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
                        regionCode: this.regionCode
                        // active: this.showVoidedDic ? null : true
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
            saveOrg() {
                axios({
                    url: this.baseUrl+'organization',
                    method: 'post',
                    headers: {},
                    data: this.newOrg
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.loadOrgs();
                        this.cancelNewOrg();
                        this.$notify({
                            title: '机构注册-创建',
                            message: '创建成功',
                            type: 'success'
                        });
                    } else {
                        if(!!data.errMsg){
                            this.$notify.error({
                                title: '机构注册-创建',
                                message: '机构注册失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '机构注册-创建',
                                message: '机构注册失败!',
                                duration: 0
                            });
                        }
                    }
                })
            }, saveEdit() {
                axios({
                    url: this.baseUrl+'organization',
                    method: 'put',
                    headers: {},
                    data: this.editOrg
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.loadOrgs();
                        this.cancelEditOrg();
                        this.$notify({
                            title: '机构注册-编辑',
                            message: '编辑成功',
                            type: 'success'
                        });
                    } else {
                         if(!!data.errMsg){
                            this.$notify.error({
                                title: '机构注册-编辑',
                                message: '编辑失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '机构注册-编辑',
                                message: '编辑失败!',
                                duration: 0
                            });
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
                        this.parentOrgs.splice(0, this.parentOrgs.length);
                        this.parentOrgs=this.convertData(data.content,'code','name')
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
            }, loadParentOrgsTable() {//加载上级机构
                axios({
                    url: this.baseUrl+'organization/' + this.editOrg.id + '/parent',
                    method: 'get',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.parentOrgsTable.splice(0, this.parentOrgsTable.length);
                        data.content.forEach(g => this.parentOrgsTable.push(g));
                    }
                })
            }, loadSubOrgsTable() {//加载下级机构
                axios({
                    url: this.baseUrl+'organization',
                    method: 'get',
                    headers: {},
                    params: {
                        page: this.currentPage,
                        limit: "",
                        version: this.version,
                        parentCode: this.editOrg.code
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        let content = data.content;
                        this.subOrgsTable.splice(0, this.subOrgsTable.length);
                        content.content.forEach(g => this.subOrgsTable.push(g));
                        this.subTotal = content.totalElements;
                    }
                })
            }, loadOfficesTable() {//加载科室
                axios({
                    url: this.baseUrl+'office',
                    method: 'get',
                    headers: {},
                    params: {
                        page: this.currentPage,
                        limit: "",
                        version: this.version,
                        organCode: this.editOrg.code
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        let content = data.content;
                        this.officesTable.splice(0, this.officesTable.length);
                        content.content.forEach(g => this.officesTable.push(g));
                        this.officeTotal = content.totalElements;
                    }
                })
            },
             initChecked () {
                this.defaultCheckedKeys = [1006, 1007];
            },
            popoverHide (checkedIds, checkedData) {
                console.log(checkedIds);
                console.log(checkedData);
            },
            convertData(listData,id,label){
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
         mounted () {
            // 组建中增加了监听数据变化的，
            // 此处初始化defaultCheckedKeys的值，有效果


            this.defaultCheckedKeys = [1001];
        },
        created: function () {
            // 初始化参数
            // this.loadVersions();
            // if (this.version) {
                this.loadRegions();
                this.loadDics('classifyCode', this.classifyCodes);//机构分类
                this.loadDics('subCode', this.subCodes);//隶属关系
                this.loadDics('organizType', this.organTypes);//机构类型
            // }

        },
        watch: {
            // 当前版本变动时，字典组列表重新加载
            version: function () {
                this.loadRegions();
                // this.loadOrgs();
                this.loadDics('classifyCode', this.classifyCodes);//机构分类
                this.loadDics('subCode', this.subCodes);//隶属关系
                this.loadDics('organizType', this.organTypes);//机构类型
            },
            // 字典（组）名称
            groupOrDicName: function (val) {
                this.$refs.dicGroupTree.filter(val);
            }
        }
    }
</script>
<style scoped>
    .el-header {
        padding: 0 10px;
    }

    .dialogLabel label {
        line-height: 35px
    }

    .organPage{
        padding:10px;
		margin-top:10px;
    }
    .card_height{
        min-height: calc(100vh - 110px);
    }
    .modal_tab .el-tabs__content{
        top: 0px;
    }
    .modal_tab  .el-tabs__nav-wrap {
        margin-top: 0px;
    }
     .modal_tab  .el-tabs__content {
        height: 100%;
    }
    .modal_tab .el-tabs__item.is-active{
        color: #409EFF !important;
    }
</style>


