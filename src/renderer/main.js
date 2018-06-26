import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Util from './libs/util';
import App from './app.vue';
import store from "./store/index";
import 'iview/dist/styles/iview.css';
import { getToken } from './config/utils'
import ApiServicePlugin from './libs/service.plugin';
import UtilsPlugin from './libs/utils.plugin';
import BaiduMap from 'vue-baidu-map';
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
// import "./mock/index.js";

import orderDetail from "./components/orderDetail";
import sourceDetail from "./components/sourceDetail";
import waybillDetail from "./components/waybillDetail";

Vue.use(ApiServicePlugin);
Vue.use(UtilsPlugin);
Vue.use(VueRouter);
Vue.use(iView);
Vue.use(BaiduMap, { ak: '960E5A4Ebf836d410f6319822d6d8450' });

Vue.component("orderDetail",orderDetail);
Vue.component("sourceDetail",sourceDetail);
Vue.component("waybillDetail",waybillDetail);

// 路由配置
const RouterConfig = {
    mode: 'hash',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (!getToken()) {
        next({
          path: '/common/homepage',
        })
      } else {
        next();
      }
    } else {
      next();
    }
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

window.VueRootInstance = new Vue({
    el: '#app',
    store,
    router: router,
    render: h => h(App)
});
