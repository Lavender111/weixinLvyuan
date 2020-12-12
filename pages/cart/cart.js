
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    saveHidden:true,
    selectAll:false,
    goods_list: [], // 商品列表
    invalid_list:[],   //失效商品
    totalPrice:0.00,
    page: 1,                              //当前请求数据是第几页
    pageSize: 10,                          //每页数据条数
    hasMoreData: true,                      //上拉时是否继续请求数据，即是否还有更多数据
    order_total_num: 0,
    order_total_price: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onShow:function(){
    this.setData({
      goods_list:[],
      invalid_list:[],
      selectAll:false,
      totalPrice:0.00
    })
    this.getInfo('正在加载数据...');
  },
  /**
   * 获取购物车列表
   */
  getInfo: function (message) {
    var that = this;
    let userinfo = wx.getStorageSync('userinfo');
    wx.showNavigationBarLoading(message)              //在当前页面显示导航条加载动画
    wx.showLoading({                        //显示 loading 提示框
        title: message,
    })
    if(!wx.getStorageSync('openId')){
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
    wx.request({
      url: 'http://localhost:8088/cart/getMyCart',    //本地设置不校验合法域名
      data: { userId:userinfo.id,page: that.data.page, count: that.data.pageSize },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
          var contentlistTem = that.data.list;
          if (res.data.sta === 1) {
            console.log(res)
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
              var {goods_list} = that.data;
              var {invalid_list} = that.data;
              for(var i=0;i<that.data.list.length;i++){
                let t = new Date(that.data.list[i].commodity.creat).toJSON();
                let creat = util.getTime(t);
                list[i].commodity.creat = creat;
                list[i].commodity.price = (list[i].commodity.price).toFixed(2);
                if(list[i].commodity.state === 0){
                  goods_list.push(list[i])
                } else {
                  invalid_list.push(list[i])
                }
                that.setData({
                  goods_list,
                  invalid_list
                })   
              }
               
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
  editTap:function(){
    this.setData({
      saveHidden:!this.data.saveHidden
    })
  },
  /**
   * 用户选择购物车商品
   */
  selectAll() {
    let selectAll = this.data.selectAll
    selectAll = !selectAll
    let goods_list = this.data.goods_list
    for(let item of goods_list) {
      item.select = selectAll
    }

    this.setData({
      selectAll,
      goods_list
    })
    this.getTotalPrice()
  },
  selectList(e) {
    // console.log(e)
    let id = e.target.dataset.id
    let goods_list = this.data.goods_list
    for(var i = 0; i < goods_list.length; i++){
      if(goods_list[i].commodityId === id){
        goods_list[i].select = !goods_list[i].select
        if(goods_list[i].select == false){
          this.setData({
            selectAll:false
          })
        }
      }
    }
    this.setData({
      goods_list
    })
    var j = 0;
    for(var i = 0; i < this.data.goods_list.length; i++){
      if(this.data.goods_list[i].select){
        j++
      }
    }
    if(j === this.data.goods_list.length){
      this.setData({
        selectAll:!this.data.selectAll
      })
    }
    this.getTotalPrice()
  },
  //计算总价
  getTotalPrice() {
    let goods_list = this.data.goods_list
    let total = 0
    for(let item of goods_list) {
      if(item.select) {
        total += parseInt(item.commodity.price);
      }
    }
    this.setData({
      totalPrice:total.toFixed(2)
    })
  },
  //跳转到发布者发布的待出售商品页
  toHisIdle:function(e){
    wx.navigateTo({
      url: '/pages/cart/idle/idle?id='+e.currentTarget.dataset.id,
    })
  },

  //跳转到商品详情
  toDetail:function(e){
    wx.navigateTo({
      url: '/pages/bazaar/goodDetail/goodDetail?id='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 删除商品
   */
  del: function() {
    let _this = this,
      goods_list = _this.data.goods_list;
    var ids = [];
    for(let item of goods_list){
      if(item.select){
        ids.push(item.id);
      }
      _this.setData({
        ids:ids
      })
    }
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前商品吗?",
      success: function(e) {
        if(e.confirm){
          wx.request({
            url: 'http://localhost:8088/cart/delCart',    //本地设置不校验合法域名
            data: { ids:_this.data.ids },
            method: 'post',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success:function(res){
              if(res.data.sta === 1){
                _this.setData({
                  goods_list:[],
                  invalid_list:[]
                })
                _this.getInfo('重新加载中...')
              }
            }
          })
        }
      }
    });
  },

  /**
   * 购物车跳转到支付订单
   */
  submit: function() {
    let _this = this,
      goods_list = _this.data.goods_list;
    var cartList = [];
    for(let item of goods_list){
      if(item.select){
        cartList.push(item);
      }
      _this.setData({
        cartList:cartList
      })
    }
    if(_this.data.cartList.length === 0){
      wx.showModal({
        title: '提示',
        content:'请选择要购买的商品!'
      })
      return;
    }
    wx.setStorageSync('cartList', [])
    wx.setStorageSync('cartList',JSON.stringify(_this.data.cartList))
    wx.navigateTo({
      url: '/pages/cart/payOrder/payOrder?totalPrice='+_this.data.totalPrice,
    })
  },
  /**
   * 清空失效商品
   */
  empty:function(){
    let that = this;
    var ids = [];
    for(let item of that.data.invalid_list){
      ids.push(item.id);
      that.setData({
        ids
      })
    }
    wx.request({
      url: 'http://localhost:8088/cart/delCart',    //本地设置不校验合法域名
      data: { ids:that.data.ids },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
        if(res.data.sta === 1){
          that.setData({
            goods_list:[],
            invalid_list:[]
          })
          that.getInfo('重新加载中...')
        }
      }
    })
  },

  /**
   * 加法
   */
  mathadd: function(arg1, arg2) {
    return (Number(arg1) + Number(arg2)).toFixed(2);
  },

  /**
   * 减法
   */
  mathsub: function(arg1, arg2) {
    return (Number(arg1) - Number(arg2)).toFixed(2);
  },

  /**
   * 去购物
   */
  toIndexPage: function() {
    wx.switchTab({
      url: '/pages/bazaar/bazaar',
    });
  },

})