import { successType, errorType } from '../util/status.js';
import viewService from '../service/view.js'
import channelService from '../service/channel.js'
import viewAPI from '../API/view.js';
import fetch from 'node-fetch';
import { getCategoryData } from '../service/static-data.js';

/**
 * 1. 메인 페이지 == 오픈 채널 목록 페이지
 *  1-1. 오픈채널 세부 정보 페이지
 * 2. 내 프로필 관리 페이지
 * 3. 나의 채널 목록 페이지
 * 4. 채널 추가 페이지
 * 5. 관심 채널 목록 페이지
 * 6. 채널입장 -> 채널 내부 페이지
 * 7. 채팅방 입장 -> 채팅방 페이지
 */

const viewController = {
    // 1. 메인 페이지 ==  생성된 오픈 채널 목록 페이지
    getMainPage: async (req, res, next) => {
        try {
            const resData = await channelService.getOpenChannelList();

            const channelList = resData.channels;
            // const status = resData.status;

            res.render('index', {
                path: '메인 페이지',
                title: 'Soulmate 메인 페이지',
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                channelList: channelList,
                chatRooms: null,
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
            const jsonWebToken = req.cookies.token;

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
            });
        } catch (err) {
            next(err);
        }
    },
    // 3. 나의 채널 페이지
    getMyChannelListPage: async (req, res, next) => {
        try {
            console.log(req.query.searchWord);
            const jsonWebToken = req.cookies.token;// 쿠키 웹 토큰

            const resData = await channelService.getChannelListByUserId(jsonWebToken, req.query.searchWord, next);
            const staticData = await getCategoryData(next);

            const state = 'off';

            //나의 채널 목록 페이지 렌더링
            res.status(resData.status.code).render('channel/mychannel', {
                path: '/mychannels',
                title: 'Soulmate',
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                staticCategoryList: staticData.category,
                channelList: resData.channels,
                chatRooms: null,
                state: state
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
                state: 'off'
            });
        } catch (error) {
            next(err);
        }
    },
    // 5. 관심 채널 목록 페이지
    getMyWishChannelListPage: async (req, res, next) => {
        try {
            const resData = await channelService.getMyWishChannelList(req.cookies.token, req.query.searchWord, next);// 관심 채널 리스트
            const staticData = await getCategoryData(next);// 서버 정적 데이터: 카테고리 목록

            res.status(resData.status.code).render('channel/mywishchannels', {
                path: '/wishchannels',
                title: 'soulmate | ' + req.cookies.clientName + '님의 관심 채널',
                staticCategoryList: staticData.category,
                channelList: resData.wishChannels,
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                chatRooms: null,
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

            // 1. 해당 채널아이디 보내주고 해당 채널 입장 요청
            const channelDetailData = await channelService.getChannelDetailByChannelId(jsonWebToken, channelId, next);

            const matchedChannel = channelDetailData.channel;

            console.log('matchedChannel: ', matchedChannel);

            // 2. 채팅방 목록 요청
            const chatRoomListData = await channelService.getChatRoomList(jsonWebToken, channelId, next);

            const matchedChatRoomList = chatRoomListData.chatRooms;//동기화 해줘야해!!

            console.log('matchedChatRoomList: ', matchedChatRoomList);
            const state = 'on';
            // 2. 해당 채널 렌더링
            res.status(chatRoomListData.status.code).render('channel/enter-channel-profile', {
                path: '/mychannels/:channelId',
                title: matchedChannel.channelName,
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                channel: matchedChannel,
                chatRooms: matchedChatRoomList,
                state: state
            });
        } catch (err) {
            next(err);
        }
    }
}

export default viewController;