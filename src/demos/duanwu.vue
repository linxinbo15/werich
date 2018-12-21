<template>
  <div style="background:#e8e2c8;padding-bottom:10px;">
    <img src="../assets/event/duan.png" class='banner'>
    <div class='box'>
      <img src="../assets/event/obj1.png">
      <div class='con'>
        <ul>
          <li><p>全球市场来看：</p>美联储6月大概率加息，强势的美元将加速资本回流，新兴市场权益市场和货币波动将进一步增大。
          </li>
          <li><p>国内方面：</p>中美贸易摩擦仍尚未有定论，6月解禁减持规模较大，流动性环境偏紧，不利于权益市场表现。建议投资者静待风险落地，做防守反击。
          </li>
          <li><p>当下：</p>在震荡市中，正是通过基金定投布局未来的好时机，越早定投，越早受益！</li>
          <li>
            <p>基金定投：</p>
            一方面通过分期投资，降低了基金持仓成本，同时也帮投资者进行了长期持续投入，聚沙成塔，让投资者不知不觉间积累一笔财富。
          </li>
        </ul>
      </div>

    </div>
    <div class='box'>
      <img src="../assets/event/obj3.png">
      <div class='con'>
        <ul>
          <li>
            <img src="../assets/event/advan.png">
          </li>
        </ul>
      </div>
    </div>
    <div class='box'>
      <img src="../assets/event/obj2.png">
      <ul class='obj'>
        <li>
          <img src="../assets/event/duanpro1.png">
          <button @click='change()'>立即购买</button>
        </li>
        <li>
          <img src="../assets/event/duanpro2.png">
          <button @click='change1()'>立即购买</button>
        </li>
      </ul>
      <p style="color:#666;">
        而市场现有的智能投顾多半为银行或各大基金公司提供，在定期不定额的模式上进行了创新，一定程度平滑了收益曲线，但前者的问题在于模式简单而后者的问题在于容易主推自家产品。创金作为第三方平台避免了这样的问题，并且创新地加入了自己的风控以及市场预判模型，为投资者带来更好的投资体验以及更高的达标概率。</p>
    </div>
  </div>
</template>
<script>
  export default {
    methods: {
      change () {
        this.$router.push('/component/invest-step?plan=A')
      },
      change1 () {
        this.$router.push('/component/invest-step?plan=C')
      }
    }
  }
</script>
<style scoped>
  ol, ul, li {
    list-style: none outside none;
  }

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  .box {
    padding: 0 10px;
    margin-top: 10px;
  }

  .box .con {
    border: solid 2px #a65b37;
    border-radius: 10px;
    margin-top: 10px;
    padding: 10px;
  }

  .box .con ul {
    background: #f4f1e4;
    padding: 10px;
  }

  .box .con ul li {
    margin-bottom: 10px;
  }

  .box .con ul li p {
    color: #a65b37;
    display: inline-block;
  }

  .obj {
    margin-top: 10px;
  }

  .obj li {
    border: solid 0px transparent;
    border-radius: 10px;
    background: #fff;
    text-align: center;
    margin-bottom: 10px;
  }

  .obj li button {
    color: #fff;
    font-size: 20px;
    background: #a65b37;
    margin: 10px 0;
    line-height: 2;
    width: 90%;
    border: solid 1px #a65b37;
    border-radius: 20px;

  }
</style>
