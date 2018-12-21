import Vue from "vue"
import {mianUrlt9} from '../vuex/api'
import {setLocalStorage,getLocalStorage} from '../vuex/storage'
const http = Vue.http

export function buyAllFund(fundcode,thisPage) {
  thisPage.$vux.loading.show({text: '正在请求'})
  http.post(mianUrlt9 + 'user/getUserInfo', {}, {emulateJSON: true}).then((res) => {
    if (res.data.retCode === '0') {
      setLocalStorage('userName', res.data.data.userName)
      setLocalStorage('isopen', res.data.data.isOpen)
      setLocalStorage('sendTel', res.data.data.sendTel)
      setLocalStorage('sn', res.data.data.idNumber)
      setLocalStorage('Tel', res.data.data.tel)
      // console.log(res.data.data.tel)
      setLocalStorage('x', res.data.data.xscore)
      setLocalStorage('y', res.data.data.yscore)
      setLocalStorage('z', res.data.data.zscore)
      setLocalStorage('level', res.data.data.preferenceLevel)
      setLocalStorage('riskLevel', res.data.data.riskLevel)
      if (res.data.data.weiXinHeadImgUrl === undefined || res.data.data.weiXinHeadImgUrl == null) {
        setLocalStorage('weixinHeadimgurl', '')
      } else {
        setLocalStorage('weixinHeadimgurl', res.data.data.weiXinHeadImgUrl)
      }
      if (res.data.data.isweixin === undefined) {
        setLocalStorage('isweixin', '')
      } else {
        setLocalStorage('isweixin', res.data.data.isweixin)
      }
      if (res.data.data.taxType === undefined) {
        res.data.data.taxType = 'underfined'
      }
      setLocalStorage('taxType', res.data.data.taxType)
      const that = thisPage
      const Tel = getLocalStorage('Tel')
      const isopen = getLocalStorage('isopen')
      const riskLevel = getLocalStorage('riskLevel')
      if (isopen === '0') { // 未开户
        /*thisPage.$router.push({
          path: '/component/account',
          query: {path: thisPage.$route.fullPath}
        })*/
        thisPage.$vux.confirm.show({
          title: '尚未开户',
          content: '基金交易前，需要您先开通基金账户！',
          onShow () {
            console.log('plugin show')
          },
          onHide () {
            console.log('plugin hide')
          },
          onCancel () {
            thisPage.$router.push({path: '/component/login', query: {path: that.$route.fullPath}})
          },
          onConfirm () {
            thisPage.$router.push({path: '/component/account', query: {path: that.$route.fullPath}})
          }
        })
      } else if (riskLevel == null || riskLevel === '') { // 未做风险测评
        thisPage.$vux.confirm.show({
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
        const obj = {fundCode: fundcode.substring(0, 6)}
        http.post(mianUrlt9 + 'fund/beforeSingleBuy', obj, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            thisPage.$vux.loading.hide()
            // console.log(res)
            thisPage.$router.push({
              path: '/component/buy-fund',
              query: {
                fundCode: res.data.data.fundCode,
                fundName: res.data.data.fundName,
                fundType: res.data.data.fundType,
                perMax22: res.data.data.perMax22,
                perMin22: res.data.data.perMin22,
                perMax24: res.data.data.perMax24,
                perMin24: res.data.data.perMin24,
                perMax20: res.data.data.perMax20,
                perMin20: res.data.data.perMin20,
                riskLevel: res.data.data.riskLevel,
                shareType: res.data.data.shareType,
                status: res.data.data.status,
                taNo: res.data.data.taNo
              }
            })
          } else if (res.data.retCode === '990101') {
            thisPage.$vux.loading.hide()
            thisPage.$vux.toast.text(res.data.retMsg, 'middle', 3000)
            thisPage.$router.push({
              path: '/component/login',
              query: {path: thisPage.$route.fullPath}
            })
          } else if (res.data.retCode === '990102') {
            thisPage.$vux.loading.hide()
            thisPage.$vux.toast.text(res.data.data[0].field + '' + res.data.data[0].message, 'middle', 3000)
          } else if (res.data.retCode === '990103') {
            Vue.$vux.loading.hide()
            thisPage.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
          } else if (res.data.retCode === '990104') {
            thisPage.$vux.loading.hide()
            thisPage.$vux.toast.text('服务器内部错误', 'middle', 3000)
          } else if (res.data.retCode === '201008') {
            // thisPage.$Message.warning('该基金暂停申购！')
            thisPage.$vux.loading.hide()
            thisPage.$vux.toast.text('该基金暂停申购！', 'middle', 3000)
          } else {
            thisPage.$vux.loading.hide()
            thisPage.$vux.toast.text(res.data.retMsg, 'middle', 3000)
          }
        })
      }
    } else if (res.data.retCode === '990101') {
      thisPage.$vux.loading.hide()
      thisPage.$vux.toast.text('未登录', 'middle', 3000)
      thisPage.$router.push({
        path: '/component/login',
        query: {path: thisPage.$route.fullPath}
      })
    } else {
      thisPage.$vux.loading.hide()
      thisPage.$router.push({
        path: '/component/login',
        query: {path: thisPage.$route.fullPath}
      })
    }
    //resolve(res)
  }).catch(error => {
    console.log(error)
  })
}

