import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp'

import session from 'express-session';
import RedisStore from 'connect-redis';

import redisClient from './util/redis.js';
import errorHandler from './error/error-handler.js';
import { NotFoundError } from './error/error.js';

import awsHealthCheckerRouter from './routes/aws.js'
import authRoutes from './routes/auth.js'
import viewRoutes from './routes/view.js'
import clientRoutes from './routes/client.js'

dotenv.config();

const app = express();

// 정적 file처리를 위한 변수
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 요청 응답 로그 출력
if (process.env.NODE_ENV === 'production') {
    console.log('-------------------PROD ENV-------------------');
    process.env.BACKEND_API_DOMAIN = process.env.BACKEND_API_DOMAIN_PROD_VER;
    app.use(morgan('combined'));
    app.use(
        helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: false
        })
    )
    app.use(hpp());
} else {
    console.log('-------------------DEV ENV-------------------');
    process.env.BACKEND_API_DOMAIN = process.env.BACKEND_API_DOMAIN_DEV_VER;
    app.use(morgan('dev'));
}

// 세션 옵션
const sessionOption = {
    resave: true,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET_KEY,
    cookie: {
        httpOnly: true,
        maxAge: 3600000,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        signed: true,
        sameSite: process.env.NODE_ENV === 'production' ? false : 'none',
    },
    name: 'sid',
    store: new RedisStore({
        client: redisClient.v4,
        prefix: 'session: '
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
// 세션 쿠키의 시크릿 값과 쿠키파서의 시크릿 값이 같게 하는게 좋음
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

// 정적 파일 처리
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use((req, res, next) => {
//     console.log('테스트중 token: ', req.signedCookies.token);
//     console.log('테스트중 refreshToken: ', req.signedCookies.refreshToken);
//     console.log('req.session: ', req.session)
//     next();
// })

// 라우트 접근
app.use('/aws', awsHealthCheckerRouter);
app.use(viewRoutes);
app.use(authRoutes);
app.use('/client', clientRoutes);
app.all('*', () => {
    const error = new NotFoundError('요청한 페이지를 찾지 못했습니다.');
    error.isViewRenderError = true;
    throw error;
});

// 오류 처리
app.use(errorHandler);

// 서버 실행
app.listen(process.env.PORT || 3000, () => {
    console.log(`클라이언트 서버 가동!!`);
    // 레디스 연결
    redisClient.connect();
});
