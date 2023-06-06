import { successType, errorType } from '../util/status.js';
import viewService from '../service/view.js'

const viewController = {
    getMainPage: async (req, res, next) => {
        try {
            const chatRooms = null;
            res.render('index', {
                path: '메인 페이지',
                title: 'Soulmate 메인 페이지',
                clientId: req.cookies.clientId,
                chatRooms: chatRooms
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

            console.log('resData: ', resData);
            const channelList = resData.channels;
            const status = resData.status;

            // 나의 채널 목록 페이지
            res.status(status.code).render('channel/mychannel', {
                path: '유저 채널 리스트',
                title: 'Soulmate',
                clientId: req.cookies.clientId,
                channelList: channelList,
                chatRooms: null
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
                chatRooms: null
            });
        } catch (error) {
            throw err;
        }
    }
}

export default viewController;