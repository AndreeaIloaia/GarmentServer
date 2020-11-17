import dataSource from 'nedb-promise';

export class UserStore {
    constructor({ filename, autoload }) {
        this.store = dataSource({ filename, autoload })
    }

    async findOne(props) {
        return this.store.findOne(props);
    }

    async insert(user) {
        //TODO
        return this.store.insert(user);
    };
}

export default new UserStore({ filename: './database/users.json', autoload: true })