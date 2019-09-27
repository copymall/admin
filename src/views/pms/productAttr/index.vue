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
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        <el-dialog :title="dialogTitle"
                   :visible.sync="dialogVisible"
                   width="30%">
            <el-form ref="productAttrCatForm"
                     :model="productAttrCate"
                     :rules="rules"
                     label-width="120px">
                <el-form-item label="类型名称" prop="name">
                    <el-input auto-complete="off" v-model="productAttrCate.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel()">取 消</el-button>
            <el-button type="primary" @click="handleConfirm('productAttrCatForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        createProductAttrCate,
        deleteProductAttrCate,
        fetchList,
        updateProductAttrCate
    } from "../../../api/productAttrCate";

    export default {
        name: "productAttr",
        methods:{
            addProductAttrCate(){
                // this.$router.push({path:''})
                this.dialogVisible = true;
                this.dialogTitle = "添加类型";
                this.productAttrCate.name = "";
            },
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response=>{
                    this.listLoading = false;
                    this.list = response.data.list;
                    this.total = response.data.total;
                });
            },
            getAttrList(index, row){
                this.$router.push({path:'/pms/productAttrList', query: {cid:row.id, cname:row.name, type:0}});
            },
            getParamList(index, row){
                this.$router.push({path:'/pms/productAttrList', query: {cid: row.id, cname: row.name, type:0}});
            },
            handleSizeChange(val){
                this.listQuery.pageSize = val;
                this.listQuery.pageNum = 0;
                this.getList();
            },
            handleCurrentChange(val){
                this.listQuery.pageNum = val;
                this.getList();
            },
            handleConfirm(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        let data = new URLSearchParams();
                        data.append("name", this.productAttrCate.name);
                        if(this.dialogTitle === '添加品牌'){
                            createProductAttrCate(data).then(response=>{
                                this.$message({
                                    message:'添加成功',
                                    type:'success',
                                    duration:1000
                                });
                                this.dialogVisible = false;
                                this.getList();
                            });
                        }else {
                            updateProductAttrCate(this.productAttrCate.id, data).then(response=>{
                                this.$message({
                                    message:'修改成功',
                                    type:'success',
                                    duration:1000
                                });
                                this.dialogVisible = false;
                                this.getList();
                            });
                        }
                    }else {
                        return false;
                    }
                })
            },
            handleCancel() {
                this.dialogVisible = false;
            },
            handleUpdate(index, row){
                this.dialogVisible =true;
                this.dialogTitle = "编辑类型";
                this.productAttrCate.name = row.name;
                this.productAttrCate.id = row.id;
            },
            handleDelete(index, row) {
                this.$confirm('是否要删除该品牌', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    deleteProductAttrCate(row.id).then(response=>{
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration:1000
                        });
                        this.getList();
                    });
                });
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
                },
                dialogVisible:false,
                dialogTitle:"",
                productAttrCate:{
                    name:'',
                    id:null
                },
                rules:{
                    name: [
                        {required:true, message:'请输入类型名称', trigger:'blur'}
                    ]
                }
            }
        },
        created() {
            this.getList();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
