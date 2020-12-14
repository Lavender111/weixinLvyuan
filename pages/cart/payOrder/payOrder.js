const util = require("../../../utils/util");
var app = getApp()
Page({
  data:{
    chooseAddress:'点击选择地址',
    array: ['余额支付', '微信支付'],
    index:0,
    extract_list:[],
    sent_list:[],
    hiddenmodal: true,
    item: {},
    items:[],
  },
  onLoad:function(options){
    var totalPrice = options.totalPrice
    this.setData({
      totalPrice
    })
  },
  onShow:function(){
    this.setData({
      items:[],
      extract_list:[],
      sent_list:[],
    })
    this.classifyList();
    this.getAddress();
  },
  //点击按钮弹出指定的hiddenmodalput弹出框
  modalRadio: function () {
    this.setData({
      hiddenmodal: !this.data.hiddenmodal
    })
  }, 
  //取消按钮 
  cancel: function () {  
    this.setData({
      hiddenmodal: true
    });
  },
  //确认
  confirm: function () {
    this.setData({
      hiddenmodal: true,
    })
  },  
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const items = this.data.items;
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].id === e.detail.value;
    }
    for (let j = 0; j < items.length; j++){
      if(items[j].id == e.detail.value){
        this.setData({
          item: items[j]
        })
      }
    }
  },
  //将商品按配送方式分类
  classifyList:function(){
    var cartList = JSON.parse(wx.getStorageSync('cartList'));
    let {extract_list} = this.data;
    let {sent_list} = this.data;
    for(let item of cartList){
      if(item.commodity.delivery === 0){
        extract_list.push(item)
      } else {
        sent_list.push(item)
      }
      this.setData({
        extract_list,
        sent_list
      })
    }
  },

  //移动选点
  onChangeAddress: function() {
    var _page = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        _page.setData({
          chooseAddress: res.address,
          latitude:res.latitude,
          longitude:res.longitude
        });
      },
      fail: function(err) {
       console.log(err)
      }
    });
  },
  // 选择器
  bindPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //获取用户地址
  getAddress: function() {
    let that = this,
    userinfo = wx.getStorageSync('userinfo');
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
        if(res.data.obj == null){
          wx.showModal({
            title:"提示",
            content:"您并未设置默认地址，是否前去设置",
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/personal/address/address',
                })
              }
            }
          })
          return;
        }
        let {items} = that.data;
        if(res.data.sta == 1){
          for(var i = 0;i < res.data.obj.length;i++){
            let {id,name,phone} = res.data.obj[i]
            var address = res.data.obj[i].address+res.data.obj[i].detail
            var data = {id,name,phone,address}
            items.push(data);
            that.setData({
              items
            })
            if(res.data.obj[i].is_default === 1){
              items[items.length-1].checked = true
              that.setData({
                items,
                item:data
              })
            }
          }
        } 
      }
    });
  },

  //提交订单
  createOrder:function(e){
    wx.showLoading();
    let that = this;
    var ids = [];
    var commodityIds = []
    var cartList = JSON.parse(wx.getStorageSync('cartList'));
    let userinfo = wx.getStorageSync('userinfo');
    for(let item of cartList){
      ids.push(item.id);
      commodityIds.push(item.commodity.id)
      that.setData({
        ids:ids,
        commodityIds
      })
    }
    if(that.data.index == 0){
      wx.request({
        url: 'http://localhost:8088/cart/pay',
        method:'POST',
        data:{
          ids:ids,
          commodityIds:commodityIds,
          creat: util.formatTime(new Date()),
          userId:userinfo.id,
          name:that.data.item.name,
          phone:that.data.item.phone,
          address:that.data.item.address,
          totalPrice:that.data.totalPrice
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success:function(res){
          wx.hideLoading()
          if(res.data.sta === 1){
            app.queryUserInfo();
            wx.navigateTo({
              url: '/pages/personal/order/order',
            })
          } else {
            wx.showModal({
              title:'提示',
              content:res.data.msg,
              success:function(o){
                if(o.confirm){
                  wx.switchTab({
                    url: '/pages/cart/cart',
                  })
                } else {
                  return;
                }
              }
            })
          }
        }
      })
    }
    //that.getState();
  },
  //跳转添加地址
  toAddAddess:function(){
    wx.navigateTo({
      url: '/pages/personal/address/creat/creat',
    })
  }

  //获取商品状态
  /*getState:function(){
    var ids = [];
    var cartList = JSON.parse(wx.getStorageSync('cartList'));
    for(let item of cartList){
      ids.push(item.id);
      this.setData({
        ids:ids
      })
    }
    wx.request({
      url: 'http://localhost:8088/cart/getState',
      method:'POST',
      data:{
        ids:ids
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        wx.hideLoading()
        if(res.data.obj !== 0){
          wx.showModal({
            title:'提示',
            content:'有商品已被购买，请重新选购!',
            success:function(o){
              if(o.confirm){
                wx.switchTab({
                  url: '/pages/cart/cart',
                })
              } 
              
            }
          })
        }
      }
    })
  }*/
})
