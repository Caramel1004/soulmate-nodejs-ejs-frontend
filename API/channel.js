import fetch from 'node-fetch';
import { successType, errorType } from '../util/status.js';
import dotenv from 'dotenv';

dotenv.config();

const channelAPI = {
    // 1. 생성된 오픈 채널 목록
    getOpenChannelList: async (searchWord, category, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/openchannel-list?searchWord=${searchWord}&category=${category}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    searchWord: searchWord,
                    category: category
                })
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
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/openchannel-list/${channelId}`, {
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
    // 2. 해당 유저의 채널 리스트 조회
    getChannelListByUserId: async (token, refreshToken, searchWord, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/mychannels?searchWord=${searchWord}`, {
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
    getMyWishChannelList: async (token, refreshToken, category, searchWord, next) => {
        try {
            console.log(category)
            console.log(searchWord)
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/wishchannels?category=${category}&searchWord=${searchWord}`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: category,
                    searchWord: searchWord
                })
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
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/${channelId}`, {
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
    getChatRoomList: async (token, refreshToken, channelId, searchWord, next) => {
        try {
            // 채팅방 목록 요청
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/${channelId}/chat?searchWord=${searchWord}`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    searchWord: searchWord
                })
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
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/${channelId}/create-chatRoom`, {
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
    patchInviteUserToChannel: async (token, refreshToken, channelId, selectedIds, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/invite/${channelId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    RefreshToken: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId,
                    selectedIds: selectedIds
                })
            });
            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 10. 워크스페이스 목록 요청
    getWorkSpaceList: async (token, refreshToken, channelId, searchWord, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/${channelId}/workspace?searchWord=${searchWord}`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    searchWord: searchWord
                })
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
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/${channelId}/create-workspace`, {
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
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/add-or-remove-wishchannel`, {
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
    },
    // 15. 채널에 내피드 생성
    postCreateFeedToChannel: async (token, refreshToken, channelId, formData, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/create-feed/${channelId}`, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken
                },
                body: formData
            });
            const resData = await response.json();

            return resData
        } catch (err) {
            next(err);
        }
    },
    patchEditFeedToChannel: async (token, refreshToken, channelId, feedId, formData, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/edit-feed/${channelId}/${feedId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken
                },
                body: formData
            });
            const resData = await response.json();

            return resData
        } catch (err) {
            next(err);
        }
    },
    deleteRemoveFeedByReqUser: async (token, refreshToken, channelId, feedId, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/delete-feed/${channelId}/${feedId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                }
            });
            const resData = await response.json();

            return resData
        } catch (err) {
            next(err)
        }
    },
    patchPlusOrMinusNumberOfLikeInFeed: async (token, refreshToken, channelId, feedId, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/plus-or-minus-feed-like`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId,
                    feedId: feedId
                })
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    patchEditChannelByReqUser: async (token, refreshToken, channelId, body, next) => {
        try {
            const response = await fetch(`${process.env.BACKEND_API_DOMAIN}/api/v1/channel/edit-channel/${channelId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Refresh: refreshToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
}

export default channelAPI;