import { Router } from 'express';

import authController from '../controller/auth.js';
import { checkValidEmailAndPassWord } from '../validator/valid.js'

const router = Router();


// GET /login
router.get('/login', authController.getLoginPage);// 로그인 페이지 렌더링

// POST /login
router.post('/login', checkValidEmailAndPassWord, authController.postLogin);// 로그인

// GET /kakao/oauth/authorize
router.get('/kakao/oauth/authorize', authController.getKakaoLoginPage);

// get /logout
router.get('/logout', authController.getLogout);// 로그 아웃

// POST /signup
router.post('/signup', authController.postSignUp);// 회원가입

export default router;
