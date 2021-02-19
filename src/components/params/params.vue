<template>
	<el-card class="box-card">
		<my-bread :list="['商品管理','分类参数']"></my-bread>
		<el-alert class="alert" title="只允许为第三级分类设置参数" type="error">
		</el-alert>
		<el-form label-position="left">
			<el-form-item label="商品名称">
				<el-cascader :show-all-levels="false" clearable v-model="selectedOptions" :options="options" :props="defaultProps" @change="handleChange"></el-cascader>
			</el-form-item>
		</el-form>
		<el-tabs v-model="active" @tab-click="handleClick">
			<el-tab-pane label="动态参数" name="1">
				<el-button type="danger" @click="showAddDyParamCart">设置动态参数</el-button>
				<el-table :data="arrDyparams" style="width: 100%">
					<el-table-column type="expand" label="#">
						<template slot-scope="scope">
							<el-tag :key="tag" v-for="tag in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row,tag)">
								{{tag}}
							</el-tag>
							<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"  @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
							</el-input>
							<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
						</template>
					</el-table-column>
					<el-table-column label="属性名称" prop="attr_name">
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" @click="editDyParams(scope.row)" plain icon="el-icon-edit" circle></el-button>
							<el-button type="danger" size="mini" @click="dorpDyParams(scope.row,scope.$index)" plain icon="el-icon-delete" circle></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="静态参数" name="2">
				<el-button type="danger" @click="showAddStaticParamCart">设置静态参数</el-button>
				<el-table :data="arrStaticParams" style="width: 100%">
					<el-table-column type="index" label="#">
					</el-table-column>
					<el-table-column label="属性名称" prop="attr_name">
					</el-table-column>
					<el-table-column label="属性值" prop="attr_vals">
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" @click="editStaticParams(scope.row)" plain icon="el-icon-edit" circle></el-button>
							<el-button type="danger" size="mini" @click="dorpStaticParams(scope.row,scope.$index)" plain icon="el-icon-delete" circle></el-button>
						</template>
					</el-table-column>
				</el-table> 
			</el-tab-pane>
		</el-tabs>
		<el-dialog title="添加动态参数" :visible.sync="showAddDyParam">
			<el-form :model="addPostDyParams">
				<el-form-item label="参数名称" label-width="110px">
					<el-input v-model="addPostDyParams.attr_name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="参数值" label-width="110px">
					<el-input v-model="addPostDyParams.attr_vals" placeholder="请以逗号分隔不同参数值" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showAddDyParam = false">取 消</el-button>
				<el-button type="primary" @click="addDyParam">确 定</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>
<script>
	export default {
		name: 'params',
		components: {},
		data() {
			return {
				selectedOptions: [],
				options: [],
				defaultProps: {
					label: 'cat_name',
					value: 'cat_id',
					children: 'children'
				},
				arrDyparams: [],
				arrStaticParams:[],
				active: "1",
				tableData: [],
				inputVisible: false,
				inputValue: '',
				showAddDyParam: false,
				addPostDyParams: {
					attr_name: '',
					attr_sel: 'many',
					attr_vals: ''
				}
			}
		},
		props: {},
		computed: {},
		created() {
			this.getThreeData()
		},
		methods: {
			showAddStaticParamCart(){
				
			},
			showAddDyParamCart() {
				if (this.selectedOptions.length !== 3) {
					this.$message.error('请先选择三级分类')
					return;
				}
				this.showAddDyParam = true;
			},
			async addDyParam() {
				let res = await this.$http.post(`categories/${this.selectedOptions[2]}/attributes`, this.addPostDyParams);
				console.log(res)
				let {msg,status} = res;
				if(status === 201){
					this.$message.success(msg)
					this.showAddDyParam = false;
					location.reload()
				}else{
					this.$message.error(msg)
				}
			},
			async dorpStaticParams(item,index) {
				let res = await this.$http.delete(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`)
				let {
					msg,
					status
				} = res.meta;
				if (status === 200) {
					this.arrStaticParams.splice(index,1)
					this.$message(msg)
				}
			},
			async dorpDyParams(item,index) {
				let res = await this.$http.delete(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`)
				let {
					msg,
					status
				} = res.meta;
				if (status === 200) {
					this.arrDyparams.splice(index,1)
					this.$message(msg)
				}
			},
			handleClose(item, tag) {
				item.attr_vals.splice(item.attr_vals.indexOf(tag), 1);
				let putParams = {
					attr_name: item.attr_name,
					attr_sel: 'many',
					attr_vals: item.attr_vals.join(',')
				}
				this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`, putParams)
			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick(() => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputConfirm(item) {
				let inputValue = this.inputValue;
				if (inputValue) {
					item.attr_vals.push(inputValue);
					let putParams = {
						attr_name: inputValue,
						attr_sel: 'many',
						attr_vals: item.attr_vals.join(',')
					}
					this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`, putParams)
				}

				this.inputVisible = false;
				this.inputValue = '';
			},
			async handleClick() {
				// if(this.active === '2' && this.selectedOptions.length === 3){
				// 	let res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
				// 	this.arrStaticParams = res.data;
				// }else{
				// 	this.$message.error('请先选择三级分类！')
				// }
			},
			async handleChange() {
				if (this.selectedOptions.length === 3) {
					let res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
					let staticParams = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
					this.arrStaticParams = staticParams.data;
					res.data.map(i => {
						i.attr_vals = i.attr_vals.length === 0 ? [] : i.attr_vals.split(',')
					})
					this.arrDyparams = res.data;
				}else{
					this.$message.error('请先选择三级分类！')
				}
			},
			async getThreeData() {
				let res = await this.$http.get('categories?type=3');
				let {
					data,
					meta: {
						status
					}
				} = res;
				if (status === 200) {
					this.options = data;
				}
			}
		}
	}
</script>

<style scoped>
	.alert {
		margin: 10px 0;
	}

	.goods-name {
		margin-right: 10px;
	}
</style>
