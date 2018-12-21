<template>
  <div style=" background: #f3f6f6;padding:10px 0;">
    <div class='box' v-for="(item,index) in list" @click='change(index)'>
     <!--  <masker style="border-radius: 2px;" :color='color' :opacity='opa'>
        <div class="m-img"><img :src="item.img" class='pic'></div>
      </masker> -->
      <ul>
        <li>
          <p class='obj'><span>{{item.name}}</span><span>已售:{{item.money}}元</span></p>
          <img :src="item.img" class='pic'>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {Masker} from 'vux'

  export default {
    data () {
      return {
        color: '255,255,255',
        opa: 0,
        list: [{
          img: './static/image/privat_10.jpg',
          name:'星壤资产',
          money:'36,752,145.00'
        }, {
          img: './static/image/dapu.jpg',
          name:'大朴进取一期',
          money:'67,820,800.00'
        }, {
          img: './static/image/ming.png',
          name:'明汯中性1号',
          money:'48,730,900.00'
        }, {
          img: './static/image/privat_1 (2).jpg',
          name:'元盛8号',
          money:'20,706,160.00'
        }, {
          img: './static/image/ys1.png',
          name:'元盛跨境双策略',
          money:'25,360,700.00'
        },{
          img: './static/image/kuanyuan.png',
          name:'宽远价值成长2期',
          money:'54,920,800.00'
        }, {
          img: './static/image/privat_5.png',
          name:'兴全睿众9号',
          money:'18,292,950.00'
        }]
      }
    },
    components: {
      Masker
    },
    methods: {
      change (index) {
        this.$router.push({path: '/component/advanceobj', query: {index: index}})
      }
    }
  }
</script>
<style scoped>
  ol, ul, li {
    list-style: none outside none;
  }
  .box {
    margin:0 10px 10px 10px;
    overflow: hidden;
  }

  li {
    padding:5px 10px 10px;
    border:solid 1px #dce0e3;
    background: #fff;
    border-radius: 3px;
  }
  li .obj {
    margin-bottom: 5px;
    overflow: hidden;
  }
  li .obj span:nth-of-type(1) {
    float:left;
  }
   li .obj span:nth-of-type(2) {
    float:right;
  }
  .pic {
    display: block;
    height: auto;
    width: 100%;

  }

  .m-img a {
    display: block;
    height: auto;
    width: 100%;
  }
</style>
