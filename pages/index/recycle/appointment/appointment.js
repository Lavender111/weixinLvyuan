// pages/index/recycle/appointment/appointment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().toLocaleDateString(),
    array: ['上午(09:00-12:00)', '中午(12:00-14:00)', '下午(14:00-18:00)', '晚上(18:00-21:00)'],
    index:2,
    region: '',
    detail: {},
    list:[],
    hiddenmodal: true,
    item: '等待回收商接单',
    items:[
      {id:0,value:'等待回收商接单',name:'等待回收商接单',checked:true},
    ],
    recyclerId:0
  },

  //校验日期
  dateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 选择器
  bindPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //校验地区
  regionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
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
          item: items[j].value
        })
      }
    }
    this.setData({
      recyclerId:e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var price = options.price;
    var list = JSON.parse(options.list);
    this.setData({
      list:list,
      price:price
    })
  },
  onShow:function(){
    this.getAddress();
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
        _page.setData({
          items:[
            {id:0,value:'等待回收商接单',name:'等待回收商接单',checked:true},
          ],
        })
        _page.getRecyclers(_page.data.latitude,_page.data.longitude)
      },
      fail: function(err) {
       console.log(err)
      }
    });
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
    if (values.address === '') {
      this.data.error = '详细地址不能为空';
      return false;
    }
    return true;
  },

  /**
   * 获取当前默认地址信息
   */
  getAddress: function() {
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
    userinfo = wx.getStorageSync('userinfo');
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
        if(res.data.sta == 1){
          _this.setData({
            detail:res.data.obj,
            region:res.data.obj.address,
            chooseAddress:res.data.obj.detail,
            latitude:res.data.obj.latitude,
            longitude:res.data.obj.longitude
          })
          _this.getRecyclers(_this.data.latitude,_this.data.longitude);
        } 
      }
    });
  },

  getRecyclers:function(latitude,longitude) {
    let that = this;
    wx.request({
      url: 'http://localhost:8088/recycler/getRecyclers',
      method:'POST',
      data:{
        latitude:latitude,
        longitude:longitude
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        let {items} = that.data;
        if(res.data.sta == 1){
          for(var i = 0;i < res.data.obj.length;i++){
            let {id,value,name,phone,distance} = res.data.obj[i]
            var data = {id,value,name,phone,distance}
            items.push(data);
            that.setData({
              items
            })
          }
        }
      }
    });
  },

  // 提交回收表单
  submitInfo:function(e){
    let that = this;
    let userinfo = wx.getStorageSync('userinfo'),
    index = this.data.index,
    date = new Date(this.data.date);
    var list = this.data.list;
    for(var i = 0; i < list.length; i++){
      if(list[i].id == 4){
        list[i].number = list[i].number+'个'
      }else if(list[i].id == 9 || list[i].id == 11){
        list[i].number = list[i].number+'件'
      } else {
        list[i].number = list[i].number+'公斤'
      }
    }
    // this.setData({
    //   list
    // })
    /*if(this.data.list.length == 1){
      this.setData({
        matter:this.data.list[0].name
      })
      if(this.data.list[0].id == 4){
        memo += this.data.list[0].number+'个'
      }else if(this.data.list[0].id == 9){
        memo += this.data.list[0].number+'件'
      } else {
        memo += this.data.list[0].number+'公斤'
      }
    } else {
      this.setData({
        matter:'啥都有',
      })
      for(var i =0;i < this.data.list.length;i++){
        if(this.data.list[i].id == 4){
          memo += ','+this.data.list[i].name+' '+this.data.list[i].number+'个'
        }else if(this.data.list[i].id == 9){
          memo += ','+this.data.list[i].name+' '+this.data.list[i].number+'件'
        } else {
          memo += ','+this.data.list[i].name+' '+this.data.list[i].number+'公斤'
        }
      }
    }*/
    wx.request({
      url: 'http://localhost:8088/recycle/appointment',
      method:'POST',
      data:{
        userId:userinfo.id,
        name:e.detail.value.name,
        phone:e.detail.value.phone,
        address:that.data.region+e.detail.value.address,
        detail: JSON.stringify(that.data.list),
        date:date,
        time:that.data.array[index],
        memo:e.detail.value.memo,
        recyclerId: that.data.recyclerId,
        price:that.data.price
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        if(res.data.sta == 1){
          wx.navigateTo({
            url: '/pages/personal/condition/condition',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  }
})