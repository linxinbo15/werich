<template>
  <div class="mofantotal">
    <div class="banner">
      <img src="../assets/event/YD_mf_banner.png">
    </div>
      <div class="list">
        <img src="../assets/event/intro1.png" class="subject">
        <div class="content" style="overflow: hidden;">
          <div class="obj2">
            <div class="obj2_content1">
              <img src="../assets/event/icon01.png" class="img1">
              <div class="content1_text">
                <p>基金筛选</p>
                <div>采用机器学习与因子模式相结合的方式，对全部公募基金进行优选，来寻找可以区分基金收益的模式。</div>
              </div>
            </div>
            <div class="obj2_content2">
              <div class="content2_text">
                <p>市场预判</p>
                <div>利用了多周期、多角度、多策略择时模型，采用机器学习来进行复合，判断未来市场涨跌的概率。</div>
              </div>
              <img src="../assets/event/icon02.png" class="img2">
          </div>
            </div>
          </div>
        </div>
        <div class="list">
          <h2>十一月回顾</h2>
          <div class="z_t">
            <table>
              <tr>
                <td>基金名称</td>
                <td>11月收益</td>
                <!-- <td>6月以来</td> -->
                <td>购买</td>
              </tr>
              <tr v-for='item in November'>
                <td>{{item.name}}</td>
                <td :class="{'small':Number(item.shouyi) > 0}">{{item.shouyi}}%</td>
                <!-- <td :class="{'small':Number(item.totalshouyi) > 0}">{{item.totalshouyi}}%</td> -->
                <td class="buy">
                  <button @click='buyFundPrepose(item.code,item.name)'>购买</button>
                </td>
              </tr>
            </table>
            <p class="sub">数据截止2018.12.2</p>
          </div>
        </div>
        <div class="list">
          <h2>十月回顾</h2>
          <div class="z_t">
            <table>
              <tr>
                <td>基金名称</td>
                <td>10月收益</td>
                <!-- <td>6月以来</td> -->
                <td>购买</td>
              </tr>
              <tr v-for='item in October'>
                <td>{{item.name}}</td>
                <td :class="{'small':Number(item.shouyi) > 0}">{{item.shouyi}}%</td>
                <!-- <td :class="{'small':Number(item.totalshouyi) > 0}">{{item.totalshouyi}}%</td> -->
                <td class="buy">
                  <button @click='buyFundPrepose(item.code,item.name)'>购买</button>
                </td>
              </tr>
            </table>
            <p class="sub">数据截止2018.11.2</p>
          </div>
        </div>
        <div class="list">
          <h2>九月回顾</h2>
          <div class="z_t">
            <table>
              <tr>
                <td>基金名称</td>
                <td>9月收益</td>
                <!-- <td>6月以来</td> -->
                <td>购买</td>
              </tr>
              <tr v-for='item in September'>
                <td>{{item.name}}</td>
                <td :class="{'small':Number(item.shouyi) > 0}">{{item.shouyi}}%</td>
                <!-- <td :class="{'small':Number(item.totalshouyi) > 0}">{{item.totalshouyi}}%</td> -->
                <td class="buy">
                  <button @click='buyFundPrepose(item.code,item.name)'>购买</button>
                </td>
              </tr>
            </table>
            <p class="sub">数据截止2018.10.2</p>
          </div>
        </div>
        <div class="list">
          <h2>八月回顾</h2>
          <div class="z_t">
            <table>
              <tr>
                <td>基金名称</td>
                <td>8月收益</td>
                <!-- <td>6月以来</td> -->
                <td>购买</td>
              </tr>
              <tr v-for='item in August'>
                <td>{{item.name}}</td>
                <td :class="{'small':Number(item.shouyi) > 0}">{{item.shouyi}}%</td>
                <!-- <td :class="{'small':Number(item.totalshouyi) > 0}">{{item.totalshouyi}}%</td> -->
                <td class="buy">
                  <button @click='buyFundPrepose(item.code,item.name)'>购买</button>
                </td>
              </tr>
            </table>
            <p class="sub">数据截止2018.9.2</p>
          </div>
        </div>
        <div class="list">
          <h2>七月回顾</h2>
          <div class="z_t">
            <table>
              <tr>
                <td>基金名称</td>
                <td>7月收益</td>
                <!-- <td>6月以来</td> -->
                <td>购买</td>
              </tr>
              <tr v-for='item in July'>
                <td>{{item.name}}</td>
                <td :class="{'small':Number(item.shouyi) > 0}">{{item.shouyi}}%</td>
                <!-- <td :class="{'small':Number(item.totalshouyi) > 0}">{{item.totalshouyi}}%</td> -->
                <td class="buy">
                  <button @click='buyFundPrepose(item.code,item.name)'>购买</button>
                </td>
              </tr>
            </table>
            <p class="sub">数据截止2018.8.2</p>
          </div>
        </div>
        <div class="list">
          <!-- <img src="../assets/event/1804.png" class="subject"> -->
          <h2>六月回顾</h2>
          <div class="z_t">
            <table>
              <tr>
                <td>基金名称</td>
                <td>6月收益</td>
                <!-- <td>6月以来</td> -->
                <td>购买</td>
              </tr>
              <tr v-for='item in June'>
                <td>{{item.name}}</td>
                <td :class="{'small':Number(item.shouyi) > 0}">{{item.shouyi}}%</td>
                <!-- <td :class="{'small':Number(item.totalshouyi) > 0}">{{item.totalshouyi}}%</td> -->
                <td class="buy">
                  <button @click='buyFundPrepose(item.code,item.name)'>购买</button>
                </td>
              </tr>
            </table>
            <p class="sub">数据截止2018.7.2</p>
          </div>
        </div>
        <div class="list">
          <sticky scroll-box="vux_view_box_body" ref="sticky" :offset="46" :check-sticky-support="false" :disabled="disabled">
            <tab :line-width="3" active-color='#ff9900'>
              <tab-item selected @on-item-click="select1">一月</tab-item>
              <tab-item @on-item-click="select1">二月</tab-item>
              <tab-item @on-item-click="select1">三月</tab-item>
              <tab-item @on-item-click="select1">四月</tab-item>
              <tab-item @on-item-click="select1">五月</tab-item>
            </tab>
          </sticky>
          <div class="z_t" v-show="currentindex === 0">
            <table>
              <tr>
                <td>基金名称</td>
                <td>1月收益</td>
                <!-- <td>1月以来</td> -->
                <td>购买</td>
              </tr>
              <tr v-for='item in Jan'>
                <td>{{item.name}}</td>
                <td :class="{'small':Number(item.shouyi) > 0}">{{item.shouyi}}%</td>
                <!-- <td :class="{'small':Number(item.totalshouyi) > 0}">{{item.totalshouyi}}%</td> -->
                <td class="buy">
                  <button @click='buyFundPrepose(item.code,item.name)'>购买</button>
                </td>
              </tr>
            </table>
            <p class="sub">数据截止2018.2.6</p>
          </div>
          <div class="z_t" v-show="currentindex === 1">
            <table>
              <tr>
                <td>基金名称</td>
                <td>2月收益</td>
                <!-- <td>2月以来</td> -->
                <td>购买</td>
              </tr>
              <tr v-for='item in Feb'>
                <td>{{item.name}}</td>
                <td :class="{'small':Number(item.shouyi) > 0}">{{item.shouyi}}%</td>
                <!-- <td :class="{'small':Number(item.totalshouyi) > 0}">{{item.totalshouyi}}%</td> -->
                <td class="buy">
                  <button @click='buyFundPrepose(item.code,item.name)'>购买</button>
                </td>
              </tr>
            </table>
            <p class="sub">数据截止2018.3.6</p>
          </div>
          <div class="z_t" v-show="currentindex === 2">
            <table>
              <tr>
                <td>基金名称</td>
                <td>3月收益</td>
                <!-- <td>3月以来</td> -->
                <td>购买</td>
              </tr>
              <tr v-for='item in Mar'>
                <td>{{item.name}}</td>
                <td :class="{'small':Number(item.shouyi) > 0}">{{item.shouyi}}%</td>
                <!-- <td :class="{'small':Number(item.totalshouyi) > 0}">{{item.totalshouyi}}%</td> -->
                <td class="buy">
                  <button @click='buyFundPrepose(item.code,item.name)'>购买</button>
                </td>
              </tr>
            </table>
            <p class="sub">数据截止2018.4.6</p>
          </div>
          <div class="z_t" v-show="currentindex === 3">
            <table>
              <tr>
                <td>基金名称</td>
                <td>4月收益</td>
                <!-- <td>4月以来</td> -->
                <td>购买</td>
              </tr>
              <tr v-for='item in April'>
                <td>{{item.name}}</td>
                <td :class="{'small':Number(item.shouyi) > 0}">{{item.shouyi}}%</td>
                <!-- <td :class="{'small':Number(item.totalshouyi) > 0}">{{item.totalshouyi}}%</td> -->
                <td class="buy">
                  <button @click='buyFundPrepose(item.code,item.name)'>购买</button>
                </td>
              </tr>
            </table>
            <p class="sub">数据截止2018.5.7</p>
          </div>
          <div class="z_t" v-show="currentindex === 4">
            <table>
              <tr>
                <td>基金名称</td>
                <td>5月收益</td>
                <!-- <td>5月以来</td> -->
                <td>购买</td>
              </tr>
              <tr v-for='item in May'>
                <td>{{item.name}}</td>
                <td :class="{'small':Number(item.shouyi) > 0}">{{item.shouyi}}%</td>
                <!-- <td :class="{'small':Number(item.totalshouyi) > 0}">{{item.totalshouyi}}%</td> -->
                <td class="buy">
                  <button @click='buyFundPrepose(item.code,item.name)'>购买</button>
                </td>
              </tr>
            </table>
            <p class="sub">数据截止2018.6.7</p>
          </div>
        </div>
        <toast v-model="showPositionValue" type="text" width="18em" :time="800" is-show-mask :text="toastText" :position="position">{{toastText}}
        </toast>
      </div>
