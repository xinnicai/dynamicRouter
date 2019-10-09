export default file => {
  return map[file] || null
}

const map = {
  Nested: () => import('@/views/layout/Layout'),
  Menu1: () => import('@/views/nested/menu1/index'),
  'Menu1-1': () => import('@/views/nested/menu1/menu1-1'),
  'Menu1-2': () => import('@/views/nested/menu1/menu1-2'),
  Menu2: () => import('@/views/nested/menu2/index'),
  form: () => import('@/views/layout/Layout'),
  Form: () => import('@/views/form/index'),
  Example: () => import('@/views/layout/Layout'),
  Table: () => import('@/views/table/index'),
  Tree: () => import('@/views/tree/index'),
  // 字典管理
  dicManage: () => import('@/views/layout/Layout'),
  dic:()=>import('@/views/dic/dic'),
  localDic:()=>import('@/views/dic/localDic'),
  sysDic:()=>import('@/views/dic/sysDic'),
  // 注册管理
  registerManage: () => import('@/views/layout/Layout'),
  office:()=>import('@/views/register/office'),
  organ:()=>import('@/views/register/organ'),
  person:()=>import('@/views/register/person'),
  region:()=>import('@/views/register/region'),
  system:()=>import('@/views/register/system'),
  //权限管理
  powerManage: () => import('@/views/layout/Layout'), 
  powerList:()=>import('@/views/power/powerList'),
  roleList:()=>import('@/views/power/roleList'),
  //服务治理
  serverManage: () => import('@/views/layout/Layout'), 
  endpoint:()=>import('@/views/server/endpoint'),
  log:()=>import('@/views/server/log'),
  // 日志审计
  logManage: () => import('@/views/layout/Layout'), 
  ssoLog:()=>import('@/views/logAudit/ssoLog'),
  // 平台配置
  settingManage: () => import('@/views/layout/Layout'), 
  setting:()=>import('@/views/platformSetting/setting'),
  ThreeDemo: () => import('@/views/componentsDemo/threePart'),
  TwoDemo: () => import('@/views/componentsDemo/twoPartNobutton'),
  OneDemo: () => import('@/views/componentsDemo/onePart'),
}
