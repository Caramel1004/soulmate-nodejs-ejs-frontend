import fetch from 'node-fetch';
import { successType, errorType } from '../util/status.js';

const userAPI = {
    getMyProfile: async (token, refreshToken, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/user/myprofile', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                }
            });

            const resData = await response.json();
            
            return resData;
        } catch (err) {
            next(err);
        }
    }
}

export default userAPI;