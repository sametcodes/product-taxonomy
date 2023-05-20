import { Request, Response } from 'express';
import * as resolvers from './resolvers';
import * as resolversV2 from './v2/resolvers';
import multer from 'multer';
import bodyParser from 'body-parser';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

type Route = {
    path: string,
    method: 'get' | 'post' | 'put' | 'delete',
    middlewares: Array<any>,
    handler: (req: Request, res: Response) => Promise<any> | any | void
}

const routes: Array<Route> = [{
    path: '/category/predict/:platform',
    method: 'post',
    middlewares: [bodyParser.urlencoded(), bodyParser.json()],
    handler: resolvers.queryCategory
}, {
    path: '/category/:platform',
    method: 'post',
    middlewares: [upload.single("file")],
    handler: resolvers.createVectors
}, {
    path: '/category/:platform',
    method: 'delete',
    middlewares: [],
    handler: resolvers.deleteVectors
}, {
    path: '/v2/category/predict/:platform',
    method: 'post',
    middlewares: [bodyParser.urlencoded(), bodyParser.json()],
    handler: resolversV2.queryCategory
}, {
    path: '/v2/category/:platform',
    method: 'post',
    middlewares: [upload.single("file")],
    handler: resolversV2.createVectors
}]

export default routes;