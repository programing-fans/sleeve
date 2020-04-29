import {Http} from "../utils/http";

class Categories{
    roots = []
    subs = []

    async getAll() {
        const data = await Http.request({
            url:`category/all`
        })
        this.roots = data.roots
        this.subs = data.subs
    }

    getRoots(){
        return this.roots
    }

    getRoot(rootId) {
        return this.roots.find(r => r.id == rootId);
    }

    getSubs(parentId){
        return this.subs.filter(sub=>sub.parent_id == parentId)
    }


    static async  getGridCategories(){
        return await Http.request({
            url:`category/grid/all`
        })
    }

    static  getAllRoots() {
        return Http.request({
            url:`category/roots`
        })
    }

    static getByParentId(parentId) {
        return Http.request({
            url:`category/by/parent/${parentId}`
        })
    }

}

export {
    Categories
}
