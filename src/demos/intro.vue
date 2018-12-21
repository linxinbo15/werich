<template>
  <div class='box'>
    <img src="../../static/image/robot_02.jpg">
    <img src="../../static/image/choice_04.jpg">
    <img src="../../static/image/choice1_05.jpg">
    <img src="../../static/image/select_06.jpg">
    <tabbar v-transfer-dom>
      <tabbar-item @on-item-click='tiaozhuan()'>
        <a slot="label">开启智能理财</a>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<style scoped>
  .box {}

  .box img {
    display: block;
    width: 100%;
    height: auto;
  }

  .weui-tabbar .weui-tabbar__item {
    background: #fff;
  }

  .weui-tabbar .weui-tabbar__label a {
    font-size: 18px;
    color: #0e75f6;
    line-height: 50px;
  }
</style>
<script>
  import {Tabbar, TabbarItem, TransferDom} from 'vux'
  import {getLocalStorage} from '../vuex/storage'

  export default {
    data() {
      return {}
    },
    directives: {
      TransferDom
    },
    components: {
      Tabbar,
      TabbarItem,
      TransferDom
    },
    methods: {
      tiaozhuan() {
        if (getLocalStorage('Tel') == null) { // 没登录
          if (getLocalStorage('answer') !== null) {
            this.$router.push({
              path: '/component/zuhedetail',
              query: {result: getLocalStorage('answer')}
            })
          } else {
            this.$router.push({
              path: '/component/intell-test'
            })
          }
        } else { // 登录
          if (getLocalStorage('level') !== '') {
            this.$router.push({
              path: '/component/zuhedetail',
              query: {
                level: getLocalStorage('level'),
                x: getLocalStorage('x'),
                y: getLocalStorage('y'),
                z: getLocalStorage('z')
              }
            })
          } else if (getLocalStorage('answer') !== null) {
            console.log(getLocalStorage('answer') + 'news')
            this.$router.push({
              path: '/component/zuhedetail',
              query: {result: getLocalStorage('answer')}
            })
          } else {
            this.$router.push({
              path: '/component/intell-test'
            })
          }
        }
        // this.$router.push({
        //      path:'component/intell-test'
        //  })
      },
    }
  }
</script>
