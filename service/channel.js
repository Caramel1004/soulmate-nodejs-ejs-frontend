import fetch from 'node-fetch';

import channelAPI from '../API/channel.js'

const channelService = {
    // 1. 생성된 오픈 채널 목록
    getOpenChannelList: async () => {
        try {
            const resData = await channelAPI.getOpenChannelList();

            return resData;
        } catch (err) {
            throw err;
        }
    },
    // 1-1. 오픈 채널 세부 정보 조회
    getOpenChannelDetail: async (token, channelId, next) => {
        try {
            const data = await channelAPI.getOpenChannelDetail(token, channelId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 2. 해당 유저의 채널 리스트 조회
    getChannelListByUserId: async (token, searchWord, next) => {
        try {
            const data = await channelAPI.getChannelListByUserId(token, searchWord, next);

            return data;
        } catch (error) {

        }
    },
    // 5. 관심 채널 목록 페이지
    getMyWishChannelList: async (token, searchWord, next) => {
        try {
            const data = await channelAPI.getMyWishChannelList(token, searchWord, next);
            
            return data;
        } catch (err) {
            next(err);
        }
    }
}

export default channelService;