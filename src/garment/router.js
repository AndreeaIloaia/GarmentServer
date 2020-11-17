import Router from 'koa-router';
import garmentStore from './store'

const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

export const router = new Router();

const createGarment = async (ctx, garment, response) => {
    try {
        response.body = await garmentStore.insert(garment);
        response.status = 201;
    } catch (err) {
        response.body = { message : err.message };
        response.status = 400;
    }
};

router.get('/', async (ctx) => {
    const response = ctx.response;
    // ctx.body = 'Merge';
    response.body = await garmentStore.find({});
});

router.get('/:id', async (ctx) => {
    const garment = await garmentStore.findOne({ id: ctx.params.id });
    const response = ctx.response;
    if (garment) {
        response.body = garment;
        response.status = 200; // ok
    } else {
        response.status = 404; // not found
    }
});

router.post('/', async ctx => await createGarment(ctx, ctx.request.body, ctx.response));

router.put('/:id', async (ctx) => {
    const garment = ctx.request.body;
    const id = ctx.params.id;
    const updId = garment.id;
    const response = ctx.response;
    if(updId && updId !== id) {
        response.body = { message: 'Param id and body _id should be the same' };
        response.status = 400;
        return;
    }
    if(!updId)
        await createGarment(ctx, garment, response)
    else {
        const updatedCount = await garmentStore.update({id: id }, garment);
        if (updatedCount === 1) {
            response.body = garment;
            response.status = 200;
        } else {
            response.body = { message: 'Resource no longer exists'};
            response.status = 405;
        }
    }
});

router.del('/:id', async (ctx) => {
    const recipe = await garmentStore.findOne({id: ctx.params.id });
    await garmentStore.remove({ id: ctx.params.id });
    ctx.response.status = 204;
});