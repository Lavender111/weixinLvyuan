// pages/personal/set/set.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    nickname:'',
    phone:'',
    sex: [{
      name: '先生',
      id: 1,
      check: true,
    }, {
      name: '女士',
      id: 2,
      check: false
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userinfo = wx.getStorageSync('userinfo');
    let {sex} = this.data
    if(userinfo.sex == 1){
      sex[0].check = true
      sex[1].check = false
    } else {
      sex[1].check = true
      sex[0].check = true
    }
    this.setData({
      avatar:userinfo.avatar,
      nickname:userinfo.nickname,
      sex:sex,
      phone:userinfo.phone,
      checkedId:userinfo.sex
    })
  },
  sexChange(e) {
    let that = this;
    let sex = that.data.sex;
    let id = e.detail.value;
    for (let i = 0; i < sex.length; i++) {
      if(id == sex[i].id){
        sex[i].check = true
      } else {
        sex[i].check = false
      }
    }
    that.setData({
      sex: sex,
      checkedId:id
    })
  },
  nameInput:function(e){
    this.setData({
      nickname:e.detail.value
    })
  },
  phoneInput:function(e){
    this.setData({
      phone:e.detail.value
    })
  },
  
  //修改头像
  changeAvatar:function(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        this.setData({
          avatar: tempFilePaths[0]
        })
        that.doUpload(this.data.avatar)
      },
    })
  },
  //上传图片
  doUpload(filePath) {
    const that = this;
    wx.uploadFile({
      url: 'http://localhost:8088/uploadFile/uploadPicture', //开发者服务器的 url
      filePath: filePath, // 要上传文件资源的路径 String类型！！！
      name: 'file', // 文件对应的 key ,(后台接口规定的关于图片的请求参数)
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      success:function(res){
        let result = JSON.parse(res.data)
        console.log('[上传文件] 成功：', JSON.parse(res.data))
        that.setData({
          avatar:result.obj
        });
        console.log(that.data.avatar)
      },
      fail:function(error){
        console.error('[上传文件] 失败：', error);
        wx.showToast({
          icon: 'none',
          title: '上传失败',
          duration: 1000
        })
      }
    })
  },
  submit:function(){
    let that = this;
    var userinfo = wx.getStorageSync('userinfo');
    if(that.data.nickname == ''){
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
      });
      return false;
    }
    if(that.data.phone == ''){
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none',
      });
      return false;
    }
    wx.request({
      url: 'http://localhost:8088/user/updateInfo',
      method:'POST',
      data:{
        id: userinfo.id,
        nickname:that.data.nickname,
        sex:that.data.checkedId,
        phone:that.data.phone,
        avatar:that.data.avatar
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        if(res.data.sta === 1){
          app.queryUserInfo();
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
        })
      }
    })
  }
})