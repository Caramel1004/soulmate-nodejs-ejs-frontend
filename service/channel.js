import channelAPI from '../API/channel.js'

/**
 * 1. 생성된 오픈 채널 목록 요청
 *     1-1. 오픈 채널 세부 정보 요청
 * 2. 해당 유저의 채널 리스트 요청
 * 
 */

const channelService = {
    // 1. 생성된 오픈 채널 목록 요청
    getOpenChannelList: async (searchWord, category, next) => {
        try {
            const resData = await channelAPI.getOpenChannelList(searchWord, category, next);

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 1-1. 오픈 채널 세부 정보 요청
    getOpenChannelDetail: async (channelId, next) => {
        try {
            const data = await channelAPI.getOpenChannelDetail(channelId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 2. 해당 유저의 채널 리스트 요청
    getChannelListByUserId: async (token, refreshToken, reqQuery, next) => {
        try {
            const data = await channelAPI.getChannelListByUserId(token, refreshToken, reqQuery, next);

            return data;
        } catch (error) {
            next(error);
        }
    },
    // 5. 관심 채널 목록 요청
    getMyWishChannelList: async (token, refreshToken, category, searchWord, next) => {
        try {
            const data = await channelAPI.getMyWishChannelList(token, refreshToken, category, searchWord, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 6. 채널 세부정보 요청
    getChannelDetailByChannelId: async (token, refreshToken, channelId, next) => {
        try {
            const data = await channelAPI.getChannelDetailByChannelId(token, refreshToken, channelId, next);

            const passedTime = Math.ceil((new Date(data.channel.createdAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const formatterDay = new Intl.RelativeTimeFormat('ko', {
                numeric: 'auto'
            });

            data.channel.passedTime = formatterDay.format(passedTime, 'days').split('일')[0];

            return data;
        } catch (err) {
            next(err);
        }
    },

    // 7. 채팅방 목록 요청
    getChatRoomList: async (jsonWebToken, refreshToken, channelId, searchWord, next) => {
        try {
            const data = await channelAPI.getChatRoomList(jsonWebToken, refreshToken, channelId, searchWord, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 8. 채팅방 생성
    postCreateChatRoom: async (jsonWebToken, refreshToken, channelId, roomName, next) => {
        try {
            const data = await channelAPI.postCreateChatRoom(jsonWebToken, refreshToken, channelId, roomName, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 9. 해당 채널에 유저 초대
    patchInviteUserToChannel: async (jsonWebToken, refreshToken, channelId, selectedIds, next) => {
        try {
            const data = await channelAPI.patchInviteUserToChannel(jsonWebToken, refreshToken, channelId, selectedIds, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 10. 워크스페이스 목록 요청
    getWorkSpaceList: async (jsonWebToken, refreshToken, channelId, searchWord, open, next) => {
        try {
            const data = await channelAPI.getWorkSpaceList(jsonWebToken, refreshToken, channelId, searchWord, open, next);
            
            return data;
        } catch (err) {
            next(err);
        }
    },
    // 11. 워크스페이스 생성
    postCreateWorkSpace: async (token, refreshToken, channelId, open, workSpaceName, comment, next) => {
        try {
            const data = await channelAPI.postCreateWorkSpace(token, refreshToken, channelId, open, workSpaceName, comment, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 14. 관심채널 추가 또는 삭제(토글 관계)
    postAddOpenChannelToWishChannel: async (token, refreshToken, channelId, next) => {
        try {
            const data = await channelAPI.postAddOpenChannelToWishChannel(token, refreshToken, channelId, next);

            return data;
        } catch (err) {
            next(err)
        }
    },
    postCreateFeedToChannel: async (token, refreshToken, channelId, formData, next) => {
        try {
            const data = await channelAPI.postCreateFeedToChannel(token, refreshToken, channelId, formData, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    patchEditFeedToChannel: async (token, refreshToken, channelId, feedId, formData, next) => {
        try {
            const data = await channelAPI.patchEditFeedToChannel(token, refreshToken, channelId, feedId, formData, next);

            return data;
        } catch (err) {
            next(err)
        }
    },
    deleteRemoveFeedByReqUser: async (token, refreshToken, channelId, feedId, next) => {
        try {
            const data = await channelAPI.deleteRemoveFeedByReqUser(token, refreshToken, channelId, feedId, next);

            return data;
        } catch (err) {
            next(err)
        }
    },
    patchPlusOrMinusNumberOfLikeInFeed: async (token, refreshToken, channelId, feedId, next) => {
        try {
            const data = await channelAPI.patchPlusOrMinusNumberOfLikeInFeed(token, refreshToken, channelId, feedId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    patchEditChannelByReqUser: async (token, refreshToken, channelId, formData, next) => {
        try {
            const data = await channelAPI.patchEditChannelByReqUser(token, refreshToken, channelId, formData, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
}

export default channelService;