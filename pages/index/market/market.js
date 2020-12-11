const MAX_IMG_NUM = 8;
Page({
  data:{
    item: 0,
    tab: 0,
    scrollTop: 0,
    collegeCur: -2,
    college: [
      {
        name: '书籍',
        id: 0
      },
      {
        name: '衣物',
        id: 1
      },
      {
        name: '家电',
        id: 2
      },
      {
        name: '化妆品',
        id: 3
      },
      {
        name: '饰品',
        id: 4
      },
      {
        name: '其他',
        id: 5
      },
    ],
    showList: false,
    page: 1,                              //当前请求数据是第几页
    pageSize: 10,                          //每页数据条数
    hasMoreData: true,                      //上拉时是否继续请求数据，即是否还有更多数据
    list: [],                        //获取的数据列表，以追加的形式添加进去
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
      desc: '补充物品信息'
    },
    {
      text: '步骤二',
      desc: '发布成功',
    },
  ],
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onLoad: function (options) {
  //   // 页面初始化 options为页面跳转所带来的参数
  //   var that = this
  //   that.getInfo('正在加载数据...')
  // },
  //跳转搜索
  search() {
    wx.navigateTo({
          url: '/pages/market/search/search',
    })
  },
  //类别选择
  collegeSelect(e) {
    this.setData({
          collegeCur: e.currentTarget.dataset.id - 1,
          scrollLeft: (e.currentTarget.dataset.id - 3) * 100,
          showList: false,
    })
    //this.getList();
  },
  //选择全部
  selectAll() {
    this.setData({
          collegeCur: -2,
          scrollLeft: -200,
          showList: false,
    })
    //this.getList();
  },
  //展示列表小面板
  showlist() {
    let that = this;
    if (that.data.showList) {
      that.setData({
        showList: false,
      })
    } else {
      that.setData({
        showList: true,
      })
     }
  },
  // 标签栏点击监听
  changeItem(e) {
    var item = e.currentTarget.dataset.item;
    this.setData({
      item: item
    });
    if(this.data.item == 1){
      this.initial()
    }
  },
  // 滑块滑动时的监听函数
  changeTab: function (e) {
    // e.detail.current为当前显示页面的索引号
    this.setData({
      tab: e.detail.current
    })
  },
  toCategory:function(){
    wx.navigateTo({
      url: '/pages/index/market/category/category',
    })
  },
  // 获取分页列表
  getInfo: function (message) {
    var that = this;
    wx.showNavigationBarLoading(message)              //在当前页面显示导航条加载动画
    wx.showLoading({                        //显示 loading 提示框
        title: message,
    })
    wx.request({
      url: 'http://localhost:8088/wechat/test',    //本地设置不校验合法域名
      data: { page: that.data.page, count: that.data.pageSize },
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
          var contentlistTem = that.data.list;
          if (res.data.length > 0) {
              wx.hideNavigationBarLoading()     //在当前页面隐藏导航条加载动画
              wx.hideLoading()               //隐藏 loading 提示框
              if (that.data.page == 1) {
                  contentlistTem = []
              }
              var list = res.data;
              if (list.length < that.data.pageSize) {
                  that.setData({
                      list: contentlistTem.concat(list),
                      hasMoreData: false
                  })
              } else {
                  that.setData({
                      list: contentlistTem.concat(list),
                      hasMoreData: true,
                      page: that.data.page + 1
                  })
              }
          }
      },
      fail: function (res) {
          wx.hideNavigationBarLoading()
          wx.hideLoading()
          fail()
      },
      complete: function (res) {
      },
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.data.page = 1
    this.getInfo('正在刷新数据')
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
        this.getInfo('加载更多数据')
    } else {
        wx.showToast({
            title: '没有更多数据',
        })
    }
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
      kind: [{
        name: '通用',
        id: 0,
        check: true,
      }, {
        name: '用途',
        id: 1,
        check: false
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
      //物品输入
      goodInput(e) {
            console.log(e)
            this.data.good = e.detail.value
      },
      //类别选择
      kindChange(e) {
            let that = this;
            let kind = that.data.kind;
            let id = e.detail.value;
            for (let i = 0; i < kind.length; i++) {
                  kind[i].check = false
            }
            kind[id].check = true;
            if (id == 1) {
                  that.setData({
                        kind: kind,
                        chooseCollege: true,
                        kindid: id
                  })
            } else {
                  that.setData({
                        kind: kind,
                        cids: '-1',
                        chooseCollege: false,
                        kindid: id
                  })
            }
      },
      //选择专业
      choCollege(e) {
            let that = this;
            that.setData({
                  cids: e.detail.value
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
            if (that.data.kind[1].check) {
                  if (that.data.cids == -1) {
                        wx.showToast({
                              title: '请选择用途',
                              icon: 'none',
                        });
                        return false;
                  }
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
            }
            that.publish();
      },
      //正式发布
      publish() {
            let that = this;
            if (!app.openid) {
                  wx.showModal({
                        title: '温馨提示',
                        content: '该功能需要注册方可使用，是否马上去注册',
                        success(res) {
                              if (res.confirm) {
                                    wx.navigateTo({
                                          url: '/pages/login/login',
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
                              db.collection('publish').add({
                                    data: {
                                          creat: new Date().getTime(),
                                          dura: new Date().getTime() + that.data.dura * (24 * 60 * 60 * 1000),
                                          status: 0, //0在售；1买家已付款，但卖家未发货；2买家确认收获，交易完成；3、交易作废，退还买家钱款
                                          price: that.data.price, //售价
                                          //分类
                                          kindid: that.data.kindid, //区别通用还是用途
                                          collegeid: that.data.cids, //学院id，-1表示通用类
                                          deliveryid: that.data.chooseDelivery, //0自1配
                                          place: that.data.place, //选择自提时地址
                                          notes: that.data.notes, //备注
                                          bookinfo: {
                                                pic: that.data.imgUrl,
                                                good: that.data.good,
                                                describe: that.data.describe,
                                                imgs: that.data.imgUrl
                                          },
                                          key: that.data.good,
                                    },
                                    success(e) {
                                          console.log(e)
                                          that.setData({
                                                show_b: false,
                                                show_c: true,
                                                active: 2,
                                                detail_id: e._id
                                          });
                                          wx.showToast({
                                                title: '正在上传...',
                                                icon: 'loading',
                                                mask: true,
                                                duration: 1000
                                          })
                                          setTimeout(function () {
                                                //判断卖家是否已经上传了赞赏码
                                                if (that.data.isExist == false) {
                                                      wx.showModal({
                                                            title: '商品发布成功',
                                                            content: '您未上传赞赏码用于交易，是否现在去上传？',
                                                            showCancel: true, //是否显示取消按钮
                                                            cancelText: "稍后再传", //默认是“取消”
                                                            cancelColor: '#fbbd08', //取消文字的颜色
                                                            success(res) {
                                                                  if (res.confirm) {
                                                                        wx.navigateTo({
                                                                              url: '/pages/appreciateCode/appreciateCode',
                                                                        })
                                                                  }
                                                            }
                                                      })
                                                }
                                          }, 2000)

                                          that.setData({
                                                show_b: false,
                                                show_c: true,
                                                active: 2,
                                                detail_id: e._id,
                                          });
                                          //滚动到顶部
                                          wx.pageScrollTo({
                                                scrollTop: 0,
                                          })
                                    }
                              })
                        }
                  }
            })
      },
      getCodeFromSet() {
            let that = this;
            let openid = app.openid
            console.log(openid)
            db.collection('appreciatecode').where({
                  _openid: openid,
            }).get().then(res => {
                  if (res.data.length > 0) {
                        that.setData({
                              isExist: true,
                              bigImg: res.data[0].bigImg
                        })
                        console.log(res.data[0].bigImg)
                        console.log("isExist---->" + that.data.isExist)
                  } else {
                        that.setData({
                              isExist: false,
                        })
                        console.log("isExist---->" + that.data.isExist)
                  }
            })
      },
      // doUpload(filePath) {
      //       const that = this;
      //       // var timestamp = (new Date()).valueOf();
      //       const cloudPath = 'goods-pic/' + app.openid + '/' + Math.floor(Math.random() * 10000 + 10000) + '.png';

      //       wx.cloud.uploadFile({
      //             cloudPath,
      //             filePath
      //       }).then(res => {
      //             console.log('[上传文件] 成功：', res)
      //             const {
      //                   params
      //             } = that.data;
      //             const {
      //                   imgUrl
      //             } = params;
      //             imgUrl.push(res.fileID);
      //             params['imgUrl'] = imgUrl;
      //             that.setData({
      //                   imgUrl,
      //             });
      //       }).catch(error => {
      //             console.error('[上传文件] 失败：', error);
      //             wx.showToast({
      //                   icon: 'none',
      //                   title: '上传失败',
      //                   duration: 1000
      //             })
      //       })
      // },

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
                        const tempFiles = res.tempFiles;
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
                              selectPhoto: max <= 0 ? false : true // 当超过8张时,加号隐藏
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
                  url: '/pages/detail/detail?scene=' + that.data.detail_id,
            })
      }

})