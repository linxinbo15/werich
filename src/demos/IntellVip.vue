<template>
  <div class='test'>
    <div class="jiqiren">
      <img src="../assets/jiqiren.gif">
      <h2>主人，您好！</h2>
      <p>我叫GRobot，让我们来认识一下吧！</p>
      <div class="speed" ref='changdu' :style="{width: '100%',height: '3rem',position: 'relative'}">
        <span class="dj" style="float: left;">1</span><span class="dj" style="float: right;">8</span>
        <div class="speed_end"></div>
        <div class="speed_end_bg" ref='bg' :style='{width:"3%"}'></div>
        <ul style="width:100%;">
          <li class='dian' v-for='(obj,i) in huadong' :class='{"dianselect":obj.flag}' :style='{left:obj.distance}'
              @click='selecthua(i)'>{{obj.number}}
          </li>
        </ul>
      </div>
    </div>
    <div>
      <div style="position:relative;overflow:hidden;z-index:100;height:300px;">
        <transition-group name='test_fade' tag='div'>
          <div v-for='(item,index) in items' class="question" v-show='item.isshow' v-bind:key='index'>
            <div class="problem">
              <h2>{{item.timu}}</h2></div>
            <div class="answer" style="margin-top: 1rem;">
              <ul>
                <li v-for='(ans,s) in item.answer' @click='select(item.num,s)' :class='{active:item.selectindex === s}'>
                  {{ans}}
                </li>
              </ul>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  // import { mapState, mapMutations, mapGetters } from 'vuex'
  // import Scroll from '../../base/scroll/scroll'
  // import { url, setCookie, getCookie } from '../../common/js/config'
  import { mianUrlt9 } from '../vuex/api'
  import {getLocalStorage, setLocalStorage} from '../vuex/storage'

  export default {
    data () {
      return {
        arr: [],
        result: '',
        complete: 0,
        source: this.$route.query.source,
        // gaodu1: 200,
        isselect: {
          width: '2rem',
          height: '2rem',
          bottom: '-0.25rem',
          zIndex: '102',
          backgroundColor: '#ff8d0a',
          borderRadius: '50%',
          textAlign: 'center',
          lineHeight: '2rem',
          fontSize: '1.33rem',
          color: '#ffffff'
        },
        huadong: [{
          flag: true,
          number: 1,
          classname: 'a',
          distance: '2.0%'
        }, {
          flag: false,
          number: 2,
          classname: 'b',
          distance: '25.0%'
        }, {
          flag: false,
          number: 3,
          classname: 'c',
          distance: '50.0%'
        }, {
          flag: false,
          number: 4,
          classname: 'd',
          distance: '75.0%'
        }, {
          flag: false,
          number: 5,
          classname: 'e',
          distance: '96.0%'
        }],
        items: [{
          isshow: true,
          timu: '您的年龄是：',
          num: 0,
          selectindex: '', // 选中的选项
          answer: ['A、小于32岁', 'B、32-42岁', 'C、43-54岁', 'D、55岁以上']
        }, {
          isshow: false,
          timu: '预计投资额占年收入的比例：',
          num: 1,
          selectindex: '', // 选中的选项
          answer: ['A、小于20%', 'B、20%-50%', 'C、50%-80%', 'D、大于80%']
        }, {
          isshow: false,
          timu: '预计投资期限：',
          num: 2,
          selectindex: '', // 选中的选项
          answer: ['A、小于1年', 'B、1年至2年', 'C、2年至3年', 'D、3年以上']
        }, {
          isshow: false,
          timu: '以下四种可能的投资，您更倾向于的是：',
          num: 3,
          selectindex: '', // 选中的选项
          answer: ['A、最大可能损失0%，预期收益6%', 'B、最大可能损失3%，预期收益10%', 'C、最大可能损失6%，预期收益20%', 'D、最大可能损失10%，预期收益30%']
        }, {
          isshow: false,
          timu: '您最希望智能投顾帮到您的方面是：',
          num: 4,
          selectindex: '', // 选中的选项
          answer: ['A、 帮我判断股市场的涨跌，把握上涨机会，规避下跌风险', 'B、 帮我寻找优质资产，构建基金组合，实现资产配置', 'C、 帮我实现长期储蓄目标，聚沙成塔', 'D、 我去看看']
        }]
      }
    },
    mounted () {
      this.getSource()
      this.goProduct()
    },
    methods: {
      // ...mapMutations([
      //   'changeanswer'
      // ]),
      goProduct() {
        this.$http.post(mianUrlt9 + 'fund/queryQuestionInformationByUserId', '', {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.$vux.loading.hide()
          } else {
            //console.log(res)
          }
        })
      },
      getSource() {
        console.log(this.source)
        if(this.source !== '' || this.source !== undefined){
          setLocalStorage('source', this.source)
        }
      },
      select (index, s) {
        this.items[index].selectindex = s
        //console.log(this.items[index].selectindex)
        if (index <= 3) {
          this.items[index].isshow = false
          this.items[index + 1].isshow = true
          this.huadong[index].flag = false
          this.huadong[index + 1].flag = true
          this.$refs.bg.style.width = parseInt(this.huadong[index + 1].distance) + 0.5 + '%'
          this.complete = index
          //console.log(this.complete)
          if (s === 0) {
            this.arr[index] = 'A'
          } else if (s === 1) {
            this.arr[index] = 'B'
          } else if (s === 2) {
            this.arr[index] = 'C'
          } else {
            this.arr[index] = 'D'
          }
          //console.log(this.arr)
        } else if (index === 4) {
          if (s === 0) {
            this.arr[index] = 'A'
          } else if (s === 1) {
            this.arr[index] = 'B'
          } else if (s === 2) {
            this.arr[index] = 'C'
          } else {
            this.arr[index] = 'D'
          }
          for (let n = 0; n < this.arr.length; n++) {
            this.result = this.arr.join('')
          }

          if (getLocalStorage('tel') == null) {
            setLocalStorage('answerVip', this.result)
          }
          this.$vux.loading.show({
            text: '模型计算中'
          })
          const obj = {"answer":this.result}
          this.$http.post(mianUrlt9 + 'fund/intelligentEvaluation', obj, {emulateJSON: true}).then((res) => {
            if (res.data.retCode === '0') {
              this.$vux.loading.hide()
              if(res.data.data.result == 'LIST') {
                this.$router.push({path: '/component/home-vip'})
              } else if(res.data.data.result == 'CJ1004'){
                this.$router.push({
                  path: '/component/group-detail',
                  query: {groupCode: 'CJ1004', groupName: '创金平衡组合1号'}
                })
              } else if(res.data.data.result == 'CJ1001'){
                this.$router.push({
                  path: '/component/group-detail',
                  query: {groupCode: 'CJ1001', groupName: '创金积极组合1号'}
                })
              } else if(res.data.data.result == 'CJ1007'){
                this.$router.push({
                  path: '/component/group-detail',
                  query: {groupCode: 'CJ1007', groupName: '创金稳健组合1号'}
                })
              } else if(res.data.data.result == 'LOFR2'){
                this.$router.push({
                  path: '/component/strategy-detail',
                  query: { groupCode: 'LOFR2',groupName:'小富即安' }
                })
              } else if(res.data.data.result == 'INVEST'){
                this.$router.push({path: '/component/invest-home'})
              }
              //console.log(res)
            } else if (res.data.retCode === '990101') {
              this.$vux.loading.hide()
              this.$vux.toast.text(res.data.retMsg, 'middle', 3000)
              this.$router.push({
                path: '/component/login',
                query: {path: this.$route.fullPath}
              })
            } else if (res.data.retCode === '990102') {
              this.$vux.loading.hide()
              this.$vux.toast.text(res.data.data[0].field + '' + res.data.data[0].message, 'middle', 3000)
            } else if (res.data.retCode === '990103') {
              this.$vux.loading.hide()
              this.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
            } else if (res.data.retCode === '990104') {
              this.$vux.loading.hide()
              this.$vux.toast.text('服务器内部错误', 'middle', 3000)
            } else {
              this.$vux.loading.hide()
              this.$vux.toast.text(res.data.retMsg, 'middle', 3000)
            }
          })
          /*this.$router.push({
            path: '/component/zuhedetail',
            query: {result: this.result}
          })*/
          setTimeout(() => {
            this.destroy()
          }, 3000)
        }
      },
      selecthua (i) {
        if (i <= this.complete) {
          for (var j = 0; j < 8; j++) {
            this.huadong[j].flag = false
            this.items[j].isshow = false
          }
          this.huadong[i].flag = true
          this.$refs.bg.style.width = this.huadong[i].distance
          this.items[i].isshow = true
        }
      },
      destroy () {
        //console.log('初始化')
        for (let i = 0; i < 5; i++) {
          if (i === 0) {
            this.huadong[0].flag = true
            //this.$refs.bg.style.width = this.huadong[0].distance
            this.items[0].isshow = true
            this.items[0].selectindex = ''
          } else {
            this.huadong[i].flag = false
            this.items[i].isshow = false
            this.items[i].selectindex = ''
          }
        }
      }
    }
  }

