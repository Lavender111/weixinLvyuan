
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // tabbar
    // winWidth: 0,
    // winHeight: 0,
    // tab切换
    // currentTab: 0,
    // scrollLeft: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   var that = this;
  //   /*** 获取系统信息*/
  //   wx.getSystemInfo({
  //      success: function (res){ 
  //        that.setData({
  //           winWidth: res.windowWidth,
  //            winHeight: res.windowHeight 
  //            }); 
  //            } 
  //            });
  // },
  /*** 滑动切换tab*/
//   bindChange: function (e) {
//     var that = this;
//      that.setData({ 
//        currentTab: e.detail.current 
//        });
//        // 内容与tabbar的联动//这里的 2 75 是根据顶部tabbar的个数来决定的，我定义的是5个，2是索引，也就是说超过三页才会改变
//        if (e.detail.current > 2)
//         {
//           var a = e.detail.currentvar 
//           var query = wx.createSelectorQuery()
//           query.select('.scrollBox').boundingClientRect(function (res) {
//             that.setData({scrollLeft: (a - 2) * 75})})
//             query.selectViewport().scrollOffset()
//             query.exec(function (res) {})} 
//             else {
//               var a = e.detail.current
//               this.setData({scrollLeft: 0})}
//                },
//  /*** 点击tab切换*/
//   switchNav: function (e) {
//         var that = this;console.log(e.target)
//         if (this.data.currentTab === e.target.dataset.current) 
//             {return false;} 
//         else {
//             that.setData({currentTab: e.target.dataset.current})}
//   },
 
  // 点击相应的垃圾分别跳转到相关详情页面
  toRecoverable: function (event) {
    wx.navigateTo({
      url: '/pages/index/rubbish/recoverable-garbage/recoverable-garbage',
    })
  },
  toHarmful: function (event) {
    wx.navigateTo({
      url: '/pages/index/rubbish/harmful-waste/harmful-waste',
    })
  },
  toKitchen: function (event) {
    wx.navigateTo({
      url: '/pages/index/rubbish/kitchen-waste/kitchen-waste',
    })
  },
  toOther: function (event) {
    wx.navigateTo({
      url: '/pages/index/rubbish/other-waste/other-waste',
    })
  }
  
})