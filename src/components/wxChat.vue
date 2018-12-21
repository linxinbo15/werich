//微信聊天可视化组件
//依赖scrollLoader组件, 依赖指令v-emotion（实现请查看main.js）

//参数：
// width               组件宽度，默认450
// wrapBg              外层父元素背景颜色，默认#efefef
// maxHeight           展示窗口最高高度, 默认900
// contactAvatarUrl    好友头像url
// ownerAvatarUrl      微信主人头像url
// ownerNickname       微信主人昵称
// getUpperData        （必需）当滚动到上方时加载数据的方法，返回值要为Promise对象，resolve的结构同data
// getUnderData        （必需）当滚动到下方时加载数据的方法，返回值同上
// data                （必需）传入初始化数据， 结构如下：
[{
direction: 2, //为2表示微信主人发出的消息，1表示联系人
id: 1, //根据这个来排序消息
type: 1, //1为文本，2为图片
content: '你好!![呲牙]', //当type为1时这里是文本消息，当type2为2时这里要存放图片地址；后续会支持语音的显示
ctime: new Date().toLocaleString() //显示当前消息的发送时间
},
{
direction: 1,
id: 2,
type: 1,
content: '你也好。[害羞]',
ctime: new Date().toLocaleString()
}]


<style scoped>
  .wxchat-container {
    padding-top: 46px;
    padding-bottom: 57px;
  }

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: .2;
  }

  .window {
    box-shadow: 1px 1px 20px -5px #000;
    background: #F5F5F5;
    margin: 0 auto;
    overflow: hidden;
    padding: 0;
    height: 100%;
    position: relative;
    z-index: 99;
  }

  button {
    border: 0;
    background: none;
    border-radius: 0;
    text-align: center;
  }

  button {
    outline: none;
  }

  .w100 {
    width: 100%;
  }

  .mt5 {
    margin-top: 5px;
  }

  .mt10 {
    margin-top: 10px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mb20 {
    margin-bottom: 20px;
  }

  .fs0 {
    font-size: 0
  }

  .title {
    text-align: center;
    color: #fff;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
  }

  .loading, .no-more {
    text-align: center;
    color: #b0b0b0;
    line-height: 100px;
  }

  .no-more {
    line-height: 60px;
  }

  .pull-right {
    float: right;
  }

  .link-line {
    text-decoration: underline;
  }

  .message {
    /*position: relative;*/
    padding: 10px 15px 57px 15px;
    display: block;
    /*overflow-y: scroll;*/
    /*background-color: #F5F5F5;*/
  }

  .message li {
    margin-bottom: 15px;
    left: 0;
    position: relative;
    display: block;
  }

  .message .time {
    margin: 10px 0;
    text-align: center;
  }

  .message .text {
    display: inline-block;
    position: relative;
    padding: 0 10px;
    max-width: calc(100% - 75px);
    min-height: 35px;
    line-height: 2.1;
    font-size: 15px;
    padding: 6px 10px;
    text-align: left;
    word-break: break-all;
    background-color: #fff;
    color: #000;
    border-radius: 4px;
    box-shadow: 0px 1px 7px -5px #000;
  }

  .message .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
    background: #fff;
  }

  .inSend {
    height: 56px;
    display: flex;
    background-color: #ffffff;
    align-items: center;
  }

  .inSend input {
    flex: 1;
    height: 28px;
    border: 1px solid #dddddd;
    margin-left: 10px;
    padding: 5px;
    outline: none;
  }

  .inSend button {
    background-color: #439057;
    width: 65px;
    height: 38px;
    margin-right: 10px;
    margin-left: 10px;
    color: #ffffff;
    border-radius: 5px;
  }

  .message .time > span {
    display: inline-block;
    padding: 0 5px;
    font-size: 12px;
    color: #fff;
    border-radius: 2px;
    background-color: #DADADA;
  }

  .message .system > span {
    padding: 4px 9px;
    text-align: left;
  }

  .message .text:before {
    content: " ";
    position: absolute;
    top: 9px;
    right: 100%;
    border: 6px solid transparent;
    border-right-color: #fff;
  }

  .message .self {
    text-align: right;
  }

  .message .self .avatar {
    float: right;
    margin: 0 0 0 10px;
  }

  .message .self .text {
    background-color: #9EEA6A;
  }

  .message .self .text:before {
    right: inherit;
    left: 100%;
    border-right-color: transparent;
    border-left-color: #9EEA6A;
  }

  .message .image {
    max-width: 200px;
  }

  img.static-emotion-gif, img.static-emotion {
    vertical-align: middle !important;
  }

  .an-move-left {
    left: 0;
    animation: moveLeft .7s ease;
    -webkit-animation: moveLeft .7s ease;
  }

  .an-move-right {
    left: 0;
    animation: moveRight .7s ease;
    -webkit-animation: moveRight .7s ease;
  }

  .bgnone {
    background: none;
  }

  @keyframes moveRight {
    0% {left: -20px;opacity: 0}
    100% {  left: 0;  opacity: 1 }
  }

  @-webkit-keyframes moveRight {
    0% {left: -20px;opacity: 0}
    100% {left: 0px;opacity: 1}
  }
  @keyframes moveLeft {
    0% {left: 20px;opacity: 0}
    100% {left: 0px;opacity: 1}
  }

  @-webkit-keyframes moveLeft {
    0% {left: 20px;opacity: 0}
    100% {left: 0px;opacity: 1}
  }

  @media (max-width: 367px) {
    .fzDInfo {
      width: 82%;
    }
  }

