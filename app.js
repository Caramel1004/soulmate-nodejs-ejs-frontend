import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 } from 'uuid';
import dotenv from 'dotenv';

import session from 'express-session';
import RedisStore from 'connect-redis';

import sockeClient from './socket-client.js';
import redisClient from './util/redis.js';
import errorHandler from './error/error-handler.js';

import authRoutes from './routes/auth.js'
import viewRoutes from './routes/view.js'
import clientRoutes from './routes/client.js'
import { validationResult } from 'express-validator';

dotenv.config();

const app = express();
const socket = sockeClient.init(process.env.BACKEND_API_URL);

// 정적 file처리를 위한 변수
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// 세션 옵션
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET_KEY,
    cookie: {
        httpOnly: true,
        secure: false,
        signed: true
    },
    name: 'sid',
    store: new RedisStore({
        client: redisClient
    })
};

// 템플릿 엔진 세팅
app.set('view engine', 'ejs');
app.set('views', 'views');

// 바디 파서
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 세션
app.use(session(sessionOption));

// 쿠키 파서
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

// 정적 파일 처리
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// 동적 라우트 처리
app.use(viewRoutes);
app.use(authRoutes);
app.use('/client', clientRoutes);

// 오류 처리
app.use(errorHandler);

// 서버 실행
app.listen(3000, () => {
    console.log(`클라이언트 서버 가동!!`);
});

// 레디스 연결
redisClient.connect();