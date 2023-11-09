import channelService from '../service/channel.js'
import workspaceService from '../service/workspace.js'
import userService from '../service/user.js';
import chatService from '../service/chat.js';
import { getCategoryData } from '../service/static-data.js';

import { hasError, hasNewAuthToken } from '../validator/valid.js';
import { successType, errorType } from '../util/status.js';
import redisClient from '../util/redis.js';


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
            const { token, refreshToken, sid } = req.signedCookies;
            const { searchWord, category } = req.query;
            const resData = await channelService.getOpenChannelList(searchWord, category, next);
            hasError(resData.error);

            const channelList = resData.channels;

            if (req.signedCookies.token) {
                const data = await userService.getMyProfile(token, refreshToken, next);

                hasNewAuthToken(res, data.authStatus);
                for (const wishChannel of data.matchedUser.wishChannels) {
                    channelList.map(channel => {
                        if (channel._id.toString() === wishChannel.toString()) {
                            channel.isUserWishChannel = true;
                            return channel;
                        }
                    });
                }
            }

            const staticData = await getCategoryData(next);// 서버 정적 데이터: 카테고리 목록

            res.render('index', {
                path: '/',
                title: 'Soulmate 메인 페이지',
                clientName: req.session.clientName,
                photo: req.session.photo,
                channels: req.session.userChannels,
                channelList: channelList,
                staticCategoryList: staticData.category,
            });
        } catch (err) {
            err.isViewRenderError = true
            next(err);
        }
    },
    // 1-1. 오픈 채널 세부 정보 페이지
    getOpenChannelDetailPage: async (req, res, next) => {
        try {
            const { token, refreshToken, sid } = req.signedCookies;
            const { channelId } = req.params;
            const channelData = await channelService.getOpenChannelDetail(channelId, next);
            hasError(channelData.error);

            const channelDetailData = channelData.channelDetail;

            if (req.signedCookies.token) {
                const userData = await userService.getMyProfile(token, refreshToken, next);
                hasNewAuthToken(res, userData.authStatus);

                for (const wishChannel of userData.matchedUser.wishChannels) {
                    if (channelDetailData._id.toString() === wishChannel.toString()) {
                        channelDetailData.isUserWishChannel = true;
                        break;
                    }
                }
            }

            res.status(channelData.status.code).render('channel/channel-intro-detail', {
                path: `/open/:channelId`,
                title: channelDetailData.channelName,
                clientName: req.session.clientName,
                channels: req.session.userChannels,
                photo: req.session.photo,
                channel: channelDetailData
            });
        } catch (err) {
            err.isViewRenderError = true
            next(err)
        }
    },
    // 2. 내 프로필 관리 페이지
    getMyProfilePage: async (req, res, next) => {
        try {
            const { token, refreshToken, sid } = req.signedCookies;

            const resData = await userService.getMyProfile(token, refreshToken, next);
            hasError(resData.error);
            hasNewAuthToken(res, resData.authStatus);

            const myProfile = resData.matchedUser;
            console.log(myProfile);
            res.render('user/myprofile', {
                path: '/myprofile',
                title: 'Soulmate | ' + myProfile.name + '님의 프로필',
                clientName: req.session.clientName,
                photo: req.session.photo,
                channels: req.session.userChannels,
                myProfile: myProfile
            });
        } catch (err) {
            err.isViewRenderError = true
            next(err);
        }
    },
    // 3. 나의 채널목록 페이지
    getMyChannelListPage: async (req, res, next) => {
        try {
            const { token, refreshToken, sid } = req.signedCookies;

            const resData = await channelService.getChannelListByUserId(token, refreshToken, req.query.searchWord, next);
            hasError(resData.error);
            hasNewAuthToken(res, resData.authStatus);
            const staticData = await getCategoryData(next);

            //나의 채널 목록 페이지 렌더링
            res.status(resData.status.code).render('channel/mychannel', {
                path: '/mychannels',
                title: 'Soulmate',
                clientName: req.session.clientName,
                photo: req.session.photo,
                channels: req.session.userChannels,
                staticCategoryList: staticData.category,
                channelList: resData.channels
            });
        } catch (err) {
            err.isViewRenderError = true
            next(err);
        }
    },
    // 4. 채널 추가 페이지
    getAddChannelPage: async (req, res, next) => {
        try {
            const { sid } = req.signedCookies;
            const staticData = await getCategoryData(next);
            res.render('menu/create-channel', {
                path: '/channel',
                title: 'Soulmate',
                clientName: req.session.clientName,
                photo: req.session.photo,
                channels: req.session.userChannels,
                staticCategoryList: staticData.category,
            });
        } catch (err) {
            err.isViewRenderError = true
            next(err);
        }
    },
    // 5. 관심 채널 목록 페이지
    getMyWishChannelListPage: async (req, res, next) => {
        try {
            const resData = await channelService.getMyWishChannelList(req.signedCookies.token, req.signedCookies.refreshToken, req.query.category, req.query.searchWord, next);// 관심 채널 리스트
            hasError(resData.error);
            hasNewAuthToken(res, resData.authStatus);

            const staticData = await getCategoryData(next);// 서버 정적 데이터: 카테고리 목록

            res.status(resData.status.code).render('channel/mywishchannels', {
                path: '/wishchannels',
                title: 'soulmate | ' + req.session.clientName + '님의 관심 채널',
                staticCategoryList: staticData.category,
                channelList: resData.wishChannels,
                clientName: req.session.clientName,
                photo: req.session.photo,
                channels: req.session.userChannels,
            })
        } catch (err) {
            err.isViewRenderError = true
            next(err);
        }
    },
    // 6. 채널입장 -> 채널 내부 페이지
    getEnterMyChannelPage: async (req, res, next) => {
        try {
            const jsonWebToken = req.signedCookies.token;
            const channelId = req.params.channelId;
            const { searchType, searchWord } = req.query;
            const fileName = `channel/channel-${searchType}`;

            // 1. 해당 채널아이디 보내주고 해당 채널 입장 요청
            const channelDetailData = await channelService.getChannelDetailByChannelId(jsonWebToken, req.signedCookies.refreshToken, channelId, next);
            hasError(channelDetailData.error);
            hasNewAuthToken(res, channelDetailData.authStatus);
            const matchedChannel = channelDetailData.channel;
            if (req.signedCookies.token) {
                const data = await userService.getMyProfile(req.signedCookies.token, req.signedCookies.refreshToken, next);

                for (const wishChannel of data.matchedUser.wishChannels) {
                    matchedChannel.isUserWishChannel = false;
                    if (matchedChannel._id.toString() === wishChannel.toString()) {
                        matchedChannel.isUserWishChannel = true;
                        break;
                    }
                }
            }

            let matchedChatRoomList = null
            if (searchType === 'chatRooms') {
                // 2. 채팅방 목록 요청
                const chatRoomListData = await channelService.getChatRoomList(jsonWebToken, req.signedCookies.refreshToken, channelId, searchWord, next);
                hasError(chatRoomListData.error);
                matchedChatRoomList = chatRoomListData.chatRooms;
            }

            let matchedWorkSpaceList = null;
            let matchedOpenWorkSpaceList = null;
            if (searchType === 'workspaces') {
                // 3. 워크스페이스 목록 요청
                const workSpaceListData = await channelService.getWorkSpaceList(jsonWebToken, req.signedCookies.refreshToken, channelId, searchWord, next);
                hasError(workSpaceListData.error);
                matchedWorkSpaceList = workSpaceListData.workSpaces;
                matchedOpenWorkSpaceList = workSpaceListData.openWorkSpaces;
            }

            // 4. 해당 채널 렌더링
            res.status(channelDetailData.status.code).render(fileName, {
                path: `/mychannel/:channelId?searchType=${searchType}`,
                title: matchedChannel.channelName,
                clientName: req.session.clientName,
                channels: req.session.userChannels,
                photo: req.session.photo,
                channel: matchedChannel,
                chatRooms: matchedChatRoomList,
                workSpaces: matchedWorkSpaceList,
                openWorkSpaces: matchedOpenWorkSpaceList,
                searchWord: searchWord
            });
        } catch (err) {
            err.isViewRenderError = true
            next(err);
        }
    },
    // 7. 채팅방 입장 -> 채팅방 페이지
    getEnterChatRoomPage: async (req, res, next) => {
        try {
            const { token, refreshToken, sid } = req.signedCookies;
            const channelId = req.params.channelId;
            const chatRoomId = req.params.chatRoomId;

            // 1. 채팅 방
            const chatRoomData = await chatService.getLoadChatRoom(token, refreshToken, channelId, chatRoomId, next);
            hasError(chatRoomData.error);
            hasNewAuthToken(res, chatRoomData.authStatus);
            console.log('chatRoomData.chatRoom.chats: ', chatRoomData.chatRoom.chats);
            res.status(chatRoomData.status.code).render('chat/chat-board', {
                path: '채팅방',
                title: chatRoomData.chatRoom.roomName,
                currentDate: `${new Date().getFullYear()}년  ${new Date().getMonth() + 1}월  ${new Date().getDate()}일`,
                clientName: req.session.clientName,
                photo: req.session.photo,
                channels: req.session.userChannels,
                chats: chatRoomData.chatRoom.chats,
                members: chatRoomData.chatRoom.users,
                channel: { _id: channelId },
                chatRoomId: chatRoomData.chatRoom._id,
            });
        } catch (err) {
            err.isViewRenderError = true
            next(err);
        }
    },
    // 8. 워크스페이스 입장 -> 워크스페이스 페이지
    getEnterWorkSpacePage: async (req, res, next) => {
        try {
            const { token, refreshToken, sid } = req.signedCookies;
            const channelId = req.params.channelId;
            const workspaceId = req.params.workspaceId;
            const query = req.query;

            // 1. 워크스페이스 세부정보
            const workSpaceData = await workspaceService.getLoadWorkspace(token, refreshToken, channelId, workspaceId, query, next);
            hasError(workSpaceData.error);
            hasNewAuthToken(res, workSpaceData.authStatus);

            res.status(workSpaceData.status.code).render('workspace/workspace', {
                path: '/channel/workspace/:channelId/:workspaceId',
                title: workSpaceData.workSpace.workSpaceName,
                clientName: req.session.clientName,
                photo: req.session.photo,
                channels: req.session.userChannels,
                workSpace: workSpaceData.workSpace,
                channel: { _id: channelId }
            });
        } catch (err) {
            err.isViewRenderError = true
            next(err);
        }
    }
}

export default viewController;