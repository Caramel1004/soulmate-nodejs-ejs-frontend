import { errorType } from '../util/status.js';

export function accessAuthorizedToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        const errReport = errorType.E04.e01;
        throw new Error(errReport);
    }
    next();
}

