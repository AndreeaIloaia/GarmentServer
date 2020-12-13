import Router from 'koa-router';
import garmentStore from './store'
import {broadcast} from "../utils";

// const Koa = require('koa');
// const app = new Koa();
// const server = require('http').createServer(app.callback());
// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ server });

export const router = new Router();

const createGarment = async (ctx, garment, response) => {
    try {
        const userId = ctx.state.user._id;
        garment.userId = userId;
        response.body = await garmentStore.insert(garment);
        response.status = 201;
        broadcast(userId, {type: 'created', payload: garment});
    } catch (err) {
        response.body = {message: err.message};
        response.status = 400;
    }
};

router.get('/', async (ctx) => {
    const response = ctx.response;
    // ctx.body = 'Merge';
    const userId = ctx.state.user._id;
    response.body = await garmentStore.find({userId});
    response.status = 200;
});

router.get('/photo/:nr', async (ctx) => {
    const response = ctx.response;

    let img = {
        "message": [
            "https://images.dog.ceo/breeds/spaniel-japanese/n02085782_313.jpg",
            "https://images.dog.ceo/breeds/clumber/n02101556_3736.jpg",
            "https://images.dog.ceo/breeds/borzoi/n02090622_6851.jpg"
        ],
        "status": "success"
    }
    response.body = img;
    response.status = 200;
});

router.get('/:id', async (ctx) => {
    const userId = ctx.state.user._id;
    const garment = await garmentStore.findOne({_id: ctx.params.id});
    const response = ctx.response;
    if (garment) {
        if (garment.userId === userId) {
            response.body = garment;
            response.status = 200; // ok
        } else {
            response.status = 403;
        }
    } else {
        response.status = 404; // not found
    }
});

router.post('/', async ctx => await createGarment(ctx, ctx.request.body, ctx.response));

router.put('/:id', async (ctx) => {
    const garment = ctx.request.body;
    const id = ctx.params.id;
    const updId = garment._id;
    const response = ctx.response;
    if (updId && updId !== id) {
        response.body = {message: 'Param id and body _id should be the same'};
        response.status = 400;
        return;
    }
    if (!updId)
        await createGarment(ctx, garment, response)
    else {
        const userId = ctx.state.user._id;
        garment.userId = userId;
        const updatedCount = await garmentStore.update({_id: id}, garment);
        if (updatedCount === 1) {
            response.body = garment;
            response.status = 200;
            broadcast(userId, {type: 'updated', payload: garment});
        } else {
            response.body = {message: 'Resource no longer exists'};
            response.status = 405;
        }
    }
});

router.del('/:id', async (ctx) => {
    const userId = ctx.state.user._id;
    const garment = await garmentStore.findOne({_id: ctx.params.id});
    if (garment && userId !== garment.userId)
        ctx.response.status = 403;
    else {
        await garmentStore.remove({_id: ctx.params.id});
        ctx.response.status = 204;
    }
});

