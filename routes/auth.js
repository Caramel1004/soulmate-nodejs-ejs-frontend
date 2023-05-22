import { Router } from 'express';

import authController from '../controller/auth.js';

const router = Router();

// GET /login
router.get('/login',authController.getLoginPage);// 로그인 페이지 렌더링

// POST /login
router.post('/login',authController.postLogin);// 로그인

// POST /signup
// router.post('/signup',authController.postSignUp);// 회원가입

export default router;