</style>

<template>
  <div>
    <!--<div class="window" id="window-view-container" :style="{maxHeight: maxHeight + 'px'}">-->
      <!-- data is empty -->
      <!--<div class="loading" v-if="dataArray && dataArray.length==0">
        <div style="margin-top: 300px;text-align:center; font-size: 16px;">
          <span>未查找到聊天记录</span>
        </div>
      </div>

      &lt;!&ndash; loading &ndash;&gt;
      <div class="loading" v-if="dataArray.length==0">
        <div style="margin-top: 300px;">
          <div>加载中...</div>
        </div>
      </div>-->

     <!-- <div class="title" v-if="dataArray && dataArray.length>0">
        <p v-text="contactNickname"></p>
      </div>-->
      <!-- main -->
      <!--<ScrollLoader :minHeight="minHeight" class="container-main" v-if="dataArray && dataArray.length>0"
                    :style="{maxHeight: maxHeight-70 + 'px'}">-->
        <div class="message" id="window-view-message">
          <ul>
            <li v-for="(message, index) in dataArray" :key="index"
                :class="message.direction==2?'an-move-right':'an-move-left'">
              <p class="time"><span v-text="message.ctime"></span></p>
              <p class="time system" v-if="message.type==10000"><span v-html="message.content"></span></p>
              <div :class="'main' + (message.direction==2?' self':'')" v-else>
                <img class="avatar" width="45" height="45"
                     :src="message.direction==2? ownerAvatarUrl: contactAvatarUrl">
                <!-- 文本 -->
                <div class="text" v-emotion="message.content" v-if="message.type==1"></div>

                <!-- 图片 -->
                <div class="text" v-else-if="message.type==2">
                  <img :src="message.content" class="image" alt="聊天图片">
                </div>

                <!-- 其他 -->
                <div class="text" v-else-if="message.type!=10000"
                     v-text="'[暂未支持的消息类型:'+ message.type +']\n\r' + message.content">

                </div>
              </div>
            </li>

          </ul>
        </div>
      <!--</ScrollLoader>-->

    <!--</div>-->
    <tabbar class="inSend" v-transfer-dom>
      <input v-model="msg"/>
      <button @click="infinite">发送</button>
    </tabbar>

  </div>
</template>

