// pages/other-waste/other-waste.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    wx.request({
      url: 'http://localhost:8088/rubbish/info',
      method:'POST',
      data:{
        id:4
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        if(res.data.sta === 1){
          _this.setData({
            icon:res.data.obj.icon,
            introduce:res.data.obj.introduce,
            picture:res.data.obj.picture,
            explain:res.data.obj.explain,
            textData:res.data.obj.rubbishPuts,
            kindData:res.data.obj.rubbishDetails
          })
        }
      }
    })
  },
})