import fetch from 'node-fetch';
import { successType, errorType } from '../util/status.js';

const viewAPI = {
    getMyProfile: async token => {
        try {
            const response = await fetch('http://localhost:8080/v1/user/myprofile', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            const resData = await response.json();
            
            return resData;
        } catch (err) {
            throw err;
        }
    },
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
            // console.log('resData api', resData);

            return resData;
        } catch (err) {
            throw err;
        }
    }
}

export default viewAPI;