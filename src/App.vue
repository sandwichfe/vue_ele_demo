<!--
 * @Author: sandwichfe 1344382941@qq.com
 * @Date: 2022-08-10 10:06:38
 * @LastEditors: sandwichfe 1344382941@qq.com
 * @LastEditTime: 2022-08-29 13:27:21
 * @FilePath: \vue_ele_demo\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style>
    * {
        margin: 0;
        padding: 0;
        /** 取消移动端默认的长按选中文字 */
        -webkit-touch-callout: none !important;
        -webkit-user-select: none;
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
    /*清除ios下的默认圆角*/
input,
button {
  -webkit-appearance: none;
  border-radius: 0;
}
body {
  -webkit-text-size-adjust: 100%;/*禁止文字缩放*/
}
body * {
  font-family: helvetica; /*默认字体设置*/
}

</style>
