<template>
	<div class="welcome">
		欢迎来到管理系统
	</div>
</template>
<script>
	export default{
		name:'default',
		data(){
			return {}
		},
		async created() {
			//正常应该有一个判断登录是否过期的接口
			// let res = await this.$http.get(`users?query=''&pagesize=1&pagenum=1`);
			// console.log(res)
			// if(res.meta.status === 400){
			// 	this.$message.warning('登录已过期，请重新登录');
			// 	localStorage.clear();
			// 	this.$router.replace({name:'login'})
			// }
		}
	}
</script>
<style scoped>
	.welcome{
		font-weight: bold;
		text-align: center;
	}
</style>
