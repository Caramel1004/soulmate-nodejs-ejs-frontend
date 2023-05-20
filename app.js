import express from 'express';
import bodyParser from 'body-parser';
import { io } from 'socket.io-client';

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


app.use((req, res, next) => {
    const socket = io('http://localhost:8080', {
        path: '/socket.io'
    });
    console.log('socket: ', socket);
    console.log('클라이언트 소켓 가동 중!!!');

    socket.emit('loadChat', socketData => {
        console.log('socketData: ', socketData);
    })

    socket.emit('sendChat', data => {
        console.log('socketData: ', socketData);
    })
    socket.emit('connection', data => {
        console.log('data: ', data);
    })
});

app.listen(3000, () => console.log('클라이언트 접속!!'));



