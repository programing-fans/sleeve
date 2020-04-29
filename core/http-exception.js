class HttpException extends Error{
    errorCode = 999
    statusCode = 500
    message = ''

    constructor(errorCode, msg, statusCode) {
        super()
        this.message = msg;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}

export {
    HttpException
}
