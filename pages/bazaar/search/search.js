// pages/bazaar/search/search.js
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    newlist: [],
    list: [],
    key: '',
    blank: false,
    hislist: [],
    page: 1,                              //当前请求数据是第几页
    pageSize: 10,                          //每页数据条数
    hasMoreData: true,                      //上拉时是否继续请求数据，即是否还有更多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gethis();
  },

  //获取本地记录
  gethis() {
    let that = this;
    wx.getStorage({
          key: 'history',
          success: function(res) {
                let hislist = JSON.parse(res.data);
                //限制长度
                if (hislist.length > 5) {
                      hislist.length = 5
                }
                that.setData({
                      hislist: hislist
                })
          },
    })
  },
//选择历史搜索关键词
  choosekey(e) {
      this.data.key = e.currentTarget.dataset.key;
      this.search('his');
  },
  
  //跳转详情
  detail(e) {
      let that = this;
      wx.navigateTo({
            url: '/pages/bazaar/goodDetail/goodDetail?id=' + e.currentTarget.dataset.id,
      })
  },
  //搜索结果
  search(n) {
      let that = this;
      let key = that.data.key;
      if (key == '') {
            wx.showToast({
                  title: '请输入关键词',
                  icon: 'none',
            })
            return false;
      }
      wx.setNavigationBarTitle({
            title:'"'+ that.data.key + '"的搜索结果',
      })
      wx.showLoading({
            title: '加载中',
      })
      if (n !== 'his') {
            that.history(key);
      }
      wx.request({
        url: 'http://localhost:8088/commodity/search',    //本地设置不校验合法域名
        data: { key:key,page:that.data.page,count:that.data.pageSize},
        method: 'post',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success:function(res){
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
                      blank: true,
                      list: contentlistTem.concat(list),
                      hasMoreData: false
                  })
              } else {
                  that.setData({
                      blank: true,
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
                list[i].price = (list[i].price).toFixed(2);
              }
              that.setData({
                list:list.sort((prev, next) => Date.parse(prev.creat) - Date.parse(next.creat)),
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
  //添加到搜索历史
  history(key) {
      let that = this;
      wx.getStorage({
            key: 'history',
            success(res) {
                  let oldarr = JSON.parse(res.data); //字符串转数组
                  let newa = [key]; //对象转为数组
                  let newarr = JSON.stringify(newa.concat(oldarr)); //连接数组\转字符串
                  wx.setStorage({
                        key: 'history',
                        data: newarr,
                  })
            },
            fail(res) {
                  //第一次打开时获取为null
                  let newa = [key]; //对象转为数组
                  var newarr = JSON.stringify(newa); //数组转字符串
                  wx.setStorage({
                        key: 'history',
                        data: newarr,
                  })
            }
      });
  },
  keyInput(e) {
      this.data.key = e.detail.value
  },
  //至顶
  gotop() {
      wx.pageScrollTo({
            scrollTop: 0
      })
  },
  //监测屏幕滚动
  onPageScroll: function (e) {
      this.setData({
            scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
      })
  },
  
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
 onPullDownRefresh: function () {
  this.data.page = 1
  this.search('his')
},

/**
* 页面上拉触底事件的处理函数
*/
onReachBottom: function () {
  if (this.data.hasMoreData) {
      this.search('his')
  } else {
      wx.showToast({
          title: '没有更多数据',
      })
  }
},
})