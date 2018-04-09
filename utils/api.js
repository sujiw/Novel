import Promise from 'promise.js';
const baseUrl = require('./config.js');

/**
 * 获取分类接口
 */
function gerCats() {
  var url = baseUrl.baseUrl + "/index.php/?g=api&m=book&a=mClass"
    return baseNet(url)
}
/**
 * 书籍详情
 * @param bookId
 * @returns {*}
 */
function bookDetail(bookId) {
  var url = baseUrl.baseUrl + "/index.php/?g=api&m=book&a=book&id=" + bookId
    return baseNet(url)
}

/**
 * 获取书籍目录
 * @param bookId
 * @returns {*}
 */
function getContents(bookId) {
  const url = baseUrl.baseUrl + '/index.php/?g=api&m=book&a=catalog&id=' + bookId
    return baseNet(url)
}

/**
 * 获取书籍列表
 * @param gender
 * @param cate
 * @param start
 * @param limit
 * @returns {*}
 */
function getBookList(types,start) {
    const url = baseUrl.baseUrl + "/index.php/?g=api&m=book&a=index&types=" + types+"&start="+start+"&limit="+25
    return baseNet(url)
}
/**
 * 获取内容
 * @param contents
 * @returns {*}
 */
function getContact(cid,bid) {
  const url = baseUrl.baseUrl + "/index.php/?g=api&m=book&a=cont&bid=" + bid +"&cid=" + cid
    return baseNet(url)
}
/**
 * 搜索内容
 * @param queryName
 * @returns {*}
 */
function searchBook(queryName) {
    //const url = baseUrl.baseUrl+"/book/fuzzy-search?query="+queryName;
    const url = baseUrl.baseUrl +"/index.php/?g=api&m=book&a=search&search="+queryName;
    return baseNet(url);
}
/**
 * 获取热门标签
 * @returns {*}
 */
function getHotWorld() {
    const url = baseUrl.baseUrl +"/index.php/?g=api&m=book&a=hotWords";
    return baseNet(url);
}

function baseNet(url) {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                resolve(res)
                console.log("success")
            },
            fail: function (res) {
                reject(res)
                console.log("failed")
            }
        })
    })
}

module.exports.getCats = gerCats;
module.exports.bookDetail = bookDetail;
module.exports.getContents = getContents;
module.exports.getBookList = getBookList;
module.exports.getContact = getContact;
module.exports.searchBook = searchBook;
module.exports.getHotWorld = getHotWorld;