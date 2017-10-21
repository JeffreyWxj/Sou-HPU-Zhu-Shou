//app.js
App({
	//小程序启动钩子
	onLaunch: function () {
		let that = this;
		wx.login({
			success: function (res) {
				if (res.code) {	//取出的结果存在code字段,表示登录成功
					that.globalData.code = res.code;	//取出code字段并存储
					that.getUserInfo();
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
	//自定义方法:获取用户信息及后续处理逻辑
	getUserInfo: function () {
		let that = this;
		wx.getUserInfo({
			success: res => {	//成功获取用户信息
				console.log(res, 'Get UserInfo Success');
				that.globalData.userInfo = res.userInfo;
			},
			fail: function (res) {	//获取用户信息失败
				console.log(res, 'Get UserInfo fail');
				wx.showModal({
					title: '提示',
					content: '请允许我们获取您的基本信息,否则可能无法正常为您服务',
					success: function () {
						wx.openSetting({
							success: function (res) {
								console.log(res, '调用setting成功');
								if (res.authSetting['scope.userInfo']) {
									that.getUserInfo();	//重新调起获取信息方法
								}
							}
						});
					},
					fail: function () {
					
					}
				});
			}
		});
	},
	globalData: {
		userInfo: null
	}
});