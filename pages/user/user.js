//index.js
//获取应用实例
const app = getApp();

Page({
	data: {
		userInfo: null
	},
	onLoad: function () {
		let that = this;
		wx.getUserInfo({
			success: function (res) {
				that.setData({
					userInfo: res.userInfo
				});
			}
		});
	},
});