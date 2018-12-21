<template>
  <div>
    <div>
      <div class="tax_title">
        为配合参与人落实国税总局关于非居民涉税信息收集的相关工作要求，确保《中央数据交换平台开放式基金业务数据交换协议》切换工作顺利开展，现在需要您补填相关信息：
      </div>
      <h2 class="planTitle">填写信息</h2>
      <group>
        <x-input title="真实姓名" v-model="userName" :disabled="true" text-align="right"></x-input>
        <x-input title="身份证号" v-model="sn" :disabled="true" text-align="right"></x-input>
        <selector title="税收类型" ref="bankt" :options="taxList" v-model="taxValue" direction="rtl"></selector>
      </group>
      <Group style="margin-top: 10px;" v-show="taxValue != '1'">
        <popup-picker title="出生国家/地区" :data="list" v-model="birthcitydefault" value-text-align="right"></popup-picker>
        <x-input title="出生城市" v-model="birthcity" placeholder="请用英文/拼音填写" :disabled="false"
                 text-align="right"></x-input>
        <popup-picker title="现居国家/地区" :data="list" v-model="nowcitydefault" value-text-align="right"></popup-picker>
        <x-input title="现居城市" v-model="birthcity" placeholder="请用英文/拼音填写" :disabled="false"
                 text-align="right"></x-input>
        <popup-picker title="税收国家/地区" :data="list" v-model="taxcitydefault" value-text-align="right"></popup-picker>
        <x-switch title="是否有纳税人识别号" :value-map="['0', '1']" v-model="flag0"></x-switch>
        <x-input v-show="flag0 == '0'" title="纳税人识别号" v-model="taxnum" placeholder="请输入纳税人识别号" :disabled="false"
                 text-align="right"></x-input>
        <selector v-show="flag0 == '1'" title="选择原因" ref="reasonkt" :options="reasonlist" v-model="taxreason"
                  direction="rtl"></selector>
      </group>
      <box gap="10px 10px">
        <x-button type="primary" :disabled='ables' :gradients="['#FF9500', '#FF9500']" @click.native="taxAdd">提交涉税信息
        </x-button>
      </box>
    </div>
    <toast v-model="showPositionValue" type="text" :time="800" width="18em" is-show-mask :text="toastText"
           :position="position"></toast>
  </div>
</template>

<i18n>
  set bar-active-color:
  zh-CN: 设置bar颜色
</i18n>

