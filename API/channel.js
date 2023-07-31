import fetch from 'node-fetch';
import { successType, errorType } from '../util/status.js';

const channelAPI = {
    // 1. 생성된 오픈 채널 목록
    getOpenChannelList: async next => {
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
    getOpenChannelDetail: async (channelId, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/channel/openchannel-list/' + channelId, {
                method: 'POST',
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
    // 2. 해당 유저의 채널 리스트 조회
    getChannelListByUserId: async (token, refreshToken, searchWord, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/channel/mychannels?searchWord=' + searchWord, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken
                }
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 5. 관심 채널 목록 페이지
    getMyWishChannelList: async (token, refreshToken, searchWord, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/channel/wishchannels?searchWord=' + searchWord, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken
                }
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 6. 채널 세부정보 요청
    getChannelDetailByChannelId: async (token, refreshToken, channelId, next) => {
        try {
            // 해당 채널아이디 보내주고 해당 채널 입장 요청
            const response = await fetch('http://localhost:8080/v1/channel/' + channelId, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken
                }
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 7. 채팅방 목록 요청
    getChatRoomList: async (token, refreshToken, channelId, next) => {
        try {
            // 채팅방 목록 요청
            const response = await fetch('http://localhost:8080/v1/channel/' + channelId + '/chat', {
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
    // 8. 채팅방 생성
    postCreateChatRoom: async (token, refreshToken, channelId, roomName, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/channel/${channelId}/create-chatRoom`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId,
                    roomName: roomName
                })
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 9. 해당 채널에 유저 초대
    postInviteUserToChannel: async (token, refreshToken, channelId, invitedUserId, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/channel/invite/' + channelId, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId,
                    invitedUserId: invitedUserId
                })
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 10. 워크스페이스 목록 요청
    getWorkSpaceList: async (token, refreshToken, channelId, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/channel/${channelId}/workspace`, {
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
    // 11. 워크스페이스 생성
    postCreateWorkSpace: async (token, refreshToken, channelId, open, workSpaceName, comment, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/channel/${channelId}/create-workspace`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    open: open,
                    workSpaceName: workSpaceName,
                    comment: comment
                })
            });
            const resData = await response.json();

            return resData
        } catch (err) {
            next(err);
        }
    },
    // 14. 관심 채널 추가
    postAddOpenChannelToWishChannel: async (token, refreshToken, channelId, next) => {
        try {
            const response = await fetch(`http://localhost:8080/v1/channel/add-or-remove-wishchannel`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId
                })
            });
            const resData = await response.json();

            return resData
        } catch (err) {
            next(err)
        }
    }
}

export default channelAPI;