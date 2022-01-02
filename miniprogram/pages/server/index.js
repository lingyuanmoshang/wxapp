// pages/server/index.js
const app = getApp();
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oname:'',
    beatmapid:'',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    isbind:false,
    iconList: [{
      icon: 'icon-osuyouxi',
      color: 'red',
      badge: 0,
      name: '最近游玩',
      flag:1
    }, {
      icon: 'icon-osuhe_39shijuanguanli',
      color: 'orange',
      badge: 0,
      name: '最好成绩',
      flag:2
    }, 
  ],
    gridCol:2,
    skin: false
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  fun1(){
    var r = /^\d+$/;
    if(Object.prototype.isPrototypeOf(app.userInfo) && Object.keys(app.userInfo).length === 0){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return
    }
    db.collection('userinfo').doc(app.userInfo._id).field({
      bind:true
    }).get().then(res => {
      this.setData({
        isbind:res.data.bind
      })
    })
    if(!this.data.isbind){
      wx.showToast({
        title: '未绑定OSU用户',
        icon: 'none',
        duration: 2000//持续的时间
      })
    }
    else{
      wx.request({
        url: 'https://osu.ppy.sh/api/get_user_recent', 
        method: 'GEt',
        data: {
          k: '10b64105b92ee6045e54b99fb96d4c0f1d9515ba',
          u: app.userInfo.name
        },
        headers:{
          'content-type': 'application/json; charset=utf-8',
        },
        success: function (res) {
          if(res.data.length === 0){
            wx.showToast({
              title: '未查询到指定信息',
              icon: 'none',
              duration: 2000//持续的时间
            })
            return
          }
          app.playrecord = Object.assign(app.playrecord,res.data[0]);
        }
      })
      setTimeout(function () {
        wx.request({
          url: 'https://osu.ppy.sh/api/get_beatmaps', 
          method: 'GEt',
          data: {
            k: '10b64105b92ee6045e54b99fb96d4c0f1d9515ba',
            b: app.playrecord.beatmap_id,
          },
          headers:{
            'content-type': 'application/json; charset=utf-8',
          },
          success: function (res) {
            if(Object.prototype.isPrototypeOf(res.data) && Object.keys(res.data).length === 0){
              wx.showToast({
                title: '未查询到指定信息',
                icon: 'none',
                duration: 2000//持续的时间
              })
              return
            }
            app.mapinfo = Object.assign(app.playrecord,res.data[0]);
            wx.navigateTo({
              url: '../information/information',
            })
          }
        })
      }, 1000);
      
    }
  },
  fun2(){
    var r = /^\d+$/;
    if((Object.prototype.isPrototypeOf(app.userInfo) && Object.keys(app.userInfo).length === 0) || !app.logged){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return
    }
    db.collection('userinfo').doc(app.userInfo._id).field({
      bind:true
    }).get().then(res => {
      this.setData({
        isbind:res.data.bind
      })
    })
    if(!this.data.isbind){
      wx.showToast({
        title: '未绑定OSU用户',
        icon: 'none',
        duration: 2000//持续的时间
      })
    }
    else{
      wx.request({
        url: 'https://osu.ppy.sh/api/get_user_best', 
        method: 'GEt',
        data: {
          k: '10b64105b92ee6045e54b99fb96d4c0f1d9515ba',
          u: app.userInfo.name
        },
        headers:{
          'content-type': 'application/json; charset=utf-8',
        },
        success: function (res) {
          if(res.data.length === 0){
            wx.showToast({
              title: '未查询到指定信息',
              icon: 'none',
              duration: 2000//持续的时间
            })
            return
          }
          app.playrecord = Object.assign(app.playrecord,res.data[0]);
        }
      })
      setTimeout(function () {
        wx.request({
          url: 'https://osu.ppy.sh/api/get_beatmaps', 
          method: 'GEt',
          data: {
            k: '10b64105b92ee6045e54b99fb96d4c0f1d9515ba',
            b: app.playrecord.beatmap_id,
          },
          headers:{
            'content-type': 'application/json; charset=utf-8',
          },
          success: function (res) {
            if(Object.prototype.isPrototypeOf(res.data) && Object.keys(res.data).length === 0){
              wx.showToast({
                title: '未查询到指定信息',
                icon: 'none',
                duration: 2000//持续的时间
              })
              return
            }
            app.mapinfo = Object.assign(app.playrecord,res.data[0]);
            wx.navigateTo({
              url: '../information/information',
            })
          }
        })
      }, 2000);
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  gridchange: function (e) {
    this.setData({
      gridCol: e.detail.value
    });
  },
  gridswitch: function (e) {
    this.setData({
      gridBorder: e.detail.value
    });
  },
  menuBorder: function (e) {
    this.setData({
      menuBorder: e.detail.value
    });
  },
  menuArrow: function (e) {
    this.setData({
      menuArrow: e.detail.value
    });
  },
  menuCard: function (e) {
    this.setData({
      menuCard: e.detail.value
    });
  },
  switchSex: function (e) {
    this.setData({
      skin: e.detail.value
    });
  },
  handlebeatmapid(e){
    let temp = e.detail.value;
    this.setData({
      beatmapid:temp,
    })
  },
  playrecord(){
    var r = /^\d+$/;　　
    if((Object.prototype.isPrototypeOf(app.userInfo) && Object.keys(app.userInfo).length === 0) || !app.logged){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return
    }
    db.collection('userinfo').doc(app.userInfo._id).field({
      bind:true
    }).get().then(res => {
      this.setData({
        isbind:res.data.bind
      })
    })
    if(!this.data.isbind){
      wx.showToast({
        title: '未绑定OSU用户',
        icon: 'none',
        duration: 2000//持续的时间
      })
    }
    else if(this.data.beatmapid == ''){
      wx.showToast({
        title: '输入信息不能为空',
        icon: 'none',
        duration: 2000//持续的时间
      })
    }else if(!r.test(this.data.beatmapid)){
      wx.showToast({
        title: '输入信息只能为数字',
        icon: 'none',
        duration: 2000//持续的时间
      })
    }else{
      wx.request({
        url: 'https://osu.ppy.sh/api/get_beatmaps', 
        method: 'GEt',
        data: {
          k: '10b64105b92ee6045e54b99fb96d4c0f1d9515ba',
          b: this.data.beatmapid,
        },
        headers:{
          'content-type': 'application/json; charset=utf-8',
        },
        success: function (res) {
          if(Object.prototype.isPrototypeOf(res.data) && Object.keys(res.data).length === 0){
            wx.showToast({
              title: '未查询到指定信息',
              icon: 'none',
              duration: 2000//持续的时间
            })
            return
          }
          app.mapinfo = Object.assign(app.mapinfo,res.data[0]);
        }
      })
      wx.request({
        url: 'https://osu.ppy.sh/api/get_scores', 
        method: 'GEt',
        data: {
          k: '10b64105b92ee6045e54b99fb96d4c0f1d9515ba',
          b: this.data.beatmapid,
          u: app.userInfo.name
        },
        headers:{
          'content-type': 'application/json; charset=utf-8',
        },
        success: function (res) {
          if(Object.prototype.isPrototypeOf(res.data) && Object.keys(res.data).length === 0){
            wx.showToast({
              title: '未查询到指定信息',
              icon: 'none',
              duration: 2000//持续的时间
            })
          }
          app.playrecord = Object.assign(app.playrecord,res.data[0]);
          wx.navigateTo({
            url: '../information/information',
          })
        }
       })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      isbind:app.bind
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('1+',app)
    this.setData({
      isbind:app.bind
    })
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
    this.setData({
      isbind:app.bind
    })
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