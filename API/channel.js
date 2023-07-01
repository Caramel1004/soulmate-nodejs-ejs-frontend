import fetch from 'node-fetch';
import { successType, errorType } from '../util/status.js';

const channelAPI = {
    // 1. 생성된 오픈 채널 목록
    getOpenChannelList: async () => {
        try {
            const response = await fetch('http://localhost:8080/v1/channel/openchannel-list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 1-1. 오픈 채널 세부 정보 조회
    getOpenChannelDetail: async (token, channelId, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/channel/openchannel-list/' + channelId, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 2. 해당 유저의 채널 리스트 조회
    getChannelListByUserId: async (token, searchWord, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/channel/mychannels?searchWord=' + searchWord, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 5. 관심 채널 목록 페이지
    getMyWishChannelList: async (token, searchWord, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/channel/channel-of-interest-list?searchWord=' + searchWord, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    }
}

export default channelAPI;