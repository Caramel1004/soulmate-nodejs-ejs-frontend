import express from 'express';
import bodyParser from 'body-parser';
import socketClient from './socket-client.js';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import clientRoutes from './routes/client.js'
import authRoutes from './routes/auth.js'

const app = express();

// 정적 file처리를 위한 변수
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 템플릿 엔진 세팅
app.set('view engine', 'ejs');
app.set('views', 'views');

// 바디파서
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 정적 파일 처리
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// 동적 라우트 처리
app.use(authRoutes);
app.use('/client', clientRoutes);

// 오류 처리
app.use((error, req, res, next) => {
    console.log('클라이언트 측 에러!! -> ', error);
    const statusCode = (!error.statusCode) ? 500 : error.statusCode;
    const msg = error.message;
    const data = error.data;

    // res.render('error', {
    //     title: `${statusCode} | 에러 발생`,
    //     message: msg,
    //     statusCode: statusCode,
    //     data: data
    // });
    res.render('error2');
});

// 웹 소켓 클라이언트
app.use(socketClient);

// 서버 실행
app.listen(3000, () => console.log('클라이언트 접속!!'));



