//app.js
App({
  onLaunch: function () {
    wx.checkSession({
      success:function(res){
        console.log("处于登录态")
      },
      fail:function(res){
        console.log("需要重新登录")
      }
    })
  },

  login:function(e){
     // 登录
     wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){
          let that = this;
          var code = res.code;
          var nickname = e.nickName;
          var avatarUrl = e.avatarUrl;
          var gender = e.gender;
          //调用后端，获取sessionkey,openId
          wx.request({
            url: 'http://localhost:8088/user/wxLogin',
            method:'POST',
            data:{
              code:code,
              nickname:nickname,
              avatar:avatarUrl,
              sex:gender
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            success:function(record){
              console.log(record);
              if(record.data.sta == 1){
                wx.setStorageSync('openId', record.data.obj.openid);
                wx.setStorageSync('session_key', record.data.obj.session_key);
                that.queryUserInfo();
                wx.switchTab({
                  url: '/pages/personal/personal',
                  success:function(e){
                    var page = getCurrentPages().pop();
                    if(page == undefined || page == null) return;
                    page.onLoad();
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  //获取用户信息
  queryUserInfo:function() {
    wx.request({
      url: 'http://localhost:8088/user/userInfo',
      data: {
          "openId": wx.getStorageSync('openId')
      },
      header: {
          'content-type': 'application/json'
      },
      success: function (res) {
          if(res.data.sta == 1){
            wx.setStorageSync('userinfo', res.data.obj)
          }
      }
    });
  },

  //显示错误信息
  showError: function(msg, callback) {
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success: function(res) {
        // callback && (setTimeout(function() {
        //   callback();
        // }, 1500));
        callback && callback();
      }
    });
  },
  
})