<template>
    <el-tree class="filter-tree" ref="dicGroupTree"
                :data="organs" :props="{label:'label'}" :filter-node-method="filterDics"
                @node-click="handleNodeClick">
            <span class="span-ellipsis" slot-scope="{ node, data }">
                    <el-tooltip class="item" effect="dark" :content="node.label" placement="bottom" :open-delay="1000">
                    <span >{{ node.label }}</span>
                </el-tooltip>
            </span>
    </el-tree>
    
</template>
<script>
import axios from 'axios'

export default {
    props: [
        'organType'
    ],
    data: function () {

        // var versionType = 'standard';
        return {
            orgCode: '',//当前机构
            organs:[],
            version: 'system', // 当前版本
            versions: [],
            defaultExpand:[]
        }
    },
    methods:{
        handleNodeClick(data) {
            this.orgCode = data.id;
            this.$emit('update:RegiontreeSelect',data);
            // this.loadPersons()
        },
        // 过滤字典（字典组）
        filterDics(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        loadOrgTree() {
            if(this.organType==='organization'){
                axios({
                    url: this.baseUrl+this.organType+'/' + this.version + '/tree',
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
            }else{
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
                        this.organs.splice(0, this.organs.length);
                        this.organs=this.convertData(data.content,'code','name')
                        this.defaultExpand.push(this.organs[0].children[0].id)
                    }
                })
            }
                
            },
            //转换数据格式 
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

    created() {
	        // 初始化参数
	        this.loadOrgTree();
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