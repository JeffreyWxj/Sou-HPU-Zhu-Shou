const app = getApp();
Page({
  data: {
    stuid: wx.getStorageSync('stuid', null)
  },
  onLoad: function () {
    
  },
  onShow: function () {
    let that = this;
    const stuid = wx.getStorageSync('stuid');
    that.setData({
      stuid: stuid
    });
    if (!stuid) {
      wx.showModal({
        title: '提示',
        content: '请先登录账号',
        showCancel: 0,
        success: function () {
          wx.switchTab({
            url: '/pages/user/user'
          });
        }
      });
    } else {
      app.getStuInfo(that.data.stuid, function (stuInfo) {
        console.log(stuInfo);
        that.setData({
          stuInfo: stuInfo
        });
      });
    }
  }
});