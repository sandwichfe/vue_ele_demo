<template>
   <div class="main_content">

    <div class="head_bg">
      <div class="head">
        <el-breadcrumb class="bottom clearfix">
          <el-breadcrumb-item v-for="(h, index) in hs" :key="index" @click.native="gopage(h,index)">{{
              h.preName
            }}
          </el-breadcrumb-item>
          <div class="switch" @click="switchToAn()"> {{this.$store.state.realPath}}切换</div>
        </el-breadcrumb>
      </div>

    </div>

    <div class="scroll_content">
      <vue-scroll :ops="ops" style="width:100%;height:100%" ref="vs">
        <div class="main_scroll_content">


          <ul>
            <li v-for="(c, index) in contents" :key="index" @click="go(c)" class="line">
              <div class="filetype">{{ c.type }}</div>
              <div class="prename"> {{ c.preName }}</div>
            </li>
          </ul>
          

        </div>
      </vue-scroll>

    </div>


    <el-backtop ></el-backtop>


  </div>


</template>

<script>
import {request} from '../network/request'   //引入自己封装的axios请求函数

export default {
  name: "index",
  data() {
    return {
      currentDate: new Date(),
      contents: [1, 2, 3],
      loading: false,
      currentPath: this.$store.state.realPath,
      hs: [{type: "folder", path: this.$store.state.realPath, preName: "首页"}],
      ops: {
        vuescroll: {
          mode: "native",  //模式:pc natice 移动端是slice
          sizeStrategy: "percent",  //父元素是否是固定的是就percent 不是就是number 填一个数值
          detectResize: true,  //内容是否根据页面调整
        },
        scrollPanel: {
          initialScrollY: false,  //初始化距离顶部的位置
          initialScrollX: false,  //初始化距离左侧的位置
          scrollingX: true,  // 是否开启横向滚动
          scrollingY: true,  //是否开启竖向滚动
          speed: 300,       //多长时间内完成一次滚动。 数值越小滚动的速度越快。
          easing: 'easeInQuad', //默认动画
          verticalNativeBarPos: "right",
          maxHeight: undefined,  //这是滚动条最大高度,内容高度小于 maxHeight 时高度自适应，超出的话出现滚动条。
          maxWidth: undefined,   //这是滚动条最大宽度,内容宽度小于 maxWidth 时高度自适应，超出的话出现滚动条。
        },
        rail: {
          background: "#ffffff", //轨道的背景色。
          opacity: 0.5,            //轨道的透明度。 0是透明，1是不透明
          size: "6px",             //轨道的尺寸。
          specifyBorderRadius: false, //是否指定轨道的 borderRadius， 如果不那么将会自动设置。
          gutterOfEnds: null,
          gutterOfSide: "0px",      //距离容器的距离
          keepShow: false,          //是否即使 bar 不存在的情况下也保持显示。
        },
        bar: {
          showDelay: 500,             //在鼠标离开容器后多长时间隐藏滚动条。
          onlyShowBarOnScroll: true,  //是否只在滚动时显示 bar。
          keepShow: true,            //滚动条是否保持显示。
          background: "#d9dcda",      //滚动条背景色。
          opacity: 1,                 //滚动条透明度。
          hoverStyle: false,
          specifyBorderRadius: false,  //是否指定滚动条的 borderRadius， 如果不那么和轨道的保持一致。
          minSize: false,              //为 bar 设置一个最小尺寸, 从 0 到 1. 如 0.3, 代表 30%.
          size: "6px",                 //bar 的尺寸。
          disable: false,              //是否禁用滚动条。
        },
      },
      sgo: true,
    };
  },
  activated() {  //用户点击进入时执行的方法
    console.log('init');
  },
  deactivated() {  //用户离开（点了别的组件）时执行的方法
    //离开时保存
    console.log('离开了');
  },

  created() {
    request({
      method: 'post',
      url: '/file/list1',
      params: {
        path: this.$store.state.realPath,
      }
    }).then(res => {
      this.contents = res.data
    })
  },
  methods: {
    go(content) {
      this.loading = true
      var type = content.type;
      var path = content.path;
      var preName = content.preName;

      var newGo = this.currentPath + "\\" + preName
      if (type === "folder") {
        //调接口  进入此文件夹的内容
        request({
          method: 'post',
          url: '/file/list1',
          params: {
            path: newGo,
          }
        }).then(res => {
          this.contents = res.data
          //关闭loading动画
          this.loading = false
          this.hs.push(content)

          this.currentPath = newGo;

          //新进子目录滚动条归到最前面  滚到某个div的位置  过渡速度为0
          this.$refs["vs"].scrollIntoView(".main_scroll_content", 0);

        })
      } else if (type === "file") {
        //正斜杠替换反斜杠
        var z = path.replace(/\\/g, "/");
        //前缀路径替换
        var zreg = new RegExp('this.$store.state.realPath' + '/', "g"); //g代表全部
        var aba = (z).replace(zreg, '');
        //this.$router.push('http://localhost:6688/' + aba)
        var gohref = this.$store.state.goP + aba


        //正斜杠替换反斜杠
        var z22 = gohref.replace(/D:/g, "");

        if (gohref.indexOf("E:")!==-1){
          z22 = z22.replace(/E:/g, "");
          z22 = z22.replace(/6688/g, "6695");
        }


        //前缀路径替换
        var zreg22 = new RegExp('this.$store.state.realPath' + '/', "g"); //g代表全部
        var aba22 = z22.replace(zreg22, '');
        window.open(aba22, '_blank');
        this.loading = false
      }
    },


    gopage(content, index) {

      //跳到点击位置的索引   index 后面的内容直接干掉
      //this.hs =
      var fds = this.hs.slice(0, index + 1)
      this.hs = fds
      this.loading = false
      var path = content.path;
      var preName = content.preName;

      this.currentPath = content.path;


      //调接口  进入此文件夹的内容
      request({
        method: 'post',
        url: '/file/list1',
        params: {
          path: this.currentPath,
        }
      }).then(res => {
        this.contents = res.data
        //关闭loading动画
        this.loading = false
        // 滚动条位置 设置
        this.$refs["vs"].scrollIntoView(".main_scroll_content", 0);
      })
    },


    switchToAn() {
      if (this.sgo == true) {
        this.sgo = false
      } else if (this.sgo == false) {
        this.sgo = true
      }
      this.$store.commit('changeP', this.sgo)

      request({
        method: 'post',
        url: '/file/list1',
        params: {
          path: this.$store.state.realPath,
        }
      }).then(res => {
        this.contents = res.data
      })
      this.currentPath = this.$store.state.realPath;
      this.hs = [{type: "folder", path: this.$store.state.realPath, preName: "首页"}]


      request({
        method: 'post',
        url: '/file/list2',
        params: {
        }
      }).then(res => {
        this.contents = res.data

        this.$message({
          message: '你的ip为：'+res,
          type: 'success'
        });

      })

    }

  },


}
</script>

<style scoped >


.filetype {
  margin-top: 5px;
  color:#c5a3a3;
}

.prename {
  height: 30px;
  margin-top: 5px;
  margin-bottom: 0px;
  color: black;
}

ul {
  list-style: none;
}

li {
  width: 100%;
  height: 50px;
}

.line {
  background-color: #FFFFFF;
  width: 10rem;
  height: 10rem;
}

.switch {
  cursor: pointer;
  line-height: 30px;
  float: right;
  margin-right: 2%;;
}

.main_content {
  position: absolute;
  left: 50%;
  right: 50%;
  top: 5%;
  transform: translateX(-50%);
  width: 90%;
  height: 60%;
}

.head_bg {
  background-color: #e6ebe7ab;
}

.head {
  margin-left: auto;
  line-height: 30px;
  height: 30px;
  width: 99%;

}

/* 里面就是一个一个的span */
.head span {
  cursor: pointer;
  line-height: 30px;
}

.scroll_content {
  height: 700px;
  width: 100%;
  border: #ead9d9 solid 1px;
}

.main_scroll_content {
  margin-left: auto;
  width: 99%;
  height: 800px;
}


el-breadcrumb-item {
  font-size: 16px;
}


.bottom {
  font-size: 16px;
  line-height: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>