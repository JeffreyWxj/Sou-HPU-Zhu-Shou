// 域名和API预处理
//const domain = 'http://127.0.0.1:8000';
const domain = 'https://ssl.snowboy99.com';
let apiList = {
	// 根据js_code换取openid接口
	'js_code_to_openid': '/api/wxapi/js-code-to-openid',
	//验证码地址
	'verify_img': '/api/spider/verify-img',
	// 模拟登录教务系统
	'login_jiaowu': '/api/student/login',
	// 获取学生教务系统数据
	'student_info': '/api/student/student-info'
};
for (let apiName in apiList) {
	apiList[apiName] = domain + apiList[apiName];
}
apiList['verify_img_default'] = 'http://via.placeholder.com/108x44?text=Loading';
// 小程序对象
App({
	//小程序启动钩子
	onLaunch: function () {
		let that = this;
		that.globalData.domain = domain;
		that.globalData.apiList = apiList;
		console.log(1);
	},
	runWithOpenid: function (myFunc) {
		let that = this;
		const openid = wx.getStorageSync('openid', false);
		if (openid) {
			myFunc(openid);
		} else {
			wx.login({
				success: function (res) {
					if (res.code) {
						const js_code = res.code;
						wx.request({
							url: that.globalData.apiList['js_code_to_openid'],
							method: 'GET',
							data: {js_code: js_code},
							success: function (resp) {
								const openid = resp.data.data.openid;
								wx.setStorage({
									key: 'openid',
									data: openid
								});
								myFunc(openid);
							}
						});
					} else {
						console.log('login成功但是没有code');
					}
				},
				fail: function () {	//登录失败
					console.log('login失败');
				}
			});
		}
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
										that.reloadCurrentPage();
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
	reloadCurrentPage: function () {
		const pages = getCurrentPages();
		const currentPageUrl = pages[pages.length - 1]['route'];
		console.log(currentPageUrl);
		wx.reLaunch({
			url: '/' + currentPageUrl
		});
	},
	loadRequest: function (obj) {
		wx.showLoading({
			title: '加载中...',
			mask: 1
		});
		let oldComplete = obj.complete;
		obj.complete = function () {
			wx.hideLoading();
			if (oldComplete) {
				oldComplete();
			}
		};
		wx.request(obj);
	},
	getStuInfo: function (stuid,callback) {
		let that = this;
		that.runWithOpenid(function (openid) {
			that.loadRequest({
				url: that.globalData.apiList.student_info,
				method: 'GET',
				data: {openid: openid, stuid: stuid},
				success: function (resp) {
					if (resp.data.status == 'success') {
						console.log(resp.data);
						callback(resp.data.data);
					} else {
						wx.showModal({
							title: '出错啦~',
							content: resp.data.msg
						});
					}
				}
			});
		});
	},
	globalData: {
		userInfo: null
	}
});