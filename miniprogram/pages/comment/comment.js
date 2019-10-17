// pages/comment/comment.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieid: 0,
    detail: {},
    //用户评论
    value1: '',
    // 电影评分
    value2: 0,
    // 上传前的图片临时路径
    images: [],
    //上传后的图片的fileID
    fileIds: []
  },

  // 功能：
  //1：获取用户评论信息，评分
  //2：上传图片
  //3.将用户评论信息，评分与图片fileID保存云数据库
  contentSubmit: function() {
    // console.log()
    // 1.在云数据库存中创建集合comment，用户评论信息
    //2.再添加属性fileIds:[]  保存文件id
    //3.显示数据加载提示框
    wx.showLoading({
      title: "评论正在发表中..."
    })
    //4：创建数组 rows 保存promise对象
    var rows = [];
    //5:创建循环，遍历每张选中的图片
    for (var i = 0; i < this.data.images.length; i++) {
      // 为每一张图片创建一个promise函数
      rows.push(
        new Promise((resolve, reject) => {
          // 1:获取上传图片后缀
          var suffix = this.data.images[i].slice(-3);
          // 2：创建新文件名
          var newFile=new Date().getTime()+Math.floor(Math.random()*9999)+"."+suffix;
          // 3.上传图片
          wx.cloud.uploadFile({
            //给文件上传后的新名称，但是系统好像不买账
            cloudPath: newFile,
            //选中的图片的临时路径
            filePath: this.data.images[i],
            success: (res => {
              //将上传后的图片fileID放入fileIds保存
              this.data.fileIds.push(res.fileID);
              // 6.7：上传成功后执行 解析
              resolve();
            })
          })  //end uploadFile
         
        })
      )  //end push
    }  //end for
// 功能三：将用户评论信息怀图片fileID保存到云数据库
// 1：创建数据库对象(第二行已创建)
  // 1.1：所有图片上传完成之后，才执行以下代码
  Promise.all(rows).then(res=>{ 
    // console.log(111)
// 2：获取用户评论内容
var content=this.data.value1;
// 3：获取用户评分
    var score = this.data.value2;
// 4：获取当前电影id
    var movieid = this.data.movieid;
// 5:图片云储存的路径
    var fileIds = this.data.fileIds;
// 6:将以上信息添加到集合中
    db.collection("comment")
      .add({
        data: { 
          content: content,
          score: score,
          movieid: movieid,
          fileIds: fileIds
           }
      })
      .then(res => { 
        wx.hideLoading();
      wx.showToast({
        title:"发表成功"
      })
      })
      .catch(err => { })
// 7：添加成功后，隐藏加载提示框
// 8：提示评论成功
    }) 
  },

  //选中图片，并实现预览功能
  uploadFile: function() {
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        const tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths)
        this.setData({
          images: tempFilePaths
        })
        // console.log(this.data.images)
      },
    })
  },
  loadMore: function() {
    // 功能：组件创建成功后调用云函数
    // 1.获取用户选中电影id
    var id = this.data.movieid;
    // 2.显示数据加载提示框
    wx.showLoading({
      title: "正在加载中..."
    })
    // 3.调用云函数findDetail id
    wx.cloud.callFunction({
        name: "findDetail",
        data: {
          id: id
        }
      })
      .then(res => {
        // console.log(res);
        // 4.获取云函数返回数据
        var obj = JSON.parse(res.result);
        // 5.保存 detail:{}
        this.setData({
          detail: obj
        });
        // 6.隐藏加载提示框
        wx.hideLoading();
      })
      .catch(err => {
        console.log(err)
      })

  },
  onScoreChange(event) {
    this.setData({
      value2: event.detail
    });
    // console.log(this.data.value2)
  },
  onContentChange(event) {
    // event.detail 为当前输入的值
    // console.log(event.detail);
    this.setData({
      value1: event.detail
    })
  },

  // findDetail: function () {
  //   //下一页
  //   var pno = this.data.pno + 1;
  //   this.setData({
  //     pno: pno
  //   });
  //   var offset = (pno - 1) * 5;
  //   // console.log(offset);
  //   //调用云函数完成数据加载
  //   // 1：调用云函数
  //   wx.cloud.callFunction({
  //     name: "findDetail",
  //     data: {
  //       id: this.data.movieid
  //     }
  //   })
  //     //返回云函数调用结果
  //     .then(res => {
  //       var rows = JSON.parse(res.result);
  //       // var lists = this.data.list.concat(rows);
  //       // //将返回结果保存到list中
  //       // this.setData({
  //       //   list: lists

  //       // });
  //       console.log(rows);
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options.id)
    this.setData({
      movieid: options.id
    });
    // this.findDetail();
    this.loadMore();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})