const util = require("../../../utils/util");
var app = getApp()
Page({
  data:{
    chooseAddress:'点击选择地址',
    array: ['余额支付', '微信支付'],
    index:0,
    extract_list:[],
    sent_list:[]
  },


  onLoad:function(options){
    var totalPrice = options.totalPrice
    this.setData({
      totalPrice
    })
    this.classifyList();
    this.getAddress();
  },

  //将商品按配送方式分类
  classifyList:function(){
    var cartList = JSON.parse(wx.getStorageSync('cartList'));
    let {extract_list} = this.data;
    let {sent_list} = this.data;
    for(let item of cartList){
      if(item.commodity.delivery === 0){
        extract_list.push(item)
      } else {
        sent_list.push(item)
      }
      this.setData({
        extract_list,
        sent_list
      })
    }
  },

  //移动选点
  onChangeAddress: function() {
    var _page = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        _page.setData({
          chooseAddress: res.address,
          latitude:res.latitude,
          longitude:res.longitude
        });
      },
      fail: function(err) {
       console.log(err)
      }
    });
  },
  // 选择器
  bindPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //获取用户默认地址
  getAddress: function() {
    let _this = this,
    userinfo = wx.getStorageSync('userinfo');
    wx.request({
      url: 'http://localhost:8088/address/getDefault',
      method:'POST',
      data:{
        user_id:userinfo.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        console.log(res)
        if(res.data.sta == 1){
          _this.setData({
            name:res.data.obj.name,
            phone:res.data.obj.phone,
            chooseAddress:res.data.obj.address+res.data.obj.detail,
            latitude:res.data.obj.latitude,
            longitude:res.data.obj.longitude
          })
        } 
      }
    });
  },

  //提交订单
  createOrder:function(e){
    wx.showLoading();
    let that = this;
    var ids = [];
    var commodityIds = []
    var cartList = JSON.parse(wx.getStorageSync('cartList'));
    let userinfo = wx.getStorageSync('userinfo');
    for(let item of cartList){
      ids.push(item.id);
      commodityIds.push(item.commodity.id)
      that.setData({
        ids:ids,
        commodityIds
      })
    }
    if(that.data.index == 0){
      wx.request({
        url: 'http://localhost:8088/cart/pay',
        method:'POST',
        data:{
          ids:ids,
          commodityIds:commodityIds,
          creat: util.formatTime(new Date()),
          userId:userinfo.id,
          name:e.detail.value.name,
          phone:e.detail.value.phone,
          address:e.detail.value.address,
          totalPrice:that.data.totalPrice
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success:function(res){
          wx.hideLoading()
          if(res.data.sta === 1){
            app.queryUserInfo();
            wx.navigateTo({
              url: '/pages/personal/order/order',
            })
          } else {
            wx.showModal({
              title:'提示',
              content:res.data.msg,
              success:function(o){
                if(o.confirm){
                  wx.switchTab({
                    url: '/pages/cart/cart',
                  })
                } else {
                  return;
                }
              }
            })
          }
        }
      })
    }
    //that.getState();
    
    
  },

  //获取商品状态
  /*getState:function(){
    var ids = [];
    var cartList = JSON.parse(wx.getStorageSync('cartList'));
    for(let item of cartList){
      ids.push(item.id);
      this.setData({
        ids:ids
      })
    }
    wx.request({
      url: 'http://localhost:8088/cart/getState',
      method:'POST',
      data:{
        ids:ids
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        wx.hideLoading()
        if(res.data.obj !== 0){
          wx.showModal({
            title:'提示',
            content:'有商品已被购买，请重新选购!',
            success:function(o){
              if(o.confirm){
                wx.switchTab({
                  url: '/pages/cart/cart',
                })
              } 
              
            }
          })
        }
      }
    })
  }*/
})
