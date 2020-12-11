// pages/personal/task/task.js
var util= require("../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: 0,
    tab: 0,
    page: 1,                              //当前请求数据是第几页
    pageSize: 5,                          //每页数据条数
    hasMoreData: true,                      //上拉时是否继续请求数据，即是否还有更多数据
    list: [],                        //获取的数据列表，以追加的形式添加进去
    newList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userinfo = wx.getStorageSync('userinfo')
    this.setData({
      recyclerId:userinfo.recyclerId
    })
  },
  onShow:function(){
    this.getInfo('正在加载数据...')
  },
  // 标签栏点击监听
  // changeItem(e) {
  //   var item = e.currentTarget.dataset.item;
  //   this.setData({
  //     item: item
  //   })
  // },
  // 滑块滑动时的监听函数
  // changeTab: function (e) {
  //   // e.detail.current为当前显示页面的索引号
  //   this.setData({
  //     tab: e.detail.current
  //   })
  // },

  // 获取分页列表
  getInfo: function (message) {
    var that = this;
    wx.showNavigationBarLoading(message)              //在当前页面显示导航条加载动画
    wx.showLoading({                        //显示 loading 提示框
        title: message,
    })
    wx.request({
      url: 'http://localhost:8088/recycle/task',    //本地设置不校验合法域名
      data: { id: 0,page: that.data.page, count: that.data.pageSize },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
          wx.hideNavigationBarLoading()     //在当前页面隐藏导航条加载动画
          wx.hideLoading() //隐藏 loading 提示框
          var contentlistTem = that.data.list;
          if (res.data.sta === 1) {
            console.log(res)
              if (that.data.page == 1) {
                  contentlistTem = []
              }
              var list = res.data.obj.list;
              if (list.length < that.data.pageSize) {
                  list = contentlistTem.concat(list)
                  that.setData({
                      list: list.sort((prev, next) => Date.parse(prev.date) - Date.parse(next.date)),
                      hasMoreData: false
                  })
              } else {
                  var list = res.data.obj.list;
                  that.setData({
                      list: list.sort((prev, next) => Date.parse(prev.date) - Date.parse(next.date)),
                      hasMoreData: true,
                      page: that.data.page + 1
                  })
              }
              var {list} = that.data;
              for(var i=0;i<that.data.list.length;i++){
                let t = new Date(that.data.list[i].date).toJSON();
                let date = util.getTime(t);
                list[i].date = date;
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
   * 回收商接单
   */
  accept:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.request({
      url: 'http://localhost:8088/recycle/accept',    //本地设置不校验合法域名
      data: {
        id:id,
        recyclerId:that.data.recyclerId
      },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
        if(res.data.sta === 1){
          that.setData({
            list:[]
          })
          that.getInfo('刷新数据中...')
        }
      }
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
})