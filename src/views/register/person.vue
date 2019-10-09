<template>
    <div>
		<el-row :gutter="16">
			<el-col :span="5">
				<el-card class="box-card card_height">
                    <el-row style="margin-top:10px">
                        <el-col :span="24">
                            <el-input v-model="groupOrDicName" placeholder="输入名称" style="width: 100%"></el-input>
                            <!--                            <el-button icon="el-icon-search" type="primary" circle @click="loadDics"></el-button>-->
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px">
                        <el-tree class="filter-tree" ref="dicGroupTree"
                                 :data="organs" :props="{label:'label'}" :filter-node-method="filterDics"
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
                            <el-button icon="el-icon-search" type="primary" @click="loadPersons">搜索</el-button>
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
                                    prop="id"
                                    label="人员编号"
                                    sortable
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="人员姓名"
                                    sortable
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="officeType"
                                    label="出生日期">
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
                                    <el-button
                                            size="mini"
                                            type="primary"
                                            @click="showUserForm(scope.row)">账户
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
		</el-row>
	     <el-dialog :title="formTitle" :visible.sync="userFormVisible" width="65%">
            <el-form :model="user"  :rules="rules" ref="userForm" label-width="100px" class="demo-ruleForm">
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-col :span="15">
                            <el-form-item label="登录账号" prop="userName">
                            <el-input auto-complete="off" style="width:150px" v-model="user.userName"
                                      :disabled="formDisabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="8">
                        <el-col :span="15">
                        <el-form-item label="门户身份" prop="userName">
                            <el-select v-model="user.roleId" placeholder="选择身份"
                                       style="width:150px">
                                <el-option v-for="code in roles" :label="code.roleName" :value="code.roleId"
                                           :key="code.roleId"></el-option>
                            </el-select>
                         </el-form-item>
                        </el-col>
                    </el-col>


                </el-row>
                <el-row :gutter="10" class="dialogLabel" style="margin-bottom:20px;">
                    <el-col :span="8">
                        <el-col :span="15">
                            <el-form-item label="登录密码" prop="password">
                            <el-input  auto-complete="off" style="width:150px" v-model="user.password" show-password></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="8">
                        <el-col :span="15">
                            <el-form-item label="确认密码" prop="repeat">
                            <el-input  auto-complete="off" style="width:150px" v-model="user.repeat" show-password></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>

                </el-row>
                <el-form-item class="dialog_button">
                    <el-button @click="cancelUserForm()">取 消</el-button>
                    <el-button type="primary" @click="bindUser()">提 交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="65%" @close="cancel">
            <el-form :model="person" :rules="formRules" ref="personForm" label-width="100px" class="demo-ruleForm">
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="人员姓名" prop="name">
                            <el-input auto-complete="off" style="width:150px" v-model="person.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="英文姓名" prop="enname">
                            <el-input auto-complete="off" style="width:150px" v-model="person.enname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="照片" prop="img">
                            <img style="width: 160px;height:180px;position: absolute;"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="证件类型" prop="cardType">
                            <el-select v-model="person.cardType" placeholder="请选择证件类型" style="width:150px">
                                <el-option v-for="code in cardTypes" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="证件号码" prop="cardNo">
                            <el-input auto-complete="off" style="width:150px" v-model="person.cardNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="出生日期" prop="birthday">
                            <el-date-picker style="width:150px" v-model="person.birthday" type="date"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="person.gender" placeholder="请选择性别"
                                       style="width:150px">
                                <el-option v-for="code in genders" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="民族" prop="nation">
                            <el-select v-model="person.nation" placeholder="请选择"
                                       style="width:150px">
                                <el-option v-for="code in nations" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="专业技术资格" prop="majorQualify">
                            <el-select v-model="person.majorQualify" placeholder="请选择"
                                       style="width:150px">
                                <el-option v-for="code in majorQualifys" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="国籍" prop="nationality">
                            <el-input auto-complete="off" style="width:150px" v-model="person.nationality"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="籍贯" prop="hometown">
                            <el-input auto-complete="off" style="width:150px" v-model="person.hometown"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="执业证书编码" prop="certificateNum">
                            <el-input auto-complete="off" style="width:150px" v-model="person.certificateNum"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="行政职务" prop="jobpost">
                            <el-select v-model="person.jobpost" placeholder="请选择职务"
                                       style="width:150px">
                                <el-option v-for="code in jobPosts" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="最高学历" prop="education">
                            <el-select v-model="person.education" placeholder="请选择学历"
                                       style="width:150px">
                                <el-option v-for="code in educations" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="学位" prop="degree">
                            <el-select v-model="person.degree" placeholder="请选择学位" style="width:150px">
                                <el-option v-for="code in degrees" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="所学专业" prop="majorCode">
                            <el-select v-model="person.majorCode" placeholder="请选择专业"
                                       style="width:150px">
                                <el-option v-for="code in majorCodes" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="专业技术职务" prop="majorJob">
                            <el-select v-model="person.majorJob" placeholder="请选择职务"
                                       style="width:150px">
                                <el-option v-for="code in majorJobs" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="专业类别" prop="majorType">
                            <el-select v-model="person.majorType" placeholder="请选择类别" style="width:150px">
                                <el-option v-for="code in majorTypes" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="职称代码" prop="professionalCode">
                            <el-input auto-complete="off" style="width:150px"
                                      v-model="person.professionalCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="执业地点" prop="certifiyAddress">
                            <el-input auto-complete="off" style="width:150px"
                                      v-model="person.certifiyAddress"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="执业范围" prop="certifiyScope">
                            <el-input auto-complete="off" style="width:150px" v-model="person.certifiyScope"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="医师执业类别" prop="operationType">
                            <el-select v-model="person.operationType" placeholder="请选择类别"
                                       style="width:150px">
                                <el-option v-for="code in operationTypes" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="医师执业范围" prop="operationScope">
                            <el-input auto-complete="off" style="width:150px" v-model="person.operationScope"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="执业证书照片" prop="">
                            <img style="width: 160px;height:180px;position: absolute;"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="电子邮箱" prop="email">
                            <el-input auto-complete="off" style="width:150px" v-model="person.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="办公室电话" prop="officeTel">
                            <el-input auto-complete="off" style="width:150px" v-model="person.officeTel"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="手机号码" prop="mobile">
                            <el-input auto-complete="off" style="width:150px" v-model="person.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="参加工作时间" prop="joinInWorkDate">
                            <el-date-picker style="width:150px" v-model="person.joinInWorkDate" type="date"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10"  class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="所属机构" prop="organCode">
                            <treeselect v-model="person.organCode" @input="loadOfficeTree"
                                        :clearable="true"
                                        :searchable="true"
                                        :disabled="false"
                                        :options="organs"
                                        :limit="3"
                                        :max-height="200"
                                        :placeholder="'请选择机构'"
                                        style="width:150px"
                                        :noChildrenText="' '"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所在科室" prop="officeCode">
                            <treeselect v-model="person.officeCode"
                                        :clearable="true"
                                        :searchable="true"
                                        :disabled="false"
                                        :options="officeTrees"
                                        :limit="3"
                                        :max-height="200"
                                        :placeholder="'请选择科室'"
                                        style="width:150px"
                                        :noChildrenText="' '"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="地址" prop="address">
                            <el-input auto-complete="off" style="width:150px" v-model="person.address"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="人员类别" prop="category">
                            <el-input auto-complete="off" style="width:150px" v-model="person.category"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发证机构" prop="check_org">
                            <el-input auto-complete="off" style="width:150px" v-model="person.check_org"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="调入时间" prop="indate">
                            <el-date-picker style="width:150px" v-model="person.indate" type="date"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="调出时间" prop="outdate">
                            <el-date-picker style="width:150px" v-model="person.outdate" type="date"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="拼音助记" prop="pycode">
                            <el-input :disabled="true" auto-complete="off" style="width:150px"
                                      v-model="person.pycode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
