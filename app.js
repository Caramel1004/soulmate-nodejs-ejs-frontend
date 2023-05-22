import express from 'express';
import bodyParser from 'body-parser';
import socketClient from './socket-client.js';

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

//웹 소켓 클라이언트
app.use(socketClient);

app.listen(3000, () => console.log('클라이언트 접속!!'));



