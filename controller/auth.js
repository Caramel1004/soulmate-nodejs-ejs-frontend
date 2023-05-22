import fetch from 'node-fetch';

const authController = {
    // 로그인 페이지 렌더링
    getLoginPage: (req, res, next) => {
        res.render('auth/login', {
            title: '그이상의 소통 | Soulmate',
            path: '/login'
        });
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

            res.locals.token = data.token;
            res.locals.userId = data.userId; 
                 
            res.redirect('/client/mychannels');
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // //회원 가입
    // postSignUp: async (req, res, next) => {
    //     try {

    //     } catch (err) {

    //     }
    // }
}

export default authController;