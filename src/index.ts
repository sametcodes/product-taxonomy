import express from 'express';
import { env } from './env';
import routes from './routes';

const app = express();

app.use(express.json());

routes.forEach(route => {
    app[route.method](route.path, ...route.middlewares, route.handler)
})

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
})