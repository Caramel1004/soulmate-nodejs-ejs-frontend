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
    },
    patchEditMyProfileByReqUser: async (token, refreshToken, formData, hasPhotoToBeEdit, next) => {
        try {
            let request = 'edit-myprofile';
            if(hasPhotoToBeEdit == 'true') {
                request = 'edit-myprofile-photo'
            }
            console.log(request);
            const response = await fetch(`http://localhost:8080/v1/user/${request}`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken
                },
                body: formData
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    getSearchUserByKeyWord: async (token, refreshToken, channelId, searchWord, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/user/search/${searchWord}`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId
                })
            });

            const resData = await response.json();
            
            return resData;
        } catch (err) {
            next(err);
        }
    },
}

export default userAPI;