import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      // 登录
      path: '/login',
      name: '登录',
      component: require('../view/login/login.vue').default,
    },
    {
      // 主页
      path: '/home',
      name: '空白主页',
      component: require('../view/index/index.vue').default,
      // 含有文件夹的文件children
      children:[{
        // 主题home
          path: '/mshome',
          name: '主题主页',
          component: require('../view/index/home.vue').default,
          meta: {
            requireAuth: true
          }
        },
        {
          // 我的订单
            path: '/orderlist',
            name: '我的订单',
            component: require('../view/myorder/orderlist.vue').default,
            meta: {
              requireAuth: true
            }
          },
          {
            // 借款申请
              path: '/loanapply',
              name: '借款申请',
              component: require('../view/applyloan/loanapply.vue').default,
              meta: {
                requireAuth: true
              }
            },
            {
              // 对账报表
                path: '/duizhanglist',
                name: '对账报表',
                component: require('../view/duizhanglist/duizhanglist.vue').default,
                meta: {
                  requireAuth: true
                }
              },
              {
                // 订单详情
                  path: '/orderbasedetail',
                  name: '订单详情',
                  component: require('../view/myorder/orderdetail/orderbase.vue').default,
                  meta: {
                    requireAuth: true
                  }
                }]
    }]
})
