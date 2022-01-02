var app = getApp()
const db=wx.cloud.database();
wx.cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: "cloud1-3ghxind9e5d846ae",
  traceUser:true
})
function formateTime(time) {
  const d = parseInt(time / 86400)
  const h = parseInt((time / 3600) % 24) 
  const minute = parseInt(time / 60 % 60)
  const second = Math.ceil(time % 60)    
  const hours = h < 10 ? '0' + h : h
  const formatSecond = second > 59 ? 59 : second
  return `${d}d:${hours}h:${minute < 10 ? '0' + minute : minute}m:${formatSecond < 10 ? '0' + formatSecond : formatSecond}s`
}
Page({
  data: {
    inputusername:'', 
    nickName:'',
    userInfo: {},
    logged: false,
    hasUserInfo: false,
    disabled:true,
    newbee:0,
    user: {
    },
  },
  onShow: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.root + "wx/" + app.globalData.openid + ".do",
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ user: res.data });
        app.userInfo = Object.assign(app.userInfo,res.data[0]);
        app.bind =app.userInfo.bind;
      }
    });
  },
  unbind(){
    this.setData({
      logged:false
    })
    db.collection('userinfo').doc(app.userInfo._id).update(
      {
        data:{
          bind: false
        }
      }
    )
    setTimeout(function () {
      if (getCurrentPages().length != 0) {
        //刷新当前页面的数据
        getCurrentPages()[getCurrentPages().length - 1].onLoad()
      }
    }, 1000);
  },
  handleusername(e){
    let temp = e.detail.value;
    this.setData(
      {
        inputusername:temp
      }
    )
    this.setData
  }, 
  onLoad:function() {
    this.refresh()
  },
  bind_to_osu(){
    if(this.inputusername == ''){
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 2000//持续的时间
      })
    } 
    else{
      var that = this;
      wx.request({
        url: 'https://osu.ppy.sh/api/get_user', 
        method: 'GEt',
        data: {
          k: '10b64105b92ee6045e54b99fb96d4c0f1d9515ba',
          u: this.data.inputusername,
        },
        headers:{
          'content-type': 'application/json; charset=utf-8',
        },
        success: function (res) {
          if(Object.prototype.isPrototypeOf(res.data) && Object.keys(res.data).length === 0){
            wx.showToast({
              title: '未查询到用户',
              icon: 'none',
              duration: 2000//持续的时间
            })
            return
          }
          db.collection('userinfo').doc(app.userInfo._id).update(
            {
              data:{
                bind: true,
                name: res.data[0].username,
                ranked_total_points: res.data[0].ranked_score,
                accuracy: res.data[0].accuracy,
                play_times: res.data[0].playcount,
                total_points: res.data[0].total_score,
                pp_raw: res.data[0].pp_raw,
                level: res.data[0].level,
                play_length: formateTime(res.data[0].total_seconds_played) 
              }
            }
          )
        }
      })
      setTimeout(function () {
        if (getCurrentPages().length != 0) {
          //刷新当前页面的数据
          getCurrentPages()[getCurrentPages().length - 1].onLoad()
        }
      }, 1000);
      this.refresh();
    }
  },
  updateinfo(){
    var that = this;
    wx.request({
      url: 'https://osu.ppy.sh/api/get_user', 
      method: 'GEt',
      data: {
        k: '10b64105b92ee6045e54b99fb96d4c0f1d9515ba',
        u: this.data.user[0].name,
      },
      headers:{
        'content-type': 'application/json; charset=utf-8',
      },
      success: function (res) {
        db.collection('userinfo').doc(app.userInfo._id).update(
          {
            data:{
              bind: true,
              name: res.data[0].username,
              ranked_total_points: res.data[0].ranked_score,
              accuracy: res.data[0].accuracy,
              play_times: res.data[0].playcount,
              total_points: res.data[0].total_score,
              pp_raw: res.data[0].pp_raw,
              level: res.data[0].level,
              play_length: formateTime(res.data[0].total_seconds_played) 
            }
          }
        )
      }
    })
    this.refresh();
  },
  refresh(){
    db.collection('userinfo').where({_id:app.userInfo._id}).get().then(res=>{
      this.setData({
        user : res.data
      })
    })
    this.onShow();
  },
  started(){
    wx.cloud.callFunction({
      name:'login',
      data:{}
    }).then((res)=>{
      db.collection('userinfo').where({
        _openid: res.result.openid
      }).get().then(res=>{
          if(res.data.length){
            app.userInfo = Object.assign(app.userInfo,res.data[0]);
            app.bind = app.userInfo.bind;
            this.setData({
              userInfo: app.userInfo,
              logged: true,
              isbind: false,
            });
          }
          else{
            this.setData({
              disabled:false,
            });
          }
        })
      })
      this.onShow();
  },
  getUserProfile(e) {
    var that = this;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          logged: true,
        }),
        db.collection('userinfo').add({
          data:{
            avatarUrl:this.data.userInfo.avatarUrl,
            nickName:this.data.userInfo.nickName,
            bind:0,
          },
          success: function(res) {
            wx.setStorageSync('id', res._id)
            that.setData({
              myid: res._id
            });
          }
        })
      }
    })
    this.started();
  },
  onReady: function(){
    wx.cloud.callFunction({
      name:'login',
      data:{}
    }).then((res)=>{
      db.collection('userinfo').where({
        _openid: res.result.openid
      }).get().then(res=>{
          if(res.data.length){
            app.userInfo = Object.assign(app.userInfo,res.data[0]);
            app.bind = app.userInfo.bind;
            this.setData({
              userInfo: app.userInfo,
              logged: true
            });
            app.logged = true;
          }
          else{
            this.setData({
              disabled:false,
            });
          }
        })
      })
  },
  onShow: function(){
    wx.cloud.callFunction({
      name:'login',
      data:{}
    }).then((res)=>{
      db.collection('userinfo').where({
        _openid: res.result.openid
      }).get().then(res=>{
          if(res.data.length){
            app.userInfo = Object.assign(app.userInfo,res.data[0]);
            app.bind = app.userInfo.bind;
            this.setData({
              userInfo: app.userInfo,
              logged: true
            });
            app.logged = true;
          }
          else{
            this.setData({
              disabled:false,
            });
          }
        })
      })
      this.setData({
        newbee:0,
      })
  },
  onHide: function(){
    wx.cloud.callFunction({
      name:'login',
      data:{}
    }).then((res)=>{
      db.collection('userinfo').where({
        _openid: res.result.openid
      }).get().then(res=>{
          if(res.data.length){
            app.userInfo = Object.assign(app.userInfo,res.data[0]);
            app.bind = app.userInfo.bind;
            this.setData({
              userInfo: app.userInfo,
              logged: true
            });
            app.logged = true;
          }
          else{
            this.setData({
              disabled:false,
            });
          }
        })
      })
  },
})