<script>
  //import ScrollLoader from './scrollLoader.vue';
  import {mianUrlt9} from '../vuex/api'
  import {Confirm, Toast,Tabbar,TabbarItem,TransferDom} from 'vux'
  // import {sendMsg} from '../config/getData'

  export default {
    name: "wxChat",
    directives: {
      TransferDom
    },
    components: {
      //ScrollLoader,
      Confirm,
      Toast,
      Tabbar,
      TabbarItem,
      TransferDom
    },
    props: {
      contactNickname: {
        type: String,
        default: 'Mystic Faces'
      },
      data: {
        type: Array,
        required: true
      },
      width: {
        type: Number,
        default: 450,
      },

      wrapBg: {
        type: String,
        default: '#efefef'
      },
      maxHeight: {
        type: Number,
        default: 700
      },
      contactAvatarUrl: {
        type: String,
      },
      ownerAvatarUrl: {
        type: String,
      },
      /*sendMsg: {
        type: Function,
        required: true
      },
      fetch: {
        type: Function,
        required: true
      },*/
      getUpperData: {
        type: Function,
        required: true
      },
      getUnderData: {
        type: Function,
        required: true
      }
    },

    data() {
      return {
        isUpperLaoding: false,
        isUnderLaoding: false,

        isRefreshedAll: false,
        isLoadedAll: false,

        minHeight: 700,
        dataArray: [],
        msg: '',
        sequenceid1: 1,
        sendMsg: ''
      }
    },

    created() {
      this.initData();
    },
    mounted() {
      //document.getElementsByTagName('body')[0].scrollTop=0;
      //console.log(document.getElementById('window-view-container').offsetHeight)
      /*this.minHeight = document.getElementById('window-view-container').offsetHeight - 97;*/
      /*this.maxHeight = document.getElementById('window-view-container').offsetHeight;*/
    },
    updated:function(){
      this.$nextTick(function(){
        var div = document.getElementById('window-view-message');
        //console.log(div.scrollHeight)
        div.scrollIntoView(false);
        //div.scrollTop = div.scrollHeight;
      })
    },
    methods: {
      initData() {
        this.dataArray = this.dataArray.concat(this.data);
      },
      //向上拉刷新
      refresh(done) {
        console.log(222)
        var me = this;
        if (me.isUpperLaoding) {
          return;
        }

        if (me.isRefreshedAll) {
          done(true);
          me.isUpperLaoding = false;
          return;
        }
        try {
          this.getUpperData().then(function (data) {
            if (data.length == 0) {
              me.isRefreshedAll = true;
              done(true);
            } else {
              me.dataArray = data.reverse().concat(me.dataArray); //倒序合并
              done();
            }
          })
        } catch (error) {
          console.error('wxChat: props "getUpperData" must return a promise object!')
        }
        me.isUpperLaoding = false;
      },

      //提交加载智能内容
      infinite(done) {
        var me = this;
        if (me.isUnderLaoding) {
          return;
        }
        if (me.isLoadedAll) {
          done(true);
          me.isUnderLaoding = false;
          return;
        }
        var msg = me.msg;
        var id = 1;
        var sequenceid1 = me.sequenceid1;
        var sequenceid = sequenceid1 + 1;
        var msglist = [{
          direction: 2,
          id: me.dataArray.length + 1,
          type: 1,
          content: msg,
          ctime: new Date().toLocaleString()
        }];
        me.dataArray = me.dataArray.concat(msglist); //倒序合并
        me.msg = '';
        //console.log(me.dataArray)
        try {
          //this.sendMsg = sendMsg(id,msg,sequenceid);
          //console.log(this.sendMsg);
          /*sendMsg(id,msg,sequenceid).then(data => {*/
          this.$http.post(mianUrlt9 + 'api/ein/msg', {
            sequence: sequenceid,
            body: msg,
            id: id
          }, {emulateJSON: true}).then((res) => {
            //console.log(res.data);
            if (res.data.retCode == '0') {
              let str = res.data.data.suggestions[0].content.body
              if (str == '') {
                str = '我不明白您在说什么！'
              }
              //var str1 = unescape(str);
              //console.log(str1);
              var msglist = [{
                  direction: 1,
                  id: me.dataArray.length + 2,
                  type: 1,
                  content: str,
                  ctime: new Date().toLocaleString()
                }];
              me.dataArray = me.dataArray.concat(msglist); //倒序合并
              //console.log(me.dataArray)
              me.sequenceid1 = sequenceid;
              //document.getElementById('window-view-message').scrollIntoView(false);
              //let scrollContainer = document.getElementById('scrollLoader-container');
              //let scrollContainer1 = document.getElementsByClassName('message');
              //console.log(scrollContainer.scrollHeight)
              //scrollContainer.scrollTop = Number(scrollContainer.scrollHeight)+150;
              //console.log(scrollContainer.scrollHeight)
            } else if (res.data.retCode === '990101') {
              me.$vux.confirm.show({
                title: '',
                content: '您还未登录，去登录?',
                onShow() {
                  console.log('plugin show')
                },
                onHide() {
                  console.log('plugin hide')
                },
                onCancel() {
                  me.$router.back()
                },
                onConfirm() {
                  console.log('plugin confirm')
                  me.$router.push({
                    path: '/component/login'
                  })
                }
              })
            } else {
              const msg = res.data.retMsg
              this.$vux.toast.text(msg, 'middle', 3000)
            }
          }).catch(e => {
            // 打印一下错误
            console.log(e)
          })
        } catch (error) {
          console.log(error);
        }
        me.isUnderLaoding = false;
      }

    },

  }
</script>
