import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const authAPI = {
    // 카카오 로그인 페이지 URL
    getKakaoLoginPageURL: async next => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/oauth/kakao/authorize`, {
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
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/oauth/kakao/token?code=${code}`, {
                method: 'GET'
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
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/oauth/signin`, {
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