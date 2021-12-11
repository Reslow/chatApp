const path = require('path')
const http = require('http')
const express = require("express")
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {userjoin, getUser, userLeave} = require('./utils/users')

const ejs = require('ejs') 
const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs")

const server = http.createServer(app)
const io = socketio(server)
app.use(express.static(path.join(__dirname,'public' )))

const admin = 'Chat Admin'

app.get("/", (req,res)=> {
    res.render("index")
})

// set static folder

// run when client conncect
io.on('connection', socket => {

    socket.on('joinRoom', ({username})=>{
      const user = userjoin(socket.id , username)
        socket.join(user)
        // welcome current user
    socket.emit('message', formatMessage(admin, `${user.username} welcome to chat`))
    
    //broadcast when user conncects
    socket.broadcast.emit('message', formatMessage(admin,`${user.username} has joined the chat`))

    // userinfo
    io.emit('chatUsers', {
        users:getUser()
    })
})

    // listen for chatmsg
    socket.on('chat', (msg) => {
        const user = getUser(socket.id)
        io.emit('message', formatMessage(user.username, msg))
    } )
    // runs when client disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if(user){
            io.emit('message', formatMessage(admin,`${user.username} has left the building`))
                // userinfo
           io.emit('chatUsers', {
            users:getUser()
    })
        }

    })

})
const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`server running on port ${PORT}`))