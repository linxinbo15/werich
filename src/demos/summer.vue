<template>
	<div style="background:#fce6af;">
		<img src="../assets/event/summer.jpg">
		<div class="box">
			<img src="../assets/event/yuda.png">
			<div class='box1'>
				<p style="color:#292929;padding:15px 0 0;">收益一“夏”赢未来！</p>
				<div class='obj'>
					<img src="../assets/event/child.png">
					<p class="yuji">预计年化收益</p>
					<p class='shouyi'>+9.69<span style="font-size:20px;">%</span></p>
                    <p class="shihe">适合中期投资</p>
                    <button @click='change()'>立即购买</button>
				</div>
				<div class='obj'>
					<img src="../assets/event/travel.png">
					<p class="yuji">预计年化收益</p>
					<p class='shouyi'>+4.78<span style="font-size:20px;">%</span></p>
                    <p class="shihe">适合短期投资</p>
                    <button @click='change1()'>立即购买</button>
				</div>
				<div class='imgbox'><img src="../assets/event/advan.png"></div>
			</div>
		</div>
		<div class='box'>
			<img src="../assets/event/yuda1.png">
			<div class='box1' style="border:5px solid #1da3c7;">
			 <div class='obj1'>
				<img src="../assets/event/lofr.png">
				<div class='two' style="margin-top:15px;"><span>稳健型</span><span>2000元起购</span></div>
				<p class="yuji">近一年涨幅</p>
				<p class='shouyi'>+7.79<span style="font-size:20px;">%</span></p>
				<button @click='change2()'>立即购买</button>
				<p style="color:#878787;margin-top:10px;">优势：智能调整股基货基比例，牛市持股基，熊市持货基</p>
			 </div>
			</div>
		</div>
		<div style="padding:15px 0;"><img src="../assets/event/ma.png" style="width:50%;height:auto;margin:0 auto;"></div>
	</div>
</template>
<script>
import {getLocalStorage} from '../vuex/storage'
  import { Toast, Confirm } from 'vux'
 export default {
 	components: {
      Toast,
      Confirm
    },
    methods: {
      change () {
        this.$router.push('/component/invest-step?plan=C')
      },
      change1 () {
        this.$router.push('/component/invest-step?plan=D')
      },
      change2 (){
        const that = this
        if (getLocalStorage('Tel') == null) {
          this.$router.push({
            path: '/component/login',
            query: {path: this.$route.path}
          })
        } else if (getLocalStorage('isopen') == '0') { // 未开户
          this.$router.push({
            path: '/component/account',
            query: {path: this.$route.path}
          })
        } else if (getLocalStorage('riskLevel') == null || getLocalStorage('riskLevel') == '') { // 未做风险测评
          this.$vux.confirm.show({
            title: '风险测评',
            content: '购买基金产品前，需要对您的风险承受能力进行测评',
            onShow() {
              console.log('plugin show')
            },
            onHide() {
              console.log('plugin hide')
            },
            onCancel() {
              console.log('plugin cancel')
            },
            onConfirm() {
              that.$router.push({path: '/component/risk-question', query: {path: that.$route.fullPath}})
            }
          })
        } else {
          this.$router.push({
            path: '/component/buy-group',
            query: {groupId: 'LOFR2', groupname: '小富即安'}
          })
        }
      }
    }
  }
</script>
<style scoped>
img {
    display: block;
    width: 100%;
    height: auto;
  }
  .box{
  	margin-top: 10px;
  	padding:0 10px;
  }
  .box1{
  	text-align: center;
  	background: #fff;
  	border:5px solid #ed6403;
  	margin:-15px 10px 0;
  	border-radius: 10px;
  /*	padding:10px 20px;*/
  }
  .box1 .obj{
  	border:2px solid #fdb473;
  	border-radius: 5px;
  	padding:20px;
  	margin: 15px 20px 0;
  }
  .box1 .obj img{
  	width:90%;
  	height:auto;
  	margin:0 auto;
  }
  .box1 .obj .yuji,.box1 .obj1 .yuji{
  	color:#919191;
  	font-size: 14px;
  	margin-top: 15px;
  }
  .box1 .obj .shouyi,.box1 .obj1 .shouyi{
  	color:#ff4905;
  	font-size: 30px;
  }
  .box1 .obj .shihe{
  	width:120px;
  	margin:0 auto;
  	background: #bdbdbd;
  	color:#fff;
  	border:solid 1px #bdbdbd;
  	border-radius: 20px;
  }
  .box1 .obj button,.box1 .obj1 button{
  	width:160px;
  	background: -webkit-linear-gradient(top, #ff8223 , #ff5d0a); background: linear-gradient(to bottom, #ff8223 , #ff5d0a);
  	color:#fff;
  	border:solid 1px #ff8223;
  	border-radius: 10px;
  	font-size: 20px;
  	margin: 15px auto 0;
  	line-height: 2;
  }
  .box1 .imgbox{
  	padding:10px 20px;
  	border-top: dashed 2px #fdb473;
  	margin-top: 15px;
  }
  .box1 .obj1{
  	padding:20px;
  }
  .box1 .obj1 img{
  	width:90%;
  	height:auto;
  	margin:0 auto;
  }
  .box1 .obj1 .two span{
  	background: #fcbf8d;
  	color:#fff;
  	border:solid 1px #fcbf8d;
  	border-radius: 10px;
  	padding:0 10px;
  	margin-right:10px;
  }
</style>