<template>
  <div>
    <div v-show="step == 0">
      <div v-for="(item,index) in question" :key="index">
        <div class="fundtitle">
          {{item.ques}}
        </div>
        <group>
          <radio :options="item.answer" @on-change="change" v-model="item.flag"></radio>
          <!--<radio :options="" @on-change="change"></radio>-->
        </group>
        <!--<div v-for="select in item.answer">
          <div>
            {{select.resultContent}}
          </div>
        </div>-->
      </div>
      <box gap="10px 10px">
        <x-button type="primary" :disabled="able" :gradients="['#FF9500', '#FF9500']" @click.native="submitans">提交风险测评
        </x-button>
      </box>
    </div>
    <div v-show="step != 0">
      <div class="levelbox">
        <h2>您的风险等级为</h2>
        <div class="levelbg">{{type}}</div>
      </div>
      <div class="levelcontent">
        {{des}}
      </div>
      <box gap="10px 10px">
        <x-button type="primary" @click.native="tiaozhuan">继续购买</x-button>
        <x-button type="default" @click.native="reset">重新测评</x-button>
      </box>
    </div>
    <toast v-model="showPositionValue" type="text" :time="800" width="18em" is-show-mask :text="toastText"
           :position="position"></toast>
  </div>
</template>

<script>
  import {Toast, Radio, Box, Group, XButton, Tabbar, TabbarItem, Msg} from 'vux'
  import {mianUrlt9} from '../vuex/api'
  import {getLocalStorage, setLocalStorage} from '../vuex/storage'

  export default {
    components: {
      Toast,
      Msg,
      Box,
      XButton,
      Tabbar,
      TabbarItem,
      Radio,
      Group
    },
    data () {
      return {
        position: 'default',
        toastText: '',
        showPositionValue: false,
        papercode: '',
        question: [],
        gaodu1: 400,
        risklevel: '',
        step: 0,
        able: false,
        word: '继续购买',
        type: '',
        des: '',
        path: this.$route.query.path // 接收详情页面跳转过来的路径
      }
    },
    methods: {
      showPosition (position) {
        this.position = position
        this.showPositionValue = true
      },
      reset () {
        this.step = 0
        for (let i = 0; i < this.question.length; i++) {
          this.question[i].flag = ''
        }
      },
      tiaozhuan () {
        if (this.path !== undefined) {
          this.$router.push({path: this.path})
        } else {
          this.$router.push({path: '/'})
        }
      },
      change (value, label) {
        /* console.log(this.question)
        console.log('change:', value, label) */
      },
      getquestion () {
        this.$http.post(mianUrlt9 + 'user/riskQuestQuery').then((res) => {
          if (res.data.retCode === '0') {
            this.papercode = res.data.data.paprCode
            for (let i = 0; i < res.data.data.qustList.length; i++) {
              let obj = {}
              obj.ques = res.data.data.qustList[i].questName
              obj.answer = res.data.data.qustList[i].itemList
              obj.flag = ''
              for (let j = 0; j < obj.answer.length; j++) {
                obj.answer[j].key = obj.answer[j].result + obj.answer[j].resultPoint
                obj.answer[j].value = obj.answer[j].resultContent
              }
              obj.index = i
              this.question.push(obj)
            }
            //console.log(this.question)
          } else if (res.data.retCode === '990101') {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          } else if (res.data.retCode === '990102') {
            this.toastText = res.data.data[0].field + '' + res.data.data[0].message
            this.showPosition('middle')
          } else if (res.data.retCode === '990103') {
            this.toastText = '系统正在维护，请稍后再试'
            this.showPosition('middle')
          } else if (res.data.retCode === '990104') {
            this.toastText = '服务器内部错误'
            this.showPosition('middle')
          } else {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      },
      submitans () {
        this.able = true
        if (this.question[0].flag === '' || this.question[1].flag === '' || this.question[2].flag === '' || this.question[3].flag === '' || this.question[4].flag === '') {
          this.toastText = '请将题目答完整'
          this.showPosition('middle')
          return false
        }
        let ansresult = this.question[0].flag + ',' + this.question[1].flag + ',' + this.question[2].flag + ',' + this.question[3].flag + ',' + this.question[4].flag
        this.$http.post(mianUrlt9 + 'user/riskLevelTest', {
          paperCode: this.papercode,
          answer: ansresult
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.able = false
            let level = res.data.data.riskLevel
            if (getLocalStorage('isopen') == '1') {
              setLocalStorage('riskLevel', level)
            }
            this.risklevel = level
            this.step++
            this.display(level)
          } else if (res.data.retCode === '990101') {
            this.able = false
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          } else if (res.data.retCode === '990102') {
            this.able = false
            this.toastText = res.data.data[0].field + '' + res.data.data[0].message
            this.showPosition('middle')
          } else if (res.data.retCode === '990103') {
            this.able = false
            this.toastText = '系统正在维护，请稍后再试'
            this.showPosition('middle')
          } else if (res.data.retCode === '990104') {
            this.able = false
            this.toastText = '服务器内部错误'
            this.showPosition('middle')
          } else {
            this.able = false
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      },
      display (level) {
        if (level === '01') {
          this.type = '安逸型'
          this.des = '在基金投资过程中，保护本金不受损失和保持资产的流动性是您的首要目标。您对投资的态度是希望投资收益稳定，不愿或不能承担高风险以换取高收益，通常不太在意资金是否有较大增值，追求稳定。有的投资者可能并不认为自己属于安全型一类，但因为年龄或家累的缘故，抗风险能力实际并不强，此时，获取稳定回报应当成为投资的首要考虑。'
        } else if (level === '02') {
          this.type = '保守型'
          this.des = '稳定是您首要考虑的因素之一。在基金投资中，您希望在保证本金安全的基础上能有一些增值收入。追求较低的风险，对投资回报的要求不是太高。'
        } else if (level === '03') {
          this.type = '稳健型'
          this.des = '在基金投资的过程中，风险较小的情况下获得一定的收益是您主要的投资目的。您通常愿意使本金面临一定的风险，但在做投资决定时，会仔细地对将要面临的风险进行认真的分析。 总体来看，您愿意承受市场的平均风险。'
        } else if (level === '04') {
          this.type = '积极型'
          this.des = '在基金投资中，您渴望有较高的投资收益，但又不愿承受较大的风险；可以承受一定的投资波动，但是希望自己的投资风险小于市场的整体风险。您有较高的收益目标，且对风险有清醒的认识。'
        } else if (level === '05') {
          this.type = '激进型'
          this.des = '在基金投资中，您通常专注于投资的长期增值，并愿意为此承受较大的风险。短期的投资波动并不会对您造成大的影响，追求超高的回报才是您关注的目标。'
        }
      }
    },
    mounted () {
      this.getquestion()
    }
  }
</script>

<style lang="less" scoped>
  @import '../styles/custom.less';

  .fundtitle {
    padding: 15px;
    /*background-color: #ffffff;
    border-top: 1px solid #f2f2f2;
    border-bottom: 1px solid #f2f2f2;*/
    font-weight: bold;
    font-size: 16px;
    color: #222222;
  }

  .fundtitle span {
    color: #222222;
    font-size: 16px;
  }

  .agree {
    padding: 12px;
    font-size: 14px;
    color: #333333;
  }

  .agree a {
    color: #ffa014;
  }

  .weui-cells {
    margin-top: 0;
    background-color: #FFFFFF;
    line-height: 1.41176471;
    font-size: 14px;
    overflow: hidden;
    position: relative;
  }

  .levelbox {
    background-color: #ffffff;
    border-bottom: 1px solid #f2f2f2;
    padding: 15px;
    text-align: center;
  }

  .levelcontent {
    padding: 15px;
    color: #888888;
  }

  .levelbox h2 {
    font-size: 16px;
    text-align: center;
    color: #222222;
  }

  .levelbg {
    width: 120px;
    height: 120px;
    margin: 0 auto;
    background: url(../assets/yuanlai.png) no-repeat;
    background-size: 100% auto;
    font-size: 18px;
    text-align: center;
    color: #222222;
    line-height: 120px;
    margin-top: 20px;
  }

  .process_span {
    padding: 10px;
    font-size: 12px;
    color: #888888;
    background-color: #ffffff;
    border-top: 1px solid #f2f2f2;
  }

  .margintop {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .up {
    color: @redfont;
  }

  .down {
    color: @greenfont;
  }
</style>
