const mongoose = require("mongoose")
const express = require("express")
const app = express()

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//DB Connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex: true
}).then(() => {
    console.log("DB CONNECTED")
}).catch(() => {
    console.log("Unable to connect to DB")
})

//Use parsing middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//Import routes
const userRoutes = require("./routes/user")
const subRoutes = require("./routes/subscribe")
const adminPanelRoutes = require("./routes/adminpanel")
const adminRoutes = require("./routes/adminauth")
const userPanelRoutes = require("./routes/userpanel")
const courseProgressRoutes = require("./routes/courseprogress")
const topicProgressRoutes = require("./routes/topicprogress")

//Using routes
app.use('/user', userRoutes)

app.use('/', subRoutes)

app.use('/adminPanel', adminPanelRoutes)
app.use('/admin', adminRoutes)
app.use('/userPanel', userPanelRoutes)
app.use('/courseProgress', courseProgressRoutes)
app.use('/topicProgress', topicProgressRoutes)



const port =  process.env.PORT || 8002


//Starting the server
app.listen(port, () => {
    console.log(`App is running at ${port}`)
})