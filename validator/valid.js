import { errorType } from '../util/status.js';
import { AuthorizationTokenError, VerificationTokenError, NotFoundDataError, ValidationError } from '../error/error.js'
import { validationResult, body } from 'express-validator';

// 유효성 검사 함수
const validResult = async (req, res, next) => {
    try {
        // Result {
        //     formatter: [Function: formatter],
        //     errors: [
        //       {
        //         type: 'field',
        //         value: '',
        //         msg: '이메일을 입력하세요.',
        //         path: 'email',
        //         location: 'body'
        //       }
        //     ]
        //   }
        const errors = validationResult(req).errors[0];
        // 유효성 검사
        if (!errors) {
           throw errors;
        }
        next();
    } catch (err) {
        console.log('err: ', err)
        res.render('auth/auth', {
            title: '그이상의 소통 | Soulmate',
            path: '/login',
            msg: err.msg
        });
        next(err);
    }
}

export function accessAuthorizedToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.redirect('/login');
    } else {
        next();
    }
}

export function hasError(error) {
    if (error) {
        console.log(error);
        throw error;
    }
    return '에러가 없습니다.';
}

// 사용자 추가 유효성 검사
export const checkValidUser = [
    body('email').isEmail().withMessage('이메일이 유효하지 않습니다.')
        .custom((email, { req }) => {
            console.log('value : ', email);
            return User.findOne({ email: email })
                .then(userInfo => {
                    if (userInfo) {
                        return Promise.reject('이미 이메일이 존재 합니다.');
                    }
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 422;
                        throw err;
                    } else {
                        next(err);
                    }
                })
        })
        .normalizeEmail(),
    body('name').trim().isLength({ min: 5 }),
    body('password').trim().isLength({ min: 5 }),
    validResult
]

export const checkValidEmailAndPassWord = [
    body('email').isEmail().withMessage('이메일을 입력하세요.').normalizeEmail(),
    body('password').isEmpty().withMessage('비밀번호를 입력하세요.'),
    validResult
]


