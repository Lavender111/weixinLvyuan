// pages/personal/wallet/recharge/recharge.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //金额输入，因为js对小数乘除很容易出问题，所以干脆就取整
  numInput(e) {
    this.setData({
      num:e.detail.value
    })
  },
  //发起支付
  paypost:function(){
    let _this = this;
    let num = _this.data.num;
    let userinfo = wx.getStorageSync('userinfo');
    if(num == 0){
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return false;
    }
    // 显示loading
    wx.showLoading({ title: '正在充值...', });
    wx.request({
      url: 'http://localhost:8088/user/recharge',    //本地设置不校验合法域名
      data: { 
        id:userinfo.id,  //用户id
        num: num  //金额
      },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
        // 发起微信支付
        wx.hideLoading();
        if(res.data.sta === 1){
          app.queryUserInfo();
          _this.history('钱包充值',num,1);
          wx.showModal({
            title: '提示',
            content:'充值成功，跳转到个人中心？',
            success:function(o){
              if(o.confirm){
                wx.switchTab({
                  url: '/pages/personal/personal',
                })
              }
            }
          })
        }
      }
    })
  },

  //历史记录
  history(name,num,type){
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
})