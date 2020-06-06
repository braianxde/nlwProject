import express from 'express';
import {celebrate, Joi} from 'celebrate';

import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';
import multer from 'multer';
import multerConfig from '../src/config/multer';

const routes = express();
const pointsController = new PointsController();
const itemsController = new ItemsController();
const upload = multer(multerConfig)

routes.get('/items', itemsController.index);

routes.post('/points', upload.single('image'), celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        cidade: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required()
    })
}, {abortEarly: false}), pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);



export default routes;

// app.get('/users', (request, response) => {
//     const search = String(request.query.search);

//     const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

//     return response.json(filteredUsers);
// })

// app.get('/users/:id', (request, response) => {
//     const id = Number(request.params.id);
    
//     return response.send(users[id]);
// })

// app.post('/users', (request, response) => {
//     const data = request.body;

//     return response.send(data);
// })