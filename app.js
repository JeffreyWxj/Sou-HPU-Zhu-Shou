// 域名和API预处理
const domain = 'http://127.0.0.1:8000';
let apiList = {
	//验证码地址
	'verify_img': '/api/spider/verify-img',
	// 根据js_code换取openid接口
	'js_code_to_openid': '/api/wxapi/js-code-to-openid'
};
for (let apiName in apiList) {
	apiList[apiName] = domain + apiList[apiName];
}
// 小程序对象
App({
	//小程序启动钩子
	onLaunch: function () {
		let that = this;
		that.globalData.domain = domain;
		that.globalData.apiList = apiList;
		that.login();
	},
	login: function () {
		let that = this;
		wx.login({
			success: function (res) {
				if (res.code) {	//取出的结果存在code字段,表示登录成功
					that.globalData.code = res.code;	//取出code字段并存储
					that.requestOpenId();
				} else {	//登录接口出现异常,没有code
					console.log(res, 'app.js login success but dont have code');
				}
			},
			fail: function () {	//登录失败
				console.log(res, 'app.js login fail');
			},
			complete: function () {
			}
		});
	},
	requestOpenId: function () {
		let that = this;
		const openid = wx.getStorageSync('openid', false);
		if (!openid) {
			wx.request({
				url: that.globalData.apiList['js_code_to_openid'],
				method: 'GET',
				data: {js_code: that.globalData.code},
				success: function (resp) {
					console.log(resp, 'openid');
					wx.setStorageSync('openid', resp.data.data.openid);
				}
			});
		}
	},
	getOpenId: function () {
		return wx.getStorageSync('openid', false);
	},
	/**
	 * 重新申请授权
	 */
	resetAuth: function () {
		let that = this;
		wx.getSetting({
			success: function (setting) {
				if (!setting.authSetting['scope.userInfo']) {
					wx.showModal({
						title: '提示',
						content: '请允许我们获取您的基本信息,否则可能无法正常为您服务',
						showCancel: false,
						success: function () {
							wx.openSetting({
								success: function (res) {
									if (res.authSetting['scope.userInfo']) {
										const pages = getCurrentPages();
										const currentPageUrl = pages[pages.length - 1]['route'];
										console.log(currentPageUrl);
										wx.reLaunch({
											url: '/' + currentPageUrl
										});
									} else {
										that.resetAuth();
									}
								}
							});
						}
					});
				}
			}
		});
	},
	globalData: {
		userInfo: null
	}
});