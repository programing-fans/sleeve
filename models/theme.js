import {Http} from "../utils/http";

class Theme {
    static locationA = 't-1';
    static locationE = 't-2';

    themes = []
    static locationF = 't-3';
    static locationH = 't-4';

    static forYou = 't-6'

    // 仅请求主题基本信息，不包括SPU
    async getThemes() {
        // 不能换行
        const names = `${Theme.locationA},${Theme.locationE},${Theme.locationF},${Theme.locationH}`
        this.themes = await Http.request({
            url: `theme/by/names?names=${names}`
        })
    }

    static  getForYou() {
        return Http.request({
            url: `theme/name/${this.forYou}/with_spu`
        })
    }

    getHomeLocationA() {
        return this.themes.find(theme => theme.name == Theme.locationA)
    }


    getHomeLocationE() {
        return this.themes.find(theme => theme.name == Theme.locationE)
    }

    getHomeLocationF() {
        return this.themes.find(theme => theme.name == Theme.locationF)
    }


    getHomeLocationH() {
        return this.themes.find(theme => theme.name == Theme.locationH)
    }

    static async getHomeLocationESpuList() {
        return Theme.getThemeSpuByName(Theme.locationE)
        // return await Http.request({
            // url: `spu/by/theme/${Theme.locationE}?start=0&count=10`
        // })
    }

    static async getThemeSpuByName(name) {
        const theme = await Http.request({
            url: `theme/name/${name}/with_spu`
        })
        if(theme){
            return theme
        }
        return null
    }
}

export {
    Theme
}
