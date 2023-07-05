import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

import socketClient from './socket-client.js';
import { errorType } from './util/status.js';

import authRoutes from './routes/auth.js'
import viewRoutes from './routes/view.js'
import clientRoutes from './routes/client.js'

const app = express();

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
app.use(multer({ storage: multerStorage}).single('file'));

//쿠키 파서
app.use(cookieParser());

// 정적 파일 처리
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


// 동적 라우트 처리
app.use(viewRoutes);
app.use(authRoutes);
app.use('/client', clientRoutes);

// 접속한 유저 정보를 확인하기 위한 미들웨어
app.use(async (req, res, next) => {
    console.log('req.cookies: ', req.cookies);
    next();
});

// 오류 처리
app.use((error, req, res, next) => {
    console.log('미들웨어 함수 진입.... throw 된 에러: ', error);
    if(!error.statusCode) {
        error = errorHandler(error);
    }
    
    res.status(error.statusCode || 500).render('error404',{
        error: error
    });
    next();
});

// 웹 소켓 클라이언트
app.use(socketClient);

// 서버 실행
app.listen(3000, () => console.log('클라이언트 접속!!'));



