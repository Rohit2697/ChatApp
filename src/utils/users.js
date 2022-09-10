const users = [];

//adduser

const adduser = ({ id, username, room }) => {

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //if nothing provided
    if (!username || !room) return { error: 'Username and room is required!', user: undefined }
    //validate if the user aloready present in the same rom

    const existingUser = users.find((user) => {
        if (user.username === username && user.room === room) return user
    })

    if (existingUser) return { error: "user is in use!", user: undefined }

    users.push({
        id, username, room
    })
    return {
        error: undefined,
        user: { id, username, room }
    }
}

//remove user

const removeUser = (id) => {

    const index = users.findIndex((user) => user.id === id)
    if (index == -1) return { error: "user not found!", user: undefined }
    return { error: undefined, user: users.splice(index, 1)[0] }
}

// getUser

const getUser = (id) => {

    const user = users.find(user => user.id === id)
    if (!user) return { error: "user not found!", user: undefined }
    return { error: undefined, user };
}

//getRoom's user

const getUserInRoom = (room) => {
    room = room.trim().toLowerCase();
    const userList = users.filter(user => user.room === room)
    if (!userList.length) return { error: "no users found", userList: undefined }
    return { error: undefined, userList }
}


module.exports = {
    adduser,
    removeUser,
    getUser,
    getUserInRoom
}