const routers = [
  {
      path: '/',
      redirect: "/common/homepage"
  },
  {
    path: '/common',
    component: (resolve) => require(['../views/common/index.vue'], resolve),
    children:[
      {
        path: '/common/homepage',
        component: (resolve) => require(['../views/common/homepage.vue'], resolve),
      },
    ]
  },
  {
    path: '/consigner',
    meta: {
      requiresAuth: true,
    },
    component: (resolve) => require(['../views/consigner/index.vue'], resolve),
    children:[
      {
        path: '/consigner/homepage',
        component: (resolve) => require(['../views/common/homepage.vue'], resolve),
      },
      {
        path: '/consigner/notice',
        component: (resolve) => require(['../views/consigner/notice.vue'], resolve),
      },
      {
        path: '/consigner/changepass',
        component: (resolve) => require(['../views/consigner/changepass.vue'], resolve),
      },
      {
        path: '/consigner/goodsource',
        component: (resolve) => require(['../views/consigner/goodsource.vue'], resolve),
      },
      {
        path: '/consigner/ordermanager',
        component: (resolve) => require(['../views/consigner/ordermanager.vue'], resolve),
      },
      {
        path: '/consigner/transportmanager',
        component: (resolve) => require(['../views/consigner/transportmanager.vue'], resolve),
      },
    ]
  },
  {
    path: '/shipper',
    meta: {
      requiresAuth: true,
    },
    component: (resolve) => require(['../views/shipper/index.vue'], resolve),
    children:[
      {
        path: '/shipper/homepage',
        component: (resolve) => require(['../views/common/homepage.vue'], resolve),
      },
      {
        path: '/shipper/notice',
        component: (resolve) => require(['../views/shipper/notice.vue'], resolve),
      },
      {
        path: '/shipper/changepass',
        component: (resolve) => require(['../views/shipper/changepass.vue'], resolve),
      },
      {
        path: '/shipper/carmanager',
        component: (resolve) => require(['../views/shipper/carmanager.vue'], resolve),
      },
      {
        path: '/shipper/drivermanager',
        component: (resolve) => require(['../views/shipper/drivermanager.vue'], resolve),
      },
      {
        path: '/shipper/goodsource',
        component: (resolve) => require(['../views/shipper/goodsource.vue'], resolve),
      },
      {
        path: '/shipper/ordermanager',
        component: (resolve) => require(['../views/shipper/ordermanager.vue'], resolve),
      },
      {
        path: '/shipper/transportmanager',
        component: (resolve) => require(['../views/shipper/transportmanager.vue'], resolve),
      },
    ]
  },
];
export default routers;