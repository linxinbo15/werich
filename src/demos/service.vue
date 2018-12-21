<template>
  <wxChat
    :data="wxChatData"
    :showShade="false"
    contactNickname="创金智能客服"
    :getUpperData="getUpperData"
    :getUnderData="getUnderData"
    :ownerAvatarUrl="ownerAvatarUrl"
    :contactAvatarUrl="contactAvatarUrl"
    :width="420">
  </wxChat>
</template>

<i18n>
  set bar-active-color:
  zh-CN: 设置bar颜色
</i18n>

<script>
  //import {wxChat} from 'vux'
  import wxChat from '../components/wxChat.vue';
  export default {
    data() {
      return {
        upperTimes: 0,
        underTimes: 0,
        upperId: 0,
        underId: 6,
        ownerAvatarUrl: '../static/image/avatar1.png',
        contactAvatarUrl: '../static/image/avatar2.png',
        wxChatData: [{
          direction: 1,
          id: 2,
          type: 1,
          content: '我是创金启富的智能云客服专家小智，请问有什么可以帮助您？',
          ctime: new Date().toLocaleString()
        }]
      }
    },
    components: {wxChat},

    methods: {

      //向上滚动加载数据
      getUpperData() {
        //console.log(2)
        var me = this;
        // 这里为模拟异步加载数据
        // 实际上你可能要这么写:
        // return axios.get('xxx').then(function(result){
        //     return result;  //result的格式需要类似下面resolve里面的数组
        // })
        return new Promise(function (resolve) {
          setTimeout(function () {
            //模拟加载完毕
            if (me.upperTimes > 3) {
              return resolve([]);
            }

            //加载数据
            resolve([{
                direction: 2,
                id: me.upperId - 1,
                type: 1,
                content: '向上滚动加载第 ' + me.upperTimes + ' 条！',
                ctime: new Date().toLocaleString()
              },
                {
                  direction: 1,
                  id: me.upperId - 2,
                  type: 1,
                  content: '向上滚动加载第 ' + me.upperTimes + ' 条！',
                  ctime: new Date().toLocaleString()
                }]
            )
          }, 1000);
          me.upperId = me.upperId + 2;
          me.upperTimes++;
        })
      },
      getUnderData() {
        var me = this;
        //意义同getUpperData()
        return new Promise(function (resolve) {
          setTimeout(function () {
            //模拟加载完毕
            if (me.underTimes > 3) {
              return resolve([]);
            }

            //加载数据
            resolve(
              [{direction: 1, id: me.underId + 1, type: 1, content: '向下滚动加载第 ' + me.underTimes + ' 条！', ctime: new Date().toLocaleString()},
                {direction: 2, id: me.underId + 2, type: 1, content: '向下滚动加载第 ' + me.underTimes + ' 条！', ctime: new Date().toLocaleString()}]
            )
          }, 1000);

          me.underId = me.underId + 2;
          me.underTimes++;
        })
      }

    }
  }
</script>

<style scoped>
</style>
