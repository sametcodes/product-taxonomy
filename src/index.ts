import express from 'express';
import { env } from './env';
import routes from './routes';

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://chat.openai.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.use(express.json());

routes.forEach(route => {
    app[route.method](route.path, ...route.middlewares, route.handler)
});

app.use(express.static('static'));


app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
})