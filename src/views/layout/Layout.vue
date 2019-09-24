<template>
    <div class="app-wrapper">
        <div class="main-container">
            <navbar></navbar>
        </div>
    </div>
</template>

<script>

    import Navbar from "./components/Navbar";

    export default {
        name: "Layout",
        components: {
            Navbar
        },
        computed: {

        }
    }
</script>

<style scoped>

</style>
