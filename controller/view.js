import { successType, errorType } from '../util/status.js';
import viewService from '../service/view.js'
import viewAPI from '../API/view.js';

const viewController = {
    //메인 페이지
    getMainPage: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;// 쿠키 웹 토큰

            const resData = await viewAPI.getChannelListToServer();
            const chatRooms = null;

            // console.log('resData: ',resData);
            const channelList = resData.channels;
            // const status = resData.status;
            const state = 'off';

            res.render('index', {
                path: '메인 페이지',
                title: 'Soulmate 메인 페이지',
                clientId: req.cookies.clientId,
                photo: req.cookies.photo,
                channelList: channelList,
                chatRooms: chatRooms,
                state: 'off'
            });
        } catch (err) {
            throw err;
        }
    },
    // 해당유저의 채널리스트
    getMyChannelList: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;// 쿠키 웹 토큰

            const resData = await viewService.getMyChannelList(jsonWebToken, next);

            // console.log('resData: ', resData);
            const channelList = resData.channels;
            const status = resData.status;
            const state = 'off';

            // 나의 채널 목록 페이지
            res.status(status.code).render('channel/mychannel', {
                path: '유저 채널 리스트',
                title: 'Soulmate',
                clientId: req.cookies.clientId,
                photo: req.cookies.photo,
                channelList: channelList,
                chatRooms: null,
                state: state
            });
        } catch (err) {
            throw err;
        }
    },
    // 채널 추가 페이지
    getAddChannelPage: async (req, res, next) => {
        try {
            res.render('menu/create-channel',{
                path: '채널 추가 페이지',
                title: 'Soulmate',
                clientId: req.cookies.clientId,
                photo: req.cookies.photo,
                chatRooms: null,
                state: 'off'
            });
        } catch (error) {
            throw err;
        }
    }
}

export default viewController;