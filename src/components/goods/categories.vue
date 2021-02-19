<template>
	<div class="categories">
		<my-bread :list="['商品管理','商品分类']"></my-bread>
		<el-button type="success" class="btn" @click="addGoodsCate">添加分类</el-button>
		<el-table row-key="cat_id" :data="list" style="width: 100%" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
			<el-table-column prop="cat_name" label="分类名称" width="220">
			</el-table-column>
			<el-table-column label="级别" width="220">
				<template slot-scope="scope">
					{{scope.row.cat_level | formateLevel}}
				</template>
			</el-table-column>
			<el-table-column label="是否有效" width="280">
				<template slot-scope="scope">
					{{scope.row.cat_delete | formateEffect}}
				</template>
			</el-table-column>
			<el-table-column prop="role_name" label="操作">
				<template slot-scope="list">
					<el-button type="primary" size="mini" @click="editUser(list.row)" plain icon="el-icon-edit" circle></el-button>
					<el-button type="danger" size="mini" @click="dorpUser(list.row)" plain icon="el-icon-delete" circle></el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>
		<el-dialog title="添加分类" :visible.sync="showCateCard">
			<el-form :model="form">
				<el-form-item label="分类名称" label-width="120px">
					<el-input v-model="form.cat_name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="分类" label-width="120px">
					<el-cascader expand-trigger="hover" change-on-select v-model="selectedOptions" :props="defaultProp" :options="caslist" clearable></el-cascader>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showCateCard = false">取 消</el-button>
				<el-button type="primary" @click="addCate">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	let level = ['一级', '二级', '三级'];
	export default {
		name: 'categories',
		data() {
			return {
				pagenum: 1,
				list: [],
				total: 0,
				pagesize: 10,
				showCateCard: false,
				caslist: [],
				selectedOptions: [],
				defaultProp: {
					value: 'cat_id',
					label: 'cat_name',
					children: 'children'
				},
				form: {
					cat_name: '',
					cat_pid: -1,
					cat_level: -1
				}
			};
		},
		filters: {
			formateLevel(val) {
				return level[val]
			},
			formateEffect(val) {
				return val ? '无效' : '有效'
			}
		},
		created() {
			this.getGoodsCate()
		},
		methods: {
			async addCate() {
				if (this.form.cat_name.length === 0) {
					this.$message.error('请填写分类名称！')
					return;
				}
				switch (this.selectedOptions.length) {
					case 0:
						this.form.cat_pid = 0;
						break;
					case 1:
						this.form.cat_pid = this.selectedOptions[0];
						break;
					case 2:
						this.form.cat_pid = this.selectedOptions[1];
						break;
					default:
						break;
				}
				this.form.cat_level = this.selectedOptions.length;
				let res = await this.$http.post(`categories`, this.form);
				console.log(res);
				let {
					msg,
					status
				} = res.meta;
				if (status === 201) {
					this.$message.success(msg)
				} else {
					this.$message.warning(msg)
				}
				this.form = {}
				this.getGoodsCate()
				this.showCateCard = false;
			},
			async addGoodsCate() {
				//先获取二级分类
				let res = await this.$http.get(`categories?type=2`);
				this.caslist = res.data;
				this.showCateCard = true;
			},
			async getGoodsCate() {
				let res = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
				this.list = res.data.result;
				this.total = res.data.total;
			},
			handleSizeChange(val) {
				this.pagesize = val;
				this.pagenum = 1;
				this.getGoodsCate()
			},
			handleCurrentChange(val) {
				this.pagenum = val;
				this.getGoodsCate();
			}
		}
	}
</script>

<style scoped>
	.btn {
		margin: 10px 0;
	}
</style>
