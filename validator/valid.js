import { errorType } from '../util/status.js';

export function accessAuthorizedToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.redirect('/login');
    }else {
        next();
    }
}

