<template>
	<div>
		<ul>
			<li v-for='item in list'>
				<p><em :style='{color:item.color,borderLeftColor:item.color}'>{{item.name}}</em><span class='fuli' :style='{color:item.color,borderColor:item.color}'>复利滚存</span><i>投资收益：{{item.number}}元</i><span class='number'>(以{{item.cost}}万为例)</span></p>
				<div class='box'>
					<p>{{item.day}}<span>天</span><br><span>产品期限</span></p>
					<p>{{item.lilv}}%<br><span>预期年化收益率</span></p>
					<p><button :style='{borderColor:item.color,background:item.color}'><a href='tel:4006262818' style="color:#fff">立即咨询</a></button><br><span>一次性还本息</span></p>
				</div>
			</li>
		</ul>
	</div>
</template>
<style scoped>
  ol, ul, li {
    list-style: none outside none;
  }
   li{
     padding:15px;
     background: #fff;
     border-bottom: 1px solid #f2f2f2;
   }

   p em{
   	 font-style: normal;
   	 font-size: 16px;
     padding-left: 7px;
     font-weight: 600;
     border-left-style:solid;
     border-left-width:3px;
   }
   .fuli{
   	  font-size: 10px;
      padding: 1px 3px;
      margin-left: 7px;
      border-style: solid;
      border-width:1px;
   }
   i{
   	font-size: 10px;
   	margin-left: 5px;
   	font-style: normal;
    color: #eb1e32;
   }
   .number{
   	 color: #999;
     font-size: 10px;
     margin-left: 7px;
   }
   .box{
   	display: flex;
   	display: -webkit-flex;
   	padding:10px 0;
   }
   .box p{
   	flex:1;
   	text-align: center;
   }
   .box span{
   	color:#999;
   	font-size:10px;
   }
   .box p:nth-of-type(2){
   	color:#eb1e32;
   }
   .box button{
   	padding:5px 10px;
   	border:none;
   	border-radius: 5px;
   	color:#fff;
   }
</style>
<script>
export default {
	name: 'regular',
	props:{
    list:Array
	}
}
</script>
