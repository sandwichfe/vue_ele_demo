<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    #app {
      margin-left: auto;
        width: 100%;
        height: 100%;
    }
    /*清除点击时的高亮颜色*/
    a,
    input,
    button,
    div {
     -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
</style>
