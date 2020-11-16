import dataStore from 'nedb-promise';

export class GarmentStore {
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
        var id_random = "" + Math.floor(Math.random() * 1000);
        garment.id = id_random;
        return this.store.insert(garment);
    }

    async update(props, garment) {
        return this.store.update(props, garment);
    }

    async remove(props) {
        return this.store.remove(props);
    }
}

export default new GarmentStore({filename: './database/garments.json', autoload: true});