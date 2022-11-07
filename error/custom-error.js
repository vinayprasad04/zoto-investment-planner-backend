class customError extends Error {
    constructor(message, statusCode, status) {
        super(message, statusCode, status)
        this.message = message
        this.statusCode = statusCode
        this.status = status
    }
}

module.exports=customError