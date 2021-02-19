<template>
	<el-card>
		<my-bread :list="['权限管理','角色列表']"></my-bread>
		<el-row class="role-list">
			<el-col>
				<el-button type="info">添加角色</el-button>
			</el-col>
			<el-col>
				<el-table :data="rolesList" style="width: 100%">
					<el-table-column type="expand">
						<template slot-scope="rolesList">
							<div v-if="rolesList.row.children.length === 0">
								暂未分配权限
							</div>
							<el-row v-else v-for="(parent,i) in rolesList.row.children" :key="i" class="parent-row">
								<el-col :span="4">
									<el-tag @close="deleteRole(rolesList.row,parent.id)" closable>{{parent.authName}}</el-tag>
									<i class="el-icon-arrow-right"></i>
								</el-col>
								<el-col :span="20">
									<el-row class="son-row" v-for="son in parent.children" :key="son.id">
										<el-col :span="4">
											<el-tag @close="deleteRole(rolesList.row,son.id)" closable type="success">{{son.authName}}</el-tag>
											<i class="el-icon-arrow-right"></i>
										</el-col>
										<el-col :span="20">
											<el-tag @close="deleteRole(rolesList.row,grandson.id)" closable class="grandson" v-for="grandson in son.children"	 :key="grandson.id" type="warning">{{grandson.authName}}</el-tag>
										</el-col>
									</el-row>
								</el-col>
							</el-row>
						</template>
					</el-table-column>
					<el-table-column type="index" label="#" width="60">
					</el-table-column>
					<el-table-column prop="roleName" label="角色名称" width="120">
					</el-table-column>
					<el-table-column prop="roleDesc" label="角色描述">
					</el-table-column>
					<el-table-column prop="role_name" label="操作">
						<template slot-scope="rolesList">
							<el-button type="primary" size="mini" @click="showSetUserRole(rolesList.row)" plain icon="el-icon-edit" circle></el-button>
							<el-button type="danger" size="mini" @click="dorpUser(rolesList.row)" plain icon="el-icon-delete" circle></el-button>
							<el-button type="success" size="mini" @click="showSetUserRole(rolesList.row)" plain icon="el-icon-check" circle></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
		<el-dialog title="修改权限" :visible.sync="showUserRole" @close="selectedArr=[]">
			<el-tree ref="tree" :data="allRoles" show-checkbox node-key="id" default-expand-all :default-checked-keys="selectedArr" :props="defaultProps">
			</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showUserRole = false;selectedArr=[]">取 消</el-button>
				<el-button type="primary" @click="confirmSetUserRole">确 定</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>
<script>
	export default {
		name: 'roles',
		components: {},
		data() {
			return {
				rolesList: [],
				showUserRole: false,
				allRoles: [],
				defaultProps: {
					children: 'children',
					label: 'authName'
				},
				selectedArr: [],
				currRoleId: -1
			};
		},
		created() {
			this._getRolesData()
		},
		methods: {
			async deleteRole(item, rightId) {
				//删除数据
				let res = await this.$http.delete(`roles/${item.id}/rights/${rightId}`);
				//更新视图
				item.children = res.data;
			},
			dorpUser(item) {
				this.$confirm('删除用户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let res = await this.$http.delete('roles/' + item.id)
					let {
						msg,
						status
					} = res.meta;
					if (status === 200) {
						this.$message.success(msg);
						this._getRolesData()
					}
				})
			},
			selectedIdPushArr(data) { //递归把所有的id都放进一个数组中！
				data.forEach(v => {
					if (v.children) {
						this.selectedIdPushArr(v.children)
					} else {
						this.selectedArr.push(v.id)
					}
				})
			},
			async showSetUserRole(item) {
				let res = await this.$http.get('rights/tree');
				let data = res.data;
				this.allRoles = data;
				this.selectedIdPushArr([item])
				this.currRoleId = item.id;
				this.showUserRole = true;
			},
			async confirmSetUserRole() {
				let rids = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
				let res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
					rids: rids.join(',')
				})
				console.log(res);
				let {
					msg,
					status
				} = res.meta;
				if (status === 200) {
					this.$message.success(msg)
				} else {
					this.$message.error(msg)
				}
				this.selectedArr = [];
				this.showUserRole = false;
			},
			async _getRolesData() {
				let res = await this.$http.get('roles');
				let {
					data,
					meta: {
						msg,
						status
					}
				} = res;
				if (status == 200) {
					this.rolesList = data;
					this.$message.success(msg)
				} else {
					this.$message.error(msg)
				}
			}
		}
	}
</script>

<style scoped>
	.role-list {
		margin-top: 20px;
	}

	.parent-row {
		margin: 5px 0;
	}

	.son-row {
		margin-bottom: 5px;
	}

	.grandson {
		margin-left: 5px;
	}

	.el-tag {
		margin-right: 10px;
	}
</style>
