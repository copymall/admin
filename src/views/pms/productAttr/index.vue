<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets" style="margin-top: 5px"></i>
            <span style="margin-top: 5px">数据列表</span>
            <el-button size="mini" class="btn-add" @click="addProductAttrCate()">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="productAttrCateTable"
                      style="width:100%"
                      :data="list"
                      v-loading="listLoading"
                      border>
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="类型名称" align="center">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="属性数量" width="200" align="center">
                    <template slot-scope="scope">{{scope.row.attributeCount==null?0:scope.row.attributeCount}}</template>
                </el-table-column>
                <el-table-column label="参数数量" width="200" align="center">
                    <template slot-scope="scope">{{scope.row.paramCount==null?0:scope.row.paramCount}}</template>
                </el-table-column>
                <el-table-column label="设置" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="getAttrList(scope.$index, scope.row)">属性列表</el-button>
                        <el-button size="mini" @click="getParamList(scope.$index, scope.row)">参数列表</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleUpdate(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background
                           :total="total"
                           :page-sizes="[5, 10, 15]"
                           :page-size="listQuery.pageSize"
                           :current-page.sync="listQuery.pageNum"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           layout="total, sizes,prev, pager, next,jumper"></el-pagination>
        </div>
    </div>
</template>

<script>
    import {fetchList} from "../../../api/productAttrCate";

    export default {
        name: "productAttr",
        methods:{
            addProductAttrCate(){
                // this.$router.push({path:''})
            },
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response=>{
                    this.listLoading = false;
                    this.list = response.data.list;
                    this.total = response.data.total;
                });
            },
            getAttrList(){},
            getParamList(){},
            handleSizeChange(val){
                this.listQuery.pageSize = val;
                this.listQuery.pageNum = 0;
                this.getList();
            },
            handleCurrentChange(val){
                this.listQuery.pageNum = val;
                this.getList();
            }
        },
        data() {
            return {
                listLoading: true,
                list: null,
                total:null,
                listQuery:{
                    pageSize:5,
                    pageNum:1
                }
            }
        },
        created() {
            this.getList();
        }
    }
</script>

<style scoped>

</style>
