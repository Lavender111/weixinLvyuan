// pages/personal/indent/pay/pay.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:[],
    price:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    let userinfo = wx.getStorageSync('userinfo')
    this.setData({
      id,
      recycler:userinfo.id
    })
    this.getRecycleDetail(id)
  },
  priceInput:function(e){
    this.setData({
        price: e.detail.value    
    })
},

  /**
   * 获取支付详情
   */
  getRecycleDetail:function(id){
    let _this = this;
    wx.request({
      url: 'http://localhost:8088/recycle/getDetail',
      method:'POST',
      data:{
        id:id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        _this.setData({
          detail:res.data.obj.recycleDetails,
          userId:res.data.obj.userId,
          price:res.data.obj.price
        })
      }
    })
  },
  /**
   * 支付
   */
  banlancePay:function(e){
    let _this = this;
    let price = _this.data.price
    let type = e.currentTarget.dataset.type;
    wx.showModal({
      content: "支付金额："+price+'元',
      success: function (o) {
        if (o.confirm) {
          _this.payOff(type);
        }
      }
    });
  },
  offLinePay:function(e){
    let _this = this;
    let type = e.currentTarget.dataset.type;
    wx.showModal({
      title: "提示",
      content: "您使用的是线下支付，全部金额需通过线下转账转至以下任意账号，转款完成，请客户在回收订单点击确认收款。",
      success:function(o){
        if(o.confirm){
          wx.navigateTo({
            url: '/pages/personal/indent/indent?dataType=2&recyclerId='+_this.data.recycler,
          })
        }
      }
    });
  },
  payOff:function(type){
    let id = this.data.id;
    let price = this.data.price;
    let userId = this.data.userId;
    let recycler = this.data.recycler;
    let that = this;
    wx.request({
      url: 'http://localhost:8088/recycle/complete',
      method:'POST',
      data:{
        id:id,
        userId:userId,
        recyclerId:recycler,
        actualPay:price,
        type:type
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        if(res.data.sta === 1){
          app.queryUserInfo();
          wx.navigateTo({
            url: '/pages/personal/indent/indent?dataType=2&recyclerId='+recycler,
          })
        } else{
          wx.showModal({
            title: "提示",
            content: res.data.msg,
          });
        }
      }
    })
  }
})