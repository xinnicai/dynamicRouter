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
  zdgl: () => import('@/views/layout/Layout'),
  standard:()=>import('@/views/dic/dic'),
  localDic:()=>import('@/views/dic/localDic'),
  sysDic:()=>import('@/views/dic/sysDic'),
  // 注册管理
  zcfw: () => import('@/views/layout/Layout'),
  office:()=>import('@/views/register/office'),
  organ:()=>import('@/views/register/organ'),
  person:()=>import('@/views/register/person'),
  region:()=>import('@/views/register/region'),
  system:()=>import('@/views/register/system'),
  //权限管理
  qxgl: () => import('@/views/layout/Layout'), 
  power:()=>import('@/views/power/powerList'),
  role:()=>import('@/views/power/roleList'),
  //服务治理
  fwzl: () => import('@/views/layout/Layout'), 
  esb:()=>import('@/views/server/endpoint'),
  log:()=>import('@/views/server/log'),
  // 日志审计
  rzsj: () => import('@/views/layout/Layout'), 
  sso:()=>import('@/views/logAudit/ssoLog'),
  online:()=>import('@/views/logAudit/online'),
  // 平台配置
  xtpz: () => import('@/views/layout/Layout'), 
  setting:()=>import('@/views/platformSetting/setting'),
  ThreeDemo: () => import('@/views/componentsDemo/threePart'),
  TwoDemo: () => import('@/views/componentsDemo/twoPartNobutton'),
  OneDemo: () => import('@/views/componentsDemo/threePart'),
  // iframe页面
  mhpz: () => import('@/views/layout/Layout'), 
  mhzh: () => import('@/views/iframe/iframePage'),
  mhsf:() => import('@/views/iframe/iframePage'),
  mhmk:() => import('@/views/iframe/iframePage'),
}
