<template>
    <div>ProductCateDetail.vue {{isEdit}}</div>
</template>

<script>
    export default {
        name: "ProductCateDetail",
        props:{
            isEdit:{
                type:Boolean,
                default:false
            }
        }
    }
</script>

<style scoped>

</style>
