const app = getApp()
// pages/cart/cart.js

/*倒计时开始*/
function countdown(that) {
  let now = Number(that.data.nowTime),
    showPage = Number(that.data.showPage),
    timeList = that.data.timeList,
    allTime = that.data.allTime,
    end = timeList[showPage].end,
    start = timeList[showPage].start
  // console.log(now);
  // console.log(showPage);
  // console.log(timeList);
  // console.log(allTime);
  // console.log(end);
  // console.log(start);
  if (now < start) {
    that.setData({
      saleState: 'wait',
      navState: false
    })
    end = start
    // console.log("未开始")
  } else if (now > start && now < end) {
    that.setData({
      saleState: true
    })
    // end = allTime[showPage + 1]
    // console.log("进行中")
  }else{
    that.setData({
      saleState: false,
      navState: false
    })
    // console.log("已结束")
  }
  if (end == null) {
    that.setData({
      end: that.data.timeList[showPage].end
    })
  }
  var totalSecond = parseInt((end - now)),
  second = totalSecond % 60,
  mintue = parseInt((totalSecond % 3600) / 60),
  hour = parseInt(totalSecond / 3600)
  // console.log(hour, mintue, second , totalSecond)
  if (second < 10) {
    if (second < 0) {
      second = "00"
    } else {
      second = "0" + second
    }
  }
  if (mintue < 10) {
    if (mintue < 0) {
      mintue = "00"
    } else {
      mintue = "0" + mintue
    }
  }
  if (hour < 10) {
    if (hour < 0) {
      hour = "00"
    } else {
      hour = "0" + hour
    }
  }
  var secondTemp = second.toString(),mintueTemp = mintue.toString(), hourTemp = hour.toString(),
  second1 = secondTemp.charAt(0),second2 = secondTemp.charAt(1),
  mintue1 = mintueTemp.charAt(0), mintue2 = mintueTemp.charAt(1),
  hour1 = hourTemp.charAt(0), hour2 = hourTemp.charAt(1)
  if (that.data.second == null) {
    that.setData({
      second1: second1,
      second2: second2,
      mintue1: mintue1,
      mintue2: mintue2,
      hour1: hour1,
      hour2: hour2
    });
  }
  var timer = setTimeout(function () {
    that.setData({
      nowTime: ++now,
      second1: second1,
      second2: second2,
      mintue1: mintue1,
      mintue2: mintue2,
      hour1: hour1,
      hour2: hour2
    });
    countdown(that);
  }, 1000)
}
/*倒计时结束*/

/*监听时间改变活动状态,控制商品访问*/
function timeListener(that){
  let allTime = that.data.allTime,
      timeList = that.data.timeList,
  progress = that.data.progressList,
  // 活动状态列表
  activityState = new Array(5)
  // 0： 即将开始 1： 抢购中 2： 已结束
  setInterval(function(){
    let now = that.data.nowTime
    for (let i = 0, len = allTime.length; i < len ; i++) {
      if (now < timeList[i].start) {
        activityState[i] = 0
      } else if (now > timeList[i].start && now < allTime[i]) {
        activityState[i] = 1
        progress[i].desc = "抢购中"
        that.setData({
          progressList: progress
        })
      } else {
        activityState[i] = 2
        progress[i].desc = "已结束"
        that.setData({
          progressList: progress
        })
      }
      that.setData({
        activityState: activityState
      })
      that.showTime(that)
    }
  },1000)
}
/*监听时间改变活动状态*/

