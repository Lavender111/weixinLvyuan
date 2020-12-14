// pages/bazaar/goodDetail/goodDetail.js
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first_title: true,
    place: '',
  },

  onLoad(options) {
      var id  = options.id
    this.getPublish(id);
},
//标签点击切换
changeTitle(e) {
    let that = this;
    that.setData({
          first_title: e.currentTarget.dataset.id
    })
},
//获取发布信息
getPublish(id) {
    let that = this;
    wx.request({
      url: 'http://localhost:8088/commodity/getDetail',    //本地设置不校验合法域名
      data: { id:id },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
            console.log(res)
            if(res.data.sta === 1){
                  that.setData({
                        publishinfo:res.data.obj
                  })
                  let t = new Date(that.data.publishinfo.creat).toJSON();
                  let creat = util.getTime(t);
                  that.setData({
                        publishTime:creat
                  })
                  that.getSeller(res.data.obj.promulgatorId);
                  if(res.data.obj.delivery == 1){
                        that.getAddressInfo();
                  }
            }
      }
    }) 
},
//获取卖家信息
getSeller(promulgatorId) {
    let that = this;
    wx.request({
      url: 'http://localhost:8088/commodity/getPromulgator',    //本地设置不校验合法域名
      data: { id:promulgatorId },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
            if(res.data.sta){
                  that.setData({
                        userinfo:res.data.obj
                  })
            }
      }
    })
//     db.collection('user').where({
//           _openid: m
//     }).get({
//           success: function(res) {
//                 that.setData({
//                       userinfo: res.data[0]
//                 })
//                 that.getBook(n)
//           }
//     })
},
//获取地址信息
getAddressInfo() {
    let that = this;
    let userinfo = wx.getStorageSync('userinfo');
    if(userinfo.id !== that.data.publishinfo.promulgatorId){
      wx.request({
            url: 'http://localhost:8088/address/getDefault',
            method:'POST',
            data:{
              user_id:userinfo.id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            success:function(res){
              if(res.data.sta == 1){
                that.setData({
                  name:res.data.obj.name,
                  phone:res.data.obj.phone,
                  address:res.data.obj.address+res.data.obj.detail,
                })
              }
            }
          });
    }
    
},
//加入购物车
hanleCartAdd:function(e){
      var id = e.currentTarget.dataset.id;
    let that = this;
    let userinfo = wx.getStorageSync('userinfo');
    if (!wx.getStorageSync('openId')) {
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
    if(userinfo.id === that.data.publishinfo.promulgatorId){
          wx.showModal({
            title: '提示',
            content:'这是您自己发布的商品哦！'
          })
          return;
    }
    wx.request({
      url: 'http://localhost:8088/cart/addToCart',    //本地设置不校验合法域名
      data: { commodityId:id,userId:userinfo.id },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
},
//回到首页
home() {
    wx.switchTab({
          url: '/pages/index/index',
    })
},
//购买检测
buy() {
    let that = this;
    let userinfo = wx.getStorageSync('userinfo');
    if (!wx.getStorageSync('openId')) {
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
          return false;
    }
    if(userinfo.id === that.data.publishinfo.promulgatorId){
      wx.showModal({
        title: '提示',
        content:'这是您自己发布的商品哦！'
      })
      return;
    }
    if (that.data.publishinfo.delivery == 1) {
          if (that.data.name == '') {
                wx.showToast({
                      title: '请输入您的姓名',
                      icon: 'none'
                })
                return false
          }
          if (that.data.phone == '') {
                wx.showToast({
                      title: '请输入您的联系电话',
                      icon: 'none'
                })
                return false
          }
          if (that.data.place == '') {
                wx.showToast({
                      title: '请输入您的收货地址',
                      icon: 'none'
                })
                return false
          }
          that.paypost();
    }
    that.paypost();
},
//获取订单状态
getStatus() {
    let that = this;
    let id = that.data.publishinfo.id;
    db.collection('publish').doc(_id).get({
          success(e) {
                if (e.data.status == 0) {
                      that.paypost();
                } else {
                      wx.showToast({
                            title: '该书刚刚被抢光了~',
                            icon: 'none'
                      })
                }
          }
    })
},
//支付提交
paypost() {
    let that = this;
    let userinfo = wx.getStorageSync('userinfo');
    
    wx.showLoading({
          title: '正在下单',
    });
    var commodityIds = [];
    var ids = [];
    commodityIds.push(that.data.publishinfo.id)
    ids.push(0);
    wx.request({
      url: 'http://localhost:8088/cart/pay',
      method:'POST',
      data:{
        ids:ids,
        commodityIds:commodityIds,
        creat: util.formatTime(new Date()),
        userId:userinfo.id,
        name:that.data.name,
        phone:that.data.phone,
        address:that.data.address,
        totalPrice:that.data.publishinfo.price
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        wx.hideLoading()
        if(res.data.sta === 1){
          wx.navigateTo({
            url: '/pages/personal/order/order',
          })
        } else {
          wx.showModal({
            title:'提示',
            content:res.data.msg,
            success:function(o){
              return;
            }
          })
        }
      }
    })
},
//路由
go(e) {
    wx.navigateTo({
          url: e.currentTarget.dataset.go,
    })
},
//input输入
nameInput(e) {
      this.setData({
            name:e.detail.value
      })
},
phoneInput(e) {
      this.setData({
            phone:e.detail.value
      })
},
placeInput(e) {
      this.setData({
            address:e.detail.value
      })
},
onShareAppMessage() {
    return {
          title: '这件商品《' + this.data.bookinfo.title + '》只要￥' + this.data.publishinfo.price + '元，快来看看吧',
          path: '/pages/bazaar/goodDetail/goodDetail?id=' + this.data.publishinfo.id,
    }
},
//历史记录
//记录两次，一次相当于使用微信支付充值，一次是用于购买书籍付款
history(name, num, type, id) {
    let that = this;
    db.collection('history').add({
          data: {
                stamp: new Date().getTime(),
                type: 1, //1充值2支付
                name: '微信支付',
                num: num,
                oid: app.openid,
          },
          success: function(res) {
                db.collection('history').add({
                      data: {
                            stamp: new Date().getTime(),
                            type: type, //1充值2支付
                            name: name,
                            num: num,
                            oid: app.openid,
                      },
                      success: function(res) {
                            wx.hideLoading();
                            that.sms();
                            that.tip();
                            wx.redirectTo({
                                  url: '/pages/success/success?id=' + id,
                            })
                      }
                })
          },
    })
},
//客服跳动动画
kefuani: function() {
    let that = this;
    let i = 0
    let ii = 0
    let animationKefuData = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
    });
    animationKefuData.translateY(10).step({
          duration: 800
    }).translateY(0).step({
          duration: 800
    });
    that.setData({
          animationKefuData: animationKefuData.export(),
    })
    setInterval(function() {
          animationKefuData.translateY(20).step({
                duration: 800
          }).translateY(0).step({
                duration: 800
          });
          that.setData({
                      animationKefuData: animationKefuData.export(),
                })
                ++ii;
          console.log(ii);
    }.bind(that), 1800);
},
// onReady() {
//     this.kefuani();
// }
})