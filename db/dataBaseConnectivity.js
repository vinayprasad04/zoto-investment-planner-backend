const mongoose=require('mongoose')

module.exports.dataBaseConnectivity=(url)=>{
   return mongoose.connect(url)
}