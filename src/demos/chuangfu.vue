<template>
  <div>
	<img src='../assets/YD_CFB_banner1.jpg' />
	<tab :line-width=2 active-color='#0e75f6' v-model='index'>
      <tab-item class="vux-center" v-for="(item, index) in list" @on-item-click="onItemClick(index)" :key="index">
        {{item}}
      </tab-item>
    </tab>
    <regular :list='data1' v-show='index == 0'></regular>
    <regular :list='data2' v-show='index == 1'></regular>
    <regular :list='data3' v-show='index == 2'></regular>
  </div>
</template>
<style>
	img{
		width:100%;
		height:auto;
    display: block;
	}
</style>
<script>
import {Tab, TabItem} from 'vux'
import Regular from '../common/regular/index.vue'
export default{
	data(){
      return{
      	list:['50万起','100万起','200万起'],
      	index: 0,
        data1:[{
          name:'六月盈',
          number:'12893.00',
          cost:50,
          day:181,
          lilv:'5.20',
          color:'#349ef2'
        },{
          name:'九月富',
          number:'19820.00',
          cost:50,
          day:273,
          lilv:'5.30',
          color:'#ff9900'
        },{
          name:'年年红',
          number:'27000.00',
          cost:50,
          day:365,
          lilv:'5.40',
          color:'#eb1e32'
        }],
        data2:[{
          name:'六月盈',
          number:'26778.00',
          cost:100,
          day:181,
          lilv:'5.40',
          color:'#349ef2'
        },{
          name:'九月富',
          number:'41884.00',
          cost:100,
          day:273,
          lilv:'5.60',
          color:'#ff9900'
        },{
          name:'年年红',
          number:'58000.00',
          cost:100,
          day:365,
          lilv:'5.80',
          color:'#eb1e32'
        }],
         data3:[{
          name:'六月盈',
          number:'55539.00',
          cost:200,
          day:181,
          lilv:'5.60',
          color:'#349ef2'
        },{
          name:'九月富',
          number:'88257.00',
          cost:200,
          day:273,
          lilv:'5.90',
          color:'#ff9900'
        },{
          name:'年年红',
          number:'124000.00',
          cost:200,
          day:365,
          lilv:'6.20',
          color:'#eb1e32'
        }]
      }
	},
  methods:{
    onItemClick(index){
      this.index = index
    }
  },
	components:{
	    Tab,
      TabItem,
      Regular
	}
}
</script>
