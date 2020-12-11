// pages/personal/wallet/reflect/reflect.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    key: 0.00,
    times: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getnum();
  },

  //获取金额
  getnum() {
    let userinfo = wx.getStorageSync('userinfo')
    this.setData({
      num: (Number(userinfo.balance)).toFixed(2)
    })
  },
  //金额输入
  keyInput(e) {
    this.setData({
      key:e.detail.value
    })
  },
  //校检
  check(e) {
    let that = this;
    //校检金额不得为空
    if (that.data.key == 0) {
          wx.showToast({
                title: '请输入提现金额',
                icon: 'none',
          })
          return false;
    }
    //校检金额不得低于10元
    let key = parseInt(that.data.key);
    if (key < 10) {
          wx.showToast({
                title: '单笔提现金额不得低于10元',
                icon: 'none',
          })
          return false;
    }
    //校检金额不得高于余额
    if (key > that.data.num) {
          wx.showToast({
                title: '余额不足',
                icon: 'none',
          })
          return false;
    }
    that.reflectpost();
  },

  //历史记录
  history(name, num, type) {
    let deal = {
        stamp:new Date().toLocaleDateString(),
        name:name,
        num:num,
        type:type
    }
      wx.getStorage({
            key: 'transaction',
            success(res) {
                  let oldarr = JSON.parse(res.data); //字符串转数组
                  let newa = [deal]; //对象转为数组
                  let newarr = JSON.stringify(newa.concat(oldarr)); //连接数组\转字符串
                  wx.setStorage({
                        key: 'transaction',
                        data: newarr,
                  })
            },
            fail(res) {
                  //第一次打开时获取为null
                  let newa = [deal]; //对象转为数组
                  var newarr = JSON.stringify(newa); //数组转字符串
                  wx.setStorage({
                        key: 'transaction',
                        data: newarr,
                  })
            }
      });
  },

  //提现提交
  reflectpost() {
    let that = this;
    let userinfo = wx.getStorageSync('userinfo');
    wx.showLoading({
      title: '正在提现',
    });
    wx.request({
      url: 'http://localhost:8088/user/reflect',    //本地设置不校验合法域名
      data: { 
        id:userinfo.id,  //用户id
        num: that.data.key  //金额
      },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
        // 发起提现
        wx.hideLoading();
        if(res.data.sta === 1){
          app.queryUserInfo();
          that.setData({
            num:that.data.num - that.data.key
          })
          that.history('余额提现', that.data.key, 2);
          wx.showModal({
            title: '提示',
            content:'提现成功，跳转到个人中心？',
            success:function(o){
              if(o.confirm){
                wx.switchTab({
                  url: '/pages/personal/personal',
                })
              }
            }
          })
        } else {
          wx.showToast({
                title: '提现失败，请稍后再试',
                icon: 'none'
          });
        }
      }
    })
  },
})