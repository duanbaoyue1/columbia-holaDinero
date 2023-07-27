/* global wx */

const store = {
  signed: false // 已签名状态
};

export function getShareTitle() {
  const el = document.getElementById('wechatShareContentTitle');
  if (el && el.value) {
    return el.value;
  }
  return document.title || document.URL;
}

/**
 * 获取默认分享图标
 * @return string 图标链接
 */
export function getDefaultImgUrl() {
  const el = document.getElementById('wx_pic');
  if (el) {
    const img = el.getElementsByTagName('img')[0];
    if (img) {
      return img.currentSrc;
    }
  }
}

/**
 * 获取 meta[name=description] 内容
 * @return string 页面描述
 */
export function getMetaDesc() {
  const meta = document.getElementsByTagName('meta');
  for (let i in meta) {
    if (meta[i].name && meta[i].name.toLowerCase() === 'description') {
      return meta[i].content;
    }
  }
}

export function emptyFunc() {}

export function resetShare(options) {
  options = options || {};

  options.title = options.title || getShareTitle();
  options.imgUrl = options.imgUrl || getDefaultImgUrl() || '';
  options.link = options.link || document.URL;
  options.desc = options.desc || getMetaDesc() || options.title;
  options.success = options.success || emptyFunc;
  options.cancel = options.cancel || emptyFunc;

  wx.updateTimelineShareData(options);

  wx.updateAppMessageShareData(options);
}

/**
 * 获取微信签名参数
 * @param  string   signUrl 签名地址
 * @return promise
 */
function fetchSign(signUrl) {
  return new Promise(function(resolve) {
    let xhr = new XMLHttpRequest();
    xhr.open('get', signUrl);
    xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let res = xhr.responseText;
        res = JSON.parse(res);
        if (res.success) {
          resolve(res.data);
        }
      }
    };
    xhr.send();
  });
}

/**
 * 微信签名
 * @param  object   conf  签名数据
 * @param  boolean  debug 模式
 * @return
 */
function wxConfig(conf, debug) {
  wx.config({
    debug: debug, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印
    appId: conf.appId, // 必填，公众号的唯一标识
    timestamp: conf.timestamp, // 必填，生成签名的时间戳
    nonceStr: conf.nonceStr, // 必填，生成签名的随机串
    signature: conf.signature, // 必填，签名，见附录 1
    jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone', 'getLocation'] // 必填，需要使用的 JS 接口列表，所有 JS 接口列表见附录2
  });
}

/**
 * 配置分享信息
 * @param  object   options 分享信息
 * @return
 */
function wxSetShareOptions(options) {
  return new Promise(function(resolve) {
    wx.ready(function() {
      const shareOptions = {
        title: options.title,
        link: options.link,
        imgUrl: options.imgUrl,
        success: options.success,
        cancel: options.cancel
      };
      wx.updateTimelineShareData(shareOptions);

      shareOptions.desc = options.desc;
      shareOptions.type = ''; // 分享类型，music、video 或 link，默认为 link
      shareOptions.dataUrl = ''; // 如果 type 是 music 或 video，则要提供数据链接，默认为空
      wx.updateAppMessageShareData(shareOptions);

      resolve('ready');
    });
  });
}

/**
 * 微信分享功能
 * @param  object   data
 * @param  string   data.signUrl 签名接口地址，默认为请求美国站ws微信签名接口，需要独立请求时，外部自定义signUrl即可（注：接口需允许get请求获取，不同域需接口允许跨域）
 * @param  string   data.bizType 签名账号类型，当不使用自定义signUrl时，必填该参数区别于各账户
 * @param  object   data.options
 * @param  string   data.options.title 分享标题，默认为页面标签 title，第二默认为页面链接
 * @param  string   data.options.imgUrl 分享图标，默认为 #wx_pic img 选择器下的图片地址
 * @param  string   data.options.link 分享链接，默认为当前页面链接。注意：分享其他页面链接其域名应为签名主体可信任域名
 * @param  string   data.options.desc 分享描述，默认为 meta description，第二默认同 data.options.title
 * @param  function data.options.success [deleted] 用户确认分享后执行的回调函数，默认为空函数
 * @param  function data.options.cancel 用户取消分享后执行的回调函数，默认为空函数
 * @param  boolean  debug 模式，默认为 false
 * @return promise 是否已设置分享。注意：签名数据错误将导致无法自定义分享
 */
export default function wxShare(data, debug) {
  if (!/micromessenger/i.test(window.navigator.userAgent)) {
    return console.warn('outside Micromessenger');
  }

  const jssdkLoaded = 'wx' in window;

  if (!jssdkLoaded) {
    return console.warn('wx jssdk 未加载，return');
  }

  data = data || {};
  const options = data.options || {};
  options.title = options.title || getShareTitle();
  options.imgUrl = options.imgUrl || getDefaultImgUrl() || '';
  options.link = options.link || document.URL;
  options.desc = options.desc || getMetaDesc() || options.title;
  options.success = options.success || emptyFunc;
  options.cancel = options.cancel || emptyFunc;

  // if (store.signed) {
  //   return wxSetShareOptions(options)
  // } else {
  if (!data.signUrl) {
    data.signUrl = window.location.href.split('#')[0];
  }

  return fetchSign(`${process.env.VUE_APP_BASE_API}/api/v2/promote/js_signature?url=${encodeURIComponent(data.signUrl)}`).then(function(conf) {
    conf.appId = conf.appId || 'wx8846c28a2ab7c8be';
    wxConfig(conf, debug);
    store.signed = true;
    return wxSetShareOptions(options);
  });
  // }
}
