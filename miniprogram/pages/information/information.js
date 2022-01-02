// pages/information/information.js
const app = getApp();
const db=wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    mapinfo:{} ,
    playrecord:{} ,
    accuracy:0,
    played:false,
    imagePath:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userinfo : app.userInfo,
      mapinfo : app.mapinfo,
      playrecord : app.playrecord,
      accuracy : parseFloat(1.0*(parseFloat(app.playrecord.count50)*50+parseFloat(app.playrecord.count100)*100+parseFloat(app.playrecord.count300)*300)/(parseFloat(app.playrecord.countmiss)*300+parseFloat(app.playrecord.count50)*300+parseFloat(app.playrecord.count100)*300+parseFloat(app.playrecord.count300)*300)*100).toFixed(2),
      played:(JSON.stringify(app.playrecord) == "{}")
    })
  },
  sharemyinfo(){
    wx.navigateTo({
      url: '../canvas/canvas',
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
    this.setData({
      userinfo : {},
      mapinfo : {},
      playrecord : {},
      accuracy:0,
      played:false
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      userinfo : {},
      mapinfo : {},
      playrecord : {},
      accuracy:0,
      played:false
    })
    app.mapinfo = {}
    app.playrecord = {}
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