<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
                <el-button style="float: right" type="primary" size="small" @click="handleSearchList()">查询搜索</el-button>
                <el-button style="float: right; margin-right: 15px;" size="small" @click="handleResetSearch()">重置</el-button>
            </div>
            <div style="margin-top: 15px">
                <el-form :model="listQuery" :inline="true" size="small" label-width="140px">
                    <el-form-item label="商品名称：">
                        <el-input v-model="listQuery.productName" class="input-width" placeholder="商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="推荐状态：">
                        <el-select v-model="listQuery.recommendStatus" placeholder="全部" clearable class="input-width">
                            <el-option v-for="item in recommendOptions"
                                       :value="item.value"
                                       :label="item.label"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button size="mini" class="btn-add" @click="handleSelectProduct()">选择商品</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="newProductTable"
                      style="width: 100%;"
                      :data="list"
                      v-loading="listLoading"
                      @selection-change="handleSelectionChange"
                      border>
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="编号" width="120" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="商品名称" align="center">
                    <template slot-scope="scope">{{scope.row.productName}}</template>
                </el-table-column>
                <el-table-column label="是否推荐" width="200" align="center">
                    <template slot-scope="scope">
                        <el-switch :active-value="1"
                                   @change="handleRecommendStatusStatusChange(scope.$index, scope.row)"
                                   v-model="scope.row.recommendStatus"
                                   :inactive-value="0"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="160" align="center">
                    <template slot-scope="scope">{{scope.row.sort}}</template>
                </el-table-column>
                <el-table-column label="状态" width="160" align="center">
                    <template slot-scope="scope">{{scope.row.recommendStatus|formatRecommendStatus}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleEditSort(scope.$index, scope.row)" size="mini" type="text">设置排序</el-button>
                        <el-button @click="handleDelete(scope.$index, scope.row)" size="mini" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="batch-operate-container">
            <el-select v-model="operateType" size="small" placeholder="批量操作">
                <el-option v-for="item in operates"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-button @click="handleBatchOperate()" style="margin-left: 20px;" class="search-button" type="primary" size="small">确定</el-button>
        </div>
        <div class="pagination-container">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="listQuery.pageSize"
                :total="total"
                :current-page.sync="listQuery.pageNum"
                :page-sizes="[5,10,15]"
                layout="total, sizes,prev, pager, next,jumper"
            ></el-pagination>
        </div>
        <el-dialog title="设置排序" :visible.sync="sortDialogVisible" width="40%">
            <el-form :model="sortDialogData" label-width="150px">
                <el-form-item label="排序：">
                    <el-input v-model="sortDialogData.sort" style="width: 200px;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="sortDialogVisible=false" size="small">取 消</el-button>
                <el-button @click="handleUpdateSort" size="small" type="primary">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择商品" :visible.sync="selectDialogVisible" width="50%">
            <el-input v-model="dialogData.listQuery.keyword" style="width: 250px; margin-bottom: 20px" size="small" placeholder="商品名称搜索">
                <el-button slot="append" icon="el-icon-search" @click="handleSelectSearch()"></el-button>
            </el-input>
            <el-table :data="dialogData.list" border @selection-change="handleDialogSelectionChange">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="商品名称" align="center">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="货号" align="center" width="160">
                    <template slot-scope="scope">NO.{{scope.row.productSn}}</template>
                </el-table-column>
                <el-table-column label="价格" align="center" width="120">
                    <template slot-scope="scope">￥{{scope.row.price}}</template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination background
                               layout="prev, pager, next"
                               :current-page.sync="dialogData.listQuery.pageNum"
                               :page-size="dialogData.listQuery.pageSize"
                               :page-sizes="[5,10,15]"
                               :total="dialogData.total"
                               @current-change="handleDialogCurrentChange"
                               @size-change="handleDialogSizeChange"></el-pagination>
            </div>
            <div style="clear: both;"></div>
            <div slot="footer">
                <el-button size="small" @click="selectDialogVisible=false">取 消</el-button>
                <el-button size="small" type="primary" @click="handleSelectDialogConfirm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import {
        createHotProduct,
        deleteHotProduct,
        fetchList,
        updateHotProductSort,
        updateRecommendStatus
    } from "../../../api/hotProduct";
    import {fetchList as fetchProductList} from '../../../api/product';

    const defaultListQuery = {
        pageNum: 1,
        pageSize: 5,
        productName: null,
        recommendStatus: null
    };
    const defaultRecommendOptions = [
        {
            label: '未推荐',
            value: 0
        },
        {
            label: '推荐中',
            value: 1
        }
    ];

    export default {
        name: "hotProductList",
        data() {
            return{
                listQuery: Object.assign({}, defaultListQuery),
                recommendOptions: Object.assign({}, defaultRecommendOptions),
                list: null,
                total: null,
                listLoading: false,
                multipleSelection:[],
                operates: [
                    {
                        label: "设为推荐",
                        value: 0
                    },
                    {
                        label: "取消推荐",
                        value: 1
                    },
                    {
                        label: "删除",
                        value: 2
                    }
                ],
                operateType: null,
                selectDialogVisible:false,
                dialogData:{
                    list: null,
                    total: null,
                    multipleSelection:[],
                    listQuery:{
                        keyword: null,
                        pageNum: 1,
                        pageSize: 5
                    }
                },
                sortDialogVisible:false,
                sortDialogData:{sort:0,id:null}
            }
        },
        created() {
            this.getList();
        },
        filters: {
            formatRecommendStatus(status) {
                if(status === 1) {
                    return '推荐中';
                }else {
                    return '未推荐';
                }
            }
        },
        methods: {
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response=>{
                    this.listLoading = false;
                    this.list = response.data.list;
                    this.total = response.data.total;
                })
            },
            handleSizeChange(val){
                this.listQuery.pageSize=val;
                this.listQuery.pageNum = 1;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum = val;
                this.getList();
            },
            handleResetSearch() {
                this.listQuery = Object.assign({}, defaultListQuery);
            },
            handleSearchList(){
                this.listQuery.pageNum = 1;
                this.getList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleBatchOperate() {
                if(this.multipleSelection.length < 1) {
                    this.$message({
                        message: '请选择一条记录',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }

                let ids = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].id);
                }

                if(this.operateType === 0) {
                    this.updateRecommendStatusStatus(ids,1);
                }else if(this.operateType === 1) {
                    this.updateRecommendStatusStatus(id, 0);
                }else if(this.operateType === 2) {
                    this.deleteProduct(ids);
                }else {
                    this.$message({
                        message: '请选择批量操作类型',
                        type: 'warning',
                        duration: 1000
                    });
                }
            },
            updateRecommendStatusStatus(ids, status) {
                this.$confirm('是否要修改推荐状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let params = new URLSearchParams();
                    params.append("ids", ids);
                    params.append("recommendStatus", status);
                    updateRecommendStatus(params).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.getList();
                    })
                }).catch(()=>{
                    this.$message({
                        type: 'success',
                        message: '已取消操作!'
                    });
                    this.getList();
                })
            },
            deleteProduct(ids) {
                this.$confirm('是否要删除该推荐?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let params = new URLSearchParams();
                    params.append("ids", ids);
                    deleteHotProduct(params).then(()=>{
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                })
            },
            handleRecommendStatusStatusChange(index, row) {
                this.updateRecommendStatusStatus(row.id, row.recommendStatus);
            },
            handleDelete(index, row) {
                this.deleteProduct(row.id);
            },
            handleEditSort(index, row) {
                this.sortDialogVisible=true;
                this.sortDialogData.sort=row.sort;
                this.sortDialogData.id = row.id;
            },
            handleUpdateSort() {
                this.$confirm('是否要修改排序?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    updateHotProductSort(this.sortDialogData).then(()=>{
                        this.sortDialogVisible=false;
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '更新成功!'
                        });
                    })
                })
            },
            handleSelectProduct() {
                this.selectDialogVisible = true;
                this.getDialogList();
            },
            getDialogList(){
                fetchProductList(this.dialogData.listQuery).then(response=>{
                    this.dialogData.list = response.data.list;
                    this.dialogData.total = response.data.total;
                })
            },
            handleSelectSearch() {
                this.getDialogList();
            },
            handleDialogSelectionChange(val){
                this.dialogData.multipleSelection = val;
            },
            handleDialogSizeChange(val) {
                this.dialogData.listQuery.pageSize = val;
                this.dialogData.listQuery.pageNum = 1;
                this.getDialogList();
            },
            handleDialogCurrentChange(val) {
                this.dialogData.listQuery.pageNum = val;
                this.getDialogList();
            },
            handleSelectDialogConfirm(){
                if(this.dialogData.multipleSelection.length < 1) {
                    this.$message({
                        message: '请选择一条记录',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }
                let selectProducts = [];
                for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
                    selectProducts.push({
                        productId:this.dialogData.multipleSelection[i].id,
                        productName:this.dialogData.multipleSelection[i].name
                    })
                }

                this.$confirm('使用要进行添加操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    createHotProduct(selectProducts).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.selectDialogVisible=false;
                        this.getList();
                        this.dialogData.multipleSelection = [];
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>
