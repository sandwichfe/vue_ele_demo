<template>
    <div class="back-top">

        <svg-icon
            iconClass="backtop"
            className="bt-icon"
          ></svg-icon>


    </div>
</template>

<script>
    export default {
        name: "BackTop"
    }
</script>

<style scoped>
    .back-top {
        position: fixed;
        right: 12%;
        bottom: 5rem;
    }
    .back-top .bt-icon {
        width: 43px;
        height: 43px;
    }
</style>