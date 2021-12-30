var app = getApp()
const db=wx.cloud.database();
function formateTime(time) {
  const d = parseInt(time / 86400)
  const h = parseInt((time / 3600) % 24) 
  const minute = parseInt(time / 60 % 60)
  const second = Math.ceil(time % 60)    
  const hours = h < 10 ? '0' + h : h
  const formatSecond = second > 59 ? 59 : second
  return `${d}d${hours}h:${minute < 10 ? '0' + minute : minute}m:${formatSecond < 10 ? '0' + formatSecond : formatSecond}s`
}
Page({
  data: {
    inputusername:'', 
    nickName:'',
    userInfo: {},
    logged: false,
    hasUserInfo: false,
    disabled:true,
    user: {
    },
  },
  onShow: function (options) {
    console.log()
    var that = this;
    wx.request({
      url: app.globalData.root + "wx/" + app.globalData.openid + ".do",
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ user: res.data });
      }
    });
  },
  handleusername(e){
    let temp = e.detail.value;
    this.setData(
      {
        inputusername:temp
      }
    )
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
    }
  },
  refresh(){
    let temp 
    db.collection('userinfo').where({_id:app.userInfo._id}).get().then(res=>{
      this.setData({
        user : res.data
      })
    })
    console.log(this.data.user)
  },
  getUserProfile(e) {
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
          },
          success: function(res) {
            console.log(res)
          }
        })
      }
    })
  },
  onReady: function(){
    wx.cloud.callFunction({
      name:'login',
      data:{}
    }).then((res)=>{
      console.log(res)
      db.collection('userinfo').where({
        _openid: res.result.openid
      }).get().then(res=>{
          if(res.data.length){
            app.userInfo = Object.assign(app.userInfo,res.data[0]);
            console.log(app.userInfo);
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
  },
})