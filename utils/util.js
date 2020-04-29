const promisic = function (func) {
    return function (params = {}) {
        return new Promise((resolve, reject) => {
            const args = Object.assign(params, {
                success: (res) => {
                    resolve(res)
                },
                fail: (error) => {
                    reject(error)
                }
            })
            func(args)
        })
    }
}

const combination = function (arr, size) {
    var r = []; 

    function _(t, a, n) { 
        if (n === 0) {
            r[r.length] = t;
            return;
        }
        for (var i = 0, l = a.length - n; i <= l; i++) {
            var b = t.slice();
            b.push(a[i]);
            _(b, a.slice(i + 1), n - 1);
        }
    }

    _([], arr, size);
    return r;
}

const tagsSplit = function (tags) {
    if (!tags) {
        return []
    }
    return tags.split('$');
}

Array.prototype.search = function (key, value) {
    const element = this.find(item => item[key] == value)
    return element
}

Array.prototype.setKey = function (key, newValue) {
    const obj = this.find(item => item[key] = newValue)
}


export {
    promisic,
    combination,
    tagsSplit,
}