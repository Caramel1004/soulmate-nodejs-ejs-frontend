import { errorType } from '../util/status.js'

export class NotFoundError extends Error {
    constructor(message) {
        super();
        this.statusCode = errorType.D04.d404.code;
        this.status = errorType.D04.d404.status;
        this.message = message;
        this.name = 'NotFoundError'
    }
}

export class NotFoundDataError extends NotFoundError {
    constructor(message) {
        super(message);
        this.name = 'NotFoundDataError'
    }
}

export class ValidationError extends NotFoundError {
    constructor(message) {
        super(message);
        this.statusCode = errorType.E04.e422.code;
        this.status = errorType.E04.e422.status;
        this.name = 'ValidationError'
    }
}


// 토큰에대한 에러
export class AuthorizationTokenError extends Error {
    constructor(message) {
        super();
        this.statusCode = errorType.E04.e401.code;
        this.status = errorType.E04.e401.status;
        this.message = message;
        this.name = 'AuthorizationTokenError';
    }
}

export class VerificationTokenError extends AuthorizationTokenError {
    constructor(error) {
        let message;
        if (error.name === 'TokenExpiredError') {
            message = '인증 토큰 기간이 만료 되었습니다.'
        } else if (error.name === 'JsonWebTokenError') {
            message = '유효하지않은 키값 입니다.';
        }
        super(message);
        this.name = 'VerificationTokenError';
    }
}

export const customizeError = error => {
    const errorReport = {
        statusCode: errorType.E05.e500.code,
        status: errorType.E05.e500.status,
        name: error.name
    }
    try {
        if(error instanceof Error) {
            errorReport.message = error.message;
            return errorReport;
        }

        if (error instanceof SyntaxError) {
            errorReport.message = '코드 문법이 틀렸습니다. 다시 확인하세요.';
            return errorReport;
        }

        if (error instanceof ReferenceError) {
            errorReport.message = '레퍼런스가 존재하지 않습니다. 레퍼런스명을 확인하세요.';
            return errorReport;
        }

        if (error instanceof TypeError) {
            errorReport.message = '함수의 인수, 자료형, 변수 사용이 적절히 사용되었는지 확인하세요.';
            return errorReport;
        }

        if (error instanceof RangeError) {
            errorReport.message = '어떤 값이 집합에 없거나 허용되는 범위가 아닐 때 오류를 나타냅니다.';
            return errorReport;
        }
    } catch (error) {
        throw new ReferenceError('레퍼런스가 존재하지 않습니다. 레퍼런스명을 확인하세요.');
    }
}