<template>
    <brand-detail :is-edit='false'></brand-detail>
</template>

<script>
    import BrandDetail from "./components/BrandDetail";
    export default {
        name: "add",
        components: {BrandDetail}
    }
</script>

<style scoped>

</style>
