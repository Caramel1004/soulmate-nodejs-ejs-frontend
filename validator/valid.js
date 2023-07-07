import { errorType } from '../util/status.js';
import { AuthorizationTokenError, VerificationTokenError, NotFoundDataError, ValidationError } from '../error/error.js'

export function accessAuthorizedToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.redirect('/login');
    }else {
        next();
    }
}

export function hasError(error) {
    if(error) {
        console.log(error);
        throw error;    
    }
    return '에러가 없습니다.';
}



