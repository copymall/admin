<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
        <div>
            <i class="el-icon-search"></i>
            <span>筛选搜索</span>
            <el-button style="float: right"
                       size="small"
                       type="primary">查询搜索</el-button>
            <el-button style="float: right; margin-right: 15px"
                       size="small"
                       type="primary">重置</el-button>
        </div>
        <div style="margin-top: 15px">
            <el-form :inline="true"
                     label-width="140px"
                     size="small">
                <el-form-item label="优惠券名称：">
                    <el-input class="input-width" placeholder="优惠券名称"></el-input>
                </el-form-item>
                <el-form-item label="优惠券类型：">
                    <el-select placeholder="全部" clearable class="input-width">
                        <el-option></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button class="btn-add" size="mini" @click="handleAdd()">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="couponTable"
                      style="width: 100%"
                      :data="list"
                      v-loading="listLoading"
                      @selection-change="handleSelectionChange"
                      border>

                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="优惠劵名称" align="center">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="优惠券类型" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.type | formatType}}</template>
                </el-table-column>
                <el-table-column label="可使用商品" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.useType | formatUseType}}</template>
                </el-table-column>
                <el-table-column label="使用门槛" width="140" align="center">
                    <template slot-scope="scope">满{{scope.row.minPoint}}元可用</template>
                </el-table-column>
                <el-table-column label="面值" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.amount}}元</template>
                </el-table-column>
                <el-table-column label="适用平台" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.platform | formatPlatform}}</template>
                </el-table-column>
                <el-table-column label="有效期" width="180" align="center">
                    <template slot-scope="scope">{{scope.row.startTime | formatDate}}至{{scope.row.endTime | formatDate}}</template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.endTime | formatStatus}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleView(scope.$index, scope.row)">查看</el-button>
                        <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="text" @clck="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination
                layout="total, sizes,prev, pager, next,jumper"
                background
                :page-size="listQuery.pageSize"
                :current-page.sync="listQuery.pageNum"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[5,10,15]"
            ></el-pagination>
        </div>
    </div>
</template>

<script>

    import {deleteCoupon, fetchList} from "../../../api/coupon";
    import {formatDate} from "../../../utils/date";

    const defaultListQuery = {
        pageNum: 1,
        pageSize: 10,
        name: null,
        type: null
    };

    const defaultTypeOptions=[
        {
            label: '全场赠券',
            value: 0
        },
        {
            label: '会员赠券',
            value: 1
        },
        {
            label: '购物赠券',
            value: 2
        },
        {
            label: '注册赠券',
            value: 3
        }
    ];

    export default {
        name: "index",
        data() {
            return {
                listQuery: Object.assign({}, defaultListQuery),
                typeOptions: Object.assign({}, defaultTypeOptions),
                list:null,
                total:null,
                listLoading: false,
                multipleSelection:[]
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response=>{
                    this.list = response.data.list;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleView(index, row){
                this.$router.push({path:'/sms/couponHistory', query:{id:row.id}});
            },
            handleUpdate(index, row){
                this.$router.push({path:'/sms/updateCoupon', query:{id:row.id}});
            },
            handleDelete(index, row){
                this.$confirm('是否进行删除操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    deleteCoupon(row.id).then(()=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList();
                    });
                });
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.listQuery.pageNum = 1;
                this.getList();
            },
            handleAdd(){
                this.$router.push({path:'/sms/addCoupon'})
            }
        },
        filters:{
            formatType(type){
                for(let i=0;i<defaultTypeOptions.length;i++){
                    if(type===defaultTypeOptions[i].value){
                        return defaultTypeOptions[i].label;
                    }
                }
                return '';
            },
            formatUseType(useType){
                if(useType===0){
                    return '全场通用';
                }else if(useType===1){
                    return '指定分类';
                }else{
                    return '指定商品';
                }
            },
            formatPlatform(platform){
                if(platform===1){
                    return '移动平台';
                }else if(platform===2){
                    return 'PC平台';
                }else{
                    return '全平台';
                }
            },
            formatDate(time){
                if(time==null||time===''){
                    return 'N/A';
                }
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd')
            },
            formatStatus(endTime){
                let now = new Date().getTime();
                if(endTime>now){
                    return '未过期'
                }else{
                    return '已过期';
                }
            }
        }
    }
</script>

<style scoped>
    .input-width{
        width: 203px;
    }
</style>
