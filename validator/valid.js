import { errorType } from '../util/status.js';
import { AuthorizationTokenError, VerificationTokenError, NotFoundDataError, ValidationError, customizeError } from '../error/error.js'
import { validationResult, body } from 'express-validator';

// 결과 처리
/*
결과 값 errors
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
const validResult = (req, res, next) => {
    try {
        const errors = validationResult(req).errors[0];

        if (errors) {
            const errorStatus = new ValidationError(errors.msg);
            errors.errorStatus = errorStatus;
            errors.statusCode = errorStatus.statusCode;
            throw errors;
        }
        next();
    } catch (error) {
        next(error);
    }
}

const loginValidResult = async (req, res, next) => {
    try {
        const errors = validationResult(req).errors[0];

        if (errors) {
            const errorStatus = new ValidationError(errors.msg);
            errors.errorStatus = errorStatus;
            errors.statusCode = errorStatus.statusCode;
            res.render('auth/auth', {
                title: '그이상의 소통 | Soulmate',
                path: '/login',
                valid: errors,
                error: null,
                inputData: {
                    email: req.body.email,
                    password: req.body.password
                }
            });
        }
        next();
    } catch (error) {
        console.log('로그인 발리드 문제: ', error);
        error.isViewRenderError = true;
        next(error)
    }
}

// 인증 토큰 검사(JWT)
export function hasAuthorizedToken(req, res, next) {
    const token = req.signedCookies.token;
    if (!token) {
        res.redirect('/login');
    } else {
        next();
    }
}

// 에러 검사
export function hasError(error) {
    if (error) {
        if (!error.statusCode) {
            error = customizeError(error);
        }
        console.log(error);
        throw (error);
    }
    return '에러가 없습니다.';
}

/** 인증 토큰 관련 함수 */
export const hasNewAuthToken = (res, status) => {
    console.log(status)
    if (status.hasNewAccessToken) {
        console.log('새로운 토큰 발급')
        res.cookie('token', status.newAccessToken, {
            httpOnly: true,
            secure: false,
            signed: true
        });
    }
    return;
}

/** #----------------------------------유효성 검사 체인----------------------------------#
 * 로그인, 회원가입, 채널추가, 피드 추가, 워크스페이스 추가, 채팅방 추가시 유효성검사 체인
 * npm: express-vaildator 
 */

/** 1. 로그인
 *  @body {이메일, 비밀번호}
 *  @propertyToMustCheck {이메일, 비밀번호} 
 *  @process 비어있을시 유효성 검사 통과 못하도록하고 행동해야할 메세지 반환
 */
export const validationChainToCheckValidEmailAndPassWord = [
    body('email').trim().notEmpty().withMessage('이메일을 입력하세요.'),
    body('email').trim().isEmail().withMessage('이메일 형식으로 입력하세요.'),
    body('password').trim().isLength({ min: 1 }).withMessage('비밀번호를 입력하세요.'),
    loginValidResult
]

/** 2. 회원가입
 *  @body {이메일, 비밀번호, 닉네임, 성별, 프로필사진, 핸드폰번호, 코멘트} 
 *  @propertyToMustCheck {이메일, 비밀번호, 닉네임, 성별} 
 *  @process 비어있을시 유효성 검사 통과 못하도록하고 행동해야할 메세지 반환
 */
export const validationChainToCheckValidRequestedValidBodyFromMemberJoinPage = [
    body('email').trim().notEmpty().withMessage('이메일은 필수 입니다.'),
    body('email').trim().isEmail().withMessage('이메일 형식으로 입력하세요.'),
    body('emailFront').trim().isLength({ min: 2, max: 20 }).withMessage('이메일 도메인을 제외한 영문 2~15자 내외로 입력하세요.'),
    body('password').trim().notEmpty().withMessage('비밀번호는 필수 입니다.'),
    body('password').trim().isLength({ min: 8, max: 15 }).withMessage('8~15자 내외로 입력하세요.'),
    body('name').trim().notEmpty().withMessage('닉네임은 필수 입니다.'),
    body('name').trim().isLength({ min: 1, max: 17 }).withMessage('12자 이하로 입력하세요.'),
    body('gender').trim().notEmpty().withMessage('성별을 선택하세요.'),
    validResult
]


/** 3. 채널 추가
 * @body {공개여부, 채널명, 썸네일, 카테고리, 소개 요약, 코멘트}
 * @propertyToMustCheck {공개여부, 채널명, 카테고리, 소개 요약} 
 * @process 비어있을시 유효성 검사 통과 못하도록하고 행동해야할 메세지 반환
 */
export const validationChainToCheckRequestedValidBodyFromChannelAddPage = [
    body('open').trim().notEmpty().withMessage('공개 여부를 체크하세요.'),
    body('channelName').trim().notEmpty().withMessage('채널명은 필수 입니다.'),
    body('summary').trim().notEmpty().withMessage('간단한 소개가 필요합니다.'),
    body('channelName').trim().isLength({ min: 1, max: 15 }).withMessage('1~15자 내외로 입력하세요.'),
    body('category').trim().notEmpty().withMessage('카테고리를 골라주세요.'),
    body('summary').trim().isLength({ min: 1, max: 25 }).withMessage('1~25자 내외로 입력하세요.'),
    validResult
]

/** 4. 피드 추가
 * @body {제목, 코멘트, 업로드 사진}
 * @propertyToMustCheck {코멘트 or 업로드 사진} 
 * @process 비어있을시 유효성 검사 통과 못하도록하고 행동해야할 메세지 반환
 * 아직 작업 다 안끝남!!!
 */
export const validationChainToCheckRequestedValidBodyFromFeedUploadModal = [
    body('content').trim().notEmpty().withMessage('내용 또는 이미지를 올려주세요.'),
    validResult
]

/** 5. 워크스페이스 추가
 * @body {공개여부, 워크스페이스명, 코멘트}
 * @propertyToMustCheck {공개여부, 워크스페이스명} 
 * @process 비어있을시 유효성 검사 통과 못하도록하고 행동해야할 메세지 반환
 */
export const validationChainToCheckRequestedValidBodyFromWorkspaceAddModal = [
    body('open').trim().notEmpty().withMessage('공개 여부를 체크하세요.'),
    body('workSpaceName').trim().notEmpty().withMessage('워크스페이스명은 필수 입니다.'),
    body('workSpaceName').trim().isLength({ min: 1, max: 15 }).withMessage('1~15자 내외로 입력하세요.'),
    validResult
]

/** 6. 채팅방 추가
 * @body {채팅방명}
 * @propertyToMustCheck {채팅방명} 
 * @process 비어있을시 유효성 검사 통과 못하도록하고 행동해야할 메세지 반환
 */
export const validationChainToCheckRequestedValidBodyFromChatRoomAddModal = [
    body('roomName').trim().notEmpty().withMessage('방이름은 필수 입니다.'),
    body('roomName').trim().isLength({ min: 1, max: 15 }).withMessage('1~15자 내외로 입력하세요.'),
    validResult
]


