export const USER_CONFIG = {
    gridConfig: [
      {label: '编码',prop:'key'},
      {label: '名称', prop: 'text'},
      {label: '单位', prop: 'unit'},
      // {
      //   label: '状态', prop: 'status', render: (h, params) => {
      //     if(params.row.status === '0'){
      //       return h('el-tag', {
      //         props:{
      //           size:'mini',
      //           type:'warning'
      //         }
      //       },'正常');
      //     }else {
      //       return h('el-tag', {
      //         props:{
      //           size:'mini',
      //           type:'success'
      //         }
      //       },'禁用');
      //     }
      //   }
      // },
      // {label: '创建时间', prop: 'create_time'},
      // {label: '扩展信息', prop: 'expand'}
    ],
    // crud的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置
    formConfig: [
      {span: 24, label: '所属字典',prop:'dic', type: 'text',readonly:true},
      {span: 24, label: '代码',prop:'key', type: 'text',},
      {span: 24, label: '名称', prop: 'text', type: 'text'},
      {span: 24, label: '单位', prop: 'unit', type: 'text'},
      {span: 24, label: '说明', prop: 'desc', type: 'textarea'},],
    //   {
    //     span: 12, label: '角色',
    //     prop: 'roleIdList',
    //     type: 'checkbox',
    //     data: [{name: '角色一', id: '1'}, {name: '角色二', id: '2'}],
    //     rules: { type: 'array', required: true, message: '请选择角色', trigger: 'change' }
    //   },
    //   {
    //     span: 12, label: '状态',
    //     prop: 'status',
    //     type: 'radio',
    //     data: [{name: '正常', id: 1}, {name: '禁用', id: 0}],
    //     rules: {required: true, message: '请选择角色状态', trigger: 'change'}
    //   },
    //   {span: 24, label: '备注', prop: 'expand', type: 'textarea'}
    // ],
    // // crud的操作按钮配置，基础按钮有添加、修改、删除、查看，还可以配置扩展按钮
    gridBtnConfig: {
      create: true, update: true, delete: true, view: false,
      find:true,
      addItem:true,
      expands: [
        { name: '下载按钮', emitName: 'download', type: 'primary' }
      ]},
      
    
    // 表单基础数据类型，需要预先赋值
    formModel: {
      id: '',
      tel: '',
      name: '',
      email: '',
      status: '',
      create_time: '',
      expand: '',
      roleIdList: []
    }
  };
  