import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// Pages
const RegisterPage = () =>
import(/* webpackChunkName: "register" */ "./views/register.vue");


const routes = [
  {
    path: '/register',
    component: RegisterPage
  }
]


export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
