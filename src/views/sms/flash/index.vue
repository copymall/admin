<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
                <el-button size="small" type="primary" style="float: right" @click="handleSearchList()">查询搜索</el-button>
                <el-button size="small" style="float: right; margin-right: 15px" @click="handleResetSearch()">重置</el-button>
            </div>
            <div style="margin-top: 15px">
                <el-form :inline="true" size="small" label-width="140px" :model="listQuery">
                    <el-form-item label="活动名称：">
                        <el-input v-model="listQuery.keyword" placeholder="活动名称" clearable class="input-width"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button size="mini" class="btn-add" style="margin-left: 15px" @click="handleAdd()">添加活动</el-button>
            <el-button size="mini" class="btn-add" @click="handleShowSessionList()">秒杀时间段列表</el-button>
        </el-card>
        <el-card class="table-container" shadow="never">
            <el-table ref="flashTable"
                      style="width: 100%"
                      :data="list"
                      v-loading="listLoading"
                      border>
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="活动标题" align="center">
                    <template slot-scope="scope">{{scope.row.title}}</template>
                </el-table-column>
                <el-table-column label="活动状态" width="140" align="center">
                    <template slot-scope="scope">{{scope.row | formatActiveStatus}}</template>
                </el-table-column>
                <el-table-column label="开始时间">
                    <template slot-scope="scope">{{scope.row.startDate | formatDate}}</template>
                </el-table-column>
                <el-table-column label="结束时间" width="140" align="center">
                    <template slot-scope="scope">{{scope.row.endDate | formatDate}}</template>
                </el-table-column>
                <el-table-column label="上线/下线" width="200" align="center">
                    <template slot-scope="scope">
                        <el-switch
                                @change="handleStatusChange(scope.$index, scope.row)"
                                :active-value="1"
                                :inactive-value="0"
                                v-model="scope.row.status"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleSelectSession(scope.$index, scope.row)">设置商品</el-button>
                        <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <div class="pagination-container">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.pageNum"
                :page-size="listQuery.pageSize"
                :total="total"
                layout="total, sizes,prev, pager, next,jumper"
                :page-sizes="[5,10,15]"
            ></el-pagination>
        </div>
        <el-dialog title="添加活动" :visible.sync="dialogVisible" width="40%">
            <el-form :model="flashPromotion" ref="flashPromotionForm" label-width="150px" size="small">
                <el-form-item label="活动标题：">
                    <el-input v-model="flashPromotion.title" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="开始时间：">
                    <el-date-picker
                        v-model="flashPromotion.startDate"
                        type="date"
                        placeholder="请选择时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间：">
                    <el-date-picker
                        v-model="flashPromotion.endDate"
                        type="date"
                        placeholder="请选择时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="上线/下线">
                    <el-radio-group v-model="flashPromotion.status">
                        <el-radio :label="1">上线</el-radio>
                        <el-radio :label="0">下线</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="handleDialogConfirm()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import {createFlash, deleteFlash, fetchList, updateFlash, updateStatus} from "../../../api/flash";
    import {formatDate} from "../../../utils/date";

    const defaultListQuery = {
        pageNum: 1,
        pageSize: 5,
        keyword: null
    };
    const defaultFlashPromotion = {
        id: null,
        title: null,
        startDate: null,
        endDate: null,
        status: 0
    };

    export default {
        name: "flashPromotionList",
        data() {
            return {
                list:null,
                total:null,
                listLoading: true,
                listQuery:Object.assign({}, defaultListQuery),
                dialogVisible:false,
                isEdit:false,
                flashPromotion:Object.assign({}, defaultFlashPromotion)
            }
        },
        created() {
            this.getList();
        },
        methods:{
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response=>{
                    this.listLoading = false;
                    this.list = response.data.list;
                    this.total = response.data.total;
                })
            },
            handleStatusChange(index, row){
                this.$confirm('是否要修改该状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    updateStatus(row.id, {status: row.status}).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    });
                }).catch(()=>{
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });
                    this.getList();
                });
            },
            handleSelectSession(index, row){
                this.$router.push({path:'/sms/selectSession', query:{flashPromotionId:row.id}});
            },
            handleUpdate(index, row){
                this.dialogVisible = true;
                this.isEdit = true;
                this.flashPromotion = Object.assign({}, row);
            },
            handleDelete(index, row){
                this.$confirm('是否要删除该活动?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    deleteFlash(row.id).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList();
                    });
                });
            },
            handleSizeChange(value){
                this.listQuery.pageSize = value;
                this.listQuery.pageNum = 1;
                this.getList();
            },
            handleCurrentChange(value){
                this.listQuery.pageNum = value;
                this.getList();
            },
            handleResetSearch(){
                this.listQuery = Object.assign({}, defaultListQuery);
            },
            handleSearchList(){
                this.listQuery.pageNum = 1;
                this.getList();
            },
            handleAdd(){
                this.dialogVisible = true;
                this.isEdit = false;
                this.flashPromotion = Object.assign({}, defaultFlashPromotion);
            },
            handleShowSessionList(){
                this.$router.push({path:'/sms/flashSession'})
            },
            handleDialogConfirm(){
                this.$confirm('是否要确认?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    if(this.isEdit) {
                        updateFlash(this.flashPromotion.id, this.flashPromotion).then(()=>{
                            this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                            this.dialogVisible = false;
                            this.getList();
                        });
                    }else {
                        createFlash(this.flashPromotion).then(()=>{
                            this.$message({
                                message: '添加成功！',
                                type: 'success'
                            });
                            this.dialogVisible = false;
                            this.getList();
                        })
                    }
                });
            }
        },
        filters: {
            formatActiveStatus(row){
                let nowTime = new Date().getTime();
                if(nowTime >= row.startDate && nowTime <= row.endDate) {
                    return '活动进行中';
                }else if(nowTime > row.endDate) {
                    return '活动已结束';
                }else {
                    return '活动未开始';
                }
            },
            formatDate(time){
                if(time == null || time === '') {
                    return 'N/A';
                }
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd');
            }
        }
    }
</script>

<style scoped>

</style>
