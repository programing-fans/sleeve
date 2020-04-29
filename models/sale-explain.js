import {Http} from "../utils/http";

class SaleExplain{

    static async getFixed() {
        const explains =  await Http.request({
            url:`sale_explain/fixed`
        })
        return explains.map(explain=>{
            return explain.text
        })
    }
}

export {
    SaleExplain
}