</script>
<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/center.less';
  @import '../styles/custom.less';

  ol, ul, li {
    list-style: none outside none;
  }

  .test_fade-enter-active,
  .test_fade-leave-active {
    transition: opacity 0.5s ease-out;
  }

  .test_fade-enter,
  .test_fade-leave-to {
    opacity: 0;
  }

  .test .jiqiren {
    overflow: hidden;
    padding: 10px;
    background-color: #041d46;
    position: relative;
    z-index: 101;
  }

  .test .jiqiren img {
    display: block;
    width: 40%;
    margin: 0 auto;
    height: auto;
  }

  .test .jiqiren h2 {
    color: #ff8d0a;
    font-size: 16px;
    text-align: center;
  }

  .test .jiqiren p {
    color: #ffffff;
    font-size: 14px;
    text-align: center;
  }

  .test .speed_end {
    position: absolute;
    bottom: 5px;
    width: 100%;
    height: 5px;
    border-radius: 3px;
    background-color: #fff;
    z-index: 100;
  }

  .test .speed_end_bg {
    position: absolute;
    bottom: 5px;
    height: 5px;
    border-radius: 3px;
    background-color: #ff8d0a;
    z-index: 101;
  }

  .test .dian {
    height: 7px;
    width: 7px;
    display: inline-block;
    background-color: #ffffff;
    border: 1px solid #ff8d0a;
    border-radius: 50%;
    position: absolute;
    bottom: 3px;
    z-index: 102;
    color: transparent;
  }

  .test .dianselect {
    width: 20px;
    height: 20px;
    bottom: -2.5px;
    z-index: 102;
    background-color: #ff8d0a;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    font-size: 13.3px;
    color: #ffffff;
  }

  .test .question {
    padding: 20px 10px;
    width: 95%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .test .problem {
    padding-left: 10px;
    background: url(../assets/quest.png) no-repeat 0px 0px;
    background-size: 10px auto;
    overflow: hidden;
  }

  .test .problem h2 {
    display: inline-block;
    float: left;
    font-size: 16px;
    color: #000000;
    padding: 10px;
    background-color: #ffffff;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .test .answer {
    padding-right: 10px;
    background: url(../assets/result.png) no-repeat top right;
    background-size: 10px auto;
    overflow: hidden;
  }

  .test .answer ul {
    display: inline-block;
    float: right;
    padding: 10px;
    background-color: #ffffff;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    min-width: 50%;
    max-width: 90%;
  }

  .test .answer ul li {
    font-size: 14px;
    color: #333333;
    line-height: 1.5;
    padding: 10px 0;
  }

  .test .answer .active {
    background: #eee;
  }
</style>
