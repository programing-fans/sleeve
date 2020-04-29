import {Http} from "./http";

class Paging {

    start = 0
    count = 10
    moreData = true
    req = null
    requestUrl = ''
    accumulator = []
    locker = false

    constructor(req, start, count) {
        this.start = start ? start : 0
        this.count = count ? count : 10
        this.requestUrl = req.url
        this.req = req
    }

    _getCurrentReq() {
        let url = this.requestUrl
        const params = `start=${this.start}&count=${this.count}`
        if (url.indexOf('?') != -1) {
            url += '&' + params
        } else {
            url += '?' + params
        }
        this.req.url = url
        return this.req
    }

    async getMoreData() {
        // 服务器异常需要返回给业务来处理
        if (!this.moreData) {
            // 没有更多数据时，不再请求服务器
            return {
                empty: false,
                data: [],
                moreData: false,
                accumulator: this.accumulator,
                diff: false
            }
        }
        if (!this._getLocker()) {
            return
        }
        const paging = this._actualGetData()
        this._releaseLocker()
        return paging
    }

    async _actualGetData() {
        const req = this._getCurrentReq()
        let paging = await Http.request(req)
        if (!paging) {
            return null
        }
        if (paging.total === 0) {
            return {
                empty: true,
                data: [],
                moreData: false,
                accumulator: this.accumulator,
                diff: false,
            }
        }
        this.moreData = this._moreData(paging.total_page, paging.page)
        if (this.moreData) {
            this.start += this.count
        }
        this._accumulate(paging)
        return {
            empty: false,
            data: paging.items,
            moreData: this.moreData,
            accumulator: this.accumulator,
            diff: paging.items.length > 0
        }
    }

    _getLocker() {
        if (this.locker) {
            return false
        }
        this.locker = true
        return true
    }

    _releaseLocker() {
        this.locker = false
    }

    _accumulate(paging) {
        this.accumulator = this.accumulator.concat(paging.items)
    }


    _moreData(totalPage, pageNum) {
        return pageNum < totalPage - 1;
    }
}

export {
    Paging
}
