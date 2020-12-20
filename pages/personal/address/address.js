Page({
  data: {
    list: [],
    default_id: 1
  },

  onLoad: function(options) {
    // 当前页面参数
    this.data.options = options;
  },

  onShow: function() {
    // 获取收货地址列表
    this.getAddressList();
  },

  /**
   * 获取收货地址列表
   */
  getAddressList: function() {
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
    let _this = this,
        userinfo = wx.getStorageSync('userinfo')
    wx.request({
      url: 'http://localhost:8088/address/selectAddress',
      method:'POST',
      data:{
        user_id:userinfo.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        if(res.data.sta == 1){
          _this.setData({
            list:res.data.obj
          })
          for(var i = 0;i < _this.data.list.length; i++){
            if(_this.data.list[i].is_default == 1){
              _this.setData({
                default_id:_this.data.list[i].id
              })
            }
          }
        }
      }
    })
  },

  /**
   * 添加新地址
   */
  createAddress: function() {
    wx.navigateTo({
      url: '/pages/personal/address/creat/creat'
    });
  },

  /**
   * 编辑地址
   */
  editAddress: function(e) {
    wx.navigateTo({
      url: "/pages/personal/address/detail/detail?address_id="+e.currentTarget.dataset.id
    });
  },

  /**
   * 移除收货地址
   */
  removeAddress: function(e) {
    let _this = this,
      id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前收货地址吗?",
      success: function(o) {
        if(o.confirm){
          wx.request({
            url: 'http://localhost:8088/address/delete',
            method:'POST',
            data:{
              id:id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            success:function(res){
              if(res.data.sta == 1){
                _this.getAddressList();
              }
            }
          })
        }
      }
    });
  },

  /**
   * 设置为默认地址
   */
  setDefault: function(e) {
    let _this = this,
        id = e.detail.value,
        userinfo = wx.getStorageSync('userinfo');
    wx.request({
      url: 'http://localhost:8088/address/setDefault',
      method:'POST',
      data:{
        userId: userinfo.id,
        id:id,
        default_id:_this.data.default_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(){
        _this.getAddressList();
        _this.setData({
          default_id:e.detail.value
        })
      }
    })
  },
  //返回按键监听
  onUnload: function () {
    var pages = getCurrentPages();//获取页面栈
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //调用上一个页面的onShow方法
      try {
        prePage.getAddress()
      } catch (e) {
      }
      
    }
  }
});