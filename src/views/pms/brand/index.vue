<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
                <el-button style="float: right" type="primary" size="small" @click="searchBrandList()">查询结果</el-button>
            </div>
            <div style="margin-top: 15px">
                <el-form :inline="true"
                         :model="listQuery"
                         size="small"
                         label-width="140px">
                    <el-form-item label="输入搜索：">
                        <el-input v-model="listQuery.keyword" style="width: 203px" placeholder="品牌名称/关键字"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button class="btn-add" size="mini" @click="addBrand()">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table  ref="brandTable"
                       :data="list"
                       @selection-change="handleSelectionChange"
                       v-loading="listLoading"
                       border
                       style="width: 100%">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="品牌名称" align="center">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="品牌首字母" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.firstLetter}}</template>
                </el-table-column>
                <el-table-column label="排序" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.sort}}</template>
                </el-table-column>
                <el-table-column label="品牌制造商" width="100" align="center">
                    <template slot-scope="scope">
                        <el-switch  :active-value="1"
                                    @change="handleFactoryStatusChange(scope.$index, scope.row)"
                                    v-model="scope.row.factoryStatus"
                                    :inactive-value="0"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="是否显示" width="100" align="center">
                    <template slot-scope="scope">
                        <el-switch  :active-value="1"
                                    @change="handleShowStatusChange(scope.$index, scope.row)"
                                    v-model="scope.row.showStatus"
                                    :inactive-value="0"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="相关" width="220" align="center">
                    <template slot-scope="scope">
                        <span>商品：</span>
                        <el-button size="mini" type="text" @click="getProductList(scope.$index, scope.row)">100</el-button>
                        <span>评价：</span>
                        <el-button size="mini" type="text" @click="getProductCommentList(scope.$index, scope.row)">1000</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="batch-operate-container">
            <el-select size="small" v-model="operateType" placeholder="批量操作">
                <el-option
                    v-for="item in operates"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                ></el-option>
            </el-select>
            <el-button style="margin-left: 20px;"
                       @click="handleBatchOperate()"
                       type="primary"
                       size="small"
                       class="search-button">确定</el-button>
        </div>
        <div class="pagination-container">
            <el-pagination background
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :total="total"
                           :page-size="listQuery.pageSize"
                           :current-page.sync="listQuery.pageNum"
                           :page-sizes="[5,10,15]"
                           layout="total, sizes,prev, pager, next,jumper"></el-pagination>
        </div>
    </div>
</template>

<script>
    import {deleteBrand, fetchList, updateFactoryStatus, updateShowStatus} from "../../../api/brand";

    export default {
        name: "index",
        data() {
            return {
                listQuery:{pageSize:5, pageNum:1,keyword:null},
                listLoading:true,
                list:null,
                total:null,
                totalPage:null,
                multipleSelection:[],
                operateType:null,
                operates: [
                    {
                        label: "显示品牌",
                        value: "showBrand"
                    },
                    {
                        label: "隐藏品牌",
                        value: "hideBrand"
                    }
                ],
            }
        },
        created() {
            this.getList();
        },
        methods:{
            getList(){
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.list = response.data.list;
                    this.total = response.data.total;
                })
            },
            handleFactoryStatusChange(index, row) {
                let data = new URLSearchParams();
                data.append("ids", row.id);
                data.append("factoryStatus", row.factoryStatus);
                updateFactoryStatus(data).then(()=>{
                   this.$message({
                       message:'修改成功',
                       type:'success',
                       duration:1000
                   });
                }).catch(error=>{
                    if(row.factoryStatus === 0){
                        row.factoryStatus = 1
                    }else {
                        row.factoryStatus = 0
                    }
                });
            },
            handleShowStatusChange(index, row){
                let data = new URLSearchParams();
                data.append("ids", row.id);
                data.append("showStatus", row.showStatus);
                updateShowStatus(data).then(()=>{
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    });
                }).catch(()=>{
                    if(row.showStatus === 0) {
                        row.showStatus = 1;
                    }else {
                        row.showStatus = 0
                    }
                });
            },
            getProductList(index, row){
                console.log(index, row);
            },
            getProductCommentList(index, row){
                console.log(index, row);
            },
            handleUpdate(index, row){
                this.$router.push({path:'/pms/updateBrand', query: {id: row.id}});
            },
            handleDelete(index, row){
                this.$confirm('是否要删除该品牌', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    deleteBrand(row.id).then(response=>{
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.getList();
                    });
                });
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            handleBatchOperate(){
                if(this.multipleSelection.length < 1){
                    this.$message({
                        message: '请选择一条记录',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }
                let showStatus = 0;
                if(this.operateType === "showBrand"){
                    showStatus = 1;
                }else if(this.operateType === "hideBrand"){
                    showStatus = 0
                }else {
                    this.$message({
                        message: '请选择批量操作类型',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }

                let ids = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].id);
                }

                let data = new URLSearchParams();
                data.append("ids", ids);
                data.append("showStatus", showStatus);
                updateShowStatus(data).then(response=>{
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
            },
            handleSizeChange(val){
                this.listQuery.pageSize = val;
                this.listQuery.pageNum = 1;
                this.getList();
            },
            handleCurrentChange(val){
                this.listQuery.pageNum = val;
                this.getList();
            },
            searchBrandList() {
                this.listQuery.pageNum = 1;
                this.getList();
            },
            addBrand(){
                this.$router.push({path:'/pms/addBrand'})
            }
        }
    }
</script>

<style scoped>

</style>
