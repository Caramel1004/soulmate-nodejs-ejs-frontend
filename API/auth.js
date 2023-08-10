import fetch from 'node-fetch';

const authAPI = {
    // 카카오 로그인 페이지
    getKakaoLoginPageURL: async next => {
        try {
            const response = await fetch(`http://localhost:8080/v1/user/kakao-account`, {
                method: 'GET'
            });
            const data = await response.json();
            console.log(data);
            return data;
        } catch (err) {
            next(err);
        }
    },
    // 카카오 추가 정보 제공 선택 창
    getKakaoAddScopePage: async next => {
        try {
            const response = await fetch(`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile_nickname,profile_image,account_email,gender`, {
                method:'GET',
                scope: 'account_email, gender'
            });

            return response;
        } catch (err) {
            next(err);
        }
    },
    postSignUpByKakaoAccountEmail: async next => {
        try {
            const response = await fetch('http://localhost:8080/v1/user/kakao-account/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            return data;
        } catch (err) {

        }
    }
}

export default authAPI