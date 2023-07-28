import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import dotenv from 'dotenv';

import socketClient from './socket-client.js';
import { errorType } from './util/status.js';
import { errorHandler } from './error/error.js'

import authRoutes from './routes/auth.js'
import viewRoutes from './routes/view.js'
import clientRoutes from './routes/client.js'
import { validationResult } from 'express-validator';

const app = express();

dotenv.config();

// 정적 file처리를 위한 변수
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 파일 data를 백엔드 서버로 보내기 위한 임시메모리에 저장 => 버퍼형태로 저장
const multerStorage = multer.memoryStorage();

// 템플릿 엔진 세팅
app.set('view engine', 'ejs');
app.set('views', 'views');


// 바디 파서
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: multerStorage }).single('file'));

//쿠키 파서
app.use(cookieParser());

// 정적 파일 처리
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// 동적 라우트 처리
app.use(viewRoutes);
app.use(authRoutes);
app.use('/client', clientRoutes);

app.use((req, res, next) => {
    const io = socketClient.getSocketClient();
    console.log('웹소켓 미들웨어');
    io.on('accessToken', data => {
        console.log('재발급된 토큰: ', data);
        res.cookie('token', data.accessToken);
    });
    next();
})

// 오류 처리
app.use((error, req, res, next) => {
    console.log('미들웨어 함수 진입.... throw 된 에러: ', error);
    if (!error.statusCode) {
        error = errorHandler(error);
    }

    if (error.statusCode == 404) {
        res.render('auth/auth', {
            title: '그이상의 소통 | Soulmate',
            path: '/login',
            valid: null,
            error: error,
            inputData: {
                email: req.body.email,
                password: req.body.password
            }
        });
    }

    // if(error.statusCode == 401) {
    //     console.log('401')
    //     res.redirect('/logout');
    // }

    if (error.statusCode == 422) {
        res.status(error.statusCode).json({
            error: error
        });
    }
    res.status(error.statusCode || 500).render('error404', {
        error: error
    });
});

app.listen(3000, () => {
    console.log(`클라이언트 서버 가동!!`);
    const io = socketClient.init(process.env.BACKEND_API_URL);
    
    // io.on('connection', text => {
    //     console.log(text);
    //     console.log('백엔드 서버와 클라이언트 서버 웹 소켓 연결 완료!!!');
    // })
});