export function buyAllInvest(fundcode,thisPage) {
  thisPage.$vux.loading.show({text: '正在请求'})
  http.post(mianUrlt9 + 'user/getUserInfo', {}, {emulateJSON: true}).then((res) => {
    if (res.data.retCode === '0') {
      setLocalStorage('userName', res.data.data.userName)
      setLocalStorage('isopen', res.data.data.isOpen)
      setLocalStorage('sendTel', res.data.data.sendTel)
      setLocalStorage('sn', res.data.data.idNumber)
      setLocalStorage('Tel', res.data.data.tel)
      // console.log(res.data.data.tel)
      setLocalStorage('x', res.data.data.xscore)
      setLocalStorage('y', res.data.data.yscore)
      setLocalStorage('z', res.data.data.zscore)
      setLocalStorage('level', res.data.data.preferenceLevel)
      setLocalStorage('riskLevel', res.data.data.riskLevel)
      if (res.data.data.weiXinHeadImgUrl === undefined || res.data.data.weiXinHeadImgUrl == null) {
        setLocalStorage('weixinHeadimgurl', '')
      } else {
        setLocalStorage('weixinHeadimgurl', res.data.data.weiXinHeadImgUrl)
      }
      if (res.data.data.isweixin === undefined) {
        setLocalStorage('isweixin', '')
      } else {
        setLocalStorage('isweixin', res.data.data.isweixin)
      }
      if (res.data.data.taxType === undefined) {
        res.data.data.taxType = 'underfined'
      }
      setLocalStorage('taxType', res.data.data.taxType)
      const that = thisPage
      const Tel = getLocalStorage('Tel')
      const isopen = getLocalStorage('isopen')
      const riskLevel = getLocalStorage('riskLevel')
      if (isopen === '0') { // 未开户
        /*thisPage.$router.push({
          path: '/component/account',
          query: {path: thisPage.$route.fullPath}
        })*/
        thisPage.$vux.confirm.show({
          title: '尚未开户',
          content: '基金交易前，需要您先开通基金账户！',
          onShow () {
            console.log('plugin show')
          },
          onHide () {
            console.log('plugin hide')
          },
          onCancel () {
            thisPage.$router.push({path: '/component/login', query: {path: that.$route.fullPath}})
          },
          onConfirm () {
            thisPage.$router.push({path: '/component/account', query: {path: that.$route.fullPath}})
          }
        })
      } else if (riskLevel == null || riskLevel === '') { // 未做风险测评
        thisPage.$vux.confirm.show({
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
        const obj = {fundCode: fundcode.substring(0, 6)}
        http.post(mianUrlt9 + 'fund/preGeneralInvestOpen', obj, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            thisPage.$vux.loading.hide()
            // console.log(res)
            thisPage.$router.push({
              path: '/component/invest-fund',
              query: {
                fundCode: res.data.data.fundCode,
                fundName: res.data.data.fundName,
                maxInvestAmount: res.data.data.maxInvestAmount,
                minInvestAmount: res.data.data.minInvestAmount
              }
            })
          } else if (res.data.retCode === '990101') {
            thisPage.$vux.loading.hide()
            thisPage.$vux.toast.text(res.data.retMsg, 'middle', 3000)
            thisPage.$router.push({
              path: '/component/login',
              query: {path: thisPage.$route.fullPath}
            })
          } else if (res.data.retCode === '990102') {
            thisPage.$vux.loading.hide()
            thisPage.$vux.toast.text(res.data.data[0].field + '' + res.data.data[0].message, 'middle', 3000)
          } else if (res.data.retCode === '990103') {
            thisPage.$vux.loading.hide()
            thisPage.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
          } else if (res.data.retCode === '990104') {
            thisPage.$vux.loading.hide()
            thisPage.$vux.toast.text('服务器内部错误', 'middle', 3000)
          } else if (res.data.retCode === '201007') {
            thisPage.$vux.loading.hide()
            thisPage.$vux.toast.text('此基金暂时不支持定投', 'middle', 3000)
          } else {
            thisPage.$vux.loading.hide()
            thisPage.$vux.toast.text(res.data.retMsg, 'middle', 3000)
          }
        })
      }
    } else if (res.data.retCode === '990101') {
      thisPage.$vux.loading.hide()
      thisPage.$router.push({
        path: '/component/login',
        query: {path: thisPage.$route.fullPath}
      })
    } else {
      thisPage.$vux.loading.hide()
      thisPage.$router.push({
        path: '/component/login',
        query: {path: thisPage.$route.fullPath}
      })
    }
  }).catch(error => {
    console.log(error)
  })
}

