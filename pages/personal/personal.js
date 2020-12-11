// pages/personal/personal.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    recyclerId:0,
    userinfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            that.setData({
                              userinfo:wx.getStorageSync('userinfo'),
                              isLogin:true
                            })
                            let {userinfo} = that.data;
                            if(userinfo.balance && userinfo.earnings){
                              userinfo.balance = (Number(userinfo.balance)).toFixed(2)
                              userinfo.earnings = (Number(userinfo.earnings)).toFixed(2)
                            }
                            that.setData({
                              userinfo,
                              recyclerId:that.data.userinfo.recyclerId
                            })
                        }
                    });
                } else {
                  that.setData({
                    isLogin:false
                  })
                }
            }
        })
  },

  onShow:function(){
    if(wx.getStorageSync('openId')){
      app.queryUserInfo();
      this.setData({
        userinfo:wx.getStorageSync('userinfo'),
        isLogin:true
      })
      let {userinfo} = this.data;
      if(userinfo.balance && userinfo.earnings){
        userinfo.balance = (Number(userinfo.balance)).toFixed(2)
        userinfo.earnings = (Number(userinfo.earnings)).toFixed(2)
      }
      this.setData({
        userinfo:userinfo,
        recyclerId:this.data.userinfo.recyclerId
      })
    }
  },

  //授权登录
  getInfo:function(e){
    // 执行微信登录
    if(e.detail.userInfo){
      app.login(e.detail.userInfo);
      // this.setData({
      //   userinfo:wx.getStorageSync('userinfo'),
      //   isLogin:true
      // });
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
          confirmText: '返回授权',
          success: function(res) {
          // 用户没有授权成功，不需要改变 isLogin 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      })
    }
  },
  //跳转至回收订单页面
  toCondition:function(){
    if(this.data.recyclerId == 0){
      wx.navigateTo({
        url: '/pages/personal/condition/condition',
      })
    } else {
      wx.navigateTo({
        url: '/pages/personal/indent/indent?recyclerId='+this.data.recyclerId,
      })
    }
    
  },
  toTask:function(){
    wx.navigateTo({
      url: '/pages/personal/task/task?recyclerId='+this.data.recyclerId,
    })
  },
  //跳转至闲置订单页面
  toIdleOrder:function(){
    wx.navigateTo({
      url: '/pages/personal/order/order',
    })
  },
  //跳转至我的闲置页面
  toWallet:function(){
    wx.navigateTo({
      url: '/pages/personal/wallet/wallet',
    })
  },
  //跳转至我的闲置页面
  toUnused:function(){
    wx.navigateTo({
      url: '/pages/personal/unused/unused',
    })
  },
  //跳转至我的地址页面
  toAddress:function(){
    wx.navigateTo({
      url: '/pages/personal/address/address',
    })
  },
  //跳转至注册回收商
  toRegiister:function(){
    wx.navigateTo({
      url: '/pages/personal/register/register',
    })
  },

  //跳转至我的资料页面
  toSet:function(){
    wx.navigateTo({
      url: '/pages/personal/set/set',
    })
  }
})