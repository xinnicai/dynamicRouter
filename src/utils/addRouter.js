import _import from '../router/_import' // 获取组件的方法

/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */
export function addRouter(routerlist) {
  const router = []
  routerlist.forEach(e => {
    let paths
    if(e.sourceLevel=== '1'){
      paths= '/'+e.code
    }else{
      paths= '/'+e.code
    }
    let e_new = {
      path: paths,
      name: e.code,
      component: _import(e.code)
    }
    if (e.children) {
      e_new = Object.assign({}, e_new, { children: addRouter(e.children) })
    }
    if (e.redirect) {
      e_new = Object.assign({}, e_new, { redirect: e.redirect })
    }
    if (e.generatemenu === 1) {
      e_new = Object.assign({}, e_new, { hidden: true })
    }
    if (e.icon !== '' && e.title !== '') {
      if(e.type==='B2'){
        e_new = Object.assign({}, e_new, {
          meta: { title: e.text, icon: e.icon, uri:e.uri,type:'iframe' }
        })
      }else{
        e_new = Object.assign({}, e_new, {
          meta: { title: e.text, icon: e.icon }
        })
      }
      
    } else if (e.title !== '' && e.icon === '') {
      e_new = Object.assign({}, e_new, { meta: { title: e.text }})
    }
    router.push(e_new)
  })
  // console.log(router)
  return router
}
