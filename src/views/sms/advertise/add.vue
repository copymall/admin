<template>
    <home-advertise-detail :is-edit="false"></home-advertise-detail>
</template>

<script>
    import HomeAdvertiseDetail from "./components/HomeAdvertiseDetail";
    export default {
        name: "addHomeAdvertise",
        components: {HomeAdvertiseDetail}
    }
</script>

<style scoped>

</style>