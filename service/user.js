import fetch from 'node-fetch';

import userAPI from '../API/user.js'

const userService = {
    // 해당 유저의 채널목록 API요청
    getMyProfile: async (token, refreshToken, next) => {
        try {
            const resData = await userAPI.getMyProfile(token, refreshToken, next);

            return resData;
        } catch (err) {
            next(err);
        }
    },
    patchEditMyProfileByReqUser: async (token, refreshToken, formData, hasPhotoToBeEdit, next) => {
        try {
            const resData = await userAPI.patchEditMyProfileByReqUser(token, refreshToken, formData, hasPhotoToBeEdit, next);

            return resData;
        } catch (err) {
            next(err);
        }
    },
    getSearchUserByKeyWord: async (token, refreshToken, channelId, searchWord, next) => {
        try {
            const resData = await userAPI.getSearchUserByKeyWord(token, refreshToken, channelId, searchWord, next);

            return resData;
        } catch (err) {
            next(err);
        }
    },
}

export default userService;