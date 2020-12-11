// pages/publish/publish.js
const MAX_IMG_NUM = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    college: [],
    isExist: '',
    selectPhoto: true,
    systeminfo: wx.getSystemInfoSync(),
    params: {
      imgUrl: new Array(),
    },
    tempFilePaths: [],
    entime: {
      enter: 600,
      leave: 300
    }, //进入褪出动画时长
    // college: JSON.parse(config.data).college.splice(1),
    steps: [{
        text: '步骤一',
        desc: '编辑物品信息'
      },
      {
        text: '步骤二',
        desc: '修改成功',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id
    })
    this.initial();
    this.getCommodityInfo();
    this.getCollege();
  },
  //发布页面的事件处理函数
  //恢复初始态
  initial:function() {
    let that = this;
    that.setData({
      dura: 30,
      price: 15,
      place: '',
      chooseDelivery: 0,
      cids: '-1', //类别选择的默认值
      show_b: true,
      show_c: false,
      active: 0,
      chooseCollege: false,
      note_counts: 0,
      desc_counts: 0,
      notes: '',
      describe: '',
      good: '',
      kindid: 0,
      showorhide: true,
      tempFilePaths: [],
      params: {
        imgUrl: new Array(),
      },
      imgUrl: [],
      kind: [ {
        name: '用途',
        id: 1,
        check: true
      }],
      delivery: [{
        name: '自提',
        id: 0,
        check: true,
      }, {
        name: '帮送',
        id: 1,
        check: false
      }],
      selectPhoto:true
    })
  },
  getCommodityInfo:function(){
    let that = this;
    wx.request({
      url: 'http://localhost:8088/commodity/getDetail',
      method:'POST',
      data:{
        id:that.data.id    
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        if(res.data.sta === 1){
          console.log(res)
          that.setData({
            commodityInfo:res.data.obj
          })
          let {commodityInfo} = that.data;
          that.setData({
            good:commodityInfo.title,
            describe:commodityInfo.describe,
            desc_counts:(commodityInfo.describe).length,
            tempFilePaths:that.data.tempFilePaths.concat(commodityInfo.pic),
            imgUrl:that.data.imgUrl.push(commodityInfo.pic),
            selectPhoto:false,
            price:commodityInfo.price,
            index:commodityInfo.typeId-1,
            type:commodityInfo.typeId,
            chooseDelivery:commodityInfo.delivery,
            place:commodityInfo.place,
            phone:commodityInfo.phone,
            notes:commodityInfo.notes,
            note_counts:(commodityInfo.notes).length,
          })
        }
      }
    })
  },
  //获取分类
  getCollege:function(){
      let that = this;
      wx.request({
        url: 'http://localhost:8088/commodity/getType',    //本地设置不校验合法域名
        method: 'get',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success:function(res){
          if(res.data.sta === 1){
            that.setData({
              college:res.data.obj
            })
          }
        }
      })
    },
