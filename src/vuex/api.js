export const mianUrl = 'https://5irich.com'
export const mianUrlNew = 'api_test/'
export const mianUrlt9 = 'api_t9/'
//获取cookie、
export function getCookie(name) {
 var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
 if (arr = document.cookie.match(reg))
  return (arr[2]);
 else
  return null;
}

//设置cookie,增加到vue实例方便全局调用
export function setCookie (c_name, value, expiredays) {
 var exdate = new Date();
 exdate.setDate(exdate.getDate() + expiredays);
 document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

//删除cookie
export function delCookie (name) {
 var exp = new Date();
 exp.setTime(exp.getTime() - 1);
 var cval = getCookie(name);
 if (cval != null)
  document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

//购买基金前置

//判断业务名称
export function getBussessName(code) {
	var bussesname = "";
	if (code == 20) {
		bussesname = "认购";
		return bussesname;
	} else if (code == 22) {
		bussesname = "申购";
		return bussesname;
	} else if (code == 24) {
		bussesname = "赎回";
		return bussesname;
	} else if (code == 36) {
		bussesname = "转换";
		return bussesname;
	} else if (code == 39) {
		bussesname = "定投";
		return bussesname;
	} else if (code == 29) {
		bussesname = "修改分红方式";
		return bussesname;
	} else if (code == 60) {
		bussesname = "定投设置";
		return bussesname;
	} else if (code == 43) {
		bussesname = "分红";
		return bussesname;
	} else if (code == 30) {
		bussesname = "认购确认";
		return bussesname;
	}else if (code == 44) {
		bussesname = "强制调增";
		return bussesname;
	}else if (code == 45) {
		bussesname = "强制调减";
		return bussesname;
	}else {
		bussesname = "认购/申购";
		return bussesname;
	}
}

//判断处理状态
export function getstatsName(code) {
	var statsname = "";
	if (code == '00') {
		statsname = "待复核";
		return statsname;
	} else if (code == '01') {
		statsname = "未勾对";
		return statsname;
	} else if (code == '02') {
		statsname = "未报";
		return statsname;
	} else if (code == '03') {
		statsname = "带撤";
		return statsname;
	} else if (code == '04') {
		statsname = "废单";
		return statsname;
	} else if (code == '05') {
		statsname = "已撤";
		return statsname;
	} else if (code == '06') {
		statsname = "已报";
		return statsname;
	} else if (code == '07') {
		statsname = "已确认";
		return statsname;
	} else {
		statsname = "已结束";
		return statsname;
	}
}


