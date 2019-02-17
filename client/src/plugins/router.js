
import router from '../router'
import store from '../store'

router.beforeEach((to, from, next) => {
  if (to.path !== '/register' && !store.state.user.currentUser) {
    next('/register')
    return
  }
  next()
})