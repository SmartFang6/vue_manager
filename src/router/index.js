import Vue from 'vue'
import VueRouter from 'vue-router'
import {Message} from 'element-ui'
import Login from '@/views/login'
import Home from '@/views/home'
import Users from '@/components/user/users'
import Defaults from '@/components/defaults/Defaults'
Vue.use(VueRouter)

const routes = [{
		path: '/login',
		name: 'login',
		component: Login
	},
	{
		path: '/',
		name: 'home',
		component: Home,
		redirect:'/default',
		children: [
			{
				name:'default',
				path:'default',
				component:Defaults
			},
			{
				name: 'users',
				path: 'users',
				component: Users
			},
			{
				name: 'rights',
				path: 'rights',
				component: () => import('@/components/rights/rights')
			},
			{
				name: 'roles',
				path: 'roles',
				component: () => import('@/components/roles/roles')
			},
			{
				name: 'goods',
				path: 'goods',
				component: () => import('@/components/goods/goods')
			},
			{
				name: 'params',
				path: 'params',
				component: () => import('@/components/params/params'),
			},
			{
				name: 'goodsadd',
				path: 'goodsadd',
				component: () => import('@/components/goods/goods-add')
			},
			{
				name: 'categories',
				path: 'categories',
				component: () => import('@/components/goods/categories')
			}
		]
	},
]


const router = new VueRouter({
	routes
})
router.beforeEach((to, from, next) => {
	let token = localStorage.getItem('token');
	if (to.name === 'login') {
		next()
	} else {
		if (!token) {
			Message.error('请先登录！');
			router.replace({
				name: 'login'
			})
			return;
		}
		next()
	}
})
export default router
