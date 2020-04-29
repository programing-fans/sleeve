class Matrix {
    data = {}

    constructor(matrix) {
        console.log(matrix)
        this.m = matrix
    }

    get rowsNum() {
        return this.m.length
    }

    get colsNum() {
        return this.m[0].length
    }

    forEach(callback) {
        for (let j = 0; j < this.colsNum; j++) {
            for (let i = 0; i < this.rowsNum; i++) {
                let value = this.m[i][j]
                let index = [i, j]
                callback(value, i, j)
            }
        }
    }
}

export {
    Matrix
}

