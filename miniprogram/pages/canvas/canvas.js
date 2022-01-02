// pages/canvas/canvas.js
const app = getApp();
const db=wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    accuracy:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      accuracy : parseFloat(1.0*(parseFloat(app.playrecord.count50)*50+parseFloat(app.playrecord.count100)*100+parseFloat(app.playrecord.count300)*300)/(parseFloat(app.playrecord.countmiss)*300+parseFloat(app.playrecord.count50)*300+parseFloat(app.playrecord.count100)*300+parseFloat(app.playrecord.count300)*300)*100).toFixed(2),
    }),
    that.sys();
    that.bginfo();
    setTimeout(function () {
      that.canvasdraw();
    }, 2000);
  },
  sys: function () {
    var that = this;
    wx.getSystemInfo({
     success: function (res) {
      that.setData({
       windowW: res.windowWidth,
       windowH: res.windowHeight
      })
     },
    })
   },
   bginfo: function () {
    var that = this;
    wx.downloadFile({
     url: 'https://636c-cloud1-3ghxind9e5d846ae-1309001593.tcb.qcloud.la/74201667_p0.png?sign=fa63be369e87a7e37ee5a7e59dd07e6f&t=1641120882',
     success: function (res) {
      that.setData({ 
       canvasimgbg: res.tempFilePath
      })
     }
    })
   },
   canvasdraw: function () {
    var that = this;
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    var canvasimgbg = that.data.canvasimgbg;
    let canvas = wx.createCanvasContext('canvas')
    console.log(canvasimgbg)
    canvas.setFillStyle('#000');
    canvas.drawImage(canvasimgbg, 0, 0, windowW, windowH);
    canvas.setFontSize(24)
    canvas.setFillStyle('#000');
    canvas.fillText(app.mapinfo.title,20,35)
    canvas.setFontSize(20)
    canvas.fillText('Artist:',20,70)
    canvas.fillText('Mapper:',20,90)
    canvas.fillText('BID:',20,110)
    canvas.fillText(app.mapinfo.artist,150,70)
    canvas.fillText(app.mapinfo.creator,150,90)
    canvas.fillText(app.mapinfo.beatmap_id,150,110)
    canvas.fillText('BPM:',20,130)
    canvas.fillText('AR:',20,150)
    canvas.fillText('CS:',20,170)
    canvas.fillText('OD:',20,190)
    canvas.fillText('HP:',20,210)
    canvas.fillText('Length:',20,230)
    canvas.fillText('Accuracy:',20,250)
    canvas.fillText('Combo:',20,270)
    canvas.fillText('Combo300:',20,290)
    canvas.fillText('Combo100:',20,310)
    canvas.fillText('Combo50:',20,330)
    canvas.fillText('Combo0:',20,350)
    canvas.fillText('Achievement:',20,370)
    canvas.fillText("Player:",20,390)
    canvas.fillText('played_date:',20,410)
    canvas.fillText('PP',20,430)
    canvas.fillText(app.mapinfo.bpm,150,130)
    canvas.fillText(app.mapinfo.diff_approach,150,150)
    canvas.fillText(app.mapinfo.diff_size,150,170)
    canvas.fillText(app.mapinfo.diff_overall,150,190)
    canvas.fillText(app.mapinfo.diff_drain,150,210)
    canvas.fillText(app.mapinfo.total_length+'s',150,230)
    canvas.fillText(this.data.accuracy+"%",150,250)
    canvas.fillText(app.playrecord.maxcombo+"/"+app.mapinfo.max_combo,150,270)
    canvas.fillText(app.playrecord.count300,150,290)
    canvas.fillText(app.playrecord.count100,150,310)
    canvas.fillText(app.playrecord.count50,150,330)
    canvas.fillText(app.playrecord.countmiss,150,350)
    canvas.fillText(app.playrecord.score,150,370)
    canvas.fillText(app.userInfo.name,150,390)
    canvas.fillText(app.playrecord.date,150,410)
    canvas.fillText(app.playrecord.pp,150,430)
    canvas.draw(true,setTimeout(function(){
     that.daochu()
    },1000));
    // canvas.draw();
   },
   daochu: function () {
    console.log('a');
    var that = this;
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    wx.canvasToTempFilePath({
     x: 0,
     y: 0,
     width: windowW,
     height: windowH,
     destWidth: windowW,
     destHeight: windowH,
     canvasId: 'canvas',
     success: function (res) {
      console.log(res)
      wx.saveImageToPhotosAlbum({
       filePath: res.tempFilePath,
       success(res) {
       }
      })
      wx.previewImage({
       urls: [res.tempFilePath],
      })
     }
    })
   },
   chooseImage: function () {
    var that = this;
    var canvas = wx.createCanvasContext('canvas');
    wx.chooseImage({
     success: function (res) {
      that.setData({
       chooseimg: res.tempFilePaths[0]
      })
      that.canvasdraw(canvas);
     },
    })
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
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})