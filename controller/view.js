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
        } catch (error) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 해당유저의 채널리스트
    getMyChannelList: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;// 쿠키 웹 토큰

            const data = await viewService.getMyChannelList(jsonWebToken);

            console.log(data);
            const channelList = data.channels;
            const chatRooms = null;

            // 나의 채널 목록 페이지
            res.render('channel/mychannel', {
                path: '유저 채널 리스트',
                title: 'Soulmate',
                clientId: req.cookies.clientId,
                channelList: channelList,
                chatRooms: chatRooms
            });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    getAddChannelPage: async (req, res, next) => {

    }
}

export default viewController;