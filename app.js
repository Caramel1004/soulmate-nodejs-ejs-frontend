import express from 'express';
import bodyParser from 'body-parser';
import openSocket from 'socket.io-client';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import clientRoutes from './routes/client.js'

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/client', clientRoutes);

app.listen(3000, () => console.log('Client view!!!'));

app.use((req, res, next) => {
    console.log('클라이언트 소켓 가동 중!!!');
    const socket = openSocket('http://localhost:8080/v1/chat');
    socket.on('chat', data => {
        console.log('백엔드에서 넘어온 data: ', data);
    });
})

