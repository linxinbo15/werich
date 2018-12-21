<template>
  <div class='box'>
    <img src="../assets/event/sep.jpg">
    <div class='con'>
      <ul v-for='item in list'>
        <li>适合{{item.time}}期投资</li>
        <li>
          <h2>{{item.name}}</h2></li>
        <li>{{item.percent}}%</li>
        <li>预期年华收益率</li>
        <li>
          <button @click='step(item.id)'>开启梦想计划</button>
        </li>
      </ul>
    </div>
   <img src="../assets/event/sepadv.png">
   <img src="../assets/event/seplast.png" style="margin-top:20px;">
  </div>
</template>
<script>
import { getLocalStorage } from '../vuex/storage'
import { Toast, Confirm } from 'vux'
export default {
  data() {
    return {
      list: [{
        time: '短',
        name: '旅行度假',
        percent: '6.78',
        id:'D'
      }, {
        time: '中长',
        name: '子女教育',
        percent: '9.69',
        id:'C'
      }, {
        time: '中长',
        name: '购房置业',
        percent: '8.69',
        id:'B'
      }, {
        time: '长',
        name: '养老计划',
        percent: '10.69',
        id:'A'
      }]
    }
  },
  methods:{
  	step(id){
  	  this.$router.push('/component/invest-step?plan='+id)
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

.box {
  background: -webkit-linear-gradient(left top, #7126e2, #3c31c9);
  background: linear-gradient(to bottom right, #7126e2, #3c31c9);
}

img {
  display: block;
  width: 100%;
  height: auto;
}

.con {
  padding: 10px 20px;
  text-align: center;
}

.con ul {
  background: #fff;
  border: solid 1px #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.con ul li:nth-of-type(1) {
  color: #541bca;
  font-size: 16px;
  line-height: 32px;
  border-bottom: dotted 1px #541bca;
}

.con ul li:nth-of-type(2) {
  color: #541bca;
  font-size: 20px;
  line-height: 2;
  border-bottom: dotted 1px #541bca;
}

.con ul li:nth-of-type(3) {
  color: #ff5e34;
  font-size: 20px;
  font-weight: bold;
}

.con ul li:nth-of-type(4) {
  font-size: 14px;
  color: #8c8c8c;
}

.con ul li:nth-of-type(5) button {
  font-size: 20px;
  width: 100%;
  color: #fff;
  border: none;
  line-height: 2;
  border: solid 1px transparent;
  border-radius: 10px;
  background: -webkit-linear-gradient(left, #c31075, #4404e2);
  background: linear-gradient(to right, #c31075, #4404e2);
}

</style>
