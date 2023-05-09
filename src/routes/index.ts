import { Request, Response } from 'express';
import { queryCategory, createVectors } from './resolvers';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

type Route = {
    path: string,
    method: 'get' | 'post' | 'put' | 'delete',
    middlewares: Array<any>,
    handler: (req: Request, res: Response) => Promise<any> | any | void
}

const routes: Array<Route> = [{
    path: '/category/:platform',
    method: 'get',
    middlewares: [],
    handler: queryCategory
}, {
    path: '/category/:platform',
    method: 'post',
    middlewares: [upload.single("file")],
    handler: createVectors
}]

export default routes;