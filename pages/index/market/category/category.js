Page({
  data:{
     pres: [
     {    id:"0",
       preX: "书籍"   },
     {    id: "1",
       preX: "衣物"   },
     {    id: "2",
       preX: "数码"   },
      {    id: "3",      
        preX: "家电"  },
      {   id: "4",
        preX: "个护彩妆"  },
      {   id: "5",
        preX: "饰品"  },
      {   id: "6",
        preX: "其他"  },
   ],
   goods:[
     { id: 0, name: "教育", url:"/images/novel.png"},
     { id: 1, name: "小说", url:"/images/novel.png"},
     { id: 2, name: "文艺", url:"/images/novel.png"},
     { id: 3, name: "童书", url:"/images/novel.png"},
     { id: 4, name: "人文社科", url:"/images/novel.png"},
     { id: 5, name: "经管", url:"/images/novel.png"},
     { id: 6, name: "科技", url:"/images/novel.png"},
     { id: 7, name: "生活", url:"/images/novel.png"},
   ],
   id: 0,
  },
 // 单击改变样式
 click: function (e) {
   var ids = e.currentTarget.dataset.id;  //获取自定义的id 
   var good = "";  
   if(ids == 0){
     good = [
      { id: 0, name: "教育", url:"/images/novel.png"},
      { id: 1, name: "小说", url:"/images/novel.png"},
      { id: 2, name: "文艺", url:"/images/novel.png"},
      { id: 3, name: "童书", url:"/images/novel.png"},
      { id: 4, name: "人文社科", url:"/images/novel.png"},
      { id: 5, name: "经管", url:"/images/novel.png"},
      { id: 6, name: "科技", url:"/images/novel.png"},
      { id: 7, name: "生活", url:"/images/novel.png"},
     ];
   } else if (ids == 1){
     good = [
       { id: 0, name: "帽子", url: "/images/affaires.png" },
       { id: 1, name: "上衣", url: "/images/affaires.png" },
       { id: 2, name: "裤子", url: "/images/affaires.png" },
       { id: 3, name: "裙子", url: "/images/affaires.png" },
       { id: 4, name: "鞋子", url: "/images/affaires.png" },
       { id: 5, name: "包包", url: "/images/affaires.png" },
     ];
     } else if (ids == 2) {
     good = [
       { id: 0, name: "手机", url: "/images/paizhao.png" },
       { id: 1, name: "电脑", url: "/images/paizhao.png" },
       { id: 2, name: "数码相机", url: "/images/paizhao.png" },
       { id: 3, name: "电脑", url: "/images/paizhao.png" },

     ]; 
     }else if (ids == 3) {
       good = [
         { id: 0, name: "电视", url: "/images/electric.png" },
         { id: 1, name: "空调", url: "/images/electric.png" },
         { id: 2, name: "冰箱", url: "/images/electric.png" },
         { id: 3, name: "洗衣机", url: "/images/electric.png" },
         { id: 4, name: "饮水机", url: "/images/electric.png" },
         { id: 5, name: "电风扇", url: "/images/electric.png" },
         { id: 6, name: "取暖电器", url: "/images/electric.png" },
         { id: 7, name: "吸尘器", url: "/images/electric.png" },
         { id: 8, name: "豆浆机", url: "/images/electric.png" },
         { id: 9, name: "电饭煲", url: "/images/electric.png" },
         { id: 10, name: "其他", url: "/images/electric.png" },

       ];
   }else if(ids == 4){
     good = [
        { id: 0, name: "护肤套装", url: "/images/cosmetic.png" },
        { id: 1, name: "彩妆", url: "/images/cosmetic.png" },

     ];
   }else if(ids == 5){
     good = [
        { id: 0, name: "装饰摆件", url: "/images/adorn.png" },
        { id: 1, name: "手表", url: "/images/adorn.png" },
        { id: 2, name: "首饰", url: "/images/adorn.png" },

     ];
   }else if(ids == 6){
     good = [
        { id: 0, name: "玩具", url: "/images/music.png" },
        { id: 1, name: "模型", url: "/images/music.png" },
        { id: 2, name: "乐器", url: "/images/music.png" },
        { id: 3, name: "文具用品", url: "/images/music.png" },

     ];
   }
   this.setData({
     id: ids,  //把获取的自定义id赋给当前组件的id(即获取当前组件)  
     goods: good
   })
 },
})