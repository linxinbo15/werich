<template>
  <div class='warm'>
    <img src="../assets/event/warm1.jpg">
    <div class='con'>
      <div class='box'>
        <ul>
          <li>斗转星移<span class='code'>（ct00001）</span></li>
          <li><span class='one'>高风险等级</span><span class='two'>1000元起购</span><span class='three'>近一年收益3.53%</span></li>
          <li>43.59%</li>
          <li class='code'>成立以来收益(2016年)</li>
          <li><button @click="tag('ct00001','斗转星移')">立即购买</button></li>
        </ul>
        <p><span style="color:#fff;font-weight: bold;font-size:1rem;">投资标的：</span><br><span style="color:#ffd02c;font-size:0.5rem;">易方达沪深300量化，占比100%</span></p>
      </div>
      <div class='box'>
        <ul>
          <li>SmartBeta<span class='code'>（smart1）</span></li>
          <li><span class='one'>高风险等级</span><span class='two'>2000元起购</span><span class='three'>近一年收益3.13%</span></li>
          <li>43.01%</li>
          <li class='code'>成立以来收益(2016年)</li>
          <li><button @click="tag('smart1','SmartBeta')">立即购买</button></li>
        </ul>
        <p><span style="color:#fff;font-weight: bold;font-size:1rem;">投资标的：</span><br><span style="color:#ffd02c;font-size:0.5rem;">易方达天天A（000009），占比50%；<br>工银瑞信大盘蓝筹（481008），占比37.5%；<br>汇添富消费行业（000083），占比12.5%</span>
        </p>
      </div>
    </div>
    <img src="../assets/event/warm2.jpg">
  </div>
</template>
<script>
import { getLocalStorage } from '../vuex/storage'
import { Toast, Confirm } from 'vux'
import { buyAllGroup } from '../common/buyAllFund'
export default {
  methods: {
    tag(code, name) {
      buyAllGroup(code, name, this)
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
  padding: 1rem;
  background: linear-gradient(to bottom, #f56d51, #f79534);
}

.con .box ul {
  background: #fff;
  text-align: center;
  padding: 2rem 0;
  border: solid 3px #fbbd45;
  border-radius: 1rem;
}

.con .box ul li:nth-of-type(1) {
  font-size: 1.2rem;
  color: #333;
}

.con .box ul .code {
  color: #666;
  font-size: 0.8rem;
}

.con .box ul li:nth-of-type(2) span {
  font-size: 0.8rem;
  color: #fff;
  background: #91c5ff;
  border: solid 2px #3b91f2;
  border-radius: 8px;
}

.con .box ul li:nth-of-type(2) .one {
  width: 25%;
  margin-right: 1%;
}

.con .box ul li:nth-of-type(2) .two {
  width: 25%;
  margin: 0 1%;
}

.con .box ul li:nth-of-type(2) .three {
  width: 45%;
  margin-left: 1%;
}

.con .box ul li:nth-of-type(3) {
  font-size: 1.6rem;
  color: #ef3e29;
  font-weight: bold;
}

.con .box ul button {
  background: #ffd02c;
  width: 80%;
  border: solid 1px #ffd02c;
  border-radius: 8px;
  font-size: 1.5rem;
  color: #ef5411;
  font-weight: bold;
  padding: 0.5rem 0;
  margin-top: 1rem;
}

</style>
