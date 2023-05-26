import fetch from 'node-fetch';

const authController = {
    // 로그인 페이지 렌더링
    getLoginPage: (req, res, next) => {
        res.render('auth/auth', {
            title: '그이상의 소통 | Soulmate',
            path: '/login'
        });
    },
    //회원 가입
    postSignUp: async (req, res, next) => {
        try {
            const clientId = req.body.clientId;
            const password = req.body.password;
            const name = req.body.name;

            const response = await fetch('http://localhost:8080/v1/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: clientId,
                    password: password,
                    name: name
                })
            });

            res.redirect('/login');
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 로그인
    postLogin: async (req, res, next) => {
        try {
            const clientId = req.body.clientId;
            const password = req.body.password;

            const response = await fetch('http://localhost:8080/v1/user/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: clientId,
                    password: password
                })
            });

            const data = await response.json();

            // app.locals
            // 자바스크립트 객체이고, 프로퍼티들은 애플리케이션 내의 지역 변수들이다. 
            // 애플리케이션의 라이프 타임 동안 유효하다.

            // req.app.locals
            // 미들웨어에서 app의 지역 변수들을 사용할 수 있게 해준다.

            // res.locals
            // res.locals의 프로퍼티들은 request의 라이프 타임 동안에만 유효하다.
            // html/view 클라이언트 사이드로 변수들을 보낼 수 있으며, 그 변수들은 오로지 거기서만 사용할 수 있다.

            res.cookie('token', data.token, {
                httpOnly: true,
                secure: false
            });
            res.cookie('clientId', data.clientId, {
                httpOnly: true,
                secure: false
            });

            console.log('req.cookies: ', req.cookies);
            // req.app.locals.token = data.token;
            // req.app.locals.clientId = data.clientId;

            res.redirect('/client/mychannels');

            next();
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    //로그 아웃
    getLogout: (req, res, next) => {
        try {
            if (req.cookies.token) {
                res.clearCookie(token);
            }
            res.redirect('/login');
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
}

export default authController;