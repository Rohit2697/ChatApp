const socket = io()

// socket.on('countUpdated', (count)=>{
//     console.log('Count= ',count)
// })

// document.getElementById('countUpdate').addEventListener('click', ()=>{

//     socket.emit('increment')

// })

const sendMsgBtn = document.querySelector('#sendMsg')
const sendLocationBtn = document.querySelector('#sendLocation')
const msgBox = document.querySelector('#messageinput')
const msg = document.getElementById('message');
const msgBody = document.querySelector('#message-body').innerHTML
const locationBody = document.querySelector('#location-body').innerHTML
const userListBody = document.querySelector('#roomlist').innerHTML;
const sideBar = document.querySelector('#sidebar');


socket.on('serverMsg', (generatedMessage) => {

    const html = Mustache.render(msgBody, {
        username: generatedMessage.username,
        message: generatedMessage.text,
        createdAt: moment(generatedMessage.createdAt).format('h:mm a')
    })

    msg.insertAdjacentHTML('beforeend', html)

})

//Option
const { username, room } = (Qs.parse(location.search, { ignoreQueryPrefix: true }))


socket.emit('join', ({ username, room }), (error) => {
    if (error) {
        alert(error);
        location.href = "/"
    }
});

socket.on("activeUsers", (room, { error, userList }) => {

    const html = Mustache.render(userListBody, {
        roomName: room,
        users: userList
    })
    console.log(html)
    sideBar.innerHTML = html;
})
socket.on('locationFromServer', (generatedLocation) => {

    const html = Mustache.render(locationBody, {
        username: generatedLocation.username,
        location: generatedLocation.text,
        createdAt: moment(generatedLocation.createdAt).format('h:mm a')
    })

    msg.insertAdjacentHTML('beforeend', html)
    //console.log(msg)
})



sendMsgBtn
    .addEventListener('click', (e) => {
        e.preventDefault()
        sendMsgBtn.setAttribute('disabled', 'disabled')
        const msg = msgBox.value

        socket.emit('sendMessage', msg, () => {
            console.log('Message Deliverd!')
            sendMsgBtn.removeAttribute('disabled')
            msgBox.value = ""
            msgBox.focus()
        })

    })

sendLocationBtn.addEventListener('click', (e) => {

    e.preventDefault();
    if (!navigator.geolocation) return alert('No Geo Location available!')
    sendLocationBtn.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {

        const newLocation = "https://google.com/maps?q=" + position.coords.latitude + "," + position.coords.longitude

        socket.emit('sendLocation', newLocation, () => {
            console.log("Location shared")
            sendLocationBtn.removeAttribute('disabled')
        })
    })

})


