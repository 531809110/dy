// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //电影的全部信息保存给list
    list:[],
    //页码
    pno:0
  },
jump:function(event){
  // 1:获取当前电影id
 var id = event.target.dataset.id;
  // 2:跳转comment组件
  // wx.redirectTo({
  //   url:`/pages/comment/comment?id=`+id
  // });
  wx.navigateTo({
    url: `/pages/comment/comment?id=` + id
  });
},
getMovie:function(){
  //下一页
  var pno = this.data.pno+1;
  this.setData({pno:pno});
  var offset=(pno-1)*5;
  // console.log(offset);
  //调用云函数完成数据加载
  // 1：调用云函数
  wx.cloud.callFunction({
    name: "movie",
    data: { start: offset, count: 5 }
  })
  //返回云函数调用结果
    .then(res => { 
      var rows = JSON.parse(res.result).subjects;
      var lists=this.data.list.concat(rows);
      //将返回结果保存到list中
      this.setData({
        list: lists
        
        });
        // console.log(this.data.list[0]);
      })
    .catch(err => { console.log(err) })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovie();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
// console.log(123)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
//加载下一页数据
    this.getMovie();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})