import { errorType } from '../util/status.js';
import { AuthorizationTokenError, VerificationTokenError, NotFoundDataError, ValidationError } from '../error/error.js'
import { validationResult, body } from 'express-validator';

// 결과 처리
const validResult = (req, res, next) => {
    try {
        /*
        결과 값
        Result {
            formatter: [Function: formatter],
            errors: [
              {
                type: 'field',
                value: '',
                msg: '이메일을 입력하세요.',
                path: 'email',
                location: 'body'
              }
            ]
          }
         */
        const errors = validationResult(req).errors[0];

        // 에러 존재하면 바로 쓰루
        if (errors) {
            throw errors;
        }
        next();
    } catch (error) {
        res.render('auth/auth', {
            title: '그이상의 소통 | Soulmate',
            path: '/login',
            valid: error,
            error: null,
            inputData: {
                email: req.body.email,
                password: req.body.password
            }
        });
    }
}

// 인증 토큰 검사(JWT)
export function accessAuthorizedToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.redirect('/login');
    } else {
        next();
    }
}

// 에러 검사
export function hasError(error) {
    if (error) {
        console.log(error);
        throw(error);
    }
    return '에러가 없습니다.';
}

// 이메일 비밀번호 데이터 있는지 체크
export const checkValidEmailAndPassWord = [
    body('email').isEmail().withMessage('이메일을 입력하세요.'),
    body('password').trim().isLength({ min: 1 }).withMessage('비밀번호를 입력하세요.'),
    validResult
]


