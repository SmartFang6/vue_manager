<template>
	<el-card class="box-card">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item class="home">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>内容管理</el-breadcrumb-item>
		</el-breadcrumb>
		<el-row>
			<el-col class="search_box">
				<el-input placeholder="请输入内容" v-model="query" class="input-with-select">
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
				<el-button type="success">搜索</el-button>
			</el-col>
			<el-col>
				<el-table :data="userList" style="width: 100%">
					<el-table-column type="index" label="#" width="60">
					</el-table-column>
					<el-table-column prop="username" label="姓名" width="120">
					</el-table-column>
					<el-table-column prop="email" label="邮箱" width="180">
					</el-table-column>
					<el-table-column prop="mobile" label="电话" width="180">
					</el-table-column>
					<el-table-column prop="create_time" label="创建日期">
						<template slot-scope="userList">{{userList.row.create_time | formatDate}}</template>
					</el-table-column>
					<el-table-column prop="mg_state" label="用户状态">
						<template slot-scope="userList">
							<el-switch v-model="userList.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
							</el-switch>
						</template>
					</el-table-column>
					<el-table-column prop="role_name" label="操作">
						<template slot-scope="">
							<el-button type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
							<el-button type="success" size="mini" plain icon="el-icon-check" circle></el-button>
							<el-button type="danger" size="mini" plain icon="el-icon-delete" circle></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[1,2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</el-col>
		</el-row>
	</el-card>
</template>
<script>
	export default {
		name: 'users',
		components: {},
		data() {
			return {
				userList: [],
				pagenum: 1,
				pagesize: 1,
				query: '',
				total: 0,
			}
		},
		props: {},
		computed: {},
		created() {
			this._getUserData()
		},
		methods: {
			async _getUserData() {
				let {
					pagesize,
					query,
					pagenum
				} = this;
				let res = await this.$http.get(`users?query=${query}&pagesize=${pagesize}&pagenum=${pagenum}`)
				console.log(res)
				let {
					data: {
						total,
						users
					},
					meta: {
						status,
						msg
					}
				} = res;
				if (status == 200) {
					this.userList = users;
					this.$message.success(msg)
					console.log(pagenum, total)
					this.total = total;
				} else {
					this.$message.warning(msg)
				}
			},
			handleSizeChange(val) {
				this.pagesize = val;
				this._getUserData()
			},
			handleCurrentChange(val) {
				this.pagenum = val;
				this._getUserData()
			}
		}
	}
</script>

<style scoped>
	.box-card {
		height: calc(100% - 20px);
	}

	.home {
		font-weight: bold;
	}

	.search_box {
		display: flex;
		width: 400px;
		margin-top: 10px;
	}
</style>
