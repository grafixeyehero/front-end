import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import Home from './components/Home.vue'
import Index from './components/Index.vue'
import Login from './components/Login.vue'
import CadastroFilme from './components/filme/CadastroFilme.vue'
import Dashboard from './components/Admin.vue'
import VueResource from 'vue-resource'
import VueVideoPlayer from 'vue-video-player'
import VeeValidate from 'vee-validate'
import Genero from './components/pesquisa/Genero.vue'
import Registrar from './components/Registrar.vue'

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.use(VueVideoPlayer)
Vue.use(VeeValidate)

const routes = [
  {
    path: '/login',
    component: Login,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/registrar',
    component: Registrar,
  },
  {
    path: '/',
    component: Index,
    redirect: '/home',
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'home',
        component: Home
      },
      {
        path: 'filme',
        component: CadastroFilme
      },
      {
        path: 'genero/:nome',
        component: Genero
      }
    ]
  },
  {
    path: '*',
    redirect: '/home'
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    let jwtDecode = require('jwt-decode')
    let token = localStorage.getItem('iflix-user-token')
    if (token !== null) {
      let decoded = jwtDecode(token)
      if ((decoded.exp - Math.round(new Date().getTime() / 1000) <= 0)) {
        localStorage.removeItem('iflix-user-token')
        next({
          path: '/login'
        })
      }
      else if (to.fullPath === '/login') {
        next({
          path: '/home'
        })
      }
      else {
        next()
      }
    }
    else {
      if (token === null && to.fullPath !== '/login') {
        next({
          path: '/login'
        })
      }
      else {
        next()
      }
    }
  }
  else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
