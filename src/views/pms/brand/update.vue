<template>
    <brand-detail :is-edit='true'></brand-detail>
</template>

<script>
    import BrandDetail from "./components/BrandDetail";
    export default {
        name: "update",
        components: {BrandDetail}
    }
</script>

<style scoped>

</style>