//价格输入改变
  priceChange(e) {
    this.data.price = e.detail;
  },
  //时长才输入改变
  duraChange(e) {
    this.data.dura = e.detail;
  },
  //地址输入
  placeInput(e) {
    console.log(e)
    this.data.place = e.detail.value
  },
  //地址输入
  phoneInput(e) {
    console.log(e)
    this.data.phone = e.detail.value
  },
  //物品输入
  goodInput(e) {
   console.log(e)
   this.data.good = e.detail.value
  },
  //类别选择
  choCollege: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    var index = this.data.index;
    this.setData({
      type:this.data.college[index].id
    })
  },
  //取货方式改变
  delChange(e) {
    let that = this;
    let delivery = that.data.delivery;
    let id = e.detail.value;
    for (let i = 0; i < delivery.length; i++) {
      delivery[i].check = false
    }
    delivery[id].check = true;
    if (id == 1) {
      that.setData({
        delivery: delivery,
        chooseDelivery: 1
      })
    } else {
      that.setData({
        delivery: delivery,
        chooseDelivery: 0
      })
    }
  },
  //输入备注
  noteInput(e) {
    let that = this;
    that.setData({
      note_counts: e.detail.cursor,
      notes: e.detail.value,
    })
  },
  //输入描述
  describeInput(e) {
   let that = this;
   that.setData({
     desc_counts: e.detail.cursor,
     describe: e.detail.value,
   })
  },
  //发布校检
  check_pub() {
    let that = this;
   //如果用户选择了用途，需要选择用途类别
    if (that.data.type == '') {
      wx.showToast({
        title: '请选择用途',
        icon: 'none',
      });
      return false;
    }
   //如果用户选择了自提，需要填入详细地址
    if (that.data.delivery[0].check) {
      if (that.data.place == '') {
        wx.showToast({
         title: '请输入地址',
         icon: 'none',
        });
        return false;
      }
      if (that.data.phone == '') {
        wx.showToast({
          title: '请输入联系电话',
          icon: 'none',
        });
        return false;
      }
    }
    that.publish();
  },
  //正式发布
  publish() {
    let that = this;
    if (!wx.getStorageSync('openId')) {
      wx.showModal({
         title: '温馨提示',
          content: '该功能需要登录方可使用，是否马上去登录',
          success(res) {
            if (res.confirm) {
               wx.navigateTo({
                  url: '/pages/personal/personal',
               })
            }
          }
      })
      return false
    }
    if (that.data.good == '') {
      wx.showToast({
        title: '请输入商品名称',
        icon: 'none',
      });
      return false;
    }
    if (that.data.describe == '') {
      wx.showToast({
        title: '请输入商品的详细描述',
        icon: 'none',
      });
      return false;
    }
    if (that.data.imgUrl == '') {
      wx.showToast({
        title: '请选择图片',
        icon: 'none',
      });
      return false;
    }
    if (that.data.notes == '') {
      wx.showToast({
        title: '请输入相关的备注信息（如取货时间，新旧程度等）',
        icon: 'none',
      });
      return false;
    }
    wx.showModal({
      title: '温馨提示',
      content: '经检测您填写的信息无误，是否马上发布？',
      success(res) {
        if (res.confirm) {
          let userinfo = wx.getStorageSync('userinfo');
          wx.request({
            url: 'http://localhost:8088/commodity/editCommodity',
            method:'POST',
            data:{
              id:that.data.id,
              promulgatorId: userinfo.id,
              creat: new Date().toLocaleDateString(),
              dura: new Date(new Date().getTime() + that.data.dura * (24 * 60 * 60 * 1000)),
              state: 0, //0在售；1买家已付款，但卖家未发货；2买家确认收获，交易完成；3、交易作废，退还买家钱款
              //分类
              //kindid: that.data.kindid, 区别通用还是用途
              typeId: that.data.type, //类别id，-1表示通用类
              delivery: that.data.chooseDelivery, //0自1配
              place: that.data.place, //选择自提时地址
              phone: that.data.phone, //选择自提时地址
              notes: that.data.notes, //备注
              title: that.data.good,
              price: that.data.price, //售价
              describe: that.data.describe,
              pic: that.data.imgUrl[0],
              //key: that.data.good,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            success:function(res){
              console.log(res)
              if(res.data.sta === 1){
                that.setData({
                  show_b: false,
                  show_c: true,
                  active: 2,
                  detail_id: res.data.obj
                });
                wx.showToast({
                  title: '正在上传...',
                  icon: 'loading',
                  mask: true,
                  duration: 1000
                })
              }
            }
          })
        }
      }
    })
  },
  doUpload(filePath) {
    const that = this;
    // var timestamp = (new Date()).valueOf();
    const cloudPath = 'goods-pic/' + wx.getStorageSync('openId') + '/' + Math.floor(Math.random() * 10000 + 10000) + '.jpg';

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
  chooseImage: function () {
    const that = this;
    // 还能再选几张图片,初始值设置最大的数量-当前的图片的长度
    let max = MAX_IMG_NUM - this.data.tempFilePaths.length;
    // 选择图片
    wx.chooseImage({
      count: max, // count表示最多可以选择的图片张数
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        //const tempFiles = res.tempFiles;
        const filePath = res.tempFilePaths;
        //将选择的图片上传
        filePath.forEach((path, _index) => {
          setTimeout(() => that.doUpload(path), _index); //加不同的延迟，避免多图上传时文件名相同
        });
        const {
          tempFilePaths
        } = that.data;
        that.setData({
          tempFilePaths: tempFilePaths.concat(filePath)
        }, () => {
          console.log(that.data.tempFilePaths)
        })
        // 还能再选几张图片
        max = MAX_IMG_NUM - this.data.tempFilePaths.length
          this.setData({
            selectPhoto: max <= 0 ? false : true // 当超过max时,加号隐藏
          })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  deletePic(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index
    let imgUrl = this.data.params.imgUrl
    const {
      tempFilePaths
    } = this.data;
    tempFilePaths.splice(index, 1);
    imgUrl.splice(index, 1)
    this.setData({
      ['params.imgUrl']: imgUrl,
                  tempFilePaths,
    })
    // 当添加的图片达到设置最大的数量时,添加按钮隐藏,不让新添加图片
    if (this.data.tempFilePaths.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },
  detail() {
    let that = this;
    wx.navigateTo({
      url: '/pages/bazaar/goodDetail/goodDetail?id=' + that.data.detail_id,
    })
  },

  
})