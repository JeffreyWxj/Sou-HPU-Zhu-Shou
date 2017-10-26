const app = getApp();

let weekRange = [];
for (let i = 1; i < 21; i++) {
  weekRange.push('第' + i + '周');
}
let timeRange = [weekRange, ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']];
console.log(timeRange);
Page({
  data: {
    stuid: wx.getStorageSync('stuid', null),
    week: 1,
    day: 1,
    currentSchedule: {},
    sectionMap: {1: '一', 3: '二', 5: '三', 7: '四', 9: '五'},
    dayMap: {1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '日'},
    timeRange: timeRange,
    tab: 1
  },
  onLoad: function () {
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
        that.setData({
          stuInfo: stuInfo
        });
        that.changeDay(stuInfo.current_week, that.getDay());
      });
    }
  },
  getDay: function () {
    let day = (new Date()).getDay();
    return day == 0 ? 7 : day;
  },
  changeDay: function (week = false, day = false) {
    let that = this;
    if (week) {
      that.setData({
        week: week
      });
    }
    if (day) {
      that.setData({
        day: day
      });
    }
  },
  selectWeekDay: function (e) {
    const selected = e.detail.value;
    this.changeDay(selected[0] + 1, selected[1] + 1);
  },
  selectWeek: function (e) {
    const week = parseInt(e.detail.value);
    this.changeDay(week + 1);
  },
  onShow: function () {
    let that = this;
    const stuid = wx.getStorageSync('stuid');
    that.setData({
      stuid: stuid
    });
  },
  changeTab: function (e) {
    this.setData({
      tab: e.target.dataset.tab
    });
  }
});