var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var constant = require('../../utils/constant.js')
const app = getApp();
Page({
    data: {
        mrcolor: "#E9FAFF",
        bgcolor: ['#E9FAFF','#F5F5DC', '#CCE8CF', '#D2B48C','#C0C0C0','#000'],
        loading: true,
        loadingContact: false,
        chapter: {},
        selection: [], //段
        contentsIndex: 0,
        scrollHeight: 0,
        scrollTop: 0,
        recordScrollTop: 0,
        bookId: "",
        showBottom: false,
        fontSize: 38
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        const that = this;
        this.setTitle(options.title);
        var fontSize = 39;
        var mrcolor = '#E9FAFF';
        try {
            fontSize = wx.getStorageSync("fontSize");
            mrcolor = wx.getStorageSync("mrcolor");
            if (!fontSize) {
                fontSize = 39;
            }
            if (!mrcolor) {
              mrcolor = '#E9FAFF';
            }
        } catch (e) {
        }
        this.setData({
            contentsIndex: options.contentsIndex,
            bookId: options.bookId,
            scrollTop: options.top,
            recordScrollTop: options.top,
            fontSize:fontSize,
            mrcolor:mrcolor
        });
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight
                })
            }
        });
        if (app.globalData.bookContents) {
            this.processContact();
        } else {
            this.processContents(options.bookId);
        }

    },
    onReady: function () {
        // 页面渲染完成
        util.updateLocalBook(this.data.bookId);
    },
    onShow: function () {

        console.log("======onShow=====")
        if (app.globalData.contentsIndex >= 0) {
            wx.showNavigationBarLoading();
            this.setData({
                contentsIndex: app.globalData.contentsIndex,
                selection: [],
                scrollTop: 0,
                loadingContact: true
            });
            this.processContact();
        }
        app.globalData.contentsIndex = -1;
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
        // 保存信息
        var saveObj = new Object();
        saveObj.contentsIndex = this.data.contentsIndex;
        saveObj.scrollTop = this.data.recordScrollTop;
        const key = this.data.bookId + constant.READER_INFO_KEY;
        util.saveData(key, saveObj);
    },
    onUnload: function () {
        // 页面关闭
        var saveObj = new Object();
        saveObj.contentsIndex = this.data.contentsIndex;
        saveObj.scrollTop = this.data.recordScrollTop;
        const key = this.data.bookId + constant.READER_INFO_KEY;
        util.saveData(key, saveObj);
    },
    scroll: function (e) {
        this.setData({
            recordScrollTop: e.detail.scrollTop
        });
    },
    nextChapter: function (e) {
        wx.showNavigationBarLoading()
        const contentsIndex = ++this.data.contentsIndex;
        this.setData({
            contentsIndex: contentsIndex,
            selection: [],
            scrollTop: 0,
            loadingContact: true
        });
        this.processContact();
    },
    showMenu: function (e) {
        if (this.data.loadingContact) {
            return;
        }
        const showBottom = !this.data.showBottom;
        this.setData({
            showBottom: showBottom
        })
    },
    slider4change: function (e) {
        this.setData({
            fontSize: e.detail.value
        })

        util.saveData("fontSize",e.detail.value);
    },
    chapterOpen: function (e) {
        this.setData({
            showBottom: false
        })
        wx.navigateTo({
            url: "../contents/contents?bookId=" + e.currentTarget.dataset.id + "&from=reader"
        })
    },
    /**
     * 处理目录
     * @param bookId
     */
    processContents: function (bookId) {
        var that = this;
        api.getContents(bookId).then(function (res) {
            app.globalData.bookContents = res.data;
            that.processContact();
        }, function (res) {
            that.setData({
                loading: false
            })
        });
    },
    /**
     * 处理内容
     */
    processContact: function () {
        if (this.data.contentsIndex >= app.globalData.bookContents.chapters.length) {
          var e = new Object();
          var currentTarget = new Object();
          var dataset = new Object();
          dataset.id = this.data.bookId;
          currentTarget.dataset = dataset;
          e.currentTarget = currentTarget;
          this.chapterOpen(e);
          return;
        }
        var that = this;
        const contentsIndex = this.data.contentsIndex;
        const contents = app.globalData.bookContents.chapters;
        api.getContact(contents[contentsIndex].cid, contents[contentsIndex].bid).then(function (res) {
            var body = res.data.chapter.body;
            const data = body.replace(/[ ]*/g, "");
            var selection = data.split("\n");
            that.setData({
                loading: false,
                chapter: res.data.chapter,
                selection: selection,
                loadingContact: false
            });
            that.setTitle(contents[contentsIndex].title)
            wx.hideNavigationBarLoading()
        }, function (res) {
            that.setData({
                loading: false
            })
            wx.hideNavigationBarLoading()
        });
    },
    setColor: function(e){
      const color = e.target.dataset.color;
      // wx.setNavigationBarColor({
      //   frontColor: '#333',
      //   backgroundColor: color,
      // })
      util.saveData("mrcolor", color);
      this.setData({
        mrcolor: color
      });
    },
    setTitle: function (title) {
        wx.setNavigationBarTitle({
            title: title
        })
    },
})