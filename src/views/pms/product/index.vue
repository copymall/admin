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
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
            return {
                productCateOptions:[{label: "1",value: "publishOn"},{label: "2",value: "publishOn"},{label: "3",value: "publishOn"}]
            }
        }
    }
</script>

<style scoped>

</style>
