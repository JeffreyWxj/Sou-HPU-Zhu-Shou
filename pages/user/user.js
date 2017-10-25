const app = getApp();
let formTool = require('../../utils/form');
Page({
	data: {
		userInfo: {},
		formData: {},
		verify_img: app.globalData.apiList.verify_img_default,
		stuid: wx.getStorageSync('stuid', null),
		stuInfo: {}
	},
	onLoad: function () {
		console.log(2);
		let that = this;
		wx.getUserInfo({
			withCredentials: false,
			success: function (res) {
				that.setData({
					userInfo: res.userInfo
				});
			},
			fail: function () {
				app.resetAuth();
			}
		});
		if (!that.data.stuid) {
			that.refreshCaptcha();
		} else {
			app.getStuInfo(that.data.stuid, function (stuInfo) {
				that.setData({
					stuInfo:stuInfo
				})
			});
		}
	},
	formInput: function (e) {
		let that = this;
		formTool.formParamsCollect(that, e);
	},
	login: function () {
		let that = this;
		let formData = that.data.formData;
		app.runWithOpenid(function (openid) {
			formData['openid'] = openid;
			app.loadRequest({
				url: app.globalData.apiList.login_jiaowu,
				method: 'POST',
				data: formData,
				success: function (resp) {
					if (resp.data.status == 'success') {
						wx.setStorageSync('stuid', formData.stuid);
						that.setData({
							stuid: formData.stuid
						});
						app.getStuInfo(formData.stuid, function (stuInfo) {
							that.setData({
								stuInfo:stuInfo
							})
						});
					} else {
						wx.showModal({
							showCancel: false,
							title: '啊哈！出错啦~ >_<',
							content: resp.data.msg,
							success: function () {
								formData.verify_code = null;
								that.setData({
									formData: formData
								});
								that.refreshCaptcha();
							}
						});
					}
				},
				fail: function (resp) {
				
				}
			});
		});
	},
	logout: function () {
		let that = this;
		that.setData({
			stuid: null
		});
		wx.removeStorageSync('stuid');
		that.refreshCaptcha();
	},
	refreshCaptcha: function () {
		let that = this;
		that.setData({
			verify_img: app.globalData.apiList.verify_img_default
		});
		// 显示验证码
		app.runWithOpenid(function (openid) {
			app.loadRequest({
				url: app.globalData.apiList.verify_img,
				method: 'GET',
				data: {openid: openid},
				success: function (resp) {
					console.log(resp);
					const verify_img_b64 = 'data:image/jpeg;base64,' + resp.data.data.img;
					that.setData({
						verify_img: verify_img_b64
					});
				}
			});
		});
	}
});