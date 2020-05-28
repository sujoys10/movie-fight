const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handler = nextApp.getRequestHandler();

const { Users } = require('./utils/user');
const { Rooms } = require('./utils/room');

let port = process.env.PORT || 3000;
let count = 0;

const users = new Users();
const rooms = new Rooms();

io.on('connection', socket => {
    console.log('connected', Date.now())
    count++;
    io.sockets.emit('user' ,count);

    //Join a room
    socket.on('join', param => {
        
        /*add user to a room*/
        let flag = false;

        //create a new room if room doesn't exist
        if(!rooms.getRoom(param.room)){
            rooms.addRoom(param.room, param.name);
            flag = true;
            io.sockets.emit('roomList', rooms.getRoomList());
        }

        /*add the user */
        users.removeUser(socket.id);
        users.addUser(socket.id, param.name, param.room);
        
        //join the room
        rooms.getMembersofRoom(param.room).length <= 2
        if(rooms.getMembersofRoom(param.room).length <= 2){
            socket.join(param.room, () => {
                rooms.addMemberToRoom(param.room, socket.id);
                //send welcome message
                socket.emit('welcomeMsg', `welcome to room: ${param.room}`);
                //notify other about new member
                socket.broadcast.to(param.room).emit('newMember', param.name)
            })
        }
    })

    /* gamezone */
    
    //listen to movie searching event
    socket.on('searching', () => {
        const user = users.getUser(socket.id);
        socket.broadcast.to(user.room).emit('searching');
    })


    //listen to new movie selection
    socket.on('selectedMovie', movie => {
        const user = users.getUser(socket.id);
        socket.broadcast.to(user.room).emit('selectedMovieByOpponent', movie);
    })

    //rematch
    socket.on('rematch', (name) => {
      //  console.log('rematch: ',  name)
        const user = users.getUser(socket.id);
        socket.broadcast.to(user.room).emit('playAgain', user.name);
    })

    socket.on('rematchAccepted', () => {
      //  console.log('rematchAccepted');
        const user = users.getUser(socket.id);
        socket.broadcast.to(user.room).emit('startRematch');
    })

    socket.on('leaveRoom', () => {
        const user = users.getUser(socket.id);
        //check if the user is owner
        
        //console.log(room, user.name)
        if(user){
            const room = rooms.getRoom(user.room);
            if(room){
                if(room.owner === user.name){
                    const rv = rooms.removeRoom(room.name);
                   // console.log('remove',{rv})
                    //emit updated roomlist
                    
                    io.sockets.emit('roomList', rooms.getRoomList());
                    //emit admin left event
                    socket.broadcast.to(user.room).emit('ownerLeft', user.name);
                }else{
                    rooms.removeMemberFromRoom(user.room, socket.id);
                    //emit user left event
                    socket.broadcast.to(user.room).emit('opponentLeft', user.name);
                }
                socket.leave(user.room);   
            }  
        }
    })

    socket.on('disconnect', () => {
        count -= 1;
        io.sockets.emit('user' ,count);
        console.log('disconnected');
        const user = users.removeUser(socket.id);

        if(user){
            const room = rooms.getRoom(user.room);
            if(room){
                if(room.owner === user.name){
                    rooms.removeRoom(room.name);
                    //emit updated roomlist
                    io.sockets.emit('roomList', rooms.getRoomList());
                    //emit admin left event
                    socket.broadcast.to(user.room).emit('ownerLeft');
                }else{
                    rooms.removeMemberFromRoom(user.room, socket.id);
                    //emit user left event
                    socket.broadcast.to(user.room).emit('opponentLeft');
                }
                socket.leave(user.room);
            }
        }
    })
}) 



nextApp.prepare().then(() => {

    app.get('/online', (req, res) => {
        const online = count;
        res.json(online);
    })
    
    app.get('/roomlist', (req, res) => {
        const roomlist = rooms.getRoomList();
        res.json(roomlist);
    })

    app.get('/home', (req, res) => {
        nextApp.render(req, res, '/home');
    })


    app.get('*', (req, res) => {
        return handler(req, res)
    })

    server.listen(port, err => {
        if(err) throw err;
        console.log(`server is running on port: ${port}`)
    })
})

