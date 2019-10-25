<template>
    <div>
        <el-row>
            <el-col :span="24">
                <!-- <el-card class="box-card"> -->
                    <div id="dic-header">
                        <el-select v-model="version" placeholder="请选择字典版本" style="width:210px;" @change="changeName">
                            <el-option v-for="(v, index) in versions" :lable="v.version" :value="v.version"
                                    :key="v.id"></el-option>
                        </el-select>
                        <el-button style="margin-left:10px" @click="addVersionDialog.show = true">管理版本
                        </el-button>
                        <!-- <el-button v-if="this.version != this.activedVerson">激活版本</el-button> -->
                    </div>
                <!-- </el-card> -->
            </el-col>
        </el-row>
        	<!-- 新建版本 -->
		<el-dialog :title="addVersionDialog.title" :visible.sync="addVersionDialog.show" width="65%" @close="closeVersionDialog" :close-on-click-modal="false" :close-on-press-escape="false">
			<BaseCrud ref="headTable" :apiService="config.userService" :grid-config="config.gridConfig" :grid-btn-config="config.gridBtnConfig" :gridEditWidth="config.gridEditWidth"
                    :grid-data="testData"
                    :form-config="config.formConfig" :form-data="config.formModel" :grid-edit-width="200" :selectTreeData="selectTreeData" :tableParams="config.tableParams"
                    form-title="字典项" :is-async="true" :pushTableData="config.pushTableData" :sourceVisionData="versions">
            </BaseCrud>
		</el-dialog>
    </div>
</template> 
<script>
import axios from 'axios'
import BaseCrud from '../table/modalEditTable.vue'
export default {
    components: {
      BaseCrud,
    },
    props: [
        // 下拉框初始值
        'name',
        'config'
    ],
    name: 'header-table-list',
    data:function(){
        var versionType = 'standard';
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
        return {
            version:this.name,
            versions:[],
            versionType:versionType,
            activedVerson:null,
             // 新增版本Dialog属性
            addVersionDialog: {
                title: '管理版本',
                show: false,
                addVersionRules: {
                    version: [
                        {required: true, message: "请填写版本", trigger: "blur"},
                        {validator: validVersionUnique, trigger: "blur"}
                    ]
                },
            },
            // 新版本
            newVersion: {
                type: versionType,
                version: null,
                description: null,
                active: true,
                sourceVersion: null,
            },
            testData : [],
            selectTreeData:[]
        }
        
    },
    methods:{
        loadVersions() {
            axios({
                url: this.baseUrl+this.config.userService,
                method: 'get',
                headers: {},
                params: this.config.versionsParams
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
        changeName: function(){
            this.$emit('update:select',this.version);
        },
        closeVersionDialog(){
            this.addVersionDialog.show = false;
            // this.$refs['addVisionForm'].clearValidate();
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
                            type: this.versionType,
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

    },
    created(){
        this.loadVersions()
    }
}
</script>