<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
                <el-button style="float: right" type="primary" size="small">查询结果</el-button>
                <el-button style="float: right; margin-right: 15px" size="small">重置</el-button>
            </div>
            <div style="margin-top: 15px">
                <el-form :inline="true" size="small" label-width="140px">
                    <el-form-item label="输入搜索：">
                        <el-input style="width: 203px" placeholder="商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="商品货号：">
                        <el-input style="width: 203px" placeholder="商品货号"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类：">
                        <el-cascader clearable :options="productCateOptions"></el-cascader>
                    </el-form-item>
                    <el-form-item label="商品品牌：">
                        <el-select placeholder="请选择品牌" clearable>
                            <el-option></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上架状态：">
                        <el-select placeholder="全部" clearable>
                            <el-option></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核状态：">
                        <el-select placeholder="全部">
                            <el-option></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button class="btn-add" size="mini">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="productTable" style="width: 100%" border :data="list" v-loading="listLoading">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="商品图片" width="120" align="center">
                    <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
                </el-table-column>
                <el-table-column label="商品名称" align="center">
                    <template slot-scope="scope">
                        <p>{{ scope.row.name }}</p>
                        <p>品牌：{{ scope.row.brandName }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="价格/货号" width="120" align="center">
                    <template slot-scope="scope">
                        <p>价格：￥{{scope.row.price}}</p>
                        <p>货号：{{scope.row.productSn}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="标签" width="140" align="center">
                    <template slot-scope="scope">
                        <p>上架：
                            <el-switch
                                    @change="handlePublishStatusChange(scope.$index, scope.row)"
                                    :active-value="1"
                                    :inactive-value="0"
                                    v-model="scope.row.publishStatus"
                            ></el-switch>
                        </p>
                        <p>新品：
                            <el-switch
                                    @change="handleNewStatusChange(scope.$index, scope.row)"
                                    :active-value="1"
                                    :inactive-value="0"
                                    v-model="scope.row.newStatus"
                            ></el-switch>
                        </p>
                        <p>推荐：
                            <el-switch
                                @change="handleRecommendStatusChange(scope.$index, scope.row)"
                                :active-value="1"
                                :inactive-value="0"
                                v-model="scope.row.recommandStatus"
                            ></el-switch>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.sort}}</template>
                </el-table-column>
                <el-table-column label="SKU库存" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle=""></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="销量" width="100" align="center"></el-table-column>
                <el-table-column label="审核状态" width="100" align="center"></el-table-column>
                <el-table-column label="操作" width="160" align="center"></el-table-column>
            </el-table>
        </div>
        <div class="batch-operate-container">
            <el-select size="small" placeholder="批量操作">
                <el-option></el-option>
            </el-select>
            <el-button size="small" style="margin-left: 20px" class="search-button" type="primary">确定</el-button>
        </div>
        <div class="pagination-container">
            <el-pagination background
                           layout="total, sizes,prev, pager, next,jumper"
                           :page-sizes="[5,10,15]"
            ></el-pagination>
        </div>
        <el-dialog
            title="编辑货品信息"
            width="40%"
            :visible.sync="editSkuInfo.dialogVisible"
        >
            <span>商品货号：</span>
            <span>{{editSkuInfo.productSn}}</span>
            <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px;">
                <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
            </el-input>
            <el-table style="width: 100%;margin-top: 20px" :data="editSkuInfo.stockList" border>
                <el-table-column label="SKU编号" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.skuCode"></el-input>
                    </template>
                </el-table-column>
                <el-table-column v-for="(item,index) in editSkuInfo.productAttr" :label="item.name" :key="item.id" align="center">
                    <template slot-scope="scope">
                        {{getProductSkuSp(scope.row, index)}}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import {fetchList, updateNewStatus, updatePublishStatus, updateRecommendStatus} from "../../../api/product";
    import {fetchList as fetchSkuStockList} from "../../../api/skuStock";
    import {fetchList as fetchProductAttrList} from "../../../api/productAttr";

    export default {
        name: "productList",
        data(){
            return {
                editSkuInfo:{
                    dialogVisible:false,
                    productId:null,
                    productSn:'',
                    productAttributeCategoryId:null,
                    stockList:[],
                    productAttr:[],
                    keyword:null
                },
                productCateOptions:[{label: "1",value: "publishOn"},{label: "2",value: "publishOn"},{label: "3",value: "publishOn"}],
                list: null,
                listLoading: true,
                total:null
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.list = response.data.list;
                    this.total = response.data.total;
                })
            },
            updatePublishStatus(publishStatus, ids) {
                let params = new URLSearchParams();
                params.append('ids', ids);
                params.append('publishStatus', publishStatus);
                updatePublishStatus(params).then(() => {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    });
                });
            },
            handlePublishStatusChange(index, row) {
                let ids = [];
                ids.push(row.id);
                this.updatePublishStatus(row.publishStatus, ids);
            },
            handleNewStatusChange(index, row) {
                let ids = [];
                ids.push(row.id);
                this.updateNewStatus(row.newStatus, ids);
            },
            updateNewStatus(newStatus, ids) {
                let params = new URLSearchParams();
                params.append('ids', ids);
                params.append('newStatus', newStatus);
                updateNewStatus(params);
            },
            handleRecommendStatusChange(index, row) {
                let ids = [];
                ids.push(row.id);
                this.updateRecommendStatus(row.recommandStatus, ids);
            },
            updateRecommendStatus(recommendStatus, ids) {
                let params = new URLSearchParams();
                params.append('ids', ids);
                params.append('recommendStatus', recommendStatus);
                updateRecommendStatus(params).then(()=> {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    });
                })
            },
            handleShowSkuEditDialog(index, row) {
                this.editSkuInfo.dialogVisible=true;
                this.editSkuInfo.productId=row.id;
                this.editSkuInfo.productSn=row.productSn;
                this.editSkuInfo.productAttributeCategoryId=row.productAttributeCategoryId;
                this.editSkuInfo.keyword=null;
                fetchSkuStockList(row.id,{keyword:this.editSkuInfo.keyword}).then(response=>{
                    this.editSkuInfo.stockList=response.data;
                });
                fetchProductAttrList(row.productAttributeCategoryId, {type:0}).then(response=>{
                    this.editSkuInfo.productAttr=response.data.list;
                })
            },
            getProductSkuSp(row, index) {
                if(index === 0) {
                    return row.sp1;
                }else if(index === 1) {
                    return row.sp2;
                }else {
                    return row.sp3;
                }
            }
        }
    }
</script>

<style scoped>

</style>
