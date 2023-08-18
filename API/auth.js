import fetch from 'node-fetch';

const authAPI = {
    // 카카오 로그인 페이지 URL
    getKakaoLoginPageURL: async next => {
        try {
            const response = await fetch(`http://localhost:8080/v1/user/kakao/oauth/authorize`, {
                method: 'GET'
            });
            const data = await response.json();

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 카카오에 토큰 요청
    postRequestTokenToKakao: async (code, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/user/kakao/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code
                })
            });

            const data = await response.json();
            console.log(data);
            return data;
        } catch (err) {
            next(err);
        }
    },
    // sns로 회원가입 또는 로그인
    postSignUpOrLoginBySNSAccount: async (body, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/user/sns-account/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            console.log(data);
            return data;
        } catch (err) {
            next(err);
        }
    },
}

export default authAPI