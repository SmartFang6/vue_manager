<template>
	<el-card class="box-card">
		<my-bread :list="['用户管理','内容管理']"></my-bread>
		<el-row>
			<el-col class="search_box">
				<el-input placeholder="请输入内容" v-model="query" @clear="clear" clearable class="input-with-select">
					<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
				</el-input>
				<el-button type="success" @click="showAddUser = true">添加用户</el-button>
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
							<el-switch v-model="userList.row.mg_state" @change="switchStatus(userList.row)" active-color="#13ce66" inactive-color="#ff4949">
							</el-switch>
						</template>
					</el-table-column>
					<el-table-column prop="role_name" label="操作">
						<template slot-scope="userList">
							<el-button type="primary" size="mini" @click="editUser(userList.row)" plain icon="el-icon-edit" circle></el-button>
							<el-button type="danger" size="mini" @click="dorpUser(userList.row)" plain icon="el-icon-delete" circle></el-button>
							<el-button type="success" size="mini" @click="showSetUserRole(userList.row)" plain icon="el-icon-check" circle></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"				 :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</el-col>
		</el-row>
		<el-dialog title="添加用户" :visible.sync="showAddUser">
			<el-form :model="newUserInfo">
				<el-form-item label="用户名" label-width="110px">
					<el-input v-model="newUserInfo.username" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" label-width="110px">
					<el-input v-model="newUserInfo.password" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" label-width="110px">
					<el-input v-model="newUserInfo.mobile" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" label-width="110px">
					<el-input v-model="newUserInfo.email" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showAddUser = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改用户信息" @close="newUserInfo = {}" :visible.sync="showEditUser">
			<el-form :model="newUserInfo">
				<el-form-item label="用户名" label-width="110px">
					<el-input v-model="newUserInfo.username" disabled autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" label-width="110px">
					<el-input v-model="newUserInfo.mobile" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" label-width="110px">
					<el-input v-model="newUserInfo.email" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showEditUser = false">取 消</el-button>
				<el-button type="primary" @click="confirmEditUser">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="分配角色" :visible.sync="showUserRole">
			<el-form :model="newUserInfo">
				<el-form-item label="用户名" label-width="110px">
					{{currRoleName}}
				</el-form-item>
				<el-form-item label="角色" label-width="110px">
				<el-select v-model="currentRoleId" placeholder="请选择活动区域">
					<el-option label="请选择" :value="-1" disabled></el-option>
					<el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showUserRole = false">取 消</el-button>
				<el-button type="primary" @click="confirmSetUserRole">确 定</el-button>
			</div>
		</el-dialog>
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
				pagesize: 2,
				query: '',
				total: 0,
				showAddUser: false,
				newUserInfo: {
					username: '',
					password: '',
					mobile: '',
					email: ''
				},
				showEditUser: false,
				currentUserId: 0,
				currentRoleId:-1,
				showUserRole:false,
				currRoleName:'',
				rolesList:[]
			}
		},
		props: {},
		computed: {},
		created() {
			this._getUserData()
		},
		methods: {
			async showSetUserRole(item){
				this.currRoleName = item.username;
				let id = item.id;
				this.currentUserId = id;
				let roles = await this.$http.get('roles');
				this.rolesList = roles.data;
				let res = await	this.$http.get('users/'+id);
				this.currentRoleId = res.data.rid;
				console.log(res.data.rid)
				this.showUserRole = true;
			},
			async confirmSetUserRole(){
				let id = this.currentUserId;
				let res = await this.$http.put(`users/${id}/role`,{rid:this.currentRoleId});
				let {status,msg} = res.meta;
				this.showUserRole = false;
				if(status === 200){
					this.$message.success(msg)
				}else{
					this.$message.error(msg)
				}
			},
			async switchStatus(item){
				let {id,mg_state} = item;
				let res = await	this.$http.put(`users/${id}/state/${mg_state}`);
				let {msg,status} = res.meta;
				if(status === 200){
					this.$message.success(msg)
				}else{
					this.$message.error(msg)
				}
			},
			dorpUser(item) {
				this.$confirm('删除用户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let res = await this.$http.delete('users/' + item.id)
					let {
						msg,
						status
					} = res.meta;
					if (status === 200) {
						this.$message.success(msg);
						this._getUserData()
					}
				})
			},
			editUser(item) {
				let {
					username,
					email,
					mobile,
					id
				} = item;
				this.currentUserId = id;
				this.newUserInfo = {
					username,
					mobile,
					email
				}
				this.showEditUser = true;
			},
			async confirmEditUser() {
				let {
					newUserInfo,
					currentUserId
				} = this;
				let res = await this.$http.put('users/' + currentUserId, newUserInfo);
				this.showEditUser=false;
				let {meta:{msg,status}} = res;
				this.newUserInfo = {}
				if(status === 200){
					this.$message.success(msg)
					this._getUserData()	
				}else{
					this.$message.error(msg)
				}

			},
			async addUser() {
				let res = await this.$http.post('users', this.newUserInfo);
				let {
					msg,
					status
				} = res.meta;
				if (status === 201) {
					this.$message.success(msg);
					this._getUserData();
					this.newUserInfo = {}
				} else {
					this.$message.error(msg)
				}
				this.showAddUser = false
			},
			async _getUserData() {
				let {
					pagesize,
					query,
					pagenum
				} = this;
				let res = await this.$http.get(`users?query=${query}&pagesize=${pagesize}&pagenum=${pagenum}`)
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
				if (status === 200) {
					this.userList = users;
					// this.$message.success(msg)
					this.total = total;
				} else {
					this.$message.warning(msg)
				}
			},
			search() {
				this._getUserData()
			},
			clear() {
				this._getUserData()
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

	

	.search_box {
		display: flex;
		width: 400px;
		margin-top: 10px;
	}
</style>