Page({
  data: {
    load: false,
    end: null,
    userInfo: {},
    timeList: [
      { time: "00:00", end: 1493863211359, start: 1493863211359},
      { time: "00:00", end: 1493870411359, start: 1493863211359},
      { time: "00:00", end: 1493877611359, start: 1493863211359},
      { time: "00:00", end: 1493884811359, start: 1493863211359},
      { time: "00:00", end: 1493892011359, start: 1493863211359},
    ],
    progressList: [
      { state: "", desc: "即将开始" },
      { state: "", desc: "即将开始" },
      { state: "", desc: "即将开始" },
      { state: "", desc: "即将开始" },
      { state: "", desc: "即将开始" },
    ],
    activityName: "小丸子秒杀",
    saleState: true,
    showPage: 0,
    selected: 0,
    current: 'tenToTwelve',
    times:1
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '尖品秒杀',
      path: '/pages/activity/activity',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function () {
    let timer_bg = app.globalData.hostname +"Public/img/1.png"
    // 加载动画
    this.setData({
      load: false,
      timer_bg: timer_bg
    })
    // 获取用户信息
    var that = this
    //调用应用实例的方法获取全局数据
    wx.request({
      url: app.globalData.hostname + 'home/Seckill/SeckillList',
      success: function (res) {
        console.log(res)
        console.log(99)
        let goods = res.data.contents,
          goodsList = {
            tenToTwelve: [],
            twelveToFourteen: [],
            fourteenToSixteen: [],
            sixteenToEighteen: [],
            eighteenToTwenty: []
          }
        // 遍历获取不同时段商品
        for (let i = 0, len = res.data.contents.length; i < len; i++) {
          if (Number(goods[i]['10to12']) > 0) {
            goodsList['tenToTwelve'].push(goods[i])
          }
          if (Number(goods[i]['12to14']) > 0) {
            goodsList['twelveToFourteen'].push(goods[i])
          }
          if (Number(goods[i]['14to16']) > 0) {
            goodsList['fourteenToSixteen'].push(goods[i])
          }
          if (Number(goods[i]['16to18']) > 0) {
            goodsList['sixteenToEighteen'].push(goods[i])
          }
          if (Number(goods[i]['18to20']) > 0) {
            goodsList['eighteenToTwenty'].push(goods[i])
          }
        }
        let timeList = that.data.timeList,
        allTime = new Array(6)
        if (res.data.status == 1){
          for (let i = 0, len = timeList.length; i < len; i++) {
            timeList[i].time = res.data.SeckillTime[i]
            timeList[i].end = res.data.time[i]
            timeList[i].start = res.data.starttime[i]
          }
          for (let i = 0, len = res.data.time.length; i < len; i++) {
            allTime[i] = res.data.time[i]
          }
         
          that.setData({
            goodsList: goodsList,
            timeList: timeList,
            allTime: allTime,
            nowTime: res.data.nowTime,
            activityFlag: true
          })
          setTimeout(function () {
            that.setData({
              load: true
            })
          }, 800)
          countdown(that)
          timeListener(that)
          
        }else{
          that.setData({
            activityFlag: false
          })
        }
      }
    })
  },
    //进入秒杀界面自动选择正在秒杀的商品页
  showTime(that){
      var times = that.data.times
      if(times == 1){
        let goodsList = that.data.goodsList,
          activityState2 = that.data.activityState,
          selecteds = that.data.selected
        for (let i in goodsList) {
          for (let j in activityState2) {
            if (activityState2[j] == 1) {
              let index = j
              var goodsIndex = goodsList[index]
              that.setData({
                current: goodsIndex,
                selected: index,
                showPage: index,
                times:2
              })
            }
          }
        }
      }
  },
  showGoods: function (event) {
    setTimeout(function () {
      that.setData({
        load: true
      })
    }, 800)
    this.setData({
      load: false
    })
    let that = this,
    saleState = event.target.dataset.state,
    id = event.target.id,
    goodsList = that.data.goodsList
    var currentName = []
   for(let i in goodsList){
      currentName.push(i)
   }
   let current = currentName[id]
    console.log(current)
    that.setData({ current })
    if (saleState) {
      this.setData({
        saleState: true,
        showPage: id,
        selected: id
      })
    } else {
      this.setData({
        saleState: false,
        showPage: id,
        selected: id
      })
    }
  },
  goodsNav: function(event){
    let goodsId = Number(event.currentTarget.dataset.goodsid),
    index = Number(event.currentTarget.id),
    activityState = this.data.activityState
     // 0： 即将开始 1： 抢购中 2： 已结束
    switch(activityState[index]){
      case 2:
        wx.showToast({
          title: '活动已结束',
          image: '../../images/warn.png'
        })
        break;
      case 1:
        wx.navigateTo({
          url: '../info/info?goodsId='+goodsId+'&activity=true',
        })
        break;
      case 0:
        wx.showToast({
          title: '活动即将开始',
          image: '../../images/warn.png'
        })
        break;
    }
  }
})