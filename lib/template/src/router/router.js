/**
 * 基础路由
 */
// export const BaseRouter = [
//   {
//     path: '/user',
//     name: 'user',
//     redirect: '/user/login',
//     component: UserLayout,
//     children: [
//       {
//         path: 'login',
//         name: 'login',
//         component: () => import(/* webpackChunkName: "login" */ '@/views/user/Login.vue')
//       }
//     ]
//   }
// ]

export const DynamicRouter = [
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/Home.vue'),
    meta: { title: '首页', icon: 'home', permission: 'home' }
  }
]
