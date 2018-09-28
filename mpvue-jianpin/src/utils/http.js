const BASE_URL = 'https://www.meichengvip.com/api/1.0/web'
export function request(params) {
    wx.showToast({
        title: '正在加载',
        mask: true,
        duration: 10000,
        image: '../../images/loading.gif'
    });
    if (params.then && typeof params.then == "function") {
        return new Promise((resolve, reject) => {
            wx.request({
                url: BASE_URL + params.url,
                data: params.data,
                method: params.method,
                success: res => {
                    return resolve(res)
                    // if (res.data.status != 200) {
                    //     if (params.failCallback) {
                    //         params.failCallback(res, resolve, reject);
                    //     } else {
                    //         reject(res);
                    //     }
                    //     return;
                    // }
                    // if (params.success && typeof params.success == "function") {
                    //     params.success(res.data);
                    //     resolve(res);
                    // }
                },
                fail: function (res) {
                    return reject(res);
                }
            });
        })
        // .then((res) => {
        //     wx.hideToast();
        // }, res => {
        //     if (res.data && res.data.status) {
        //         wx.hideToast();
        //     } else {
        //         _failToast(res.data);
        //     }
        // });
    }
}

export function all(argus, then) {
    let shed = [];
    if (argus && argus instanceof Array) {
        argus.forEach(item => {
            if (item && typeof item == "function") {
                shed.push(new Promise((resolve, reject) => {
                    item(resolve);
                }));
            } else if ((item instanceof Object) && (item.url)) {
                shed.push(new Promise((resolve, reject) => {
                    wx.request({
                        url: item.url,
                        data: item.data,
                        success: function (res) {
                            if (res.data && res.data.status != '1') {
                                reject(res);
                                return;
                            }
                            resolve(res.data);
                        },
                        fail: function (res) {
                            reject(res);
                        }
                    });
                }))
            }
        });
    }
    if (then && typeof then == "function") {
        return Promise.all(shed).then(res => {
            return new Promise((resolve, reject) => {
                then(res, resolve);
            }).then(res => {
                wx.hideToast();
            }, res => {
                wx.hideToast();
            });
        });
    } else {
        return Promise.all(shed).then(res => {
            wx.hideToast();
        }, res => {
            wx.hideToast();
        });
    }

}
var _failToast = function (data) {
    if (!data) {
        data = {}
    }
    wx.showToast({
        title: data.msg || '系统繁忙',
        mask: true,
        duration: 1500,
        image: '../../images/loading.gif'
    });
}