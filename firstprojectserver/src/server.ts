import express from 'express';
import routes from './routes';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';

const app = express();
const users = ['Braian','Diego', 'Maikao',"Alo", "porra"];

app.use(cors());
//forma do express verifdicar o que ele ta recebendo no body por post
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname,'..' ,'uploads')));

app.use(errors());
app.listen(3333);