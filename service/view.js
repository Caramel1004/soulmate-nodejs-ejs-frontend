import fetch from 'node-fetch';

import API from '../API/view.js'

const viewService = {
    // 해당 유저의 채널목록 API요청
    getMyChannelList: async (token, next) => {
        try {
            const resData = await API.getMyChannelList(token, next);
            console.log('resData: ',resData);
            return resData;
        } catch (err) {
            throw err;
        }
    }
}

export default viewService;