import fetch from 'node-fetch';
import { FormData } from 'formdata-node';
import dotenv from 'dotenv';

import { hasError } from '../validator/valid.js';
import authAPI from '../API/auth.js';
import redisClient from '../util/redis.js';

dotenv.config();

const authController = {
    // 로그인 페이지 렌더링
    getLoginPage: (req, res, next) => {
        res.render('auth/auth', {
            title: '그이상의 소통 | Soulmate',
            path: '/login',
            valid: null,
            error: null,
            inputData: {
                email: '',
                password: ''
            }
        });
    },
    //회원 가입
    postSignUp: async (req, res, next) => {
        try {
            const photo = req.files;

            console.log('photo: ', photo);

            const formData = new FormData();
            formData.append('email', req.body.email);
            formData.append('password', req.body.password);
            formData.append('name', req.body.name);
            formData.append('gender', req.body.gender);
            formData.append('comment', req.body.comment);
            formData.append('phone', req.body.phone);
            formData.append('photo', JSON.stringify(photo));

            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/user/signup`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            hasError(data.error);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 로그인
    postLogin: async (req, res, next) => {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();
            hasError(data.error);

            console.log(data);
            // app.locals
            // 자바스크립트 객체이고, 프로퍼티들은 애플리케이션 내의 지역 변수들이다. 
            // 애플리케이션의 라이프 타임 동안 유효하다.

            // req.app.locals
            // 미들웨어에서 app의 지역 변수들을 사용할 수 있게 해준다.

            // res.locals
            // res.locals의 프로퍼티들은 request의 라이프 타임 동안에만 유효하다.
            // html/view 클라이언트 사이드로 변수들을 보낼 수 있으며, 그 변수들은 오로지 거기서만 사용할 수 있다.

            /** 쿠키: 저장데이터
             *  인증토큰
             *  리프레쉬 토큰
             *  세션 쿠키: 저장데이터
             *  유저 닉네임
             *  유저 포토
             */
            res.cookie('token', data.token, {
                httpOnly: true,
                secure: false,
                signed: true
            });

            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: false,
                signed: true
            });

            req.session.token = data.token;
            req.session.refreshToken = data.refreshToken;
            req.session.clientName = data.name;
            req.session.photo = data.photo;
            req.session.userChannels = data.channels;

            res.redirect('/');
        } catch (error) {
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
            next(error);
        }
    },
    // 카카오 로그인 페이지
    getKakaoLoginPageURL: async (req, res, next) => {
        try {
            const kakaoResData = await authAPI.getKakaoLoginPageURL(next);
            hasError(kakaoResData.error);
            console.log(kakaoResData)
            res.status(302).redirect(kakaoResData.url);
        } catch (err) {
            next(err)
        }
    },
    // 카카오에 토큰 요청
    postRequestTokenToKakao: async (req, res, next) => {
        try {
            const company = 'kakao';
            console.log('req.query : ', req.query);
            const kakaoResData = await authAPI.postRequestTokenToKakao(req.query.code, next);
            hasError(kakaoResData.error);

            kakaoResData.body.company = company;
            req.kakaoResTokenBody = kakaoResData.body;
            next();
        } catch (err) {
            next(err);
        }
    },
    // sns로 회원가입 또는 로그인
    postSignUpOrLoginBySNSAccount: async (req, res, next) => {
        try {
            const data = await authAPI.postSignUpOrLoginBySNSAccount(req.kakaoResTokenBody, next);
            hasError(data.error);
            
            /** 쿠키: 저장데이터
             *  인증토큰
             *  리프레쉬 토큰
             *  세션 쿠키: 저장데이터
             *  유저 닉네임
             *  유저 포토
             */
            res.cookie('token', data.token, {
                httpOnly: true,
                secure: false,
                signed: true
            });

            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: false,
                signed: true
            });

            req.session.clientName = data.name;
            req.session.photo = data.photo;
            req.session.userChannels = data.channels;

            res.redirect('/');
        } catch (err) {
            next(err);
        }
    },
    //로그 아웃
    getLogout: async (req, res, next) => {
        try {
            if (req.signedCookies) {
                res.clearCookie('token');
                res.clearCookie('refreshToken');
            }
            req.session.destroy();
            const logoutResult = await redisClient.v4.del('session: ' + req.signedCookies.sid);
            console.log('logoutResult: ', logoutResult);
            res.redirect('/login');
        } catch (err) {
            next(err);
        }
    }
}

export default authController;