<template>
    <div class="app-wrapper" :class="classObj">
        <div class="main-container">
            <navbar></navbar>
        </div>
    </div>
</template>

<script>
    import { Navbar } from "@/views/layout/components";

    export default {
        name: "Layout",
        components: {
            Navbar
        }
    }
</script>

<style scoped>

</style>
