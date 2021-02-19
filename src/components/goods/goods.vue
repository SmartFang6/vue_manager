<template>
	<el-card class="box-card">
		<my-bread :list="['商品管理','商品列表']"></my-bread>
		<el-row>
			<el-col class="search_box">
				<el-input placeholder="请输入内容" v-model="query" @clear="clear" clearable class="input-with-select">
					<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
				</el-input>
				<el-button type="success" @click="$router.push({name:'goodsadd'})">添加商品</el-button>
			</el-col>
			<el-col>
				<el-table border :data="goodsList" height="520px" style="width: 100%">
					<el-table-column type="index" label="#" width="60">
					</el-table-column>
					<el-table-column prop="goods_name" label="商品姓名" width="560">
					</el-table-column>
					<el-table-column prop="goods_price" label="商品价格(元)" width="120">
					</el-table-column>
					<el-table-column prop="goods_weight" label="商品重量" width="120">
					</el-table-column>
					<el-table-column prop="add_time" label="创建日期">
						<template slot-scope="goodsList">{{goodsList.row.add_time | formatDate}}</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="goodsList">
							<el-button type="primary" size="mini" @click="editGoods(goodsList.row)" plain icon="el-icon-edit" circle></el-button>
							<el-button type="danger" size="mini" @click="dorpGoodsItem(goodsList.row)" plain icon="el-icon-delete" circle></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
 :page-sizes="[5, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</el-col>
		</el-row>
		<el-dialog title="编辑商品" @close="newGoodsInfo = {}" :visible.sync="showEditGoods">
			<el-form :model="newGoodsInfo">
				<el-form-item label="商品名称" label-width="110px">
					<el-input v-model="newGoodsInfo.goods_name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="价格" label-width="110px">
					<el-input v-model="newGoodsInfo.goods_price" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="数量" label-width="110px">
					<el-input v-model="newGoodsInfo.goods_number" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="重量" label-width="110px">
					<el-input v-model="newGoodsInfo.goods_weight" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="分类" label-width="110px">
					<el-checkbox-group v-model="newGoodsInfo.goods_cat">
						<el-checkbox label="1"></el-checkbox>
						<el-checkbox label="2"></el-checkbox>
						<el-checkbox label="3"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<!-- <el-form-item label="介绍" label-width="110px">
					<el-input type="textarea" :rows="8" v-model="newGoodsInfo.goods_introduce" autocomplete="off"></el-input>
				</el-form-item> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showEditGoods = false">取 消</el-button>
				<el-button type="primary" @click="confirmEditGoods">确 定</el-button>
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
				goodsList: [],
				newGoodsInfo: {
					goods_name: '',
					goods_price: '',
					goods_number: '',
					goods_weight: '',
					goods_introduce: '',
					id: '',
					goods_cat: []
				},
				showEditGoods: false,
				currentGoodsId: 0,
				pagenum: 1,
				pagesize: 8,
				total: 0,
				query: ''
			}
		},
		props: {},
		computed: {},
		created() {
			this._getGoodsData()
		}, 
		methods: {
			// 	async addGoods() {
			// 	this.newGoodsInfo.goods_cat = this.newGoodsInfo.goods_cat.join()
			// 	let res = await this.$http.post('goods', this.newGoodsInfo);
			// 	console.log(res)
			// 	let {
			// 		msg,
			// 		status
			// 	} = res.meta;
			// 	this.newGoodsInfo = {}
			// 	if (status === 201) {
			// 		this.$message.success(msg);
			// 		this._getGoodsData();
			// 		this.newGoodsInfo = {}
			// 	} else {
			// 		this.$message.error(msg)
			// 	}
			// 	this.showAddGoods = false
			// },
			dorpGoodsItem(item) {
				this.$confirm('删除此商品?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let res = await this.$http.delete('goods/' + item.goods_id);
					console.log(res)
					let {
						msg,
						status
					} = res.meta;
					if (status === 200) {
						this.$message.success(msg);
						this._getGoodsData()
					}
				})
			},
			editGoods(item) {
				let {
					goods_name,
					goods_price,
					goods_number,
					goods_weight,
					goods_introduce,
					goods_id: id,
					cat_one_id,
					cat_three_id,
					cat_two_id
				} = item;
				this.currentGoodsId = id;
				this.newGoodsInfo = {
					goods_name,
					goods_price,
					goods_number,
					goods_weight,
					goods_introduce,
					id,
					goods_cat:`${cat_one_id},${cat_two_id},${cat_three_id}`
				}
				this.showEditGoods = true;
			},
			async confirmEditGoods() {
				let {
					newGoodsInfo,
					currentGoodsId
				} = this;
				let res = await this.$http.put('goods/' + currentGoodsId, newGoodsInfo);
				console.log(res);
				this.showEditGoods = false;
				let {
					meta: {
						msg,
						status
					}
				} = res;
				this.newGoodsInfo = {}
				if (status === 200) {
					this.$message.success(msg)
					this._getGoodsData()
				} else {
					this.$message.error(msg)
				}

			},
			async _getGoodsData() {
				let {
					pagesize,
					query,
					pagenum
				} = this;
				let res = await this.$http.get(`goods?query=${query}&pagesize=${pagesize}&pagenum=${pagenum}`);
				let {
					data: {
						total,
						goods
					},
					meta: {
						status,
						msg
					}
				} = res;
				if (status === 200) {
					this.goodsList = goods;
					this.total = total;
				} else {
					this.$message.warning(msg)
				}
			},
			search() {
				this._getGoodsData()
			},
			clear() {
				this._getGoodsData()
			},
			handleSizeChange(val) {
				this.pagesize = val;
				this._getGoodsData()
			},
			handleCurrentChange(val) {
				this.pagenum = val;
				this._getGoodsData()
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
		margin: 10px 0;
	}
</style>
