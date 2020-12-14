// pages/personal/register/register.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    images: [],
    params: {
      imgUrl: new Array(),
    },
    imgUrl: [],
    city:wx.getStorageSync('site')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  /**
   * 表单验证
   */
  validation: function(values) {
    if (values.name === '') {
      this.data.error = '姓名不能为空';
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
    if (values.address === '') {
      this.data.error = '地址不能为空';
      return false;
    }
    if (values.card === '') {
      this.data.error = '身份证号不能为空';
      return false;
    }
    if (values.title === '') {
      this.data.error = '店铺名称不能为空';
      return false;
    }
    if (values.city === '') {
      this.data.error = '当前所在城市不能为空';
      return false;
    }
    if (this.data.imgUrl.length === 0 ) {
      this.data.error = '请上传身份认证图片';
      return false;
    }
    return true;
  },

  // 照片上传方法
  chooseImage(e) {
    let that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const filePath = res.tempFilePaths
        //将选择的图片上传
        filePath.forEach((path, _index) => {
          setTimeout(() => that.doUpload(path), _index); //加不同的延迟，避免多图上传时文件名相同
        });
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        const images1 = images.length <= 3 ? images : images.slice(0, 3)
        this.setData({
          images: images1
        })
      }
    })
  },
  removeImage(e) {
    var that = this;
    var images = that.data.images;
    // 获取要删除的第几张图片的下标
    const idx = e.currentTarget.dataset.idx
    // splice  第一个参数是下表值  第二个参数是删除的数量
    images.splice(idx,1)
    this.setData({
      images: images
    })
  },
 
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
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
        const {
          params
        } = that.data;
        const {
          imgUrl
        } = params;
        imgUrl.push(result.obj);
        params['imgUrl'] = imgUrl;
        that.setData({
          imgUrl,
        });
        console.log(that.data.imgUrl[0])
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
  // 提交注册为回收商表单
  submitInfo:function(e){
    let that = this;
    let userinfo = wx.getStorageSync('userinfo');
    wx.request({
      url: 'http://localhost:8088/recycler/register',
      method:'POST',
      data:{
        id:userinfo.id,
        name:e.detail.value.name,
        phone:e.detail.value.phone,
        address:e.detail.value.address,
        latitude:that.data.latitude,
        longitude:that.data.longitude,
        card:e.detail.value.card,
        title:e.detail.value.title,
        city:e.detail.value.city,
        img1:that.data.imgUrl[0],
        img2:that.data.imgUrl[1],
        img3:that.data.imgUrl[2],
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        if(res.data.sta === 1){
          app.queryUserInfo();
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  }
})