<!--                <el-row :gutter="10" class="dialogLabel">-->
<!--                    <el-col :span="8">-->
<!--                        <el-form-item label="审核标识" prop="verify">-->
<!--                            <el-select v-model="person.verify" placeholder="请选择证件类型" style="width:150px">-->
<!--                                <el-option v-for="code in verifys" :label="code.text" :value="code.key"-->
<!--                                           :key="code.key"></el-option>-->
<!--                            </el-select>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="8">-->
<!--                        <el-form-item label="审核意见" prop="opinion">-->
<!--                            <el-input auto-complete="off" style="width:150px" v-model="person.opinion"></el-input>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="8">-->
<!--                        <el-form-item label="综合评价" prop="summary">-->
<!--                            <el-input auto-complete="off" style="width:150px" v-model="person.summary"></el-input>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
<!--                </el-row>-->
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="备注" prop="remark">
                            <el-input auto-complete="off" style="width:150px" v-model="person.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--            <el-row :gutter="10" class="dialogLabel">-->
                <!--                <el-col :span="8">-->
                <!--                    <el-col :span="9">-->
                <!--                        <label class="">版本</label>-->
                <!--                    </el-col>-->
                <!--                    <el-col :span="15">-->
                <!--                        <el-select :disabled="formDisabled" v-model="person.version" placeholder="请选择版本"-->
                <!--                                   style="width:150px">-->
                <!--                            <el-option v-for="code in versions" :label="code.description" :value="code.version"-->
                <!--                                       :key="code.version"></el-option>-->
                <!--                        </el-select>-->
                <!--                    </el-col>-->
                <!--                </el-col>-->
                <!--            </el-row>-->
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
                // 字典组或字典名称
                groupOrDicName: null,
                visible: false,
                version: 'system', // 当前版本
                versions: [],
                checked: true,
                tableData: [],
                dialogFormVisible: false,// 显示新建项窗体
                userFormVisible: false,
                activeName: 'first',
                currentPage: 1,// 分页器当前显示页
                pageSize: 10,
                total: 0,
                orgCode: '',//当前机构
                organs: [], //机构
                cardTypes: [],//证件类型
                genders: [],//性别
                nations: [],//民族
                majorQualifys: [],//专业技术资格
                jobPosts: [],//行政职务
                educations: [],//最高学历
                degrees: [],//学位
                rolesList: [],//角色列表
                majorCodes: [],//所学专业
                majorJobs: [],//专业技术职务
                majorTypes: [],//专业类别
                operationTypes: [],//医师执业类别
                verifys: [],//审核标识
                person: {},
                user: {},
                roles: {},
                formDisabled: false,
                formTitle: '人员注册',
                userFormTitle: '用户-创建',
                subCurrentPage: 1,
                queryName: null,
                officeTrees: [],
                personId: 0,
                formRules: {
                    cardNo: [
                        {required: true, message: '请输入证件号码', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入科室名称', trigger: 'blur'}
                    ],
                    cardType: [
                        {required: true, message: '请选择证件类型', trigger: 'change'}
                    ],
                    organCode: [
                        {required: true, message: '请选择所属机构', trigger: 'change'}
                    ]
                },
                rules: {
                    password:[{
                        required:true, message:'密码不能为空',trigger:'blur'
                    }],
                    repeat:[{
                        required:true,message:'确认密码不能为空',trigger:'blur'
                    },{
                        validator:(rule,value,callback)=>{
                            if(value===''){
                                callback(new Error('请再次输入密码'))
                            }else if(value!==this.user.password){
                                callback(new Error('两次输入密码不一致'))
                            }else{
                                callback( )
                            }
                        },
                        trigger:'blur'
                    }]
                }


        }
        },
        methods: {
            handleNodeClick(data) {
                this.orgCode = data.id;
                this.loadPersons();
            },
            showForm(row) {
                if (!!row.id) {
                    this.person = row;
                    this.visible = true;
                    this.formDisabled = true;
                    this.formTitle = '人员注册-编辑';
                } else {
                    // this.orgCode
                    this.person = {
                        version: this.version
                    };
                    if (!!this.orgCode) {
                        this.person.organCode = this.orgCode;
                    }
                    this.visible = false;
                    this.formDisabled = false;
                    this.formTitle = '人员注册-创建';
                }
                this.loadOfficeTree(this.person.organCode);
                this.dialogFormVisible = true
            },
            showUserForm(row) {

                this.visible = false;
                this.formDisabled = false;
                this.formTitle = '账户-创建';
                this.personId = row.id;
                this.userFormVisible = true;
                this.getRoles();
                this.getUser();

            },

            cancelUserForm() {
                this.userFormVisible = false;
                this.user = {};
                this.$refs['userForm'].clearValidate();
            },
            cancel() {
                this.dialogFormVisible = false;
                this.person = {};
                this.$refs['personForm'].clearValidate();
            },
            // 分页器修改一页显示条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.loadPersons();
            },
            // 分页器修改当前页显示
            handleCurrentChange(val) {
                this.currentPage = val;
                this.loadPersons();
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
            loadPersons() {
                axios({
                    url: this.baseUrl+'personnel',
                    method: 'get',
                    headers: {},
                    params: {
                        sort: "",
                        page: this.currentPage,
                        limit: this.pageSize,
                        name: this.queryName,
                        code: "",
                        version: this.version,
                        organCode: this.orgCode
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
                this.$refs['personForm'].validate((valid) => {
                    if (valid) {
                        if (!!this.person.id) {
                            axios({
                                url: this.baseUrl+'personnel',
                                method: 'put',
                                headers: {},
                                data: this.person
                            }).then(res => {
                                let data = res.data;
                                if (data.success) {
                                    this.loadPersons();
                                    this.cancel();
                                    this.$notify({
                                        title: '人员注册-编辑',
                                        message: '编辑成功',
                                        type: 'success'
                                    });
                                } else {
                                    if(!!data.errMsg){
                                        this.$notify.error({
                                            title: '人员注册-编辑',
                                            message: '编辑失败原因'+data.errMsg,
                                            duration: 0
                                        });
                                    }else{
                                        this.$notify.error({
                                            title: '人员注册-编辑',
                                            message: '编辑失败!',
                                            duration: 0
                                        });
                                    }
                                }
                            })
                        } else {
                            axios({
                                url: this.baseUrl+'personnel',
                                method: 'post',
                                headers: {},
                                data: this.person
                            }).then(res => {
                                let data = res.data;
                                if (data.success) {
                                    this.loadPersons();
                                    this.cancel();
                                    this.$notify({
                                        title: '人员注册-创建',
                                        message: '创建成功',
                                        type: 'success'
                                    });
                                } else {
                                    if(!!data.errMsg){
                                        this.$notify.error({
                                            title: '人员注册-创建',
                                            message: '创建失败原因'+data.errMsg,
                                            duration: 0
                                        });
                                    }else{
                                        this.$notify.error({
                                            title: '人员注册-创建',
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

            bindUser() {
                if(this.user.password != this.user.repeat){
                    this.$notify.error({
                            title: '账户-保存',
                            message: '二次密码不一致!',
                            duration: 0
                        });
                return ;
                }

                axios({
                    url: this.baseUrl+'portalUser/bind',
                    method: 'post',
                    data: {
                        "localUserId": this.personId,
                        "userName": this.user.userName,
                        "password": this.user.password,
                        "roleIds": this.user.roleId
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.cancelUserForm();
                        this.$notify({
                            title: '账户-保存',
                            message: '保存成功',
                            type: 'success'
                        });
                    } else {
                        if(!!data.errMsg){
                            this.$notify.error({
                                title: '账户-保存',
                                message: '保存失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '账户-保存',
                                message: '保存失败!',
                                duration: 0
                            });
                        }
                    }
                })
            },
            getRoles() {
                axios({
                    url: this.baseUrl+'portalUser/roles',
                    method: 'post',
                    data: {
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.roles = data.content
                        this.$notify({
                            title: '账户-创建',
                            message: '创建成功',
                            type: 'success'
                        });
                    } else {
                        if(!!data.errMsg){
                            this.$notify.error({
                                title: '账户-创建',
                                message: '创建失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '账户-创建',
                                message: '创建失败!',
                                duration: 0
                            });
                        }
                    }
                })
            },
            getUser() {
                axios({
                    url: this.baseUrl+'portalUser/get',
                    method: 'post',
                    data: {
                    "localUserId": this.personId
                    }
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.user = data.content;
                         this.$notify({
                            title: '账户-创建',
                            message: '创建成功',
                            type: 'success'
                        });
                    } else {
                        if(!!data.errMsg){
                            this.$notify.error({
                                title: '账户-创建',
                                message: '创建失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '账户-创建',
                                message: '创建失败!',
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
                        this.organs.splice(0, this.organs.length);
                        // data.content.forEach(g => this.organs.push(g));
                        this.organs = this.convertData(data.content, 'code', 'name')
                    }
                })
            }, loadOfficeTree(code) {
                if (!!code) {
                    axios({
                        url: this.baseUrl+'office/tree',
                        method: 'post',
                        headers: {},
                        data: {
                            version: this.version,
                            organCode: code
                        }
                    }).then(res => {
                        let data = res.data;
                        if (data.success) {
                            this.officeTrees.splice(0, this.officeTrees.length);
                            // data.content.forEach(g => this.officeTrees.push(g));
                            this.officeTrees = this.convertData(data.content, 'code', 'name')
                        }
                    })
                }
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
                    url: this.baseUrl+'personnel/' + id,
                    method: 'delete',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.loadPersons();
                        this.$notify({
                            title: '人员注册-删除',
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                         if(!!data.errMsg){
                            this.$notify.error({
                                title: '人员注册-删除',
                                message: '删除失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '人员注册-删除',
                                message: '删除失败!',
                                duration: 0
                            });
                        }
                    }
                })
            }, convertData(listData, id, label) {
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
            // this.loadVersions();
            // if (this.version) {
            this.loadOrgTree();
            this.loadDics('CV02.01.101', this.cardTypes);
            this.loadDics('GB_T2261.1', this.genders);
            this.loadDics('ethnic', this.nations);
            this.loadDics('majorqualify', this.majorQualifys);
            this.loadDics('jobpost', this.jobPosts);
            this.loadDics('education', this.educations);
            this.loadDics('educationbackground', this.degrees);
            this.loadDics('majorname', this.majorCodes);
            this.loadDics('majorjob', this.majorJobs);
            this.loadDics('majortype', this.majorTypes);
            this.loadDics('operationtype', this.operationTypes);
            this.loadDics('sys.personnel.verify', this.verifys);
            // }
        },
        watch: {
            // 当前版本变动时，字典组列表重新加载
            version: function () {
                this.loadOrgTree();
                this.loadDics('CV02.01.101', this.cardTypes);
                this.loadDics('GB_T2261.1', this.genders);
                this.loadDics('ethnic', this.nations);
                this.loadDics('majorqualify', this.majorQualifys);
                this.loadDics('jobpost', this.jobPosts);
                this.loadDics('education', this.educations);
                this.loadDics('educationbackground', this.degrees);
                this.loadDics('majorname', this.majorCodes);
                this.loadDics('majorjob', this.majorJobs);
                this.loadDics('majortype', this.majorTypes);
                this.loadDics('operationtype', this.operationTypes);
                this.loadDics('sys.personnel.verify', this.verifys);
            },
            // 字典（组）名称
            groupOrDicName: function (val) {
                this.$refs.dicGroupTree.filter(val);
            }
        }
    }
</script>
<style scoped>
    .personPage{
         padding:10px;
		margin-top:10px;
    }

    .dialogLabel label {
        line-height: 35px
    }
    .dialogLabel {
        margin-top: 0px
    }
    .card_height{
        min-height: calc(100vh - 110px);
    }
</style>
