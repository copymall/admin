<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <i class="el-icon-search"></i>
            <span>筛选搜索</span>
            <el-button size="small" style="float: right" type="primary" @click="handleSearchList()">查询搜索</el-button>
            <el-button size="small" style="float: right; margin-right: 20px" @click="handleResetSearch()">重置</el-button>
            <div style="margin-top: 15px">
                <el-form :inline="true" size="small" label-width="140px" :model="listQuery">
                    <el-form-item label="品牌名称：">
                        <el-input v-model="listQuery.brandName" class="input-width" placeholder="品牌名称"></el-input>
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
            <el-button size="mini" class="btn-add" @click="handleSelectBrand()">选择品牌</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="homeBrandTable"
                      style="width: 100%"
                      :data="list"
                      v-loading="listLoading"
                      @selection-change="handleSelectionChange"
                      border>
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="编号" width="120" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="品牌名称" align="center">
                    <template slot-scope="scope">{{scope.row.brandName}}</template>
                </el-table-column>
                <el-table-column label="是否推荐" width="200" align="center">
                    <template slot-scope="scope">
                        <el-switch
                                @change="handleRecommendStatusStatusChange(scope.$index, scope.row)"
                                :active-value="1"
                                :inactive-value="0"
                                v-model="scope.row.recommendStatus"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="160" align="center">
                    <template slot-scope="scope">{{scope.row.sort}}</template>
                </el-table-column>
                <el-table-column label="状态" width="160" align="center">
                    <template slot-scope="scope">{{scope.row.recommendStatus | formatRecommendStatus}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEditSort(scope.$index, scope.row)">设置排序</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="batch-operate-container">
            <el-select size="small" placeholder="批量操作" v-model="operateType">
                <el-option v-for="item in operates"
                           :value="item.value"
                           :label="item.label"
                           :key="item.value"></el-option>
            </el-select>
            <el-button style="margin-left: 20px"
                       class="search-button"
                       type="primary"
                       @click="handleBatchOperate()"
                       size="small">确定</el-button>
        </div>
        <div class="pagination-container">
            <el-pagination background
                           :total="total"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :page-size="listQuery.pageSize"
                           :current-page.sync="listQuery.pageNum"
                           layout="total, sizes,prev, pager, next,jumper"
                           :page-sizes="[5,10,15]"></el-pagination>
        </div>
        <el-dialog title="设置排序" :visible.sync="sortDialogVisible" width="40%">
            <el-form :model="sortDialogData" label-width="150px">
                <el-form-item label="排序">
                    <el-input v-model="sortDialogData.sort" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="sortDialogVisible=false" size="small">取 消</el-button>
                <el-button @click="handleUpdateSort" size="small" type="primary">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择品牌" :visible.sync="selectDialogVisible" width="40%">
            <el-input v-model="dialogData.listQuery.keyword"
                        size="small"
                      placeholder="品牌名称搜索"
                      style="width: 250px; margin-bottom: 20px">
                <el-button slot="append" icon="el-icon-search" @click="handleSelectSearch()"></el-button>
            </el-input>
            <el-table :data="dialogData.list" border @selection-change="handleDialogSelectionChange">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="品牌名称" align="center">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="相关" width="220" align="center">
                    <template slot-scope="scope">
                        商品：<span class="color-main">{{scope.row.productCount}}</span>
                        评价：<span class="color-main">{{scope.row.productCommentCount}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                    layout="prev, pager, next"
                    :page-sizes="[5,10,15]"
                    :total="dialogData.total"
                    :page-size="dialogData.listQuery.pageSize"
                    :current-page.sync="dialogData.listQuery.pageNum"
                    background
                    @size-change="handleDialogSizeChange"
                    @current-change="handleDialogCurrentChange"
                ></el-pagination>
            </div>
            <div style="clear: both;"></div>
            <div slot="footer">
                <el-button size="small" @click="this.selectDialogVisible = false">取 消</el-button>
                <el-button size="small" @click="handleSelectDialogConfirm()" type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import {
        createHomeBrand,
        deleteHomeBrand,
        fetchList,
        updateHomeBrandSort,
        updateRecommendStatus
    } from "../../../api/homeBrand";
    import {fetchList as fetchBrandList} from '../../../api/brand';

    const defaultListQuery = {
        pageNum: 1,
        pageSize: 5,
        brandName: null,
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
        name: "homeBrandList",
        data() {
            return {
                listQuery: Object.assign({}, defaultListQuery),
                recommendOptions: Object.assign({}, defaultRecommendOptions),
                list: null,
                total: null,
                listLoading:false,
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
                sortDialogVisible:false,
                sortDialogData:{sort:0,id:null},
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
            }
        },
        created() {
            this.getList();
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
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            handleRecommendStatusStatusChange(index, row){
                this.updateRecommendStatusStatus(row.id, row.recommendStatus);
            },
            updateRecommendStatusStatus(id, recommendStatus){
                this.$confirm('是否要修改推荐状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let data = new URLSearchParams();
                    data.append("ids", id);
                    data.append("recommendStatus", recommendStatus);
                    updateRecommendStatus(data).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.getList();
                    });
                }).catch(()=>{
                    this.$message({
                        type: 'success',
                        message: '已取消操作!'
                    });
                    this.getList();
                });;
            },
            handleEditSort(index, row){
                this.sortDialogVisible = true;
                this.sortDialogData.sort = row.sort;
                this.sortDialogData.id = row.id;
            },
            handleDelete(index, row){
                this.deleteBrand(row.id);
            },
            deleteBrand(id) {
                this.$confirm('是否要删除该推荐?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let data = new URLSearchParams();
                    data.append("ids", id);
                    deleteHomeBrand(data).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '删成功!'
                        });
                        this.getList();
                    })
                })
            },
            handleUpdateSort(){
                this.$confirm('是否要修改排序?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    updateHomeBrandSort(this.sortDialogData).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList();
                        this.sortDialogVisible = false;
                    })
                })
            },
            handleCurrentChange(val){
                this.listQuery.pageNum = val;
                this.getList();
            },
            handleSizeChange(val){
                this.listQuery.pageSize = val;
                this.listQuery.pageNum = 1;
                this.getList();
            },
            handleBatchOperate(){
                if (this.multipleSelection < 1) {
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
                    this.updateRecommendStatusStatus(ids, 1);
                }else if(this.operateType === 1) {
                    this.updateRecommendStatusStatus(id, 0);
                }else if(this.operateType === 2) {
                    this.deleteBrand(ids);
                }else {
                    this.$message({
                        message: '请选择批量操作类型',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }
            },
            handleSearchList(){
                this.listQuery.pageNum = 1;
                this.getList();
            },
            handleResetSearch(){
                this.listQuery = Object.assign({}, defaultListQuery);
            },
            handleSelectBrand() {
                this.selectDialogVisible = true;
                this.getDialogList();
            },
            getDialogList(){
                fetchBrandList(this.dialogData.listQuery).then(response=>{
                    this.dialogData.list=response.data.list;
                    this.dialogData.total = response.data.total;
                })
            },
            handleSelectSearch() {
                this.getDialogList();
            },
            handleDialogSelectionChange(val) {
                this.dialogData.multipleSelection = val;
            },
            handleDialogCurrentChange(val){
                this.dialogData.listQuery.pageNum = val;
                this.getDialogList();
            },
            handleDialogSizeChange(val){
                this.dialogData.listQuery.pageSize = val;
                this.dialogData.listQuery.pageNum = 1;
                this.getDialogList();
            },
            handleSelectDialogConfirm(){
                if (this.dialogData.multipleSelection < 1) {
                    this.$message({
                        message: '请选择一条记录',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }

                let selectBrands = [];
                for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
                    selectBrands.push({
                        brandId: this.dialogData.multipleSelection[i].id,
                        brandName: this.dialogData.multipleSelection[i].name
                    })
                }

                this.$confirm('使用要进行添加操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    createHomeBrand(selectBrands).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.selectDialogVisible = false;
                        this.dialogData.multipleSelection = [];
                        this.getList();
                    })
                })
            }
        },
        filters: {
            formatRecommendStatus(status){
                if(status===1){
                    return '推荐中';
                }else{
                    return '未推荐';
                }
            }
        }
    }
</script>

<style scoped>

</style>
