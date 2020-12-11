// pages/bazaar/bazaar.js
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:[
      {
        img:'/images/bazaar_ban.jpg',
        id:0
      },
      {
        img:'/images/banner3.jpg',
        id:1
      }
    ],
    scrollTop: 0,
    collegeCur: -2,
    college: [],
    showList: false,
    page: 1,                              //当前请求数据是第几页
    pageSize: 10,                          //每页数据条数
    hasMoreData: true,                      //上拉时是否继续请求数据，即是否还有更多数据
    list: [],                        //获取的数据列表，以追加的形式添加进去
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    that.getInfo('正在加载数据...')
    that.getCollege();
  },
  onShow:function(){
    this.onLoad()
  },
  //获取分类
  getCollege:function(){
    let that = this;
    wx.request({
      url: 'http://localhost:8088/commodity/getType',    //本地设置不校验合法域名
      method: 'get',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
        if(res.data.sta === 1){
          that.setData({
            college:res.data.obj
          })
        }
      }
    })
  },
  //跳转搜索
  search() {
    wx.navigateTo({
          url: '/pages/bazaar/search/search',
    })
  },
  //类别选择
  collegeSelect(e) {
    this.setData({
          collegeCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 3) * 100,
          showList: false,
    })
    this.getInfo('加载中');
  },
  //选择全部
  selectAll() {
    this.setData({
          collegeCur: -2,
          scrollLeft: -200,
          showList: false,
    })
    this.getInfo('加载中')
  },
  //展示列表小面板
  showlist() {
    let that = this;
    if (that.data.showList) {
      that.setData({
        showList: false,
      })
    } else {
      that.setData({
        showList: true,
      })
     }
  },

  toCategory:function(){
    wx.navigateTo({
      url: '/pages/index/market/category/category',
    })
  },
  // 获取分页列表
  getInfo: function (message) {
    var that = this;
    wx.showNavigationBarLoading(message)              //在当前页面显示导航条加载动画
    wx.showLoading({                        //显示 loading 提示框
        title: message,
    })
    wx.request({
      url: 'http://localhost:8088/commodity/getForSale',    //本地设置不校验合法域名
      data: { type:that.data.collegeCur,page: that.data.page, count: that.data.pageSize },
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
                let creat = util.getTime(t);
                list[i].creat = creat;
                list[i].price = (list[i].price).toFixed(2)
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
  
})