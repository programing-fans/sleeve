import {promisic} from "./util";

const getWindowSize = async function () {
    const res = await promisic(wx.getSystemInfo)()
    return {
        windowHeight: res.windowHeight,
        windowWidth:res.windowWidth,
        screenWidth: res.screenWidth,
        screenHeight: res.screenHeight,
        pixelRatio: res.pixelRatio
    }
}

const getWindowHeightRpx = async function () {
    const res = await getWindowSize()
    const rate = 750 / res.screenWidth
    return res.windowHeight * rate
};

const getWindowHeightLeft = async function (existed) {
    return await getWindowHeightRpx() - existed
}

export {
    getWindowSize,
    getWindowHeightRpx,
    getWindowHeightLeft
}
