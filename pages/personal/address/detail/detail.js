Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    nav_select: false, // 快捷导航
    region: '',
    detail: {},
    id:0,
    error: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取当前地址信息
    this.setData({id:options.address_id});
    this.getAddressDetail(options.address_id);
  },

  //移动选点
  onChangeAddress: function() {
    var _page = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        _page.setData({
          chooseAddress: res.name,
          latitude:res.latitude,
          longitude:res.longitude
        });
      },
      fail: function(err) {
       console.log(err)
      }
    });
  },

  /**
   * 获取当前地址信息
   */
  getAddressDetail: function(id) {
    let _this = this;
    wx.request({
      url: 'http://localhost:8088/address/detail',
      method:'POST',
      data:{
        id:id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        if(res.data.sta == 1){
          _this.setData({
            detail:res.data.obj,
            chooseAddress:res.data.obj.detail,
            region:res.data.obj.address
          })
        }
      }
    });
  },

  /**
   * 表单提交
   */
  saveData: function(e) {
    let _this = this,
      values = e.detail.value
    values.region = this.data.region;

    

    // 按钮禁用
    _this.setData({
      disabled: true
    });

    // 提交到后端
    values.address_id = _this.data.detail.address_id;
    wx.request({
      url: 'http://localhost:8088/address/updateAddress',
      method:'POST',
      data:{
        id:_this.data.id,
        name:values.name,
        phone:values.phone,
        address:values.region,
        detail:values.detail,
        latitude:_this.data.latitude,
        longitude:_this.data.longitude
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        wx.navigateBack();
      }
    });
  },

  /**
   * 表单验证
   */
  validation: function(values) {
    if (values.name === '') {
      this.data.error = '收件人不能为空';
      return false;
    }
    if (values.phone.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    if (values.phone.length !== 11) {
      this.data.error = '手机号长度有误';
      return false;
    }
    let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!reg.test(values.phone)) {
      this.data.error = '手机号不符合要求';
      return false;
    }
    if (!this.data.region) {
      this.data.error = '省市区不能空';
      return false;
    }
    if (values.detail === '') {
      this.data.error = '详细地址不能为空';
      return false;
    }
    return true;
  },

  /**
   * 修改地区
   */
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },


  /**
   * 快捷导航 显示/隐藏
   */
  commonNav: function() {
    this.setData({
      nav_select: !this.data.nav_select
    });
  },

  /**
   * 快捷导航跳转
   */
  nav: function(e) {
    let url = '';
    switch (e.currentTarget.dataset.index) {
      case 'home':
        url = '../index/index';
        break;
      case 'fenlei':
        url = '../category/index';
        break;
      case 'cart':
        url = '../flow/index';
        break;
      case 'profile':
        url = '../user/index';
        break;
    }
    wx.switchTab({
      url
    });
  },

})