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
                    <template slot-scope="scope"></template>
                </el-table-column>
                <el-table-column label="类型名称" align="center">
                    <template slot-scope="scope"></template>
                </el-table-column>
                <el-table-column label="属性数量" width="200" align="center">
                    <template slot-scope="scope"></template>
                </el-table-column>
                <el-table-column label="参数数量" width="200" align="center">
                    <template slot-scope="scope"></template>
                </el-table-column>
                <el-table-column label="设置" width="200" align="center">
                    <template slot-scope="scope"></template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope"></template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background
                           :total="total"
                           :page-sizes="[5, 10, 15]"
                           layout="total, sizes,prev, pager, next,jumper"></el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "productAttr",
        methods:{
            addProductAttrCate(){},
            getList() {
                this.listLoading = true;
                fetchList(listQuery).then(response=>{})
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
