<template>
	<el-card>
		<el-row>
			<el-col>
				<my-bread :list="['商品管理','商品列表']"></my-bread>
			</el-col>
			<el-col>
				<el-alert center title="添加商品信息" show-icon type="success">
				</el-alert>
			</el-col>
			<el-col>
				<el-steps :active="1*active" align-center finish-status="success">
					<el-step title="基本信息"></el-step>
					<el-step title="商品参数"></el-step>
					<el-step title="商品属性"></el-step>
					<el-step title="商品图片"></el-step>
					<el-step title="商品内容"></el-step>
				</el-steps>
			</el-col>
			<el-col>
				<el-form label-position="top" label-width="80px" style="overflow: auto;height: 460px;" :model="form">
					<el-tabs @tab-click="changeTabs()" v-model="active" tab-position="left">
						<el-tab-pane label="基本信息" name="1">
							<el-form-item label="商品名称" label-width="110px">
								<el-input v-model="form.goods_name" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="商品价格" label-width="110px">
								<el-input v-model="form.goods_price" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="商品数量" label-width="110px">
								<el-input v-model="form.goods_number" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="商品重量" label-width="110px">
								<el-input v-model="form.goods_weight" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="分类列表" label-width="110px">
								<el-cascader clearable v-model="selectedOptions" :options="options" :props="defaultProps" @change="handleChange"></el-cascader>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="商品参数" name="2">
							<el-form-item :label="item.attr_name" v-for="item in arrTyData" :key="item.id">
								<el-checkbox-group v-model="item.attr_vals">
									<el-checkbox border v-for="(c,index) in item.attr_vals" :key="index" :label="c"></el-checkbox>
								</el-checkbox-group>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="商品属性" name="3">
							<el-form-item :label="item.attr_name" v-for="item in arrStaticParams" :key="item.attr_id">
								<el-input v-model="item.attr_vals"></el-input>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="商品图片" name="4">
							<el-form-item>
								<el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :headers="headers" :on-preview="handlePreview"
 :on-remove="handleRemove" :file-list="fileList" list-type="picture" :on-success="handleSuccess">
									<el-button size="small" type="primary">点击上传</el-button>
									<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
								</el-upload>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="商品内容" name="5">
							<el-form-item>
								<el-button type="primary" @click="addGoods" style="margin-bottom: 10px;">添加商品</el-button>
								<quillEditor v-model="form.goods_introduce"> </quillEditor>
							</el-form-item>
						</el-tab-pane>
					</el-tabs>
				</el-form>
			</el-col>
		</el-row>
	</el-card>
</template>

<script>
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import {
		quillEditor
	} from 'vue-quill-editor'
	export default {
		name: 'goodsadd',
		components: {quillEditor},
		data() {
			return {
				active: "1",
				form: {
					goods_name: '',
					goods_cat: '',
					goods_price: '',
					goods_number: '',
					goods_weight: '',
					goods_introduce: '',
					pics: [],
					attrs: []
				},
				defaultProps: {
					label: 'cat_name',
					value: 'cat_id',
					children: 'children'
				},
				selectedOptions: [],
				options: [],
				arrTyData: [],
				arrStaticParams: [],
				headers: {
					Authorization: localStorage.getItem('token')
				},
				fileList: []
			};
		},
		created() {
			this.getThreeData()
		},
		methods: {
			async addGoods(){
				let arr1 = this.arrTyData.map(item=>{
					return {
						attr_id:item.attr_id,
						attr_value:Array.isArray(item.attr_vals)?item.attr_vals.join(','):item.attr_vals
					}
				})
				let arr2 = this.arrStaticParams.map(item=>{
					return {
						attr_id:item.attr_id,
						attr_value:Array.isArray(item.attr_vals)?item.attr_vals.join(','):item.attr_vals
					}
				})
				this.form.attrs = [...arr1,...arr2]
				console.log(this.form);
				let res = await this.$http.post(`goods`,this.form);
				console.log(res);
				let {msg,status} = res.meta;
				this.$message(msg)
				if(status===201){
					this.$router.push({name:'goods'})
				}
			},
			handlePreview(file) {
				console.log(file)
			},
			handleRemove(file) {
				let index = this.form.pics.findIndex(item=>item.pic == file.response.data.tmp_path)
				this.form.pics.splice(index,1)
			},
			handleSuccess(file) {
				this.form.pics.push({
					pic:file.data.tmp_path
				})
			},
			async changeTabs() {
				if (this.active == "2") {
					if (this.selectedOptions.length !== 3) {
						this.$message.warning('请先选择三级分类！')
						return
					}
					let res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
					res.data.map(i => {
						i.attr_vals = i.attr_vals.length === 0 ? [] : i.attr_vals.split(',')
					})
					this.arrTyData = res.data;
					// attr_name: "版式"
					// attr_sel: "many"
					// attr_vals:
				} else if (this.active == '3') {
					if (this.selectedOptions.length !== 3) {
						this.$message.warning('请先选择三级分类！')
						return
					}
					let res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
					this.arrStaticParams = res.data;

				}
			},
			handleChange() {
				this.form.goods_cat = this.selectedOptions.toString();
			},
			//获取三级分类数据
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
	.el-alert--success {
		margin: 10px 0;
	}
	::v-deep .ql-editor  {
		min-height: 280px;
	}
</style>
