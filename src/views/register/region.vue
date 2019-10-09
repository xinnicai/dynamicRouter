<template>
    <div class="regionPage">
        <el-col :span="24">
            <el-card class="box-card card_height">
                    <el-row>
                        <el-col :span="24">
                            <el-input placeholder="输入名称" style="width: 300px" v-model="queryName"></el-input>
                            <el-button icon="el-icon-search" type="primary" @click="loadRegions">搜索</el-button>
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
                                border
                                >
                            <el-table-column
                                    prop="code"
                                    label="区划代码"
                                    sortable
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="区划名称"
                                    sortable
                                    >
                            </el-table-column>
                            <el-table-column
                                    prop="description"
                                    label="描述">
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
        </el-col>
        <!-- 弹窗 -->
        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="65%" @close="cancel">
            <el-form :model="region" :rules="formRules" ref="regionForm" label-width="100px" class="demo-ruleForm">
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="代码" prop="code">
                            <el-input auto-complete="off" style="width:150px" :disabled="formDisabled"
                                      v-model="region.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="名称" prop="name">
                            <el-input auto-complete="off" style="width:150px" v-model="region.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="行政区划级别" prop="regionLevel">
                            <el-select v-model="region.regionLevel" placeholder="请选择行政区划级别" style="width:150px">
                                <el-option v-for="code in regionLevels" :label="code.text" :value="code.key"
                                           :key="code.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="其他代码" prop="otherCode">
                            <el-input auto-complete="off" style="width:150px" v-model="region.otherCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="上级区划" prop="parentCode">
                            <treeselect v-model="region.parentCode"
                                        :clearable="true"
                                        :searchable="true"
                                        :disabled="false"
                                        :options="regionTrees"
                                        :limit="3"
                                        :max-height="200"
                                        :placeholder="'请选择'"
                                        style="width:150px"
                                        :noChildrenText="' '"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="注册时间" prop="description">
                            <el-date-picker style="width:150px" v-model="region.regtime" type="date"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="城乡属性码" prop="cxsxm">
                            <el-input auto-complete="off" style="width:150px" v-model="region.cxsxm"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="城乡分类码" prop="cxsxm">
                            <el-input auto-complete="off" style="width:150px" v-model="region.cxflm"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="dialogLabel">
                    <el-col :span="8">
                        <el-form-item label="人口" prop="population">
                            <el-input auto-complete="off" style="width:150px" v-model="region.population"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="面积（平方千米）" prop="area">
                            <el-input auto-complete="off" style="width:150px" v-model="region.area"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="描述" prop="description">
                            <el-input auto-complete="off" style="width:150px" v-model="region.description"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--                <el-row :gutter="10" class="dialogLabel">-->
                <!--                <el-col :span="8">-->
                <!--                    <el-col :span="9">-->
                <!--                        <label class="">版本</label>-->
                <!--                    </el-col>-->
                <!--                    <el-col :span="15">-->
                <!--                        <el-select :disabled="formDisabled" v-model="region.version" placeholder="请选择版本"-->
                <!--                                   style="width:150px">-->
                <!--                            <el-option v-for="code in versions" :label="code.description" :value="code.version"-->
                <!--                                       :key="code.version"></el-option>-->
                <!--                        </el-select>-->
                <!--                    </el-col>-->
                <!--                </el-col>-->
                <!--                </el-row>-->
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
                version: 'system', // 当前版本
                versions: [],
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
                        {required: true, message: '请输入代码', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            showForm(row) {
                if (!!row.id) {
                    this.region = row;
                    this.formDisabled = true;
                    this.formTitle = '行政区划注册-编辑';
                } else {
                    this.region = {
                        version: this.version
                    };
                    this.formDisabled = false;
                    this.formTitle = '行政区划注册-创建';
                }
                this.dialogFormVisible = true
            },
            cancel() {
                this.dialogFormVisible = false;
                this.region = {};
                this.$refs['regionForm'].clearValidate();
            },
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
            // 加载字典版本
            // loadVersions() {
            //     axios({
            //         url: '/version',
            //         method: 'get',
            //         headers: {},
            //         params: {
            //             type: "sys.admin"
            //         }
            //     }).then(res => {
            //         var data = res.data;
            //         if (data.success) {
            //             this.versions.splice(0, this.versions.length);
            //             data.content.forEach(v => {
            //                 this.versions.push(v)
            //                 if (v.active) {
            //                     this.version = v.version;
            //                 }
            //             });
            //         }
            //     }).catch(e => {
            //         console.error(e);
            //     })
            // },
            // 过滤字典（字典组）
            filterDics(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            loadRegions() {
                axios({
                    url: this.baseUrl+'region',
                    method: 'get',
                    headers: {},
                    params: {
                        sort: "",
                        page: this.currentPage,
                        limit: this.pageSize,
                        name: this.queryName,
                        code: "",
                        version: this.version
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
                this.$refs['regionForm'].validate((valid) => {
                    if (valid) {
                        if (!!this.region.id) {
                            axios({
                                url: this.baseUrl+'region',
                                method: 'put',
                                headers: {},
                                data: this.region
                            }).then(res => {
                                let data = res.data;
                                if (data.success) {
                                    this.loadRegions();
                                    this.cancel();
                                    this.$notify({
                                        title: '行政区划注册-编辑',
                                        message: '编辑成功',
                                        type: 'success'
                                    });
                                } else {
                                    if(!!data.errMsg){
                                        this.$notify.error({
                                            title: '行政区划注册-编辑',
                                            message: '编辑失败原因'+data.errMsg,
                                            duration: 0
                                        });
                                    }else{
                                        this.$notify.error({
                                            title: '行政区划注册-编辑',
                                            message: '编辑失败!',
                                            duration: 0
                                        });
                                    }
                                }
                            })
                        } else {
                            axios({
                                url: this.baseUrl+'region',
                                method: 'post',
                                headers: {},
                                data: this.region
                            }).then(res => {
                                let data = res.data;
                                if (data.success) {
                                    this.loadRegions();
                                    this.cancel();
                                    this.$notify({
                                        title: '行政区划注册-创建',
                                        message: '创建成功',
                                        type: 'success'
                                    });
                                } else {
                                    if(!!data.errMsg){
                                        this.$notify.error({
                                            title: '行政区划注册-创建',
                                            message: '创建失败原因'+data.errMsg,
                                            duration: 0
                                        });
                                    }else{
                                        this.$notify.error({
                                            title: '行政区划注册-创建',
                                            message: '创建失败!',
                                            duration: 0
                                        });
                                    }
                                }
                            })
                        }
                    }
                })
            }, loadRegionTree() {
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
                        this.regionTrees.splice(0, this.regionTrees.length);
                        // data.content.forEach(g => this.regionTrees.push(g));
                        this.regionTrees = this.convertData(data.content, 'code', 'name')
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
                    url: this.baseUrl+'region/' + id,
                    method: 'delete',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        this.loadRegions();
                        this.$notify({
                                        title: '行政区划注册-删除',
                                        message: '删除成功',
                                        type: 'success'
                                    });
                    } else {
                        if(!!data.errMsg){
                            this.$notify.error({
                                title: '行政区划注册-删除',
                                message: '删除失败原因'+data.errMsg,
                                duration: 0
                            });
                        }else{
                            this.$notify.error({
                                title: '行政区划注册-删除',
                                message: '删除失败!',
                                duration: 0
                            });
                        }
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
            }

        },
        created: function () {
            // 初始化参数
            // this.loadVersions();
            // if (this.version) {
            this.loadRegions();
            this.loadRegionTree();
            this.loadDics('regionLevels', this.regionLevels);
            // }
        },
        watch: {
            // 当前版本变动时，字典组列表重新加载
            version: function () {
                this.loadRegions();
                this.loadRegionTree();
                this.loadDics('regionLevels', this.regionLevels);
            },
            // 字典（组）名称
            groupOrDicName: function (val) {
                this.$refs.dicGroupTree.filter(val);
            }
        }
    }
</script>
<style scoped>
    .dialogLabel label {
        line-height: 35px
    }


    .regionPage{
        height: 96%;
        overflow: auto;
    }
    .card_height{
        min-height: calc(100vh - 110px);
        
    }
    .el-table{
        overflow: auto;
    }
    .dialogLabel{
        margin-top: 0px;
    }
</style>
