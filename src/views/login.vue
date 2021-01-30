<template>
	<div class="login">
		<div class="login-box">
			<el-form label-position="top" label-width="80px" :model="form">
				<h2>用户登录</h2>
				<el-form-item label="用户名">
					<el-input v-model="form.username"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="form.password"></el-input>
				</el-form-item>
				<el-button class="btn" type="primary" @click="login">登录</el-button>
			</el-form>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'login',
		data() {
			return {
				form: {
					username: '',
					password: '',
				}
			}
		},
		methods: {
			async login() {
				let res = await this.$http.post('login', this.form);
				const {
					data,
					meta: {
						msg,
						status
					}
				} = res;
				if (status == 200) {
					//本地保存后台返回的token
					localStorage.setItem('token',data.token)
					this.$message.success(msg);
					this.$router.push({
						name: 'home'
					})
				} else {
					this.$message.error(msg);
				}
			}
		},
	}
</script>
<style scoped>
	.login {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100vh;
		background: #324153;
	}

	.login-box {
		width: 38%;
		height: 350px;
		padding: 20px;
		background-color: #fff;
		border-radius: 10px;
	}

	.btn {
		width: 100%;
	}
</style>
