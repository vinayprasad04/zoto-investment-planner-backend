module.exports.errorHandler=(err,req,res,next)=>{
    res.status(err.statusCode).json({
        status:err.status || 'fail',
        message:err.message
    })
}