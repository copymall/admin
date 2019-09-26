<template>
    <div style="margin-top: 50px;">
        <el-form
            :model="value"
            ref="productAttrForm"
            label-width="120px"
            style="width: 720px"
            size="small"
        >
            <el-form-item label="属性类型：">
                <el-select
                        v-model="value.productAttributeCategoryId"
                        placeholder="请选择属性类型"
                        @change="handleProductAttrChange"
                >
                    <el-option
                        v-for="item in productAttributeCategoryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品规格：">
                <el-card shadow="never" class="cardBg">
                    <div v-for="(productAttr, idx) in selectProductAttr">
                        {{productAttr.name}}：
                        <el-checkbox-group v-if="productAttr.handAddStatus === 0" v-model="selectProductAttr[idx].values">
                            <el-checkbox
                                    v-for="item in getInputListArr(productAttr.inputList)"
                                    :label="item"
                                    :key="item"
                                    class="littleMarginLeft"></el-checkbox>
                        </el-checkbox-group>
                        <div v-else>
                            <el-checkbox-group v-model="selectProductAttr[idx].values">
                                <div
                                        v-for="(item, index) in selectProductAttr[idx].options"
                                        style="display: inline-block"
                                        class="littleMarginLeft">
                                    <el-checkbox :label="item" :key="item"></el-checkbox>
                                    <el-button type="text" class="littleMarginLeft" @click="handleRemoveProductAttrValue(idx, index)">删除</el-button>
                                </div>
                            </el-checkbox-group>
                            <el-input style="width: 160px; margin-left: 10px" clearable v-model="addProductAttrValue"></el-input>
                            <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加</el-button>
                        </div>
                    </div>
                </el-card>
                <el-table
                        :data="value.skuStockList"
                        style="width: 100%; margin-top: 20px"
                        border>
                    <el-table-column
                            v-for="(item, index) in selectProductAttr"
                            :label="item.name"
                            :key="item.id"
                            align="center">
                        <template slot-scope="scope">
                            {{getProductSkuSp(scope.row, index)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="销售价格"
                            width="80"
                            align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.price"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="商品库存"
                            width="80"
                            align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.stock"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="库存预警值"
                            width="80"
                            align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.lowStock"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="SKU编号"
                            width="80"
                            align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.skuCode"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="80"
                            align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleRemoveProductSku(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" style="margin-top: 20px" @click="handleRefreshProductSkuList">刷新列表</el-button>
                <el-button type="primary" style="margin-top: 20px" @click="handleSyncProductSkuPrice">同步价格</el-button>
            </el-form-item>
            <el-form-item label="属性图片：" v-if="hasAttrPic">
                <el-card shadow="never" class="cardBg">
                    <div v-for="(item, index) in selectProductAttrPics">
                        <span>{{item.name}}:</span>
                        <single-upload></single-upload>
                    </div>
                </el-card>
            </el-form-item>
            <el-form-item label="商品参数：">
                <el-card shadow="never" class="cardBg">
                    <div v-for="(item, index) in selectProductParam" :class="{littleMarginTop:index!=0}">
                    <div class="paramInputLabel">{{item.name}}</div>
                    <el-select class="paramInput" v-if="item.inputType===1" v-model="selectProductParam[index].value">
                        <el-option
                            v-for="item in getParamInputList(item.inputList)"
                            :key="item"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                    <el-input class="paramInput" v-else v-model="selectProductParam[index].value"></el-input>
                    </div>
                </el-card>
            </el-form-item>
            <el-form-item label="商品相册：">
                <multi-upload v-model="selectProductPics"></multi-upload>
            </el-form-item>
            <el-form-item label="规格参数：">
                <el-tabs type="card" v-model="activeHtmlName">
                    <el-tab-pane label="电脑端详情" name="pc">
                    <tinymce :width="595" :height="300" v-model="value.detailHtml"></tinymce>
                    </el-tab-pane>
                    <el-tab-pane label="移动端详情" name="mobile">
                    <tinymce :width="595" :height="300" v-model="value.detailMobileHtml"></tinymce>
                    </el-tab-pane>
                </el-tabs>
            </el-form-item>
            <el-form-item style="text-align: center">
                <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
                <el-button size="medium" type="primary" @click="handleNext">下一步，选择商品关联</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {fetchList as fetchProductAttrCateList} from "../../../../api/productAttrCate";
    import {fetchList as fetchProductAttrList} from "../../../../api/productAttr";
    import SingleUpload from "../../../../components/Upload/singleUpload";
    import MultiUpload from "../../../../components/Upload/multiUpload";
    import Tinymce from "../../../../components/Tinymce";

    export default {
        name: "ProductAttrDetail",
        components: {Tinymce, MultiUpload, SingleUpload},
        props: {
            value: Object,
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                productAttributeCategoryOptions:[],
                selectProductAttr:[],
                selectProductParam:[],
                addProductAttrValue:"",
                selectProductAttrPics:[],
                activeHtmlName:'pc',
                hasEditCreated:false
            }
        },
        methods: {
            getProductAttrCateList() {
                let param = {pageNum:1, pageSize:100};
                fetchProductAttrCateList(param).then(response=>{
                    this.productAttributeCategoryOptions = [];
                    let list = response.data.list;
                    for (let i = 0; i < list.length; i++) {
                        this.productAttributeCategoryOptions.push({label: list[i].name, value: list[i].id});
                    }
                });
            },
            handleProductAttrChange(value){
                this.getProductAttrList(0, value);
                this.getProductAttrList(1, value);
            },
            getProductAttrList(type, cid) {
                let param = {pageNum:1, pageSize:100, type: type};
                fetchProductAttrList(cid, param).then(response=>{
                    let list = response.data.list;
                    if(type == 0) {
                        this.selectProductAttr = [];
                        for (let i = 0; i < list.length; i++) {
                            let options = [];
                            let values = [];
                            if(this.isEdit) {
                                if(list[i].handAddStatus === 1) {
                                    options = this.getEditAttrOptions(list[i].id);
                                }
                                values = this.getEditAttrValues(i);
                            }

                            this.selectProductAttr.push({
                                id: list[i].id,
                                name: list[i].name,
                                handAddStatus: list[i].handAddStatus,
                                inputList: list[i].inputList,
                                values: values,
                                options:options
                            });
                        }

                        if(this.isEdit) {
                            this.refreshProductAttrPics();
                        }
                    }else {
                        this.selectProductParam = [];
                        for (let i = 0; i < list.length; i++) {
                            let value = null;
                            if(this.isEdit) {
                                value = this.getEditParamValue(list[i].id);
                            }
                            this.selectProductParam.push({
                                id: list[i].id,
                                name: list[i].name,
                                value: value,
                                inputType: list[i].inputType,
                                inputList: list[i].inputList
                            })
                        }
                    }
                });
            },
            refreshProductAttrPics() {
                this.selectProductAttrPics = [];
                if(this.selectProductAttr.length>=1){
                    let values = this.selectProductAttr[0].values;
                    for (let i = 0; i < values.length; i++) {
                        let pic = null;
                        if(this.isEdit) {
                            pic = this.getProductSkuPic(values[i]);
                        }
                        this.selectProductAttrPics.push({name: values[i], pic: pic});
                    }
                }
            },
            getEditParamValue() {

            },
            getEditAttrOptions() {

            },
            getEditAttrValues(index) {
                let values = [];
                if(index === 0) {
                    for (let i = 0; i < this.value.skuStockList.length; i++) {
                        let sku = this.value.skuStockList[i];
                        if(sku.sp1 != null && values.indexOf(sku.sp1) === -1){
                            values.push(sku.sp1);
                        }
                    }
                }else if(index === 1) {
                    for (let i = 0; i < this.value.skuStockList.length; i++) {
                        let sku = this.value.skuStockList[i];
                        if(sku.sp2 != null && values.indexOf(sku.sp2) === -1){
                            values.push(sku.sp2);
                        }
                    }
                }else {
                    for (let i = 0; i < this.value.skuStockList.length; i++) {
                        let sku = this.value.skuStockList[i];
                        if (sku.sp3 != null && values.indexOf(sku.sp3) === -1) {
                            values.push(sku.sp3);
                        }
                    }
                }
            },
            getInputListArr(inputList) {
                return inputList.split(',');
            },
            handleRemoveProductAttrValue(idx, index) {
                this.selectProductAttr[idx].options.splice(index, 1);
            },
            handleAddProductAttrValue(idx) {
                let options = this.selectProductAttr[idx].options;
                if(this.addProductAttrValue == null || this.addProductAttrValue == ''){
                    this.$message({
                        message: '属性值不能为空',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }

                if(options.indexOf(this.addProductAttrValue) != -1) {
                    this.$message({
                        message: '属性值不能重复',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }
                this.selectProductAttr[idx].options.push(this.addProductAttrValue);
                this.addProductAttrValue = null;
            },
            handleRemoveProductSku(index, row) {
                let list = this.value.skuStockList;
                if(list.length === 1) {
                    list.pop();
                }else {
                    list.splice(index, 1);
                }
            },
            handleRefreshProductSkuList() {
                this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                   this.refreshProductAttrPics();
                   this.refreshProductSkuList();
                });
            },
            handleSyncProductSkuPrice(){
                this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    if(this.value.skuStockList!==null&&this.value.skuStockList.length>0) {
                        let price = this.value.skuStockList[0].price;
                        for (let i = 0; i < this.value.skuStockList.length; i++) {
                            this.value.skuStockList[i].price=price;
                        }
                    }
                });
            },
            refreshProductSkuList(){
                this.value.skuStockList = [];
                let skuList = this.value.skuStockList;
                if(this.selectProductAttr.length === 1) {
                    let values = this.selectProductAttr[0].values;
                    for (let i = 0; i < values.length; i++) {
                        skuList.push({
                            spl: values[i]
                        });
                    }
                } else if(this.selectProductAttr.length === 2){
                    let values0 = this.selectProductAttr[0].values;
                    let values1 = this.selectProductAttr[1].values;
                    for (let i = 0; i < values0.length; i++) {
                        if (values1.length === 0) {
                            skuList.push({
                                sp1: values0[i]
                            });
                            continue;
                        }
                        for (let j = 0; j < values1.length; j++) {
                            skuList.push({
                                sp1: values0[i],
                                sp2: values1[j]
                            });
                        }
                    }
                }else {
                    let values0 = this.selectProductAttr[0].values;
                    let values1 = this.selectProductAttr[1].values;
                    let values2 = this.selectProductAttr[2].values;
                    for (let i = 0; i < values0.length; i++) {
                        if (values1.length === 0) {
                            skuList.push({
                                sp1: values0[i]
                            });
                            continue;
                        }
                        for (let j = 0; j < values1.length; j++) {
                            if (values2.length === 0) {
                                skuList.push({
                                    sp1: values0[i],
                                    sp2: values1[j]
                                });
                                continue;
                            }
                            for (let k = 0; k < values2.length; k++) {
                                skuList.push({
                                    sp1: values0[i],
                                    sp2: values1[j],
                                    sp3: values2[k]
                                });
                            }
                        }
                    }

                }
            },
            getProductSkuSp(row, index) {
                if (index === 0) {
                    return row.sp1;
                } else if (index === 1) {
                    return row.sp2;
                } else {
                    return row.sp3;
                }
            },
            getProductSkuPic(){},
            getParamInputList(inputList) {
                return inputList.split(',');
            },
            handlePrev() {
                this.$emit('prevStep')
            },
            handleNext() {
                this.$emit('nextStep')
            }
        },
        created() {
            this.getProductAttrCateList();
        },
        computed: {
            hasAttrPic() {
                if(this.selectProductAttrPics.length < 1) {
                    return false;
                }else {
                    return true;
                }
            },
            selectProductPics: {
                get: function () {
                    let pics=[];
                    if(this.value.pic===undefined||this.value.pic==null||this.value.pic===''){
                        return pics;
                    }
                    pics.push(this.value.pic);
                    if(this.value.albumPics===undefined||this.value.albumPics==null||this.value.albumPics===''){
                        return pics;
                    }
                    let albumPics = this.value.albumPics.split(',');
                    for(let i=0;i<albumPics.length;i++){
                        pics.push(albumPics[i]);
                    }
                    return pics;
                },
                set: function (newValue) {
                    if (newValue == null || newValue.length === 0) {
                        this.value.pic = null;
                        this.value.albumPics = null;
                    } else {
                        this.value.pic = newValue[0];
                        this.value.albumPics = '';
                        if (newValue.length > 1) {
                            for (let i = 1; i < newValue.length; i++) {
                                this.value.albumPics += newValue[i];
                                if (i !== newValue.length - 1) {
                                    this.value.albumPics += ',';
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {SingleUpload, MultiUpload, Tinymce}
    }
</script>

<style scoped>
    .littleMarginLeft{
        margin-left: 10px;
    }
    .cardBg{
        background: #F8F9FC;
    }

    .paramInputLabel{
        display: inline-block;
        width: 100px;
        text-align: right;
        padding-right: 10px;
    }

    .paramInput{
        width: 250px;
    }

    .littleMarginTop {
        margin-top: 10px;
    }
</style>