</template>
<script>
import { Tab, TabItem, Sticky, Confirm, Toast } from 'vux'
import { mianUrlt9 } from '../vuex/api'
import { getLocalStorage } from '../vuex/storage'

export default {
  data() {
    return {
      toastText: '加入自选成功！',
      showPositionValue: false,
      position: 'default',
      disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
      November:[
     {
        name: '广发稳健增长',
        code: '270002.OF',
        shouyi:'1.56',
        totalshouyi:'-2.96'
      }, {
        name: '工银瑞信金融地产',
        code: '000215.OF',
        shouyi:'0.63',
        totalshouyi:'0.06'
      }, {
        name: '汇添富价值精选A',
        code: '519069.OF',
        shouyi:'0.00',
        totalshouyi:'-6.76'
      }, {
        name: '华安核心优选',
        code: '040011.OF',
        shouyi:'0.60',
        totalshouyi:'-0.17'
      }, {
        name: '新华行业轮动',
        code: '519156.OF',
        shouyi:'1.34',
        totalshouyi:'-2.69'
      }, {
        name: '弘德优选成长',
        code: '001256.OF',
        shouyi:'1.19',
        totalshouyi:'-3.81'
      }, {
        name: '华安易富黄金ETF联接A',
        code: '000216.OF',
        shouyi:'0.22',
        totalshouyi:'3.75'
      }, {
        name: '新华纯债添利',
        code: '519152.OF',
        shouyi:'0.38',
        totalshouyi:'0.77'
      }, {
        name: '银华信用季季红A',
        code: '000286.OF',
        shouyi:'0.38',
        totalshouyi:'1.24'
      }, {
        name: '交银双轮动AB',
        code: '519723.OF',
        shouyi:'0.94',
        totalshouyi:'2.17'
      }],
      October:[
      { 
        name: '嘉实美国成长人民币',
        code: '000043.OF',
        shouyi:'-8.67',
        totalshouyi:'-9.31'
      }, {
        name: '博时标普500ETF联接A',
        code: '050025.OF',
        shouyi:'-5.34',
        totalshouyi:'-5.31'
      }, {
        name: '广发纳斯达克100人民币',
        code: '270042.OF',
        shouyi:'-8.67',
        totalshouyi:'-9.31'
      }, {
        name: '工银瑞信全球精选',
        code: '486002.OF',
        shouyi:'-6.36',
        totalshouyi:'-6.23'
      }, {
        name: '汇添富价值精选A',
        code: '519069.OF',
        shouyi:'-9.52',
        totalshouyi:'-6.33'
      }, {
        name: '华安策略优选',
        code: '040008.OF',
        shouyi:'-7.71',
        totalshouyi:'-5.61'
      }, {
        name: '广发优企精选',
        code: '002624.OF',
        shouyi:'-8.58',
        totalshouyi:'-5.34'
      }, {
        name: '新华纯债添利',
        code: '519152.OF',
        shouyi:'0.31',
        totalshouyi:'0.39'
      }, {
        name: '银华信用季季红A',
        code: '000286.OF',
        shouyi:'0.76',
        totalshouyi:'0.76'
      }, {
        name: '易方达投资级信用债',
        code: '000205.OF',
        shouyi:'0.89',
        totalshouyi:'1.07'
      }],
      September:[{
        name: '嘉实美国成长人民币',
        code: '000043.OF',
        shouyi: '-3.05',
        totalshouyi: '-3.05'
      }, {
        name: '博时标普500ETF联接A',
        code: '050025.OF',
        shouyi: '1.21',
        totalshouyi: '1.21'
      }, {
        name: '广发纳斯达克100人民币',
        code: '270042.OF',
        shouyi: '-3.69',
        totalshouyi: '-3.69'
      }, {
        name: '工银瑞信全球精选',
        code: '486002.OF',
        shouyi: '-0.99',
        totalshouyi: '-0.99'
      }, {
        name: '汇添富价值精选A',
        code: '519069.OF',
        shouyi: '-3.35',
        totalshouyi: '-3.35'
      }, {
        name: '交银阿尔法',
        code: '519712.OF',
        shouyi: '-4.33',
        totalshouyi: '-4.33'
      }, {
        name: '新华纯债添利',
        code: '519152.OF',
        shouyi: '0.45',
        totalshouyi: '0.45'
      }, {
        name: '中银纯债A',
        code: '380005.OF',
        shouyi: '0.38',
        totalshouyi: '0.38'
      }, {
        name: '华夏纯债A',
        code: '000015.OF',
        shouyi: '0.49',
        totalshouyi: '0.49'
      }, {
        name: '广发纯债A',
        code: '270048.OF',
        shouyi: '0.42',
        totalshouyi: '0.42'
      }],
      August: [{
        name: '易方达标普消费品人民币A',
        code: '118002.OF',
        shouyi: '0.21',
        totalshouyi: '-0.46'
      }, {
        name: '华安德国30(DAX)ETF',
        code: '000614.OF',
        shouyi: '-3.33',
        totalshouyi: '-6.74'
      }, {
        name: '博时标普500ETF联接A',
        code: '050025.OF',
        shouyi: '3.01',
        totalshouyi: '4.25'
      }, {
        name: '广发纳斯达克100人民币',
        code: '270042.OF',
        shouyi: '6.47',
        totalshouyi: '2.54'
      }, {
        name: '工银瑞信全球精选',
        code: '486002.OF',
        shouyi: '2.15',
        totalshouyi: '1.15'
      }, {
        name: '广发稳健增长',
        code: '270002.OF',
        shouyi: '-2.28',
        totalshouyi: '-2.82'
      }, {
        name: '交银优势行业',
        code: '519697.OF',
        shouyi: '-1.76',
        totalshouyi: '-5.93'
      }, {
        name: '新华纯债添利',
        code: '519152.OF',
        shouyi: '0.30',
        totalshouyi: '0.75'
      }, {
        name: '大摩强收益债券',
        code: '233005.OF',
        shouyi: '0.47',
        totalshouyi: '0.93'
      }, {
        name: '易方达稳健收益A',
        code: '110007.OF',
        shouyi: '-0.67',
        totalshouyi: '-0.70'
      }],
      June: [{
        name: '汇添富消费行业',
        shouyi: '-3.53',
        totalshouyi: '-8.42',
        code: '000083.OF'
      }, {
        name: '中欧价值发现A',
        shouyi: '-6.02',
        totalshouyi: '-11.29',
        code: '166005.OF'
      }, {
        name: '汇添富价值精选',
        shouyi: '-5.96',
        totalshouyi: '-10.05',
        code: '519069.OF'
      }, {
        name: '广发稳健增长',
        shouyi: '-3.62',
        totalshouyi: '-6.31',
        code: '270002.OF'
      }, {
        name: '华宝宝康消费品',
        shouyi: '-6.00',
        totalshouyi: '-9.17',
        code: '240001.OF'
      }, {
        name: '易方达消费行业',
        shouyi: '-3.57',
        totalshouyi: '-9.55',
        code: '110022.OF'
      }, {
        name: '新华纯债添利',
        shouyi: '0.36',
        totalshouyi: '0.51',
        code: '519152.OF'
      }, {
        name: '易方达稳健收益A',
        shouyi: '-2.00',
        totalshouyi: '-2.50',
        code: '110007.OF'
      }, {
        name: '银华信用季季红A',
        shouyi: '0.38',
        totalshouyi: '0.77',
        code: '000286.OF'
      }, {
        name: '大摩双利增强A',
        shouyi: '-0.18',
        totalshouyi: '0.00',
        code: '000024.OF'
      }],
      July: [{
        name: '汇添富医疗服务',
        code: '001417.OF',
        shouyi: '-6.99',
        totalshouyi: '-6.99'
      }, {
        name: '交银阿尔法',
        code: '519712.OF',
        shouyi: '-3.21',
        totalshouyi: '-3.21'
      }, {
        name: '易方达消费行业',
        code: '110022.OF',
        shouyi: '-5.02',
        totalshouyi: '-5.02'
      }, {
        name: '广发稳健增长',
        code: '270002.OF',
        shouyi: '-2.21',
        totalshouyi: '-2.21'
      }, {
        name: '工银瑞信全球精选',
        code: '486002.OF',
        shouyi: '4.45',
        totalshouyi: '4.45'
      }, {
        name: '中银纯债A',
        code: '380005.OF',
        shouyi: '1.43',
        totalshouyi: '1.43'
      }, {
        name: '新华纯债添利',
        code: '519152.OF',
        shouyi: '0.52',
        totalshouyi: '0.52'
      }, {
        name: '易方达稳健收益A',
        code: '110007.OF',
        shouyi: '1.57',
        totalshouyi: '1.57'
      }, {
        name: '银华信用季季红A',
        code: '000286.OF',
        shouyi: '1.54',
        totalshouyi: '1.54'
      }, {
        name: '易方达信用债A',
        code: '000024.OF',
        shouyi: '1.57',
        totalshouyi: '1.57'
      }],
      June: [{
        name: '汇添富消费行业',
        shouyi: '-3.53',
        totalshouyi: '-8.42',
        code: '000083.OF'
      }, {
        name: '中欧价值发现A',
        shouyi: '-6.02',
        totalshouyi: '-11.29',
        code: '166005.OF'
      }, {
        name: '汇添富价值精选',
        shouyi: '-5.96',
        totalshouyi: '-10.05',
        code: '519069.OF'
      }, {
        name: '广发稳健增长',
        shouyi: '-3.62',
        totalshouyi: '-6.31',
        code: '270002.OF'
      }, {
        name: '华宝宝康消费品',
        shouyi: '-6.00',
        totalshouyi: '-9.17',
        code: '240001.OF'
      }, {
        name: '易方达消费行业',
        shouyi: '-3.57',
        totalshouyi: '-9.55',
        code: '110022.OF'
      }, {
        name: '新华纯债添利',
        shouyi: '0.36',
        totalshouyi: '0.51',
        code: '519152.OF'
      }, {
        name: '易方达稳健收益A',
        shouyi: '-2.00',
        totalshouyi: '-2.50',
        code: '110007.OF'
      }, {
        name: '银华信用季季红A',
        shouyi: '0.38',
        totalshouyi: '0.77',
        code: '000286.OF'
      }, {
        name: '大摩双利增强A',
        shouyi: '-0.18',
        totalshouyi: '0.00',
        code: '000024.OF'
      }],
      Jan: [{
        name: '广发全球精选人民币',
        shouyi: '4.28',
        totalshouyi: '-0.18',
        code: '270023.OF'
      }, {
        name: '易方达恒生H股E..',
        shouyi: '9.44',
        totalshouyi: '2.19',
        code: '110031.OF'
      }, {
        name: '华安香港优选',
        shouyi: '4.11',
        totalshouyi: '-1.60',
        code: '040018.OF'
      }, {
        name: '富国中国中小盘',
        shouyi: '4.79',
        totalshouyi: '-1.80',
        code: '100061.OF'
      }, {
        name: '华宝海外中国成长',
        shouyi: '3.58',
        totalshouyi: '-0.32',
        code: '241001.OF'
      }, {
        name: '汇添富香港优势精选',
        shouyi: '7.29',
        totalshouyi: '2.63',
        code: '470888.OF'
      }, {
        name: '南方香港优选',
        shouyi: '5.43',
        totalshouyi: '0.31',
        code: '160125.OF'
      }, {
        name: '汇添富沪港深新价值',
        shouyi: '2.28',
        totalshouyi: '-4.34',
        code: '001685.OF'
      }, {
        name: '嘉实沪港深精选',
        shouyi: '4.30',
        totalshouyi: '0.46',
        code: '001878.OF'
      }, {
        name: '富国沪港深价值精选',
        shouyi: '6.19',
        totalshouyi: '1.24',
        code: '001371.OF'
      }],
      Feb: [{
        name: '景顺长城沪深300',
        shouyi: '-5.76',
        totalshouyi: '-5.05',
        code: '000311.OF'
      }, {
        name: '汇添富价值精选A',
        shouyi: '-1.73',
        totalshouyi: '-0.75',
        code: '519069.OF'
      }, {
        name: '汇添富成长焦点',
        shouyi: '-5.01',
        totalshouyi: '-3.76',
        code: '519068.OF'
      }, {
        name: '汇丰晋信双核策略A',
        shouyi: '-3.92',
        totalshouyi: '-3.04',
        code: '540006.OF'
      }, {
        name: '华宝海外中国成长',
        shouyi: '3.58',
        totalshouyi: '-0.32',
        code: '241001.OF'
      }, {
        name: '圆信永丰双红利C',
        shouyi: '-3.85',
        totalshouyi: '-3.15',
        code: '000825.OF'
      }, {
        name: '圆信永丰优加生活',
        shouyi: '-1.28',
        totalshouyi: '0.13',
        code: '001736.OF'
      }, {
        name: '银华恒生H股',
        shouyi: '-8.47',
        totalshouyi: '-8.57',
        code: '161831.OF'
      }, {
        name: '富国沪港深行业精选',
        shouyi: '-3.91',
        totalshouyi: '-4.19',
        code: '005354.OF'
      }, {
        name: '汇添富香港优势精选',
        shouyi: '-2.71',
        totalshouyi: '-4.10',
        code: '470888.OF'
      }],
      Mar: [{
        name: '景顺长城沪深300',
        shouyi: '-3.95',
        totalshouyi: '-7.01',
        code: '000311.OF'
      }, {
        name: '汇添富价值精选A',
        shouyi: '-0.36',
        totalshouyi: '-4.48',
        code: '519069.OF'
      }, {
        name: '汇添富成长焦点',
        shouyi: '-3.09',
        totalshouyi: '-6.02',
        code: '519068.OF'
      }, {
        name: '汇丰晋信双核策略A',
        shouyi: '-1.25',
        totalshouyi: '-4.26',
        code: '540006.OF'
      }, {
        name: '华宝海外中国成长',
        shouyi: '3.58',
        totalshouyi: '-0.32',
        code: '241001.OF'
      }, {
        name: '圆信永丰双红利C',
        shouyi: '-3.68',
        totalshouyi: '-6.56',
        code: '000825.OF'
      }, {
        name: '圆信永丰优加生活',
        shouyi: '-0.71',
        totalshouyi: '-4.48',
        code: '001736.OF'
      }, {
        name: '银华恒生H股',
        shouyi: '-3.85',
        totalshouyi: '-4.08',
        code: '161831.OF'
      }, {
        name: '富国沪港深行业精选',
        shouyi: '-1.93',
        totalshouyi: '-3.28',
        code: '005354.OF'
      }, {
        name: '汇添富香港优势精选',
        shouyi: '-3.20',
        totalshouyi: '-5.48',
        code: '470888.OF'
      }],
      April: [{
        name: '圆信永丰优加生活',
        shouyi: '-4.38',
        totalshouyi: '-0.59',
        code: '001736.OF'
      }, {
        name: '兴全轻资产',
        shouyi: '-2.79',
        totalshouyi: '0.66',
        code: '163412.OF'
      }, {
        name: '富国天合稳健优选',
        shouyi: '-1.78',
        totalshouyi: '0.91',
        code: '100026.OF'
      }, {
        name: '国泰景气行业',
        shouyi: '-2.20',
        totalshouyi: '-4.44',
        code: '003593.OF'
      }, {
        name: '中欧潜力价值A',
        shouyi: '-2.24',
        totalshouyi: '1.89',
        code: '001810.OF'
      }, {
        name: '汇丰晋信双核策略A',
        shouyi: '-0.82',
        totalshouyi: '0.67',
        code: '000849.OF'
      }, {
        name: '兴全可转债',
        shouyi: '-1.48',
        totalshouyi: '-0.06',
        code: '340001.OF'
      }, {
        name: '新华纯债添利',
        shouyi: '0.29',
        totalshouyi: '0.43',
        code: '519152.OF'
      }, {
        name: '大摩双利增强A',
        shouyi: '0.73',
        totalshouyi: '0.82',
        code: '000024.OF'
      }, {
        name: '易方达国防军工',
        shouyi: '-2.30',
        totalshouyi: '-2.07',
        code: '001475.OF'
      }],
      May: [{
        name: '工银瑞信医疗保健行业',
        shouyi: '5.62',
        totalshouyi: '-2.27',
        code: '000831.OF'
      }, {
        name: '广发稳健增长',
        shouyi: '2.33',
        totalshouyi: '-1.38',
        code: '270002.OF'
      }, {
        name: '汇添富成长焦点',
        shouyi: '3.98',
        totalshouyi: '-3.54',
        code: '519068.OF'
      }, {
        name: '银华富裕主题',
        shouyi: '10.76',
        totalshouyi: '6.29',
        code: '180012.OF'
      }, {
        name: '交银阿尔法',
        shouyi: '5.44',
        totalshouyi: '4.12',
        code: '519712.OF'
      }, {
        name: '富国医疗保健行业',
        shouyi: '8.31',
        totalshouyi: '5.15',
        code: '000220.OF'
      }, {
        name: '新华纯债添利',
        shouyi: '0.29',
        totalshouyi: '0.65',
        code: '519152.OF'
      }, {
        name: '易方达稳健收益A',
        shouyi: '-0.05',
        totalshouyi: '-2.05',
        code: '110007.OF'
      }, {
        name: '银华信用季季红A',
        shouyi: '0.19',
        totalshouyi: '0.58',
        code: '000286.OF'
      }, {
        name: '易方达高等级信用债A',
        shouyi: '-0.25',
        totalshouyi: '0.00',
        code: '000147.OF'
      }],
      currentindex: 0
    }
  },
  components: {
    Tab,
    TabItem,
    Sticky,
    Confirm,
    Toast
  },
  methods: {
    showPosition(position) {
      this.position = position
      this.showPositionValue = true
    },
    select1(index) {
      this.currentindex = index
    },
    buyFundPrepose(fundcode, fundname, chouj) {
      const that = this
      const Tel = getLocalStorage('Tel')
      const isopen = getLocalStorage('isopen')
      const riskLevel = getLocalStorage('riskLevel')
      console.log(Tel, isopen, riskLevel)
      if (Tel == null || Tel === '') {
        this.$router.push({
          path: '/component/login',
          query: { path: this.$route.fullPath }
        })
      } else if (isopen === '0') { // 未开户
        this.$router.push({
          path: '/component/account',
          query: { path: this.$route.fullPath }
        })
      } else if (riskLevel == null || riskLevel === '') { // 未做风险测评
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
            that.$router.push({ path: '/component/risk-question', query: { path: that.$route.fullPath } })
          }
        })
      } else {
        const obj = {
          fundCode: fundcode.substring(0, 6)
        }
        this.$http.post(mianUrlt9 + 'fund/beforeSingleBuy', obj, { emulateJSON: true }).then((res) => {
          if (res.data.retCode === '0') {
            console.log(res)
            this.$router.push({
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
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: { path: this.$route.fullPath }
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
    }
  }
}

</script>
<style lang='less'>
ol,
ul,
li {
  list-style: none outside none;
}

.mofantotal {
  background: #5277F0;

  .banner {
    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  .list {
    text-align: center;
    padding-top: 10px;

    .subject {
      width: 100%;
      height: auto;
      margin: 0 auto;
    }

    h2 {
      color: #fff;
    }

    .content {
      overflow: hidden;

      .obj2 {
        background: rgba(177, 205, 234, 0.6);
        text-align: left;
        overflow: hidden;
        padding: 10px;
        border-radius: 5px;
        margin: 0 10px;

        div {
          font-size: 13px;
          line-height: 20px;
        }

        .obj2_content1,
        .obj2_content2 {
          margin-bottom: 15px;
        }

        .img1 {
          float: left;
          margin-right: 10px;
          width: 25%;
          height: auto;
          display: inline-block;
        }

        .img2 {
          float: right;
          margin-left: 10px;
          width: 25%;
          height: auto;
          display: inline-block;
        }

        P {
          color: #000;
          line-height: 20px;
          font-size: 15px;
          font-weight: 600;
        }

        .content2_text {
          float: left;
          width: 70%;
        }
      }

      .subject {
        width: 100%;
        height: auto;
        margin: 0 auto;
      }
    }

    .z_t {
      padding: 0 10px;
    }

    table {
      text-align: center;
      font-size: 15px;
      line-height: 30px;
      width: 100%;
      color: #fff;

      button {
        color: #fff;
        width: 100%;
        border: solid 1px #fcac01;
        border-radius: 12.5px;
        font-size: 15px;
        line-height: 25px;
        padding: 0 10px;
        background-size: 100% 100%;
        background: #fcac01;
      }

      .small {
        color: #ffbb10;
      }
    }

    .sub {
      text-align: right;
      color: #fff;
      margin-top: 5px;
      padding-bottom: 10px;
      font-size: 13px;
    }

    .vux-tab {
      background: #5277F0;

      .vux-tab-item {
        color: #fff;
      }
    }
  }
}

</style>
