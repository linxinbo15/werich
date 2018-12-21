<template>
  <div class='spring'>
    <img src="../assets/event/one.png">
    <img src="../assets/event/two.png">
    <div class="box">
      <ul v-for="item in list">
        <li class="list1">{{item.name}}<br><span
          style="font-size: 8px;color: #999;display:inline-block;margin-top:8px;">{{item.code}}</span></li>
        <li>{{item.num}}</li>
        <li>近1个月收益率</li>
        <li>
          <button class="buy1">立即购买</button>
        </li>
        <li>{{item.type}}</li>
      </ul>
    </div>
    <img src="../assets/event/three.png" @click="showreason()">
    <img src="../assets/event/four.png">
    <img src="../assets/event/five.png">
    <div>
      <p style="padding:20px;font-size: 8.6px;color:#999;line-height: 20px;">
        风险提示：本内容仅供参考，不构成投资建议，投资者据此操作，风险自担。基金管理人承诺以诚实信用、勤勉尽职的原则管理和运用基金资产，但不保证基金一定盈利，也不保证最低收益。基金投资需谨慎！</p>
    </div>
  </div>
</template>
<script>
  import {Alert} from 'vux'

  export default {
    data () {
      return {
        list: [{
          name: '易方达沪深300医药ETF',
          code: '001344',
          num: '8.64%',
          type: '(被动指数型) 数据截止：2018.3.15'
        }, {
          name: '易方达医疗保健',
          code: '110023',
          num: '8.37%',
          type: '(大盘平衡风格型) 数据截止：2018.3.15'
        }]
      }
    },
    components: {
      Alert
    },
    methods: {
      showreason () {
        this.$vux.alert.show({
          title: '推荐理由',
          content: '今年以来，医药主题基金收益远超2016年，相比2017年同期略有上涨。指数方面，中证申万医药生物指数、中证医药卫生指数，3月12日创下两年来新高，沪深300医药卫生指数走出历史新高。基金重仓股集中在医疗卫生板块，医疗卫生板块所涉及的部分上市公司是A股典型的蓝筹股和白马股，业绩稳定性强，成长趋势相对确定，受到市场的广泛认可！在行业板块强势行情下，推荐基金后期表现仍然可期。',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
          }
        })
      }
    }
  }
</script>
<style lang="less">
  ol, ul, li {
    list-style: none outside none;
  }

  .spring {
    background: #d7f1f4;
    img {
      display: block;
      width: 100%;
      height: auto;
    }
    .box {
      text-align: center;
      padding: 20px;
      ul {
        border: 5px solid #e9f6ff;
        border-radius: 10px;
        background: #fff;
        padding: 10px;
        margin-bottom: 10px;
        li {
          margin: 10px 0;
        }
        li:nth-of-type(1) {
          font-size: 19px;
          line-height: 13px;
        }
        li:nth-of-type(2) {
          font-size: 23.4px;
          color: #ff3300;
          margin: 8px 0;
        }
        li:nth-of-type(3) {
          font-size: 10.4px;
          color: #999;
        }
        li:nth-of-type(4) button {
          color: #fff;
          font-size: 13px;
          line-height: 26px;
          padding: 0 40px;
          background: #ff4b18;
          border: solid 1px #ff4b18;
          border-radius: 20px;
        }
        li:nth-of-type(5) {
          font-size: 10.4px;
          color: #999;
        }
      }
    }
  }

</style>
