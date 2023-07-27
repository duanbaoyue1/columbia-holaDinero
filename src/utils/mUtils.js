/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = (name) => {
  if (!name) return;
  var value = window.localStorage.getItem(name);
  if (value !== null) {
    try {
      value = JSON.parse(value);
    } catch (e) {
      value = value;
    }
  }
  return value;
};

/**
 * 存储sessionStorage
 */
export const setSessionStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
};

/**
 * 获取sessionStorage
 */
export const getSessionStore = (name) => {
  if (!name) return;
  var value = window.sessionStorage.getItem(name);
  if (value !== null) {
    try {
      value = JSON.parse(value);
    } catch (e) {
      value = value;
    }
  }
  return value;
};

/**
 * 删除localStorage
 */
export const removeStore = (name) => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

/**
 * 让整数自动保留2位小数
 */
export const returnFloat = (value) => {
  var value = Math.round(parseFloat(value) * 100) / 100;
  var xsd = value.toString().split('.');
  if (xsd.length == 1) {
    value = value.toString() + '.00';
    return value;
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + '0';
    }
    return value;
  }
};

export const dateFormat = (date, format) => {
  if (!date || !format) return '';
  if (typeof date === 'string') {
    console.log(date);

    var mts = date.match(/(\/Date\((\d+)\)\/)/);
    if (mts && mts.length >= 3) {
      date = parseInt(mts[2]);
    }
    if (/^(\d{1,2})-(\d{1,2})-(\d{4})$/.test(date)) {
      date = date.split('-').reverse().join('-');
    }
  }

  date = new Date(date);
  if (!date || date.toUTCString() == 'Invalid Date') {
    return '';
  }
  var map = {
    M: date.getMonth() + 1, //月份
    d: date.getDate(), //日
    h: date.getHours(), //小时
    m: date.getMinutes(), //分
    s: date.getSeconds(), //秒
    q: Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };

  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    var v = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v;
        v = v.substr(v.length - 2);
      }
      return v;
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length);
    }
    return all;
  });
  return format;
};

/**
 * 时间转换：20150101010101 --> '2015-01-01 01:01:01'
 */
export const parseToDate = (timeValue) => {
  var result = '';
  var year = timeValue.substr(0, 4);
  var month = timeValue.substr(4, 2);
  var date = timeValue.substr(6, 2);
  var hour = timeValue.substr(8, 2);
  var minute = timeValue.substr(10, 2);
  var second = timeValue.substr(12, 2);
  result = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
  return result;
};

/**
 * 判断空值
 */
export const isEmpty = (keys) => {
  if (typeof keys === 'string') {
    keys = keys.replace(/\"|&nbsp;|\\/g, '').replace(/(^\s*)|(\s*$)/g, '');
    if (keys == '' || keys == null || keys == 'null' || keys === 'undefined') {
      return true;
    } else {
      return false;
    }
  } else if (typeof keys === 'undefined') {
    // 未定义
    return true;
  } else if (typeof keys === 'number') {
    return false;
  } else if (typeof keys === 'boolean') {
    return false;
  } else if (typeof keys === 'object') {
    if (JSON.stringify(keys) == '{}') {
      return true;
    } else if (keys == null) {
      // null
      return true;
    } else {
      return false;
    }
  }

  if (keys instanceof Array && keys.length == 0) {
    // 数组
    return true;
  }
};

/**
 * 返回两位的小数的字符串
 */
export const toFixedNum = (num) => {
  const tonum = parseFloat(num).toFixed(2);
  return tonum;
};

/**
 * 读取base64
 */
export const readFile = (file) => {
  // 判断是否是图片类型
  if (!/image\/\w+/.test(file.raw.type)) {
    alert('只能选择图片');
    return false;
  }
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    var filedata = {
      filename: file.name,
      filebase64: e.target.result,
    };
    alert(e.target.result);
  };
};

/**
 * 设置浏览器头部标题
 */
export const setTitle = (title) => {
  title = title ? `${title}` : '后台管理';
  window.document.title = title;
};

export const param2Obj = (url) => {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
};

// 是否为正整数
export const isInteger = (s) => {
  var re = /^[0-9]+$/;
  return re.test(s);
};

export const setContentHeight = (that, ele, height) => {
  that.$nextTick(() => {
    ele.style.height = document.body.clientHeight - height + 'px';
  });
};

// 根据url获取文件名
export const getFileName = (url) => {
  if (!url) return '';
  return url.split('/').pop();
};

// 补0
export const checkTime = (i) => {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
};

export function countDown(_endTime) {
  function addZero(i) {
    return i < 10 ? '0' + i : i + '';
  }

  // const nowTime = new Date();
  // const endTime = _endTime ? _endTime : new Date( "2020/11/16,17:57:00");
  // const leftTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000);
  const leftTime = _endTime;
  let d = parseInt(leftTime / (24 * 60 * 60));
  let h = parseInt((leftTime / (60 * 60)) % 24);
  let m = parseInt((leftTime / 60) % 60);
  let s = parseInt(leftTime % 60);
  d = addZero(d);
  h = addZero(h);
  m = addZero(m);
  s = addZero(s);
  return {
    leftTime,
    leftTimeStr: `${h}h ${m}m ${s}s`,
    over: leftTime <= 0,
  };
}

export function fromFileName(data, field = 'fileUrl') {
  if (!data[field]) return '';
  let ext = '';
  const name = data.name;
  if (data[field]) {
    const index = data[field].lastIndexOf('.');
    // 获取后缀
    ext = data[field].substr(index + 1);
  }
  return name ? name + '.' + ext : data[field];
}

export function getLocalTime(i) {
  // 参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
  if (typeof i !== 'number') return;

  var d = new Date();

  // 得到1970年一月一日到现在的秒数
  var len = d.getTime();

  // 本地时间与GMT时间的时间偏移差
  var offset = d.getTimezoneOffset() * 60000;

  // 得到现在的格林尼治时间
  var utcTime = len + offset;

  // return new Date(utcTime + 3600000 * i);
  return offset + 3600000 * i;
}

/* 关闭当前页面*/
export function closePage() {
  if (navigator.userAgent.indexOf('MSIE') > 0) {
    // close IE
    if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
      window.opener = null;
      window.close();
    } else {
      window.open('', '_top');
      window.top.close();
    }
  } else {
    // close chrome;It is effective when it is only one.
    window.opener = null;
    window.open('', '_self');
    window.close();
  }
}

/* JSON 去重*/
export function reduceArray(array, key1 = 'id', key2 = 'language') {
  const cache = [];
  array.map((item) => {
    if (!cache.find((c) => c[key1] === item[key1] && c[key2] === item[key2])) {
      cache.push(item);
    }
  });
  return cache;
}

/**
 * 判断一个时间是否在夏令时中
 * 规则：4月初到10月初，时差2小时；其余月份时差3小时
 * 如果时间在4-10月之间就是夏令时
 * @param date
 */
export function isDayLightTime(date) {
  const m = date.getMonth() + 1;
  const min = 4;
  const max = 10;
  return m >= min && m < max;
}

export function getAllLeaf(data) {
  const result = [];
  function getLeaf(data) {
    data.forEach((item) => {
      if (!item.children) {
        result.push(item.alias);
      } else {
        getLeaf(item.children);
      }
    });
  }
  getLeaf(data);
  return result;
}
