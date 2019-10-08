<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>

                <el-button style="float: right"
                        type="primary"
                        @click="handleSearchList()"
                        size="small">查询搜索</el-button>
                <el-button
                    style="float: right;margin-right: 15px"
                    @click="handleResetSearch()"
                    size="small">重置</el-button>
            </div>

            <div style="margin-top: 15px">
                <el-form inline="true" :model="listQuery" size="small" label-width="140px">

                    <el-form-item label="专题名称:">
                        <el-input v-model="listQuery.subjectName" class="input-width" placeholder="专题名称"></el-input>
                    </el-form-item>

                    <el-form-item label="推荐状态:">
                        <el-select v-model="listQuery.recommendStatus" placeholder="全部" clearable class="input-width">
                            <el-option v-for="item in recommendOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

        <el-card class="operate-container">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button size="mini" class="btn-add" @click="handleSelectSubject()">选择专题</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="newSubjectTable"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    :data="list"
                    v-loading="listLoading" border>
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="编号" width="120" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="专题名称" align="center">
                    <template slot-scope="scope">{{scope.row.subjectName}}</template>
                </el-table-column>
                <el-table-column label="是否推荐" width="200" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            @change="handleRecommendStatusStatusChange(scope.$index,scope.row)"
                            :active-value="1"
                            :inactive-value="0"
                            v-model="scope.row.recommendStatus"></el-switch>
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
                        <el-button size="mini"
                                    type="text"
                                    @click="handleEditSort(scope.$index,scope.row)">设置排序
                        </el-button>
                        <el-button size="mini"
                                   type="text"
                                   @click="handleDelete(scope.$index,scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="batch-operate-container">
            <el-select size="small" v-model="operateType" placeholder="批量操作">
                <el-option
                        v-for="item in operates"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                </el-option>
                <el-button style="margin-left: 20px"
                            class="search-button"
                            @click="handleBatchOperate()"
                            type="primary"
                            size="small">确定
                </el-button>
            </el-select>

        </div>
        <div class="pagination-container">
            <el-pagination
                background
                @size-change="handleSizeChang"
                @current-change="handleCurrentChange"
                layout="total,sizes,prev,pager,next,jumper"
                :page-size="listQuery.pageSize"
                :page-sizes="[5,10,15]"
                :current-page.sync="listQuery.pageNum"
                :total="total"></el-pagination>
        </div>
        <el-dialog title="选择专题" :visible.sync="selectDialogVisible" width="50%">
            <el-input v-model="dialogDate.listQuery.keyword"
                        style="width:250px;margin-bottom:20px "
                        size="small"
                      placeholder="专题名称搜索">
                <el-button slot="append" icon="el-icon-search" @click="handleSelectSearch()"></el-button>
            </el-input>
            <el-table :data="dialogDate.list" @selection-change="handleDialogSelectionChange" border>
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="专题名称" align="center">
                    <template slot-scope="scope">{{scope.row.title}}</template>
                </el-table-column>
                <el-table-column label="所属分类" width="160" align="center">
                    <template slot-scope="scope">{{scope.row.categoryName}}</template>
                </el-table-column>
                <el-table-column label="添加时间" width="160" align="center">
                    <template slot-scope="scope">{{scope.row.createTime|formatTime}}</template>
                </el-table-column>
            </el-table>

            <div class="pagination-container">
                <el-pagination
                    background
                    @size-change="handleDialogSizeChange"
                    @current-change="handleDialogCurrentChange"
                    layout="prev,pager,next"
                    :current-page.sync="dialogDate.listQuery.pageNum"
                    :page-size="dialogDate.listQuery.pageSize"
                    :page-sizes="[5,10,15]"
                    :total="dialogDate.total"></el-pagination>
            </div>

            <div style="clear:both;"></div>
            <div slot="footer">
                <el-button size="small" @click="selectDialogVisible=false">取消</el-button>
                <el-button size="small" type="primary" @click="handleSelectDialogConfirm()">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="设置排序"
                    :visible.sync="sortDialogVisible"
                    width="40%">
            <el-form :model="sortDialogData"
                     label-width="150px">
                <el-form-item label="排序:">
                    <el-input v-model="sortDialogData.sort" style="width: 200px"></el-input>
                </el-form-item>
                <span slot="footer">
                    <el-button @click="sortDialogVisible=false" size="small">取消</el-button>
                    <el-button type="primary" @click="handleUpdateSort" size="small">确定</el-button>
                </span>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {fetchList,updateRecommendStatus,deleteHomeSubject,createHomeSubject,updateHomeSubjectSort} from "../../../api/homeSubject";
    import {fetchList as fetchSubjectList} from '@/api/subject';
    import {formatDate} from "../../../utils/date";

    const defaultListQuery={
      pageNum:1,
      pageSize:5,
      subjectName:null,
      recommendStatus:null
    };

    const defaultRecommendOptions=[
        {
            label:'为推荐',
            value:0
        },
        {
            label: '推荐中',
            value: 1
        }
    ];
    export default {
        name: "homeSubjectList",
        data(){
            return{
                listQuery:Object.assign({},defaultListQuery),
                recommendOptions:Object.assign({},defaultRecommendOptions),
                list:null,
                total:null,
                listLoading:false,
                multipleSelection:[],
                operates:[
                    {
                        label:"设为推荐",
                        value:0
                    },
                    {
                        label:"取消推荐",
                        value:1
                    },
                    {
                        label:'删除',
                        value:2
                    }
                ],
                operateType:null,
                selectDialogVisible:false,
                dialogDate:{
                    list:null,
                    total:null,
                    multipleSelection: [],
                    listQuery:{
                        keyword:null,
                        pageNum:1,
                        pageSize:5
                    }
                },
                sortDialogVisible:false,
                sortDialogData:{sort:0,id:null}
            }
        },
        created() {
            this.getList();
        },
        filters:{
          formatRecommendStatus(status){
              if(status==1){
                  return '推荐中';
              }else{
                  return '未推荐';
              }
          },
          formatTime(time){
            if(time==null||time===''){
                return 'N/A';
            }
            let date=new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm:ss')
          },
        },
        methods:{
            handleSearchList(){
                this.listQuery.pageNum=1;
                this.getList();
            },
            handleResetSearch(){
                this.listQuery=Object.assign({},defaultListQuery);
            },
            handleSelectSubject(){
                this.selectDialogVisible=true;
                this.dialogData.listQuery.keyword=null;
                this.getDialogList();
            },
            handleSelectSearch(){
                this.getDialogList();
            },
            handleDialogSelectionChange(val){
                this.dialogDate.multipleSelection=val;
            },
            handleDialogSizeChange(val){
                this.dialogDate.listQuery.pageNum=1;
                this.dialogDate.listQuery.pageSize=val;
                this.getDialogList();
            },
            handleDialogCurrentChange(val){
                this.dialogDate.listQuery.pageNum=val;
                this.getDialogList();
            },
            handleSelectDialogConfirm(){
                if(this.dialogDate.multipleSelection<1){
                    this.$message({
                        message:'你他娘的意大利炮呢？',
                        type:'warning',
                        duration:1000
                    });
                    return;
                }
                let selectSubjects=[];
                for(let i=0;i<this.dialogDate.multipleSelection.length;i++){
                    selectSubjects.push(
                        {
                            subjectId:this.dialogDate.multipleSelection[i].id,
                            subjectName:this.dialogDate.multipleSelection[i].title
                        }
                    );
                }
                this.$confirm('使用要进行添加操作？','提示dfdfd',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    createHomeSubject(selectSubjects).then(response=>{
                       this.selectDialogVisible=false;
                       this.dialogDate.multipleSelection=[];
                       this.getList();
                       this.message({
                           message:'添加成功',
                           type:'success',
                       })
                    });
                });
            },
            handleSelectionChange(val){
                this.multipleSelection=val;
            },
            handleRecommendStatusStatusChange(index,row){
                this.updateRecommendStatus(row.id,row.recommendStatus)
            },
            handleEditSort(index,row){
                this.sortDialogVisible=true;
                this.sortDialogData.sort=row.sort;
                this.sortDialogData.id=row.id;
            },
            handleDelete(index,row){
                this.deleteSubject(row.id);
            },
            handleUpdateSort(){
              this.$confirm('是否要修改排序','提示',{
                  confirmButtonText:'确定',
                  cancelButtonText:'取消',
                  type:'warning'
              }).then(()=>{
                  updateHomeSubjectSort(this.sortDialogData).then(response=>{
                      this.sortDialogVisible=false;
                      this.getList();
                      this.$message({
                          type:'success',
                          message:'删除成功'
                      })
                  })
              })
            },
            handleBatchOperate(){
                if(this.multipleSelection<1){
                    this.$message({
                        message:'请选择一条记录',
                        type:'warning',
                        duration:1000
                    });
                    return;
                }
                let ids=[];
                for(let i=0;i<this.multipleSelection.length;i++){
                    ids.push(this.multipleSelection[i].id);
                }
                if(this.operateType===0){
                    this.updateRecommendStatusStatus(ids,1);
                }else if(this.operateType===1){
                    this.updateRecommendStatusStatus(ids,0);
                }else if(this.operateType===2){
                    this.deleteSubject(ids);
                }else{
                    this.$message({
                        message:'请选择批量操作类型',
                        type:'warning',
                        duration:1000
                    });
                }
            },
            handleSizeChang(val){
                this.listQuery.pageNum=1;
                this.listQuery.pageSize=val;
                this.getList();
            },
            handleCurrentChange(val){
                this.listQuery.pageNum=val;
                this.getList();
            },
            getList(){
              this.listLoading=true;
              fetchList(this.listQuery).then(response=>{
                  this.listLoading=false;
                  this.list=response.data.list;
                  this.total=response.data.total;
              })
            },
            deleteSubject(ids){
              this.$confirm("是否要删除该推荐？",'提示',{
                  confirmButtonText:'确定',
                  cancelButtonText:'取消',
                  type:'warning'
              }).then(()=>{
                  let params=new URLSearchParams();
                  params.append("ids",ids);
                  deleteHomeSubject(params).then(response=>{
                     this.getList();
                     this.$message({
                         type:'success',
                         message:'删除成功'
                     })
                  });
              });
            },
            getDialogList(){
                fetchSubjectList(this.dialogData.listQuery).then(response=>{
                    this.dialogData.list=response.data.list;
                    this.dialogData.total=response.data.total;
                })
            },
            updateRecommendStatus(ids,status){
                this.$confirm('是否要修改推荐状态？','提示',{
                    cancelButtonText:'取消',
                    confirmButtonText:'确定',
                    type:'warning'
                }).then(()=>{
                    let params=new URLSearchParams();
                    params.append("ids",ids);
                    params.append("recommendStatus",status);
                    updateRecommendStatus(params).then(response=>{
                       this.getList();
                       this.$message({
                           type:'success',
                           message:'修改成功'
                       });
                    });
                }).catch(()=>{
                   this.$message({
                       message:"已取消操作",
                       type:'success',
                       duration:1000
                   });
                });
            },
        },
    }
</script>

<style scoped>

</style>