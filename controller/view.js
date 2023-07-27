import { successType, errorType } from '../util/status.js';
import channelService from '../service/channel.js'
import workspaceService from '../service/workspace.js'
import viewAPI from '../API/view.js';
import { getCategoryData } from '../service/static-data.js';
import chatService from '../service/chat.js';
import { hasError } from '../validator/valid.js';

/**
 * 1. 메인 페이지 == 오픈 채널 목록 페이지
 *  1-1. 오픈채널 세부 정보 페이지
 * 2. 내 프로필 관리 페이지
 * 3. 나의 채널 목록 페이지
 * 4. 채널 추가 페이지
 * 5. 관심 채널 목록 페이지
 * 6. 채널입장 -> 채널 내부 페이지
 * 7. 채팅방 입장 -> 채팅방 페이지
 * 8. 워크스페이스 입장 -> 워크스페이스 페이지
 */

const viewController = {
    // 1. 메인 페이지 ==  생성된 오픈 채널 목록 페이지
    getMainPage: async (req, res, next) => {
        try {
            const resData = await channelService.getOpenChannelList(next);

            const channelList = resData.channels;
            // const status = resData.status;

            res.render('index', {
                path: '/',
                title: 'Soulmate 메인 페이지',
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                channelList: channelList,
                chatRooms: null,
                workSpaces: null,
                state: 'off'
            });
        } catch (err) {
            next(err);
        }
    },
    // 1-1. 오픈 채널 세부 정보 페이지
    getOpenChannelDetailPage: async (req, res, next) => {
        try {
            const { channelId } = req.body;
            const data = await channelService.getOpenChannelDetail(req.cookies.token, channelId, next);

        } catch (err) {
            next(err)
        }
    },
    // 2. 내 프로필 관리 페이지
    getMyProfile: async (req, res, next) => {
        try {
            const accessToken = req.cookies.token;
            const refreshToken = req.cookies.token;

            const resData = await viewAPI.getMyProfile(jsonWebToken);

            console.log('resData: ', resData);
            const myProfile = resData.matchedUser;

            res.render('user/myprofile', {
                path: '/myprofile',
                title: 'Soulmate | ' + myProfile.name + '님의 프로필',
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                myProfile: myProfile,
                state: 'off',
                chatRooms: null,
                workSpaces: null,
            });
        } catch (err) {
            next(err);
        }
    },
    // 3. 나의 채널목록 페이지
    getMyChannelListPage: async (req, res, next) => {
        try {
            console.log(req.query.searchWord);
            const jsonWebToken = req.cookies.token;// 쿠키 웹 토큰
            const refreshToken = req.cookies.refreshToken;

            const resData = await channelService.getChannelListByUserId(jsonWebToken, refreshToken, req.query.searchWord, next);
            const staticData = await getCategoryData(next);

            hasError(resData.error);

            //나의 채널 목록 페이지 렌더링
            res.status(resData.status.code).render('channel/mychannel', {
                path: '/mychannels',
                title: 'Soulmate',
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                staticCategoryList: staticData.category,
                channelList: resData.channels,
                chatRooms: null,
                workSpaces: null,
                state: 'off'
            });
        } catch (err) {
            next(err);
        }
    },
    // 4. 채널 추가 페이지
    getAddChannelPage: async (req, res, next) => {
        try {
            const staticData = await getCategoryData(next);
            res.render('menu/create-channel', {
                path: '채널 추가 페이지',
                title: 'Soulmate',
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                staticCategoryList: staticData.category,
                chatRooms: null,
                workSpaces: null,
                state: 'off'
            });
        } catch (err) {
            next(err);
        }
    },
    // 5. 관심 채널 목록 페이지
    getMyWishChannelListPage: async (req, res, next) => {
        try {
            const resData = await channelService.getMyWishChannelList(req.cookies.token, req.query.searchWord, next);// 관심 채널 리스트

            hasError(resData.error);

            const staticData = await getCategoryData(next);// 서버 정적 데이터: 카테고리 목록

            res.status(resData.status.code).render('channel/mywishchannels', {
                path: '/wishchannels',
                title: 'soulmate | ' + req.cookies.clientName + '님의 관심 채널',
                staticCategoryList: staticData.category,
                channelList: resData.wishChannels,
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                chatRooms: null,
                workSpaces: null,
                state: 'off'
            })
        } catch (err) {
            next(err);
        }
    },
    // 6. 채널입장 -> 채널 내부 페이지
    getEnterMyChannelPage: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId;
            const searchWord = req.query.searchWord;
            const fileName = `channel/channel-${searchWord}`

            // 1. 해당 채널아이디 보내주고 해당 채널 입장 요청
            const channelDetailData = await channelService.getChannelDetailByChannelId(jsonWebToken, channelId, next);
            hasError(channelDetailData.error);
            const matchedChannel = channelDetailData.channel;

            console.log('matchedChannel: ', matchedChannel);

            // 2. 채팅방 목록 요청
            const chatRoomListData = await channelService.getChatRoomList(jsonWebToken, channelId, next);
            hasError(chatRoomListData.error);
            const matchedChatRoomList = chatRoomListData.chatRooms;

            // 3. 워크스페이스 목록 요청
            const workSpaceListData = await channelService.getWorkSpaceList(jsonWebToken, channelId, next);
            hasError(workSpaceListData.error);
            const matchedWorkSpaceList = workSpaceListData.workSpaces;
            console.log(matchedWorkSpaceList);
            // 4. 스크랩 목록 요청

            const state = 'on';
            // 2. 해당 채널 렌더링
            res.status(chatRoomListData.status.code).render(fileName, {
                path: `/mychannel/:channelId?searchWord=${searchWord}`,
                searchWord: searchWord,
                title: matchedChannel.channelName,
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                channel: matchedChannel,
                chatRooms: matchedChatRoomList,
                workSpaces: matchedWorkSpaceList,
                state: state
            });
        } catch (err) {
            next(err);
        }
    },
    // 7. 채팅방 입장 -> 채팅방 페이지
    getEnterChatRoomPage: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId;
            const chatRoomId = req.params.chatRoomId;

            // 1. 채팅 방
            const chatRoomData = await chatService.getLoadChatRoom(jsonWebToken, channelId, chatRoomId, next);
            hasError(chatRoomData.error);

            // 2. 채팅방 목록
            const chatRoomListData = await channelService.getChatRoomList(jsonWebToken, channelId, next);
            hasError(chatRoomData.error);

            // 3. 워크스페이스 목록 요청
            const workSpaceListData = await channelService.getWorkSpaceList(jsonWebToken, channelId, next);
            hasError(workSpaceListData.error);
            const matchedWorkSpaceList = workSpaceListData.workSpaces;

            console.log(chatRoomData);
            res.status(chatRoomListData.status.code).render('chat/chat-board', {
                path: '채팅방',
                title: chatRoomData.chatRoom.roomName,
                currentDate: `${new Date().getFullYear()}년  ${new Date().getMonth() + 1}월  ${new Date().getDate()}일`,
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                chatRooms: chatRoomListData.chatRooms,
                workSpaces: matchedWorkSpaceList,
                chats: chatRoomData.chatRoom.chats,
                members: chatRoomData.chatRoom.users,
                channel: { _id: channelId },
                chatRoomId: chatRoomData.chatRoom._id,
                state: 'on'
            });
        } catch (err) {
            next(err);
        }
    },
    // 8. 워크스페이스 입장 -> 워크스페이스 페이지
    getEnterWorkSpacePage: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            const channelId = req.params.channelId;
            const workspaceId = req.params.workspaceId;
            const query = req.query;

            // 1. 워크스페잇 세부정보
            const workSpaceData = await workspaceService.getLoadWorkspace(token, channelId, workspaceId, query, next);
            hasError(workSpaceData.error);

            // 2. 채팅룸 리스트
            const chatRoomListData = await channelService.getChatRoomList(token, channelId, next);
            hasError(chatRoomListData.error);
            const matchedChatRoomList = chatRoomListData.chatRooms;

            // 3. 워크스페이스 목록 요청
            const workSpaceListData = await channelService.getWorkSpaceList(token, channelId, next);
            hasError(workSpaceListData.error);
            const matchedWorkSpaceList = workSpaceListData.workSpaces;

            res.status(workSpaceData.status.code).render('workspace/workspace', {
                path: '/channel/workspace/:channelId/:workspaceId',
                title: workSpaceData.workSpace.workSpaceName,
                chatRooms: matchedChatRoomList,
                latestChat: chatRoomListData.chatRooms[0].chats,
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                workSpaces: matchedWorkSpaceList,
                workSpace: workSpaceData.workSpace,
                channel: { _id: channelId },
                state: 'on'

            });
        } catch (err) {
            next(err);
        }
    }
}

export default viewController;