<template>
  <div style="background: #005ae2;">
    <img src="../assets/event/Octobanner.jpg">
    <div class='con'>
      <ul>
        <li><img src='../assets/event/Octosmart.jpg'></li>
        <li class='box'>
          <div>
            <p :class='Number(fdReturnYearRatio)>0?"up":"down"'>{{fdReturnYearRatio}}%</p>
            <p style="color:#666;">近一年收益</p>
          </div>
          <div style="text-align:left;color:#666;">
            <p>最大回撤：10.71%</p>
            <p>成立日期：2016.5.4</p>
            <p>起购金额：2000元</p>
          </div>
        </li>
        <li style="margin-top:10px;">
          <button @click='tag'>立即购买</button>
        </li>
      </ul>
      <img src="../assets/event/Octo.jpg">
      <img src="../assets/event/erweima.png" style="width:50%;height:50%;display: block;margin:20px auto -30px;">
    </div>
      <img src="../assets/event/footer.png">
  </div>
</template>
<script>
import { mianUrl, mianUrlt9 } from '../vuex/api'
import { getLocalStorage } from '../vuex/storage'
import { Toast, Confirm } from 'vux'
import {buyAllGroup} from '../common/buyAllFund'
export default {
  data() {
    return {
      fdReturnYearRatio: 4.75
    }
  },
  mounted() {
    this.getGroupList()
  },
  methods: {
    getGroupList() {
      this.$http.post(mianUrlt9 + 'fund/recommendGroupList', {}, { emulateJSON: true }).then((res) => {
        // console.log(res)
        if (res.data.retCode === '0') {
          if (res.data.data.strategyList.length != 0) {
            for (let i = 0; i < res.data.data.strategyList.length; i++) {
              if (res.data.data.strategyList[i].groupCode == "smart1") {
                this.fdReturnYearRatio = Number(res.data.data.strategyList[i].fdReturnYearRatio).toFixed(2)
              }
            }
          }
        } else {
          const msg = res.data.retMsg
          this.$vux.toast.text(msg, 'middle', 3000)
        }
      })
    },
    tag() {
      buyAllGroup('smart1', 'SmartBeta', this)
    }
  }
}

</script>
<style scoped>
ol,
ul,
li {
  list-style: none outside none;
}

img {
  display: block;
  width: 100%;
  height: auto;
}

.con {
  padding: 10px;
}

.con ul {
  background: #fff;
  text-align: center;
  padding-bottom: 20px;
}

.con ul .box {
  overflow: hidden;
  padding: 10px 0;
}

.con ul .box div {
  width: 50%;
  float: left;
}

.con ul .up {
  font-size: 30px;
  color: #ed4621;
}

.con ul .down {
  font-size: 30px;
  color: #49a04b;
}

.con ul button {
  background: -webkit-linear-gradient(top, #fcb007, #ef6c1e);
  background: linear-gradient(to bottom, #fcb007, #ef6c1e);
  color: #fff;
  border: solid 1px #fcb007;
  font-size: 20px;
  line-height: 40px;
  width: 80%;
  border-radius: 20px;
}

</style>
