import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// Pages
const RegisterPage = () =>
  import(/* webpackChunkName: "register" */ "./views/register.vue");
const ListPage = () =>
  import(/* webpackChunkName: "list" */ "./views/list.vue");
const ChatPage = () =>
  import(/* webpackChunkName: "chat" */ "./views/chat.vue");

const routes = [
  {
    path: "/register",
    component: RegisterPage
  },
  {
    path: "/",
    component: ListPage,
    beforeEnter: (to, from, next) => {
      if (to.query.chat) {
        next(`/chat/${to.query.chat}`);
        return;
      }
      next();
    }
  },
  {
    path: "/chat/:id",
    component: ChatPage
  }
];

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
