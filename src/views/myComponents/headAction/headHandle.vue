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
                        <el-button style="margin-left:10px" @click="addVersionDialog.show = true">新增版本
                        </el-button>
                        <el-button v-if="this.version != this.activedVerson">激活版本</el-button>
                    </div>
                <!-- </el-card> -->
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
    </div>
</template> 
<script>
import axios from 'axios'
export default {
    props: [
        // 下拉框初始值
        'name'
    ],
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
                title: '新增版本',
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
        }
    },
    methods:{
        loadVersions() {
            axios({
                url: this.baseUrl+'version',
                method: 'get',
                headers: {},
                params: {
                    type: this.versionType
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
        changeName: function(){
            this.$emit('update:select',this.version);
        },
        closeVersionDialog(){
            this.addVersionDialog.show = false;
            this.$refs['addVisionForm'].clearValidate();
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