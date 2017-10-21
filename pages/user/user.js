//index.js
//获取应用实例
const app = getApp();

Page({
	data: {
		userInfo: {}
	},
	onLoad: function () {
		let that = this;
		wx.getUserInfo({
			withCredentials: false,
			success: function (res) {
				console.log(res, 'success');
				that.setData({
					userInfo: res.userInfo
				});
			},
			fail: function () {
				app.resetAuth();
			}
		});
	},
	login: function () {
		console.log(app.getOpenId());
	}
});