import channelAPI from '../API/channel.js'

/**
 * 1. 생성된 오픈 채널 목록 요청
 *     1-1. 오픈 채널 세부 정보 요청
 * 2. 해당 유저의 채널 리스트 요청
 * 
 */

const channelService = {
    // 1. 생성된 오픈 채널 목록 요청
    getOpenChannelList: async next => {
        try {
            const resData = await channelAPI.getOpenChannelList();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 1-1. 오픈 채널 세부 정보 요청
    getOpenChannelDetail: async (token, channelId, next) => {
        try {
            const data = await channelAPI.getOpenChannelDetail(token, channelId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 2. 해당 유저의 채널 리스트 요청
    getChannelListByUserId: async (token, searchWord, next) => {
        try {
            const data = await channelAPI.getChannelListByUserId(token, searchWord, next);

            return data;
        } catch (error) {
            next(error);
        }
    },
    // 5. 관심 채널 목록 요청
    getMyWishChannelList: async (token, searchWord, next) => {
        try {
            const data = await channelAPI.getMyWishChannelList(token, searchWord, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 6. 채널 세부정보 요청
    getChannelDetailByChannelId: async (jsonWebToken, channelId, next) => {
        try {
            const data = await channelAPI.getChannelDetailByChannelId(jsonWebToken, channelId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    
    // 7. 채팅방 목록 요청
    getChatRoomList: async (jsonWebToken, channelId, next) => {
        try {
            const data = await channelAPI.getChatRoomList(jsonWebToken, channelId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 8. 채팅방 생성
    postCreateChatRoom: async (jsonWebToken, channelId, roomName, next) => {
        try {
            const data = await channelAPI.postCreateChatRoom(jsonWebToken, channelId, roomName, next);
            
            return data;
        } catch (err) {
            next(err);
        }
    },
    // 9. 해당 채널에 유저 초대
    postInviteUserToChannel: async (jsonWebToken, channelId, invitedUserId, next) => {
        try {
            const data = await channelAPI.postInviteUserToChannel(jsonWebToken, channelId, invitedUserId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 10. 워크스페이스 목록 요청
    getWorkSpaceList: async (jsonWebToken, channelId, next) => {
        try {
            const data = await channelAPI.getWorkSpaceList(jsonWebToken, channelId, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 11. 워크스페이스 생성
    postCreateWorkSpace: async (token, channelId, workSpaceName, next) => {
        try {
            const data = await channelAPI.postCreateWorkSpace(token, channelId, workSpaceName, next);

            return data;
        } catch (err) {
            next(err);
        }
    }
}

export default channelService;