export function buyAllGroup(groupcode,groupname,thisPage) {
  thisPage.$vux.loading.show({text: '正在请求'})
  http.post(mianUrlt9 + 'user/getUserInfo', {}, {emulateJSON: true}).then((res) => {
    if (res.data.retCode === '0') {
      setLocalStorage('userName', res.data.data.userName)
      setLocalStorage('isopen', res.data.data.isOpen)
      setLocalStorage('sendTel', res.data.data.sendTel)
      setLocalStorage('sn', res.data.data.idNumber)
      setLocalStorage('Tel', res.data.data.tel)
      // console.log(res.data.data.tel)
      setLocalStorage('x', res.data.data.xscore)
      setLocalStorage('y', res.data.data.yscore)
      setLocalStorage('z', res.data.data.zscore)
      setLocalStorage('level', res.data.data.preferenceLevel)
      setLocalStorage('riskLevel', res.data.data.riskLevel)
      if (res.data.data.weiXinHeadImgUrl === undefined || res.data.data.weiXinHeadImgUrl == null) {
        setLocalStorage('weixinHeadimgurl', '')
      } else {
        setLocalStorage('weixinHeadimgurl', res.data.data.weiXinHeadImgUrl)
      }
      if (res.data.data.isweixin === undefined) {
        setLocalStorage('isweixin', '')
      } else {
        setLocalStorage('isweixin', res.data.data.isweixin)
      }
      if (res.data.data.taxType === undefined) {
        res.data.data.taxType = 'underfined'
      }
      setLocalStorage('taxType', res.data.data.taxType)
      const that = thisPage
      if (getLocalStorage('isopen') == '0') { // 未开户
        /*thisPage.$router.push({
          path: '/component/account',
          query: {path: thisPage.$route.path}
        })*/
        thisPage.$vux.confirm.show({
          title: '尚未开户',
          content: '基金交易前，需要您先开通基金账户！',
          onShow () {
            console.log('plugin show')
          },
          onHide () {
            console.log('plugin hide')
          },
          onCancel () {
            thisPage.$router.push({path: '/component/login', query: {path: that.$route.fullPath}})
          },
          onConfirm () {
            thisPage.$router.push({path: '/component/account', query: {path: that.$route.fullPath}})
          }
        })
      } else if (getLocalStorage('riskLevel') == null || getLocalStorage('riskLevel') == '') { // 未做风险测评
        thisPage.$vux.confirm.show({
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
        thisPage.$vux.loading.hide()
        thisPage.$router.push({
          path: '/component/buy-group',
          query: {groupId: groupcode, groupname: groupname}
        })
      }
    } else if (res.data.retCode === '990101') {
      thisPage.$vux.loading.hide()
      thisPage.$router.push({
        path: '/component/login',
        query: {path: thisPage.$route.fullPath}
      })
    } else {
      thisPage.$vux.loading.hide()
      thisPage.$router.push({
        path: '/component/login',
        query: {path: thisPage.$route.fullPath}
      })
    }
  }).catch(error => {
    console.log(error)
  })

}
