<template>
  <div class="main_content">
    <!-- 路径词条 -->
    <div>
      <vue-scroll :ops="pathOps" ref="pathVs" @handle-resize="handleResize">
        <div class="url-path">
          <div v-for="(h, index) in hs" :key="index" @click="gopage(h, index)">
            {{ h.preName }}
          </div>
        </div>
      </vue-scroll>
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
      <!-- 样式切换 -->
      <div class="back-box" @click="backToPrevious">
        <button>
          <svg-icon iconClass="back_3" className="list-btn-switch"></svg-icon>
        </button>
      </div>
    </div>

    <div
      :style="{ height: scrollerHeight }"
      class="scroll_content"
      v-loading="loading"
      element-loading-text="o(*≧▽≦)ツ加载中~"
    >
      <vue-scroll
        :ops="ops"
        @handle-scroll="handleScroll"
        style="width: 100%; height: 100%"
        ref="vs"
        v-if="this.contents && this.contents.length > 0"
      >
        <div class="main_scroll_content">
          <ul :class="listType == true ? 'list-file-ul' : ''">
            <li
              v-for="(c, index) in contents"
              :key="index"
              @click="go(c)"
              class="line"
              @touchstart="gtouchstart(c)"
              @touchmove="gtouchmove()"
              @touchend="showDeleteButton(c)"
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

      <el-empty
        description="(ง •̀_•́)ง没有数据了"
        v-else
        image=""
        :image-size="200"
        class="empty-msg-box"
      ></el-empty>
    </div>
    <back-top v-show="backTopVisible" @click.native="backToTop()"></back-top>
    <div class="util-col">
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

      <!-- 长按菜单 -->
    <div class="long-menu-box">
      <el-dialog 
      :title="this.currentLongChecked.type+'  '+this.currentLongChecked.preName"
      :visible.sync="outerVisible" 
      width="80%"
      :show-close = false>

          <ul class="operate-menu">
            <li v-show="this.currentLongChecked.type=='folder'" @click="innerVisible=true">上传文件</li>
            <li v-show="this.currentLongChecked.type=='file' ">下载此文件</li>
            <li @click="deleteFileButton()">删除此{{this.currentLongChecked.type=='file'? '文件' : '文件夹'}} </li>
          </ul>

          <!-- 删除提示 -->
          <div>
              <el-dialog
          title="删除"
          :visible.sync="deleteConfirmdialogVisible"
          append-to-body
          width="40%"
          :before-close="handleClose">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteConfirmdialogVisible = false">取 消</el-button>
            <el-button @click="gotoDeleteFile()">确 定</el-button>
          </span>
            </el-dialog>
          </div>

        <div class="upload-file-box">
         <el-dialog
          width="60%"
          title="上传"
          :visible.sync="innerVisible"
          append-to-body
        >
             <el-upload
                class="upload-demo"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" style="margin-left:-20px" >选取文件</el-button>
                <el-button  @click="submitUpload">上传</el-button>
              </el-upload>
        </el-dialog>
          </div>   


        

      </el-dialog>
    </div>
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
import { getFileList,deleteFile } from "@/network/base"; //引入自己封装的axios请求函数
import BackTop from "../components/backTop/BackTop.vue";
import { love } from "@/utils/love";
export default {
  name: "index",
  components: { BackTop },

  data() {
    return {
      listType: true,
      contents: [1, 2, 3],
      loading: false,
      backTopVisible: false,
      currentPath: "",
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
      pathOps: {
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
          keepShow: false, //滚动条是否保持显示。
          background: "#d9dcda", //滚动条背景色。
          opacity: 1, //滚动条透明度。
          hoverStyle: false,
          specifyBorderRadius: false, //是否指定滚动条的 borderRadius， 如果不那么和轨道的保持一致。
          minSize: false, //为 bar 设置一个最小尺寸, 从 0 到 1. 如 0.3, 代表 30%.
          size: "2px", //bar 的尺寸。
          disable: true, //是否禁用滚动条。
        },
      },
      serachValue: "",
      timeOutEvent: 0, //长按操作相关
      outerVisible: false, //长按菜单
      innerVisible: false,
      deleteConfirmdialogVisible:false,
      currentLongChecked:{
        preName:""
      },   //当前被长按选择的文件/文件夹
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    };
  },
  computed: {
    // 滚动区高度
    scrollerHeight: function () {
      return document.documentElement.clientHeight - 30 - 40 - 41 - 5 + "px"; //自定义高度需求  不知道这多的5px哪来的..
    },
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
  mounted() {
    // love();
  },
  methods: {
    /**
     * 进入下一级目录或文件夹
     */
    go(content) {
      var type = content.type;
      var path = content.path;
      var preName = content.preName;

      var newGo = this.currentPath + "\\" + preName;
      // 此时是root路径不用加斜杠
      if (this.currentPath == "") {
        newGo = preName;
      }
      if (type === "folder") {
        //调接口  进入此文件夹的内容
        this.loading = true;
        getFileList(newGo, null).then((res) => {
          this.contents = res.data;
          this.hs.push(content);
          this.currentPath = newGo;
          this.loading = false;
          //新进子目录滚动条归到最前面  滚到某个div的位置  过渡速度为0
          if (this.$refs["vs"]) {
            this.$refs["vs"].scrollIntoView(".main_scroll_content", 0);
          }
          // 搜索内容清空
          this.serachValue = "";
        });
      } else if (type === "file") {
        debugger;
        //路径 正斜杠替换反斜杠
        var z = path.replace(/\\/g, "/");
        // url前缀路径+文件路径
        var gohref = this.$store.state.goP + z;
        //盘符路径   替换掉盘符路径 直接就是nginx可以代理的路径
        var nginxPath = gohref.replace(/C:/g, "");

        if (gohref.indexOf("E:") !== -1) {
          // 端口转换 6688转到6695
          nginxPath = nginxPath.replace(/6688/g, "6695");
        }
        //打开
        window.open(nginxPath, "_blank");
      }
    },

    /**
     * 跳到某一个路径
     */
    gopage(content, index) {
      //跳到点击位置的索引   index 后面的内容直接干掉
      var fds = this.hs.slice(0, index + 1);
      this.hs = fds;

      this.currentPath = content.path;
      //调接口  进入此文件夹的内容
      this.loading = true;
      getFileList(this.currentPath, null).then((res) => {
        this.contents = res.data;
        this.loading = false;
        // 滚动条位置 设置
        if (this.$refs["vs"]) {
          this.$refs["vs"].scrollIntoView(".main_scroll_content", 0);
        }
        // 搜索内容清空
        this.serachValue = "";
      });

      // 回到了root 路径
      if (content.path == "root") {
        this.currentPath = "";
      }
    },

    /**
     * 切换盘符
     */
    switchToAn() {
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

    /**
     * 切换为表格/列表样式
     */
    switchList() {
      this.listType = !this.listType;
      this.$refs["vs"].scrollIntoView(".main_scroll_content", 0);
    },

    initList() {
      getFileList(this.$store.state.realPath, null).then((res) => {
        this.contents = res.data;
        this.isRoot = true;
      });
    },

    handleScroll(vertical, horizontal, nativeEvent) {
      // console.log(vertical.scrollTop)
      // 滚动超过400 就出现backtop图标
      if (vertical.scrollTop >= 400) {
        this.backTopVisible = true;
      } else {
        this.backTopVisible = false;
      }
    },

    backToTop() {
      this.$refs["vs"].scrollIntoView(".main_scroll_content", 100);
    },

    /**
     *  使url path的滚动条到最后
     */
    scrollLast() {
      this.$refs["pathVs"].scrollTo(
        {
          x: "100%",
        },
        0,
        "easeInQuad"
      );
    },

    /**
     * url path的内容发生变化后 滚动条滚到最后
     */
    handleResize() {
      // console.log('content has resized!')
      this.scrollLast();
    },

    /**
     * 返回上一级
     */
    backToPrevious() {
      if (this.currentPath == "") {
        this.$message({
          message: "(˃ ⌑ ˂ഃ )客官,返回不了啦",
          duration: 1000,
          showClose: false,
          iconClass: null,
        });
        return;
      }
      // 当前返回上一级后的菜单index -1
      let currentIndex = this.hs.length - 1 - 1;
      let currentContent = this.hs[currentIndex];
      //跳到上一层位置
      this.gopage(currentContent, currentIndex);
    },

    //长按事件（起始）
    gtouchstart(item) {
      var self = this;
      this.timeOutEvent = setTimeout(function () {
        self.longPress(item);
      }, 500); //这里设置定时器，定义长按500毫秒触发长按事件
      return false;
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    showDeleteButton(item) {
      clearTimeout(this.timeOutEvent); //清除定时器
      if (this.timeOutEvent != 0) {
        //这里写要执行的内容（如onclick事件）
        console.log("点击但未长按");
      }
      return false;
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gtouchmove() {
      clearTimeout(this.timeOutEvent); //清除定时器
      this.timeOutEvent = 0;
    },
    //真正长按后应该执行的内容
    longPress(val) {
      this.timeOutEvent = 0;
      //执行长按要执行的内容，如弹出菜单

      console.log("长按");
      this.outerVisible = true;

      this.currentLongChecked = val;
      // end
    },


     submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },

      handleClose(){},

      /**
       *  删除此路径文件或文件夹
       */
      deleteFileButton(){
        let currentFile = this.currentLongChecked;
        this.deleteConfirmdialogVisible = true;
      },

      gotoDeleteFile(){
          deleteFile(this.currentLongChecked.path).then(res=>{
           this.$message({
          message: res.msg,
          duration: 1000,
          showClose: false,
          iconClass: null,
        });
      if(res.code==200){
        this.deleteConfirmdialogVisible = false;
        this.outerVisible = false;
        this.flushCurrentPath();
      } 
          });
      
      },

      flushCurrentPath(){
          getFileList(this.currentPath, null).then((res) => {
          this.contents = res.data;
      });
      }


  },

  
};
</script>

<style scoped >
.main_content {
  width: 90%;
  margin: 0 auto;
  height: 100%;
  position: relative;
}

.prename {
  text-align: center;
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

.url-path {
  color: #42859396;
  line-height: 30px;
  display: flex;
  word-break: keep-all; /* 内容/字不换行 */
  white-space: nowrap; /* 不换行 */
}

.url-path div {
  cursor: pointer;
  margin-left: 4px;
  margin-right: 4px;
}

.url-path div:after {
  content: " /";
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

button {
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
  height: calc(100% - 100px);
  border: #ead9d9 solid 1px;
  border-bottom: none;
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
  height: 100%;
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
  margin: auto;
}

.file-svg-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  margin-top: 5px;
}

.main_scroll_content li:hover .svg-file-icon {
  scale: 1.1 1.1;
  transition: all 0.8s;
}

.empty-msg-box {
  margin-top: 150px;
}

.util-col {
  display: flex;
  flex-direction: row-reverse;
  height: 40px;
  background-color: #fff;
  border: #ead9d9 solid 1px;
  border-top: none;
}

/** element ui 样式穿透 保证不会影响到其他位置的样式 */
.long-menu-box >>> .el-dialog__header {
  background-color: #edeeee;
}

* >>> .el-dialog__body
{
      padding: 10px 0px 10px 20px
}

.upload-file-box >>> .el-dialog__header{
    margin: 0;
    padding: 0;
}

.operate-menu {
  display: flex;
}

.operate-menu li {
  width: 100%;
  line-height: 40px;
  margin-bottom: 5px;
  color:#000
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
  margin-left: 0%;
  margin-right: 0%;
}

.list-file-ul li:hover .prename {
  color: #72c8c4;
}

/* list style end */
</style>