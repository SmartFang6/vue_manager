<template>
	<el-breadcrumb :separator="type">
		<el-breadcrumb-item class="home">首页</el-breadcrumb-item>
		<el-breadcrumb-item v-for="(item,i) in list" :key="i">{{item}}</el-breadcrumb-item>
	</el-breadcrumb>
</template>

<script>
	export default {
		name: 'my-bread',
		props: {
			type:{
				type:String,
				default:'/'
			},
			list:{
				type:Array
			}
		},
	}
</script>

<style scoped>
	.home {
		font-weight: bold;
	}
</style>
