// pages/personal/order/detail/detail.js
const util = require("../../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id
    })
    this.getDetail();
  },

  getDetail:function(){
    let that = this;
    wx.request({
      url: 'http://localhost:8088/commodity/getOrder',    //本地设置不校验合法域名
      data: {
        id:that.data.id   //订单id
      },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
        if(res.data.sta === 1){
          console.log(res)
          that.setData({
            detail:res.data.obj
          })
          var {detail} = that.data;
          detail.order.creat = util.formatTimePjj(that.data.detail.order.creat)
          detail.price = (that.data.detail.price).toFixed(2);
          that.setData({
            detail
          })
        }
      }
    })
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let userinfo = wx.getStorageSync('userinfo');
    let id = e.currentTarget.dataset.id;
    let price = e.currentTarget.dataset.price;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          wx.request({
            url: 'http://localhost:8088/commodity/cancel',    //本地设置不校验合法域名
            data: {
              userId: userinfo.id, 
              id: id,   //商品id
              price:price   //商品价格
            },
            method: 'post',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success:function(res){
              if(res.data.sta === 1){
                _this.getDetail()
              }
            }
          })
        }
      }
    });
  },
  /**
   * 确认收货
   */
  receipt: function (e) {
    let _this = this;
    let promulgatorId = e.currentTarget.dataset.promulgator;
    let id = e.currentTarget.dataset.id;
    let price = e.currentTarget.dataset.price;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success: function (o) {
        if (o.confirm) {
          wx.request({
            url: 'http://localhost:8088/commodity/receipt',    //本地设置不校验合法域名
            data: { 
              promulgatorId:promulgatorId,
              id: id,   //商品id
              price:price   //商品价格
            },
            method: 'post',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success:function(res){
              if(res.data.sta === 1){
                _this.getDetail()
              }
            }
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})