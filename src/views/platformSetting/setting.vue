<template>
    <div class="settingPage">
        <el-col :span="24">
            <el-card class="box-card card_height">
                <div class="form_title"><span>基本设置</span></div>
                <el-form ref="form" :model="form" label-width="80px" style="width:60%;">
                    <el-form-item label="平台名称">
                        <el-row>
                            <el-col :span="16">
                                 <el-input v-model="form.title" placeholder="给平台取个名称吧"></el-input>
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <el-button type="primary" @click="saveTitle">确定</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="平台logo">
                        <el-select v-model="form.logo" placeholder="请选择" style="width:100%" @change="chooseLogo">
                            <el-option v-for="code in logos" :label="!!code.text?code.text:code.fileName"
                                       :value="code.id"
                                       :key="code.id" class="imgOption">
                                <el-col :span="12">
                                    <img class="avatar" :src="'http://localhost:8081/bimp/config/'+code.id+'/file'" style="height:36px;">
                                </el-col>
                                <el-col :span="12" style="text-align: right;">
                                    <span>{{!!code.text?code.text:code.fileName}}</span>
                                </el-col>
                            </el-option>
                           
                        </el-select>
                        <el-input v-model="logoData.text" placeholder="请输入图片描述"></el-input>
                         <el-upload ref="uploadLogo"
                                    class="upload-demo"
                                    action="config/saveWithFile"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :on-success="logoHandleSuccess"
                                    :on-error="handleErr"
                                    :file-list="fileList" :data="logoData"
                                    list-type="picture" :auto-upload="false">
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadLogo">
                                    上传到服务器
                                </el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        
                    </el-form-item>
                    <el-form-item label="背景图片">
                        <el-select v-model="form.background" placeholder="请选择" style="width:100%" @change="chooseBack" ref="selectBackground">
                            <el-option v-for="code in backgrounds" :label="!!code.text?code.text:code.fileName"
                                       :value="code.id"
                                       :key="code.id" class="imgOption">
                                       <el-col :span="12">
                                           <img class="avatar" :src="'http://localhost:8081/bimp/config/'+code.id+'/file'" style="height:36px;">
                                       </el-col>
                                       <el-col :span="12" style="text-align: right;">
                                           <span>{{!!code.text?code.text:code.fileName}}</span>
                                       </el-col>
                                    
                            </el-option>
                        </el-select>
                        <el-input v-model="backgroundData.text" placeholder="请输入图片描述"></el-input>
                        <el-upload ref="uploadBackground"
                                   class="upload-demo"
                                   action="config/saveWithFile"
                                   :on-preview="handlePreview"
                                   :on-success="backgroundHandleSuccess"
                                   :on-error="handleErr"
                                   :on-remove="handleRemove" :data="backgroundData"
                                   list-type="picture" :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success"
                                       @click="submitUploadBackground">
                                上传到服务器
                            </el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                    <!--                    <el-form-item label="系统首页">-->
                    <!--                        <el-input v-model="form.name"></el-input>-->
                    <!--                    </el-form-item>-->
<!--                    <el-form-item class="dialog_button">-->
<!--                        <el-button>取消</el-button>-->
<!--                        <el-button type="primary" @click="onSubmit">提交</el-button>-->
<!--                    </el-form-item>-->
                </el-form>
            </el-card>
        </el-col>
    </div>
