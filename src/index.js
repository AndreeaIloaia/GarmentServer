import Koa from 'koa';
import WebSocket from 'ws';
import http from 'http';
import Router from 'koa-router';
import bodyParser from "koa-bodyparser";
import { timingLogger, exceptionHandler, jwtConfig, initWss, verifyClient } from './utils';
import { router as authRouter } from './auth';
import { router as garmentRouter } from './garment';
import jwt from 'koa-jwt';
import cors from '@koa/cors';

const app = new Koa();
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });

initWss(wss);

app.use(cors());
app.use(timingLogger);
app.use(exceptionHandler);
app.use(bodyParser());

const prefix = '/api';

//public routes
const publicApiRoutes = new Router({ prefix });
publicApiRoutes.use('/auth', authRouter.routes());
app.use(publicApiRoutes.routes())
   .use(publicApiRoutes.allowedMethods());

app.use(jwt(jwtConfig));

//protected routes
const protectedApiRouter = new Router({ prefix });
protectedApiRouter.use('/garment', garmentRouter.routes());
app.use(protectedApiRouter.routes())
    .use(protectedApiRouter.allowedMethods());

server.listen(3000);
console.log('server started on port 3000');