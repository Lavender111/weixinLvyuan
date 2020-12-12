// pages/personal/order/order.js
var util = require('../../../utils/util');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: 0,
    orderType: '',
    list: [],
    page: 1,                              //当前请求数据是第几页
    pageSize: 10,                          //每页数据条数
    hasMoreData: true,                      //上拉时是否继续请求数据，即是否还有更多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单列表
    this.getInfo('正在加载数据中...');
  },
  /**
   * 切换标签
   */
  bindHeaderTap: function (e) {
    this.setData({ dataType: e.target.dataset.type });
    // 获取订单列表
    this.getInfo('数据刷新中...');
  },

  /**
   * 获取订单列表
   */
  // 获取分页列表
  getInfo: function (message) {
    var that = this;
    let userinfo = wx.getStorageSync('userinfo');
    wx.showNavigationBarLoading(message)              //在当前页面显示导航条加载动画
    wx.showLoading({                        //显示 loading 提示框
        title: message,
    })
    wx.request({
      url: 'http://localhost:8088/commodity/myOrder',    //本地设置不校验合法域名
      data: {
        userId: userinfo.id, 
        page: that.data.page, 
        count: that.data.pageSize,
        dataType:that.data.dataType 
      },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
          var contentlistTem = that.data.list;
          if (res.data.sta === 1) {
              wx.hideNavigationBarLoading()     //在当前页面隐藏导航条加载动画
              wx.hideLoading()               //隐藏 loading 提示框
              if (that.data.page == 1) {
                  contentlistTem = []
              }
              var list = res.data.obj.list;
              if (list.length < that.data.pageSize) {
                  that.setData({
                      list: contentlistTem.concat(list),
                      hasMoreData: false
                  })
              } else {
                  that.setData({
                      list: contentlistTem.concat(list),
                      hasMoreData: true,
                      page: that.data.page + 1
                  })
              }
              var {list} = that.data;
              for(var i=0;i<that.data.list.length;i++){
                let t = new Date(that.data.list[i].creat).toJSON();
                let date = util.getTime(t);
                list[i].creat = date;
                list[i].price = (list[i].price).toFixed(2);
              }
              that.setData({
                list
              })    
          }
      },
      fail: function (res) {
          wx.hideNavigationBarLoading()
          wx.hideLoading()
          fail()
      },
      complete: function (res) {
      },
    })
  },
   /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
 onPullDownRefresh: function () {
  this.data.page = 1
  this.getInfo('正在刷新数据')
},

/**
* 页面上拉触底事件的处理函数
*/
onReachBottom: function () {
  if (this.data.hasMoreData) {
      this.getInfo('加载更多数据')
  } else {
      wx.showToast({
          title: '没有更多数据',
      })
  }
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
                app.queryUserInfo();
                _this.getInfo('刷新数据中...')
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
                _this.getInfo('刷新数据中...')
              }
            }
          })
        }
      }
    });
  },
  /**
   * 删除订单
   * @param {*} e 
   */
  deleteOrder:function(e){
    let id = e.currentTarget.dataset.id;
    let _this = this;
    wx.showModal({
      title: "提示",
      content: "确认删除订单？",
      success: function (o) {
        if (o.confirm) {
          wx.request({
            url: 'http://localhost:8088/commodity/deleteOrder',    //本地设置不校验合法域名
            data: { 
              id:id  //订单id
            },
            method: 'post',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success:function(res){
              if(res.data.sta === 1){
                _this.getInfo('刷新数据中...')
              }
            }
          })
        }
      }
    });
  },
  /**
   * 发起付款
   */
  payOrder: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    App._post_form('user.order/pay', { order_id }, function (result) {
      if (result.code === -10) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: 'prepay_id=' + result.data.prepay_id,
        signType: 'MD5',
        paySign: result.data.paySign,
        success: function (res) {
          // 跳转到已付款订单
          wx.navigateTo({
            url: '../order/detail?order_id=' + order_id
          });
        },
        fail: function () {
          App.showError('订单未支付');
        },
      });
    });
  },
  //跳转到发布者发布的待出售商品页
  toHisIdle:function(e){
    wx.navigateTo({
      url: '/pages/cart/idle/idle?id='+e.currentTarget.dataset.id,
    })
  },

  /**
   * 跳转商品详情页
   */
  toOrderDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order/detail/detail?id=' + id
    });
  },
})