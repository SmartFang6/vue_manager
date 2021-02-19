<template>
	<el-container class="container">
		<el-header class="header">
			<el-row>
				<el-col :span="4">
					<div class="grid-content bg-purple">
						<img src="~@/assets/image/logo.png" alt="无法显示图片">
					</div>
				</el-col>
				<el-col :span="18">
					<h3>莱宠物电商购物管理系统</h3>
				</el-col>
				<el-col :span="2" class="exit">
					<el-button type="text" @click="exit">退出</el-button>
				</el-col>
			</el-row>
		</el-header>
		<el-container class="main">
			<el-aside class="el-aside" width="200px">
				<el-menu unique-opened router>
					<el-submenu :index="item.order+''" v-for="item in menuList" :key="item.id">
						<template slot="title">
							<!-- <i class="el-icon-user-solid"></i> -->
							<span>{{item.authName}}</span>
						</template>
						<el-menu-item :index="c.path" v-for="c in item.children" :key="c.id">
							<!-- <i class="el-icon-location"></i> -->
							<span>{{c.authName}}</span>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		name: 'home',
		components: {},
		data() {
			return {
				menuList: []
			};
		},
		created() {
			this._getMenuData()
		},
		computed: {},
		methods: {
			async _getMenuData() {
				//获取导航数据
				let res = await this.$http.get('menus');
				this.menuList = res.data;
			},
			exit() {
				this.$confirm('确定要退出登录吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message.success('退出成功！')
					this.$router.replace({
						name: 'login'
					})
					localStorage.removeItem('token');
				})
			}
		}
	}
</script>

<style scoped>
	.el-header {
		background-color: #B3C0D1;
		color: #333;
		height: 60px;
	}

	.bg-purple img {
		width: 60px;
		height: 60px;
	}

	.el-col-4,
	.el-col-18 {
		text-align: center;
	}

	.exit {
		margin: 10px 0;
	}

	.el-aside {
		height: calc(100vh - 60px);
		background-color: #D3DCE6;
		color: #333;
		text-align: center;
	}

	.el-menu {
		background-color: #D3DCE6;
	}

	.el-menu-item {
		background-color: #e1e1e1;
	}

	.el-submenu .el-submenu__title {
		padding-left: 0 !important;
	}

	.main {
		background-color: #E9EEF3;
		color: #333;
	}
</style>
