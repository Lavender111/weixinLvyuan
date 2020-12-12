// pages/personal/wallet/wallet.js
const util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    balance:0.00   //余额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow:function(){
    if (!wx.getStorageSync('openId')) {
      wx.showModal({
        title: '温馨提示',
        content: '该功能需要登录方可使用，是否马上去登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/personal/personal',
            })
          }
        }
      })
      return;
    }
    var userinfo = wx.getStorageSync('userinfo')
    this.setData({
      balance:(userinfo.balance).toFixed(2)
    })
    this.gethis()
  },
  gethis() {
    let that = this;
    wx.getStorage({
          key: 'transaction',
          success: function(res) {
                let list = JSON.parse(res.data);
                that.setData({
                      list: list
                })
          },
    })
  },
  toRecharge:function(){
    wx.navigateTo({
      url: 'recharge/recharge',
    })
  },
  toReflect:function(){
    wx.navigateTo({
      url: 'reflect/reflect',
    })
  }
})