<script>
  import {
    XInput,
    Confirm,
    XSwitch,
    Loading,
    Toast,
    XNumber,
    Datetime,
    Selector,
    Box,
    Group,
    XButton,
    Swiper,
    SwiperItem,
    Tabbar,
    TabbarItem,
    PopupPicker
  } from 'vux'
  import {mianUrlt9} from '../vuex/api'
  import {getLocalStorage, setLocalStorage} from '../vuex/storage'

  export default {
    components: {
      XInput,
      Confirm,
      Group,
      XNumber,
      Toast,
      Loading,
      XSwitch,
      Datetime,
      Box,
      XButton,
      Swiper,
      SwiperItem,
      Tabbar,
      TabbarItem,
      PopupPicker,
      Selector
    },
    data () {
      return {
        birthcity: '',
        birthcitydefault: ['请选择'],
        nowcitydefault: ['请选择'],
        taxcitydefault: ['请选择'],
        nowcity: '',
        taxnum: '',
        list: [['请选择', 'China', 'Macau', 'Hong Kong', 'Taiwan', 'Afghanistan', 'Anguilla', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bouvet Islands', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Cote D\'Ivorie', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Egypt', 'El Salvador', 'Equador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Republic of Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mayotte', 'Metropolitan France', 'Mexico', 'Moldova', 'Mongolia', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Neterlands Antilles', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Republic of Korea', 'Republic of Macedonia', 'Reunion', 'Romania', 'Russia', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'Spain', 'Sri Lanka', 'St. Helena', 'St. Kitts and Nevis', 'St. Lucia', 'St. Vincent and the Grenadines', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen Islands', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States USA', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Western Sahara', 'Yemen', 'Yugoslavia', 'Zaire', 'Zambia', 'Zimbabwe']],
        taxList: [{key: 1, value: '中国税收居民'}, {key: 2, value: '非中国税收居民'}, {key: 3, value: '既是中国税收居民又是其他税收管辖区居民'}],
        taxValue: '1',
        userName: '',
        sn: '',
        position: 'default',
        toastText: '',
        showPositionValue: false,
        ables: false,
        flag0: '0',
        reasonlist: [{key: 1, value: '不发放纳税人识别号'}, {key: 2, value: '未能取得纳税人识别号'}],
        taxreason: '1',
        path: this.$route.query.path // 接收详情页面跳转过来的路径
      }
    },
    methods: {
      showPosition (position) {
        this.position = position
        this.showPositionValue = true
      },
      taxAdd () {
        this.ables = true
        if (this.taxValue !== 1 && this.taxValue !== '1') {
          if (this.taxValue === 0) {
            this.toastText = '请选择税收类型'
            this.showPosition('middle')
            return false
          }
          if (this.birthcitydefault[0] === '请选择') {
            this.toastText = '请选择出生国家/地区'
            this.showPosition('middle')
            return false
          }
          if (this.birthcity === '') {
            this.toastText = '请填写出生城市'
            this.showPosition('middle')
            return false
          }

          if (this.nowcitydefault[0] === '请选择') {
            this.toastText = '请选择现居国家/地区'
            this.showPosition('middle')
            return false
          }
          if (this.nowcity === '') {
            this.toastText = '请填写居住城市'
            this.showPosition('middle')
            return false
          }

          if (this.taxcitydefault[0] === '请选择') {
            this.toastText = '请选择税收国家/地区'
            this.showPosition('middle')
            return false
          }
          if (this.taxreason === '1' && this.taxnum === '') {
            this.toastText = '请填写纳税人识别号'
            this.showPosition('middle')
            return false
          }
          if (this.taxreason === '2' && this.taxreason === 0) {
            this.toastText = '请选择没有纳税人识别号的原因'
            this.showPosition('middle')
            return false
          }
        }
        this.$vux.loading.show({text: '提交中'})
        this.$http.post(mianUrlt9 + 'user/addUserTaxInformation', {
          taxType: this.taxValue,
          engbirthcountry: this.birthcitydefault[0],
          engbirthcity: this.birthcity,
          engcurrentcountry: this.nowcitydefault[0],
          engcurrentcity: this.nowcity,
          taxesplace: this.taxcitydefault[0],
          taxesinfoseriaIno: this.taxnum,
          notaxesreason: this.taxreason
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.ables = false
            this.$vux.loading.hide()
            setLocalStorage('taxType', this.taxValue)
            if (this.path !== undefined) {
              this.$router.push({
                path: this.path,
                query: {result: getLocalStorage('answer')}
              })
            } else {
              this.$router.push({path: '/component/my'})
            }
          } else {
            this.ables = false
            this.$vux.loading.hide()
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      },
      getUserInfo () {
        this.$http.post(mianUrlt9 + 'user/getUserInfo', {}, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.userName = res.data.data.userName
            this.sn = res.data.data.idNumber
            // setLocalStorage('taxType', res.data.data.taxType)
            // this.getrisklevel()
            // console.log(this.$store.state.username)
            // console.log(this.$store.state.isopen)
            // resolve()
          } else if (res.data.retCode === '990101') {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          } else if (res.data.retCode === '990102') {
            this.toastText = res.data.data[0].field + '' + res.data.data[0].message
            this.showPosition('middle')
          } else if (res.data.retCode === '990103') {
            this.toastText = '系统正在维护，请稍后再试'
            this.showPosition('middle')
          } else if (res.data.retCode === '990104') {
            this.toastText = '服务器内部错误'
            this.showPosition('middle')
          } else {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      }
    },
    mounted () {
      this.getUserInfo()
    }
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/center.less';
  @import '../styles/custom.less';

  .tax_title {
    position: relative;
    padding: 10px;
    border-bottom: 1px solid @ai-line-color;
    font-size: 14px;
    color: #ff9900;
    background-color: #fff;
  }

  .step_banner img {
    display: block;
    width: 100%;
    height: auto;
  }

  .planTitle {
    line-height: 44px;
    font-size: 16px;
    padding-left: 10px;
    color: #ffa014;
  }

  .weui-tabbar__item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
  }

  .weui-tabbar__item:nth-child(1) {
    background-color: #ffa014;
    flex: 1;
    border-bottom: 1px solid #ffa014;
  }

  .swiper-demo-img img {
    display: block;
    width: 100%;
    height: auto;
  }

  .weui-tabbar__label span {
    font-size: 16px;
    color: #ffffff;
  }

  .active-6-1 {
    color: rgb(252, 55, 140) !important;
    border-color: rgb(252, 55, 140) !important;
  }

  .active-6-2 {
    color: #04be02 !important;
    border-color: #04be02 !important;
  }

  .active-6-3 {
    color: rgb(55, 174, 252) !important;
    border-color: rgb(55, 174, 252) !important;
  }

  .weui-cells__title {
    color: #222222;
  }

  .select_plan {
    background-color: #ffffff;
    margin: 10px 0;
  }

  .weui-cells {
    margin-top: 0px;
  }

  .up {
    color: @redfont;
  }

  .dream {
    border: 1px solid #cccccc;
    width: 90%;
    border-radius: 5px;
    margin: 0 auto;
    margin-bottom: 15px;
  }

  .dream input {
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    color: #222222;
    border: none;
    outline: none;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    border-radius: 5px;
  }

  .down {
    color: @greenfont;
  }
</style>
