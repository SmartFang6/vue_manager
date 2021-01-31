<template>
	<el-card class="card-box">
		<my-bread :list="['权限管理','权限列表']"></my-bread>
		<el-table class="table" height="500px" :data="rightsList" border>
			<el-table-column type="index" label="#" width="60">
			</el-table-column>
			<el-table-column prop="authName" label="权限姓名" width="180">
			</el-table-column>
			<el-table-column prop="path" label="路径">
			</el-table-column>
			<el-table-column prop="level" label="层级">
				<template slot-scope="rightsList">
					{{rightsList.row.level | formatLevel}}
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
	let levelArr = ['一', '二', '三', '四', '五']
	export default {
		name: 'rights',
		components: {},
		filters: {
			formatLevel(num) {
				return levelArr[num] + '层'
			}
		},
		data() {
			return {
				rightsList: []
			};
		},
		methods: {
			async _getRightsData() {
				let res = await this.$http.get('rights/list');
				console.log(res)
				this.rightsList = res.data;
			}
		},
		created() {
			this._getRightsData()
		},
	}
</script>

<style scoped>
	.card-box {
		/* height: calc(100vh - 100px);
		overflow-y: scroll; */
	}

	.table {
		margin-top: 20px;
		width: 100%
	}
</style>
