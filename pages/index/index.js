//index.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmap = new QQMapWX({
  //在腾讯地图开放平台申请密钥 http://lbs.qq.com/mykey.html
   key: 'JH7BZ-DAYKV-BVYP4-UKT4P-CM2EF-KDBSI'
  });
Page({
  data:{
    myLatitude: "",
    myLongitude: "",
    myAddress: "",
    balance:0,
    recycle:0,
    earnings:0
  },
  onLoad: function(){
    var that = this
    //用微信提供的api获取经纬度
    wx.getLocation({
     type: 'wgs84',
     success: function(res){
     that.setData({myLatitude: res.latitude, myLongitude: res.longitude})
     //用腾讯地图的api，根据经纬度获取城市
     qqmap.reverseGeocoder({
        location: {
          latitude: that.data.myLatitude,
          longitude: that.data.myLongitude
        },
      success: function (res) {
        console.log(res)
        var a = res.result.address_component
        //获取市和区（区可能为空）
        that.setData({myAddress: a.city + a.district})
        //控制台输出结果
        var address = a.province+a.city+a.district
        wx.setStorageSync('site', address)
      },
      fail: function(res) {
        console.log(res);
      }
     })
     }
    })
  },
  onShow:function(){
    let that = this;
    wx.checkSession({
      success:function(res){
        var userInfo = wx.getStorageSync('userinfo');
        that.setData({
          balance:userInfo.balance,
          recycle:userInfo.recycle,
          earnings:userInfo.earnings
        })
      }
    })
  },
  //跳转到回收价格页面
  toPrice:function(){
    wx.navigateTo({
      url: '/pages/index/price/price',
    })
  },

  //跳转到垃圾分类
  toRubbish:function(){
    wx.navigateTo({
      url: '/pages/index/rubbish/rubbish',
    })
  },
  toRecycle:function(){
    wx.navigateTo({
      url: '/pages/index/recycle/recycle',
    })
  },
  // toMarket:function(){
  //   wx.navigateTo({
  //     url: '/pages/index/market/market',
  //   })
  // }
})
