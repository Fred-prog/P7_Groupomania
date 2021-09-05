import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Wall from '../views/Wall.vue'
import OnePost from '../components/OnePost.vue';
import RecentPost from '../views/RecentPost.vue';
import Account from '../components/Account.vue';
import AllAccounts from '../components/AllAccounts';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Account/:id',
    name: 'Account',
    component: Account,
  },

  {
    path: '/Wall',
    name: 'Wall',
    component: Wall
  },
  {
    path: '/posts/:id',
    name: 'OnePost',
    component: OnePost,
    
  },
  {
    path: '/RecentPost/:id',
    name: 'RecentPost',
    component: RecentPost,
    
  },

  {
    path: '/AllAccounts',
    name: 'AllAccounts',
    component: AllAccounts,
    
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
