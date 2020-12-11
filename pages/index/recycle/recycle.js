// pages/index/recycle/recycle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recycle:[],
    tab: 1,
    matter: "",
    items: 0,
    type:[],
    categorys:[ {id: 1, rubbishDetailId: 1, name: "废旧报纸"},
    {id: 2, rubbishDetailId: 1, name: "废旧纸箱"},
    {id: 3, rubbishDetailId: 1, name: "废旧书本"}],
    number: '',
    species:0,
    list:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
      url: 'http://localhost:8088/recycle/price',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        if(res.data.sta === 1){
          _this.setData({
            type:res.data.obj
          })
        }
      }
    })
  },
  // 标签栏点击监听
  changeItem(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({
      tab: tab,
      categorys:[]
    })
    var {categorys} = this.data;
    for(var i = 0;i < this.data.type.length;i++){
      if(this.data.tab == this.data.type[i].rubbishDetailId){
        let {id,rubbishDetailId,name} = this.data.type[i];
        var data = {id,rubbishDetailId,name};
        categorys.push(data);
      }
      this.setData({
        categorys
      })
    }
  },

  // 标签栏点击监听
  changeItems(e) {
    var items = e.currentTarget.dataset.id;
    var matter = e.currentTarget.dataset.matter;
    this.setData({
      items: items,
      matter: matter
    })
  },
  //添加回收
  add:function(){
    var {list} = this.data;
    let that = this;
    var res = list.some(item => {
      // 判断项应为获取的变量
       if(item.name == that.data.matter) {
          return true;
      }
    })
    if(that.data.number == ''){
      wx.showToast({
        title: '请输入回收重（数）量',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if(res){
      for (const j in this.data.list) {
        if (this.data.matter == list[j].name) {
          var n1 = Number(this.data.list[j].number);
          var n2 = Number(this.data.number);
          list[j].number = n1+n2;
          list[j].unitPrice = (Number(list[j].number) * list[j].lowPrice).toFixed(2)
          this.setData({
            list
          })
          this.calculate();
          return;
        }
      }
    } else {
      for(var i = 0;i < this.data.type.length;i++){
        if(this.data.matter == this.data.type[i].name){
          let {id,rubbishDetailId,name,icon,lowPrice} = this.data.type[i];
          let number = this.data.number;
          let unitPrice = (Number(number) * this.data.type[i].lowPrice).toFixed(2);
          var data = {id,rubbishDetailId,name,icon,number,lowPrice,unitPrice};
          list.push(data);
        }
        this.setData({
          list
        })
        this.calculate();
      }
    }
    
  },
  // 计算预计获得人民币
  calculate:function(){
    var {species} = this.data;
    species = 0;
    for(var j = 0;j < this.data.list.length; j++){
      species += this.data.list[j].lowPrice * Number(this.data.list[j].number)
      this.setData({
        species:species.toFixed(2)
      })
    }
  },
  //移除
  delete: function(e){
    var id = e.currentTarget.dataset.id;
    var list = this.data.list;
    var {species} = this.data;
    for(var i = 0;i < list.length;i++){
      species -= Number(list[id].number)*list[id].lowPrice;
      if (id === 0) {
        list.shift();
      } else if (id === list.length-1 ) {
        list.pop();
      } else {
        list.splice(id, 1);
      }
      this.setData({
        list:list,
        species:species.toFixed(2)
      })
    }
  },
  //清空
  empty:function(){
    console.log(this.data.list)
    this.setData({
      list:[],
      species:0
    })
  },
  //input输入监听
  inputedit:function(e){
    let value = e.detail.value;
    var number = value;
    //obj是我们使用data-传递过来的键值对的键
    this.setData({
      number: number
    })
  },
  //跳转到预约回收
  toAppointment:function(){
    if(this.data.list.length > 0){
      var list = JSON.stringify(this.data.list)
      wx.navigateTo({
        url: '/pages/index/recycle/appointment/appointment?price='+this.data.species+'&list='+list,
      })
    } else {
      wx.showToast({
        title: '请选择回收类型及数量',
        icon: 'none',
        duration: 1000
      })
    } 
  },
})