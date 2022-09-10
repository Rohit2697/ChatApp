const express = require('express');
const path = require('path')
const app = express();
const http = require('http');
const socketio = require('socket.io');
const {
    adduser,
    removeUser,
    getUser,
    getUserInRoom
} = require("./utils/users")
const port = process.env.PORT || 3000;
const { generateMessage, generateLocation } = require('./utils/message')
const staticPath = path.join(__dirname, '../public')
app.use(express.static(staticPath));
app.use(express.json())

const server = http.createServer(app);

const io = socketio(server);
//let count = 0;
// io.on('connection', (socket) => {
//     console.log('connection Established')
//     socket.emit('countUpdated', count)

//     socket.on('increment', () => {
//         count++;
//         io.emit('countUpdated', count)
//     })

// })
const welcomeMessage = "Hi There ! What's UP!!!"
io.on('connection', (socket) => {



    //receive msg from the client side
    // socket.emit('serverMsg', generateMessage("Admin",welcomeMessage))

    //socket.broadcast.emit('serverMsg', generateMessage('a new user has Joined!'))

    socket.on('sendMessage', (msg, callback) => {
        const { error, user } = getUser(socket.id)
        if (error) return console.log(error)
        io.to(user.room).emit('serverMsg', generateMessage(user.username, msg))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        const { error, user } = getUser(socket.id)
        if (error) return console.log(error)

        io.to(user.room).emit('locationFromServer', generateLocation(user.username, location))
        callback()
    })

    socket.on('join', (Option, callback) => {

        const { error, user } = adduser({ id: socket.id, ...Option })

        if (error) return callback(error);

        socket.join(user.room);
        socket.emit('serverMsg', generateMessage("Admin", welcomeMessage))
        socket.broadcast.to(user.room).emit('serverMsg', generateMessage(user.username, `${user.username}, has joined the Room!`))
        io.to(user.room).emit('activeUsers', user.room, getUserInRoom(user.room))
    })



    socket.on('disconnect', () => {
        const { error, user } = removeUser(socket.id);
        if (error) return console.log(error)
        io.to(user.room).emit('serverMsg', generateMessage("Admin", `${user.username} has left!`))
        io.to(user.room).emit('activeUsers', user.room, getUserInRoom(user.room))
    })


})


server.listen(port, () => {
    console.log("running ", port)
})




