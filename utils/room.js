class Rooms {
    constructor(){
        this.rooms = [];
    }

    addRoom(name, owner){
        const room = { name, owner, members: [] };
        this.rooms.push(room);
       // console.log(this.rooms)
        return room;
    }

    removeRoom(name){
        const room = this.getRoom(name);
        if(room){
            this.rooms = this.rooms.filter(room => room.name !== name)
        }
        return room;
    }

    getRoom(name){
        const room = this.rooms.find(room => room.name === name);
        //console.log(this.rooms);
       // console.log({name, room})
        return room;
    }

    getRoomList(){
        const roomList = [];
        this.rooms.map(room => roomList.push({name: room.name, owner: room.owner}));
        return roomList;
    }

    addMemberToRoom(name, id){
        const currentRoom = this.rooms.find(room => room.name === name);
        if(currentRoom){
            const isExist = currentRoom.members.includes(id);
            !isExist && currentRoom.members.push(id);
        }   
    }

    removeMemberFromRoom(name, id){
        const currentRoom = this.rooms.find(room => room.name === name);
        if(currentRoom){
            const isExist = currentRoom.members.includes(id);
           if(isExist){
            this.members = currentRoom.members.filter(member => member !== id);
           } 
        }  
    }

    getMembersofRoom(name){
        const currentRoom = this.rooms.find(room => room.name === name);
        if(currentRoom){
            return currentRoom.members;
        }
    }
}

module.exports = { Rooms };