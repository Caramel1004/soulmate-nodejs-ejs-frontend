import express from 'express';
import bodyParser from 'body-parser';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import clientRoutes from './routes/client.js'

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));



app.use('/client', clientRoutes);

app.listen(3000, () => console.log('Client view!!!'));