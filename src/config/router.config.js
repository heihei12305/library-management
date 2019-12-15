// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'home' },
    hidden: true,
    redirect: '/index/welcome',
    children: [

      // forms
      {
        path: '/index',
        redirect: '/index/welcome',
        component: RouteView,
        meta: { title: '主页', icon: 'form', permission: [ 'form' ] },
        children: [
          {
            path: '/index/welcome',
            name: 'welcome',
            component: () => import('@/views/form/BasicForm'),
            meta: { title: '欢迎页', keepAlive: true, permission: [ 'form' ] }
          }
        ]
      },

      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '图书流通', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: '/dashboard/insert',
            name: 'TestWork',
            component: () => import('@/views/dashboard/Insert'),
            meta: { title: '书籍信息添加', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/dashboard/find',
            name: 'find',
            component: () => import('@/views/dashboard/Find'),
            meta: { title: '书籍信息修改', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '学生借阅管理', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },
      // list
      {
        path: '/list',
        name: 'list',
        component: PageView,
        redirect: '/list/table-list',
        meta: { title: '图书采购', icon: 'table', permission: [ 'table' ] },
        children: [
          {
            path: '/list/table-list',
            name: 'TableListWrapper',
            component: () => import('@/views/list/TableList'),
            meta: { title: '学生荐书审核', keepAlive: true, permission: [ 'table' ] }
          },

          {
            path: '/list/standard-list',
            name: 'StandardList',
            component: () => import('@/views/list/StandardList'),
            meta: { title: '新书采购', keepAlive: true, permission: [ 'table' ] }
          }
        ]
      },
       // profile
       {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        redirect: '/profile/basic',
        meta: { title: '用户管理', icon: 'profile', permission: [ 'profile' ] },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic/Index'),
            meta: { title: '添加用户', permission: [ 'profile' ] }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: '修改用户', permission: [ 'profile' ] }
          }
        ]
      },
       // account
       {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center/Index'),
            meta: { title: '个人中心', keepAlive: true, permission: [ 'user' ] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', permission: [ 'user' ] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', keepAlive: true, permission: [ 'user' ] }
              }
            ]
          },
          {
            path: '/account/recommend',
            name: 'recommend',
            component: () => import('@/views/account/recommend'),
            meta: { title: '个人荐读', keepAlive: true, permission: [ 'user' ] }
          },
          {
            path: '/account/search',
            name: 'search',
            component: () => import('@/views/account/search'),
            meta: { title: '书籍查询', keepAlive: true, permission: [ 'user' ] }
          }
        ]
      },
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recommend-result',
        name: 'recommendResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/account/recommendResult')
      },
      {
        path: 'security-result',
        name: 'SecurityResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/account/settings/SecurityResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
