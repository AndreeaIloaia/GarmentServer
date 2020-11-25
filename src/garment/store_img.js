import dataStore from 'nedb-promise';

export class ImagesStore {
    constructor({filename, autoload}) {
        this.store = dataStore({filename, autoload});
    }

    async findAll() {
        return this.store.find();
    }

    async find(props) {
        return this.store.find(props);
    }

    async findOne(props) {
        return this.store.findOne(props);
    }

    async insert(garment) {
        let garmentName = garment.name;
        if (!garmentName)
            throw new Error('Missing name property');
        return this.store.insert(garment);
    }

    async update(props, garment) {
        return this.store.update(props, garment);
    }

    async remove(props) {
        return this.store.remove(props);
    }
}

export default new ImagesStore({filename: './database/dataset', autoload: true});