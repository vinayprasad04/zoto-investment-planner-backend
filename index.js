const express = require('express')
const cors = require('cors')
const { dataBaseConnectivity } = require('./db/dataBaseConnectivity')
const { authenticationMiddleware } = require('./middleware/authentication')
const { errorHandler } = require('./middleware/error-handler')
const { notFoundMiddleware } = require('./middleware/not-found')
const app = express()
require('dotenv').config()



//appuse
app.use(cors())
app.use(express.json())
app.use('/zoto-investment-planner/api/v1',require('./router/authRouter'))
app.use('/zoto-investment-planner/api/v1',authenticationMiddleware,require('./router/account'))
app.all('*',notFoundMiddleware)
app.use(errorHandler)





const Start = async () => {
    try {
        await dataBaseConnectivity(process.env.DATABASE_CONNECTION_URL)
        app.listen(4000, () => {
            console.log('connect...')
        })
    } catch (err) {
        console.log('...not connect')
    }
}
Start()