<template>
<el-container style="height: 500px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1']"  :default-active="'1-1'">
            <!--默认展开的选项    默认被选中的选项  通过index关联-->
            <el-submenu index="1">   <!--一个可开关的分组-->
                <template slot="title"><i class="el-icon-setting"></i>导航一</template>
                <el-menu-item-group>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
        <el-menu>
            <el-submenu index="1">   <!--一个可开关的分组-->
                <template slot="title"><i class="el-icon-setting"></i>导航二</template>
                <el-menu-item-group>
                    <el-menu-item index="2-1">选项1</el-menu-item>
                    <el-menu-item index="2-2">选项2</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </el-aside>

        <el-main>

        </el-main>
</el-container>
</template>

<style>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }
</style>

<script>
    export default {
        data() {
            const item = {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            };
            return {
                tableData: Array(20).fill(item)
            }
        }
    };
</script>