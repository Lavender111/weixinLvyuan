// pages/personal/indent/indent.js
var util= require("../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: 0,
    list:[],
    page: 1,                              //当前请求数据是第几页
    pageSize: 10,                          //每页数据条数
    hasMoreData: true,                      //上拉时是否继续请求数据，即是否还有更多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var recyclerId = options.recyclerId;
    if(options.dataType != undefined){
      this.setData({
        dataType:options.dataType
      })
    }
    this.setData({
      recyclerId
    })
    this.getInfo('正在加载数据...')
  },
  onShow:function(){
    this.getInfo('重新加载数据')
  },

  /**
   * 切换标签
   */
  bindHeaderTap: function (e) {
    this.setData({ dataType: e.target.dataset.type });
    // 获取订单列表
    this.getInfo('正在加载数据');
  },

  // 获取分页列表
  getInfo: function (message) {
    var that = this;
    wx.showNavigationBarLoading(message)              //在当前页面显示导航条加载动画
    wx.showLoading({                        //显示 loading 提示框
        title: message,
    })
    wx.request({
      url: 'http://localhost:8088/recycle/indent',    //本地设置不校验合法域名
      data: {
        recyclerId: that.data.recyclerId, 
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
                let t = new Date(that.data.list[i].date).toJSON();
                let date = util.getTime(t);
                list[i].date = date;
                list[i].price = (list[i].price).toFixed(2);
                list[i].actualPay = (list[i].actualPay).toFixed(2);
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
   * 确认打包
   */
  receipt: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/personal/indent/pay/pay?id='+id,
    })
    // wx.showModal({
    //   title: "提示",
    //   content: "确认打包？",
    //   success: function (o) {
    //     if (o.confirm) {
    //       wx.request({
    //         url: 'http://localhost:8088/recycle/complete',
    //         method:'POST',
    //         data:{
    //           id:id,
    //           user_id:userinfo.id,
    //           balance:userinfo.balance+num,
    //           recycle:userinfo.recycle+1,
    //           earnings:userinfo.earnings+num
    //         },
    //         header: {
    //           'content-type': 'application/x-www-form-urlencoded',
    //         },
    //         success:function(){
    //           _this.getAppointmentList(_this.data.dataType);
    //           app.queryUserInfo();
    //         }
    //       })
    //     }
    //   }
    // });
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
})