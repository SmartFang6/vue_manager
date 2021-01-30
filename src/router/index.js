import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Users from '@/components/user/users'
Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    name:'login',
    component:Login
  },
  {
    path: '/',
		name:'home',
		component:Home,
		children:[
			{
				name:'users',
				path:'users',
				component:Users
			}
		]
  },
]

const router = new VueRouter({
  routes
})

export default router
