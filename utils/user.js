class Users{
    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        const user = { id, name, room };
        this.users.push(user);
        return user;
    }

    getUser(id){
        const user = this.users.find(user => user.id === id);
        return user;
    }

    removeUser(id){
        const user = this.getUser(id);
        if(user){
            this.users = this.users.filter(user => user.id !== id)
        }
        return user;
    }

    getUserList(){
        const names = [];
        if(this.users.length !== 0){
            this.users.map(user => names.push(user));
        }
        return names;
    }
}

module.exports = {
    Users
}