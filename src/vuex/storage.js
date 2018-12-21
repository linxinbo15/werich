// Operation LocalStorage
export function setLocalStorage(key, vaule) {
  return localStorage.setItem(key, JSON.stringify(vaule));
}

export function getLocalStorage(key) {
  const value = JSON.parse(localStorage.getItem(key));
  return value;
}

export function getAddDate() {
  let startDate1 = new Date()
  let yearAdd = Number(startDate1.getFullYear()) + 3
  let zdate = startDate1.setFullYear(yearAdd)
  return new Date(zdate).Format("yyyy-MM-dd")
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//校验身份证号
export function IdentityCodeValid(code) {
  // console.log(code);
  let city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外 "
  };
  let tip = "";
  let pass = true;

  if (!code || !/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(code)) {
    tip = "身份证号格式错误";
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = "地址编码错误";
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      let last = parity[sum % 11];
      if (parity[sum % 11] != code[17]) {
        tip = "校验位错误";
        pass = false;
      }
    }
  }
  if (!pass)
    console.log(pass);
  return pass;
}

//校验银行卡号
export function CheckBankNo(banknono,that) {
  let bankno = banknono.replace(/\s/g, '')
  if (bankno == "") {
    // that.toastText = '请填写银行卡号！'
    // that.showPosition('middle')
    that.$vux.toast.text('请填写银行卡号！', 'middle', 3000)
    return false
  }
  if (bankno.length < 16 || bankno.length > 19) {
    // that.toastText = '银行卡号长度必须在16到19之间'
    // that.showPosition('middle')
    that.$vux.toast.text('银行卡号长度必须在16到19之间', 'middle', 3000)

    return false;
  }
  let num = /^\d*$/; // 全数字
  if (!num.exec(bankno)) {

    // this.toastText = '银行卡号必须全为数字'
    // this.showPosition('middle')
    that.$vux.toast.text('银行卡号必须全为数字', 'middle', 3000)
    return false;
  }
  // 开头两位
  let strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
  if (strBin.indexOf(bankno.substring(0, 2)) == -1) {

    // this.toastText = '银行卡号开头两位不符合规范'
    // this.showPosition('middle')
    that.$vux.toast.text('银行卡号开头两位不符合规范', 'middle', 3000)
    return false
  }
  // luhn校验
  if (!luhnCheck(bankno)) {
    return false
  }
  return true
}

export function luhnCheck(bankno) {
  let lastNum = bankno.substr(bankno.length - 1, 1); // 取出最后一位（与luhn进行比较）
  let first15Num = bankno.substr(0, bankno.length - 1); // 前15或18位
  let newArr = new Array();
  for (let i = first15Num.length - 1; i > -1; i--) { // 前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1));
  }
  let arrJiShu = new Array(); // 奇数位*2的积 <9
  let arrJiShu2 = new Array(); // 奇数位*2的积 >9
  let arrOuShu = new Array(); // 偶数位数组
  for (let j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 == 1) { // 奇数位
      if (parseInt(newArr[j]) * 2 < 9) {
        arrJiShu.push(parseInt(newArr[j]) * 2);
      } else {
        arrJiShu2.push(parseInt(newArr[j]) * 2);
      }
    } else {
      arrOuShu.push(newArr[j]); // 偶数位
    }
  }

  let jishu_child1 = new Array(); // 奇数位*2 >9 的分割之后的数组个位数
  let jishu_child2 = new Array(); // 奇数位*2 >9 的分割之后的数组十位数
  for (let h = 0; h < arrJiShu2.length; h++) {
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
  }
  let sumJiShu = 0; // 奇数位*2 < 9 的数组之和
  let sumOuShu = 0; // 偶数位数组之和
  let sumJiShuChild1 = 0; // 奇数位*2 >9 的分割之后的数组个位数之和
  let sumJiShuChild2 = 0; // 奇数位*2 >9 的分割之后的数组十位数之和
  let sumTotal = 0;
  for (let m = 0; m < arrJiShu.length; m++) {
    sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
  }
  for (let n = 0; n < arrOuShu.length; n++) {
    sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
  }
  for (let p = 0; p < jishu_child1.length; p++) {
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
  }
  // 计算总和
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) +
    parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
  // 计算luhn值
  let k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
  let luhn = 10 - k;
  if (lastNum == luhn) {
    console.log("验证通过")
    return true;
  } else {

    // this.toastText = '银行卡号必须符合luhn校验'
    // this.showPosition('middle')
    that.$vux.toast.text('银行卡号必须符合luhn校验', 'middle', 3000)
    return false
  }
}
