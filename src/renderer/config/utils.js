/**
 * 存储用户信息
 */
export const saveUserInfo = (content) => {
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem("userInfo", content);
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return JSON.parse(window.sessionStorage.getItem("userInfo"));
}

/**
 * 删除用户信息
 */
export const removeUserInfo = () => {
  window.sessionStorage.removeItem("userInfo");
}

/**
 * 保存TOKEN
 */
export const saveToken = (str) => {
  window.sessionStorage.setItem("token", str);
}

/**
 * 删除TOKEN
 */
export const removeToken = () => {
  window.sessionStorage.removeItem("token");
}

/**
 * 获取TOKEN
 */
export const getToken = () => {
  return window.sessionStorage.getItem("token");
}

/**
 * 存储省市区三级信息
 */
export const saveAllArea = (content) => {
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem("areaList", content);
}

/**
 * 获取省市区三级信息
 */
export const getAllArea = () => {
  return JSON.parse(window.localStorage.getItem("areaList"));
}

/**
* 获取本周、本季度、本月、上月的开始日期、结束日期
*/
export const DateManager = new function () {
  var now = new Date(); //当前日期 
  var nowDayOfWeek = now.getDay(); //今天本周的第几天 
  var nowDay = now.getDate(); //当前日 
  var nowMonth = now.getMonth(); //当前月 
  var nowYear = now.getYear(); //当前年 
  nowYear += (nowYear < 2000) ? 1900 : 0; //

  var lastMonthDate = new Date(); //上月日期
  lastMonthDate.setDate(1);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  var lastYear = lastMonthDate.getYear();
  var lastMonth = lastMonthDate.getMonth();

  //格式化日期：yyyy-MM-dd 
  this.formatDate = function (date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();

      if (mymonth < 10) {
          mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
          myweekday = "0" + myweekday;
      }
      return (myyear + "-" + mymonth + "-" + myweekday);
  }

  //格式化日期时间: yyyy-MM-dd HH-mm
  this.formatTime = function (date) {
    date = new Date(date);
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    var myHour = date.getHours();
    var myMinute = date.getMinutes();
    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    if (myHour < 10) {
        myHour = "0" + myHour;
    }
    if (myMinute < 10) {
        myMinute = "0" + myMinute;
    }
    return (myyear + "-" + mymonth + "-" + myweekday + " " + myHour + ":" + myMinute);
  }

  //格式化日期时间: yyyy年MM月dd日
  this.formatSpecific = function (date) {
    date = new Date(date);
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    var myHour = date.getHours();
    var myMinute = date.getMinutes();
    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    if (myMinute < 10) {
        myMinute = "0" + myMinute;
    }
    return (myyear + "年" + mymonth + "月" + myweekday + "日");
  }

  //格式化星期X: 星期X
  this.formatWeek= function (date) {
    date = new Date(date);
    var weeks=["日","一","二","三","四","五","六"];
    var myweekday = date.getDay();
    return "星期"+weeks[myweekday];
  }

  //获得某月的天数 
  this.getMonthDays = function (myMonth) {
      var monthStartDate = new Date(nowYear, myMonth, 1);
      var monthEndDate = new Date(nowYear, myMonth + 1, 1);
      var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
      return days;
  }

  //获得本季度的开始月份 
  this.getQuarterStartMonth = function () {
      var quarterStartMonth = 0;
      if (nowMonth < 3) {
          quarterStartMonth = 0;
      }
      if (2 < nowMonth && nowMonth < 6) {
          quarterStartMonth = 3;
      }
      if (5 < nowMonth && nowMonth < 9) {
          quarterStartMonth = 6;
      }
      if (nowMonth > 8) {
          quarterStartMonth = 9;
      }
      return quarterStartMonth;
  }
  
  //获得今日的日期 
  this.getTodayDate = function () {
    var today = new Date();
    return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
}

  //获得昨日的日期 
  this.getYesterdayDate = function () {
      var yesterday = new Date((now.getTime() - 24*60*60*1000));
      return yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" + yesterday.getDate();
  }

  //获得本周的开始日期 
  this.getWeekStartDate = function () {
      var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
      return this.formatDate(weekStartDate);
  }

  //获得本周的结束日期 
  this.getWeekEndDate = function () {
      var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
      return this.formatDate(weekEndDate);
  }

  //获得本月的开始日期 
  this.getMonthStartDate = function () {
      var monthStartDate = new Date(nowYear, nowMonth, 1);
      return this.formatDate(monthStartDate);
  }

  //获得本月的结束日期 
  this.getMonthEndDate = function () {
      var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
      return this.formatDate(monthEndDate);
  }

  //获得上月开始时间
  this.getLastMonthStartDate = function () {
      var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
      return this.formatDate(lastMonthStartDate);
  }

  //获得上月结束时间
  this.getLastMonthEndDate = function () {
      var lastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDays(lastMonth));
      return this.formatDate(lastMonthEndDate);
  }

  //获得本季度的开始日期 
  this.getQuarterStartDate = function () {
      var quarterStartDate = new Date(nowYear, this.getQuarterStartMonth(), 1);
      return this.formatDate(quarterStartDate);
  }

  //或的本季度的结束日期 
  this.getQuarterEndDate = function () {
      var quarterEndMonth = this.getQuarterStartMonth() + 2;
      var quarterStartDate = new Date(nowYear, quarterEndMonth, this.getMonthDays(quarterEndMonth));
      return this.formatDate(quarterStartDate);
  }
}();