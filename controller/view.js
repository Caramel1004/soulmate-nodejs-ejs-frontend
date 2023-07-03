import { successType, errorType } from '../util/status.js';
import viewService from '../service/view.js'
import channelService from '../service/channel.js'
import viewAPI from '../API/view.js';

/**
 * 1. 메인 페이지 == 오픈 채널 목록 페이지
 *  1-1. 오픈채널 세부 정보 페이지
 * 2. 내 프로필 관리 페이지
 * 3. 나의 채널 목록 페이지
 * 4. 채널 추가 페이지
 * 5. 관심 채널 목록 페이지
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

            const state = 'off';

            //나의 채널 목록 페이지 렌더링
            res.status(resData.status.code).render('channel/mychannel', {
                path: '/mychannels',
                title: 'Soulmate',
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
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
            res.render('menu/create-channel', {
                path: '채널 추가 페이지',
                title: 'Soulmate',
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
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
            const resData = await channelService.getMyWishChannelList(req.cookies.token, req.query.searchWord, next);
            console.log('wish: ',resData.wishChannels);
            res.status(resData.status.code).render('channel/mywishchannels',{
                path: '/mywishchannels',
                title: 'soulmate | ' + req.cookies.clientName + '님의 관심 채널',
                channelList: resData.wishChannels,
                clientName: req.cookies.clientName,
                photo: req.cookies.photo,
                chatRooms: null,
                state: 'off'
            })
        } catch (err) {
            next(err);
        }
    }
}

export default viewController;