</template>
<script>
	import axios from 'axios'
	export default {
        data() {
            return {
                fileList: [],
                form: {
                    title:'',
                    logo:'',
                    background:''

                },
                backgroundData: {
                    code: 'background',
                    text:''
                },
                logoData: {
                    code: 'logo',
                    text:''
                },
                backgrounds: [],
                logos: []
            };
        },
        methods: {
            handleRemove(file, fileList) {
                // console.log(file, fileList);
            },
            handlePreview(file) {
                // console.log(file);
            },
            submitUploadLogo() {
                // this.logoData = {
                //     code: 'logo',
                //     // text:''
                // }
                this.$refs.uploadLogo.submit();
            },
            submitUploadBackground() {
                // this.backgroundData = {
                //     code: 'background',
                //     // text:''
                // }
                this.$refs.uploadBackground.submit();
            },
            onSubmit() {
                this.$notify({
                    title: '成功',
                    message: '基本配置修改成功',
                    type: 'success'
                });
            },
            chooseBack() {//选择背景
                // let path=this.$refs.selectBackground.selectedLabel
                // this.$refs.selectBackground.$el.children[0].children[1].setAttribute('style','background:url('+ path +') no-repeat;color:#fff');      
                if (!!this.form.background) {
                    axios({
                        url: this.baseUrl+'config/active',
                        method: 'post',
                        headers: {},
                        data: {
                            code: 'background',
                            id: this.form.logo
                        }
                    }).then(res => {
                        let data = res.data;
                        if (data.success) {
                            this.$notify({
                                title: '成功',
                                message: '背景图修改成功',
                                type: 'success'
                            });
                        } else {
                            this.$notify({
                                title: '失败',
                                message: '背景图修改失败',
                                type: 'error'
                            });
                        }
                    });
                }
            },
            chooseLogo() {//选择logo
                if (!!this.form.logo) {
                    axios({
                        url: this.baseUrl+'config/active',
                        method: 'post',
                        headers: {},
                        data: {
                            code: 'logo',
                            id: this.form.logo
                        }
                    }).then(res => {
                        let data = res.data;
                        if (data.success) {
                            this.$notify({
                                title: '成功',
                                message: 'logo修改成功',
                                type: 'success'
                            });
                        } else {
                            this.$notify({
                                title: '失败',
                                message: 'logo修改失败',
                                type: 'error'
                            });
                        }
                    });
                }
            },
            getConfig(code, objs) {
                if (!!code) {
                    axios({
                        url: this.baseUrl+'config/sample',
                        method: 'post',
                        headers: {},
                        data: {
                            code: code
                        }
                    }).then(res => {
                        let data = res.data;
                        if (data.success) {
                            objs.splice(0, objs.length);
                            data.content.forEach(element => {
                                objs.push(element);
                            });
                        }
                    });
                }
            },
            saveTitle() {//保存标题
                if (!!this.form.title) {
                    axios({
                        url: this.baseUrl+'config/saveValue',
                        method: 'post',
                        headers: {},
                        data: {
                            code: 'title',
                            value: this.form.title
                        }
                    }).then(res => {
                        let data = res.data;
                        if (data.success) {
                            this.$notify({
                                title: '成功',
                                message: '报存成功',
                                type: 'success'
                            });
                        } else {
                            this.$notify({
                                title: '失败',
                                message: '保存失败',
                                type: 'error'
                            });
                        }
                    });
                }else {
                    this.$notify({
                        title: '提示',
                        message: '平台名称不能为空',
                        type: 'warning'
                    });
                }
            },
            // 上传成功时的操作
            logoHandleSuccess(response, file, fileList){
                if(response.success===false){
                    this.$notify.error({
                        title: '错误',
                        message:file.name+ '上传失败，原因'+response.errMsg,
                        duration: 0
                    });
                }else{
                    this.$notify({
                    title: '成功',
                    message: file.name+'上传成功',
                    type: 'success'
                    });
                    this.getConfig('logo', this.logos);
                }
                
            },
            backgroundHandleSuccess(response, file, fileList){
                if(response.success===false){
                    this.$notify.error({
                        title: '错误',
                        message:file.name+ '上传失败，原因'+response.errMsg,
                        duration: 0
                    });
                }else{
                    this.$notify({
                        title: '成功',
                        message: file.name+'上传成功',
                        type: 'success'
                    });
                    this.getConfig('background', this.backgrounds);
                }

            },
            // 上传失败操作
            handleErr(err, file, fileLis){
                this.$notify.error({
                    title: '错误',
                    message: '上传失败，请检查接口是否异常'
                    });
            },
            getAllConfig() {//获取所有配置
                axios({
                    url: this.baseUrl+'config/all',
                    method: 'get',
                    headers: {}
                }).then(res => {
                    let data = res.data;
                    if (data.success) {
                        let content = data.content;
                        let background = content.background;
                        let logo = content.logo;
                        let title = content.title;

                        if (!!title) {
                            this.form.title = title[0].value;
                        }

                        this.backgrounds.splice(0, this.backgrounds.length);
                        this.logos.splice(0, this.logos.length);

                        if (!!background) {
                            background.forEach(element => {
                                this.backgrounds.push(element);
                                if (element.active == true) {//获取当前背景
                                    this.form.background = element.id;
                                }
                            });
                        }
                        if (!!logo) {
                            logo.forEach(element => {
                                this.logos.push(element);
                                if (element.active == true) {//当前logo
                                    this.form.logo = element.id;
                                }
                            });
                        }
                    }
                })
            }
        },
        mounted: function () {
            this.getAllConfig();
        },
        watch: {
            form: {
            handler: function (val, oldVal) { /* ... */
                this.form=val;
            },
            deep: true
            },
            // sync:{
            //   handler:function(val,oldVal){
            //     console.log('sync',val,this.ruleForm)
            //     //this.ruleForm=this.ruleForm1;
            //   //  this.ruleForm.sex='1';
            //   }
            // }

        }
    }
</script>
<style>
    .settingPage {
        height: 96%;
        overflow: auto;
    }

    .form_title {
        color: rgba(0, 0, 0, 0.85);
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 12px;
    }
    .imgOption{
        margin:10px 0;
    }
</style>