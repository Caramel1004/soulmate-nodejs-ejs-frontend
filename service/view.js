import fetch from 'node-fetch';

const viewService = {
    // 해당 유저의 채널목록 API요청
    getMyChannelList: async (token, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/channel', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
}

export default viewService;