<template>
  <div :style="{background:color,paddingBottom:'10px'}">
    <div v-for='item in list' style="margin:0;padding:0;">
      <img :src="item.img" class='pic'>
    </div>
    <box gap="10px 10px"><a href="tel:4006262818">
      <x-button type="primary" action-type="button">立即预约</x-button>
    </a>
    </box>
  </div>
</template>
<script>
  import {XInput, Group, XButton, Cell, Toast, Box} from 'vux'

  export default {
    data () {
      return {
        index: this.$route.query.index,
        list: [],
        color: '#fff'
      }
    },
    components: {
      XInput,
      XButton,
      Group,
      Cell,
      Toast,
      Box
    },
    mounted () {
      this.panduan()
    },
    methods: {
      panduan () {
        if (this.index === 0) {
          this.list = [{img: './static/image/new1.jpg'}, {img: './static/image/new2.jpg'}, {img: './static/image/new3.jpg'}, {img: './static/image/new4.jpg'}, {img: './static/image/new5.jpg'}]
          this.color = '#0B457F'
        } else if (this.index === 6) {
          this.list = [{img: './static/image/xingquan1.jpg'}, {img: './static/image/xingquan2.jpg'}, {img: './static/image/xingquan3.jpg'}, {img: './static/image/xingquan4.jpg'}]
        } else if (this.index === 3) {
          this.list = [{img: './static/image/banner.jpg'}, {img: './static/image/yuansheng8_01.png'}, {img: './static/image/yuansheng8_02.png'}, {img: './static/image/yuansheng8_03.png'}, {img: './static/image/yuansheng8_04.png'}, {img: './static/image/yuansheng8_05.png'}, {img: './static/image/yuansheng8_06.png'}]
        } else if (this.index === 4) {
          this.list = [{img: './static/image/yuansheng_01.jpg'}, {img: './static/image/yuansheng_02.jpg'}, {img: './static/image/yuansheng_03.jpg'}, {img: './static/image/yuansheng_04.jpg'}, {img: './static/image/yuansheng_05.jpg'}, {img: './static/image/yuansheng_06.jpg'}, {img: './static/image/yuansheng_07.jpg'}, {img: './static/image/yuansheng_08.jpg'}, {img: './static/image/yuansheng_09.jpg'}, {img: './static/image/yuansheng_10.jpg'}, {img: './static/image/yuansheng_11.jpg'}, {img: './static/image/yuansheng_12.jpg'}]
          this.color = '#F5EBE2'
        } else if (this.index === 5){
            this.list = [{img: './static/image/kuanyuan1.jpg'}, {img: './static/image/kuanyuan2.jpg'}, {img: './static/image/kuanyuan3.jpg'}, {img: './static/image/kuanyuan4.jpg'}]  
        } else if (this.index === 1){
            this.list = [{img: './static/image/dapu1.jpg'}, {img: './static/image/dapu2.jpg'}, {img: './static/image/dapu3.jpg'}]  
        } else if (this.index === 2){
            this.list = [{img: './static/image/ming1.jpg'}, {img: './static/image/ming2.jpg'}, {img: './static/image/ming3.jpg'}]  
        }
      }
    }
  }
</script>
<style scoped>
  .pic {
    display: block;
    height: auto;
    width: 100%;
  }

  a {
    color: #fff;
    display: block;
    height: auto;
    width: 100%;
  }
</style>
