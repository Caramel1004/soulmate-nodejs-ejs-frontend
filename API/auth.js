import fetch from 'node-fetch';

const authAPI = {
    // 카카오 로그인 페이지
    getKakaoLoginPage: async next => {
        try {
            const response = await fetch(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.url)
            return response.url
        } catch (err) {
            next(err);
        }
    }
}

export default authAPI