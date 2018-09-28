const baseUrl = 'https://media.zjrvip.com/api/2.0/web'
export default function request(params) {
    wx.showToast({
        title: '正在加载',
        mask: true,
        duration: 10000,
        image: 'static/img/loading.gif'
    });

        return new Promise((resolve, reject) => {
            wx.request({
                url: baseUrl + params.url,
                method: params.method,
                data: params.data,
                success: res => {
                    console.log(res)
                    resolve(res.data)
                    // if (res.data && res.data.code === 200) {
                        
                    // }else{
                    //     reject(res.data)
                    // }
                },
                fail: function(res) {
                    reject(res)
                }
            })
        }).then((res) => {
            wx.hideToast();
        }, res => {
            // if (res.data && res.data.status) {
            //     wx.hideToast();
            // } else {
            //     _failToast(res.data);
            // }
        })
    
}

var _failToast = function(data) {
    
    wx.showToast({
        title: data.msg || '系统繁忙',
        mask: true,
        duration: 1500,
        image: 'static/img/loading.gif'
    })
}

