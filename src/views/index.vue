<template>
  <div class="main_content">
    <!-- 路径词条 -->
    <div>
      <el-breadcrumb class="bread">
        <el-breadcrumb-item
          class="bread-item"
          v-for="(h, index) in hs"
          :key="index"
          @click.native="gopage(h, index)"
          >{{ h.preName }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>

    <div class="head head_bg">
      <!-- 搜索 -->
      <div class="keyword-select">
        <el-input
          v-model="serachValue"
          placeholder="请输入内容"
          ref="keywordSelect"
          clearable
        ></el-input>
      </div>
      <!-- 盘符切换 -->
      <div class="switch" @click="switchToAn()">
        {{ this.$store.state.realPath }}切换
      </div>
      <!-- 样式切换 -->
      <div class="show-box" @click="switchList()">
        <button>
          <svg-icon
            iconClass="list-icon"
            className="list-btn-switch"
            v-if="listType == false"
          ></svg-icon>
          <svg-icon
            iconClass="app-icon"
            className="list-btn-switch"
            v-if="listType == true"
          ></svg-icon>
        </button>
      </div>
    </div>

    <div class="scroll_content"  
    v-loading="loading"
    element-loading-text="o(*≧▽≦)ツ加载中~"
    >
      <vue-scroll :ops="ops" @handle-scroll="handleScroll" 
      style="width: 100%; height: 100%" 
      ref="vs"  v-if="this.contents&&this.contents.length>0">
        <div class="main_scroll_content">
          <ul :class="listType == true ? 'list-file-ul' : ''">
            <li
              v-for="(c, index) in contents"
              :key="index"
              @click="go(c)"
              class="line"
            >
              <div class="file-li-item">
                <div class="file-svg-icon">
                  <svg-icon
                    v-if="c.type == 'folder'"
                    iconClass="dir-1"
                    className="dirIcon"
                    class="svg-file-icon"
                  ></svg-icon>
                  <svg-icon
                    v-if="c.type == 'file'"
                    iconClass="file-1"
                    className="fileIcon"
                    class="svg-file-icon"
                  ></svg-icon>
                </div>
                <div class="prename">{{ c.preName }}</div>
              </div>
            </li>
            <i></i
            ><i></i
            ><i></i
            ><i></i
            ><i></i
            ><i></i
            ><i></i>
          </ul>
        </div>
      </vue-scroll>

      <el-empty description="(ง •̀_•́)ง没有数据了" 
      v-else 
      image=""
      :image-size="200"
      class="empty-msg-box"></el-empty>

    </div>  
    <back-top v-show="backTopVisible" @click.native="backToTop()"></back-top>

  </div>
</template>

<script>
// 节流函数
const delay = (function () {
  let timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
import { getFileList } from "@/network/base"; //引入自己封装的axios请求函数
import BackTop from '../components/backTop/BackTop.vue';
export default {
  name: "index",
  components: {BackTop},
  data() {
    return {
      listType: true,
      contents: [1, 2, 3],
      loading: false,
      backTopVisible: false,
      currentPath: this.$store.state.realPath,
      hs: [
        { type: "folder", path: this.$store.state.realPath, preName: "首页" },
      ],
      ops: {
        vuescroll: {
          mode: "native", //模式:pc natice 移动端是slice
          sizeStrategy: "percent", //父元素是否是固定的是就percent 不是就是number 填一个数值
          detectResize: true, //内容是否根据页面调整
        },
        scrollPanel: {
          initialScrollY: false, //初始化距离顶部的位置
          initialScrollX: false, //初始化距离左侧的位置
          scrollingX: true, // 是否开启横向滚动
          scrollingY: true, //是否开启竖向滚动
          speed: 300, //多长时间内完成一次滚动。 数值越小滚动的速度越快。
          easing: "easeInQuad", //默认动画
          verticalNativeBarPos: "right",
          maxHeight: undefined, //这是滚动条最大高度,内容高度小于 maxHeight 时高度自适应，超出的话出现滚动条。
          maxWidth: undefined, //这是滚动条最大宽度,内容宽度小于 maxWidth 时高度自适应，超出的话出现滚动条。
        },
        rail: {
          background: "#ffffff", //轨道的背景色。
          opacity: 0.5, //轨道的透明度。 0是透明，1是不透明
          size: "6px", //轨道的尺寸。
          specifyBorderRadius: false, //是否指定轨道的 borderRadius， 如果不那么将会自动设置。
          gutterOfEnds: null,
          gutterOfSide: "0px", //距离容器的距离
          keepShow: false, //是否即使 bar 不存在的情况下也保持显示。
        },
        bar: {
          showDelay: 500, //在鼠标离开容器后多长时间隐藏滚动条。
          onlyShowBarOnScroll: true, //是否只在滚动时显示 bar。
          keepShow: true, //滚动条是否保持显示。
          background: "#d9dcda", //滚动条背景色。
          opacity: 1, //滚动条透明度。
          hoverStyle: false,
          specifyBorderRadius: false, //是否指定滚动条的 borderRadius， 如果不那么和轨道的保持一致。
          minSize: false, //为 bar 设置一个最小尺寸, 从 0 到 1. 如 0.3, 代表 30%.
          size: "6px", //bar 的尺寸。
          disable: false, //是否禁用滚动条。
        },
      },
      sgo: true,
      serachValue: "",
    };
  },
  watch: {
    //watch serachValue change
    serachValue() {
      delay(() => {
        this.remoteMethod(this.serachValue);
      }, 300);
    },
  },
  activated() {
    //用户点击进入时执行的方法
    console.log("init");
  },
  deactivated() {
    //用户离开（点了别的组件）时执行的方法
    //离开时保存
    console.log("离开了");
  },
  created() {
    this.initList();
  },
  methods: {
    go(content) {
      var type = content.type;
      var path = content.path;
      var preName = content.preName;

      var newGo = this.currentPath + "\\" + preName;
      if (type === "folder") {
        //调接口  进入此文件夹的内容
        this.loading = true;
        getFileList(newGo, null).then((res) => {
          this.contents = res.data;
          this.hs.push(content);
          this.currentPath = newGo;
          this.loading = false;
          //新进子目录滚动条归到最前面  滚到某个div的位置  过渡速度为0
          if(this.$refs["vs"]){
            this.$refs["vs"].scrollIntoView(".main_scroll_content", 0);
          }
          // 搜索内容清空
          this.serachValue = "";
        });
      } else if (type === "file") {
        //正斜杠替换反斜杠
        var z = path.replace(/\\/g, "/");
        //前缀路径替换
        var zreg = new RegExp("this.$store.state.realPath" + "/", "g"); //g代表全部
        var aba = z.replace(zreg, "");
        var gohref = this.$store.state.goP + aba;

        //正斜杠替换反斜杠
        var z22 = gohref.replace(/D:/g, "");

        if (gohref.indexOf("E:") !== -1) {
          z22 = z22.replace(/E:/g, "");
          z22 = z22.replace(/6688/g, "6695");
        }

        //前缀路径替换
        var zreg22 = new RegExp("this.$store.state.realPath" + "/", "g"); //g代表全部
        var aba22 = z22.replace(zreg22, "");
        window.open(aba22, "_blank");
      }
    },

    gopage(content, index) {
      //跳到点击位置的索引   index 后面的内容直接干掉
      //this.hs =
      var fds = this.hs.slice(0, index + 1);
      this.hs = fds;
      this.currentPath = content.path;

      //调接口  进入此文件夹的内容
      this.loading = true;
      getFileList(this.currentPath, null).then((res) => {
        this.contents = res.data;
        this.loading = false;
        // 滚动条位置 设置
         if(this.$refs["vs"]){  
            this.$refs["vs"].scrollIntoView(".main_scroll_content", 0);
          }
        // 搜索内容清空
        this.serachValue = "";
      });
    },

    switchToAn() {
      this.loading = true;
      if (this.sgo == true) {
        this.sgo = false;
      } else if (this.sgo == false) {
        this.sgo = true;
      }
      this.$store.commit("changeP", this.sgo);

      this.initList();
      this.currentPath = this.$store.state.realPath;
      this.hs = [
        { type: "folder", path: this.$store.state.realPath, preName: "首页" },
      ];
      this.loading = false;
    },

    // 搜索框内每一次输入都会执行的事件
    remoteMethod(query) {
      if (query !== "") {
        setTimeout(() => {
          this.loading = true;
          getFileList(this.currentPath, query).then((res) => {
            this.contents = res.data;
            this.loading = false;
          });
        }, 200);
      } else {
        this.loading = true;
        getFileList(this.currentPath, null).then((res) => {
          this.contents = res.data;
          this.loading = false;
        });
      }
    },

    switchList() {
      this.listType = !this.listType;
    },

    initList() {
      getFileList(this.$store.state.realPath, null).then((res) => {
        this.contents = res.data;
      });
    },


     handleScroll(vertical, horizontal, nativeEvent) {
                // console.log(vertical.scrollTop)
        // 滚动超过400 就出现backtop图标
          if(vertical.scrollTop>=400){
            this.backTopVisible = true;
          }else{
            this.backTopVisible = false;
          }
     },

     backToTop(){
        this.$refs["vs"].scrollIntoView(".main_scroll_content", 100);
     }

  },
};
</script>

<style scoped >
.main_content {
  width: 90%;
  margin: 0 auto;
  height: 100%;
}

.prename {
  height: 30px;
  line-height: 30px;
  margin-top: 5px;
  margin-bottom: 0px;
  color: black;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dirIcon {
  width: 40px;
  height: 40px;
  margin-left: auto;
  fill: currentColor;
  color: #c7cad4;
}

.fileIcon {
  width: 40px;
  height: 40px;
  margin-left: auto;
  fill: currentColor;
  color: #c8dae2;
}

.head {
  margin-left: auto;
  line-height: 40px;
  height: 40px;
  background-color: #e6ebe7ab;
  display: flex;
  justify-content: space-between;
}

.bread {
  line-height: 30px;
}

.bread-item {
  cursor: pointer;
}

.keyword-select {
  line-height: 40px;
  flex: 12;
}

.switch {
  line-height: 40px;
  /* flex: 1; */
  flex-shrink: 0;
  margin-right: 5px;
  cursor: pointer;
}

.show-box {
  /* flex: 1; */
  flex-shrink: 0;
}

.show-box button {
  cursor: pointer;
  border: 0; /* 清除默认边框 */
  outline: none;
  background-color: transparent; /*清除默认背景 */
}

.list-btn-switch {
  width: 40px;
  height: 40px;
  line-height: 40px;
}

.scroll_content {
  height: 700px;
  border: #ead9d9 solid 1px;
}

.loading-icon {
    background: #000;
}

ul {
  /* background-color: rgb(95, 68, 68); */
  list-style: none;
  display: flex;
  flex-wrap: wrap; /** 子元素li超出换行 */
  justify-content: space-between; /**居中 从左往右 */
}

.main_scroll_content li {
  height: 120px;
}

ul > i {
  width: 10rem;
}

.line {
  width: 10rem;
  height: 10rem;
}

.file-li-item {
  width: 80%;
  margin-left: auto;
}

.file-svg-icon {
  margin-top: 5px;
}

.main_scroll_content li:hover .svg-file-icon {
  scale: 1.1 1.1;
  transition: all 0.8s;
}

.empty-msg-box {
  margin-top: 150px;
}

/* list style */
.list-file-ul {
  display: flex;
}

.list-file-ul .prename {
  margin-left: 10px;
}
.list-file-ul li {
  border: #e8f3f2 1px solid;
  width: 100%;
  height: 60px;
}
.list-file-ul .file-li-item {
  width: 100%;
  margin: 0 auto;
  display: flex;
  height: 40px;
  margin-top: 10px;
}

.list-file-ul .file-svg-icon {
  margin-top: 0;
}

.list-file-ul li:hover .prename {
  color: #72c8c4;
}

/* list style end */
</style>