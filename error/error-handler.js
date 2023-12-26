import { customizeError } from "./error.js";

const errorHandler = async (error, req, res, next) => {
    try {
        console.log('미들웨어 함수 진입.... throw 된 에러: ', error);
        if (!error.statusCode) {
            error = customizeError(error);
        }

        // view 렌더링 오류 처리
        if (error.statusCode == 401) {
            res.status(error.statusCode).redirect('/logout');
        }

        if (error.statusCode == 404 && error.isViewRenderError) {
            let errorImageUrl = '/images/error404.gif';
            if(error.message == '해당 채널 멤버가 아닙니다.\n해당 채널의 멤버에게 초대를 받아보세요.') {
                errorImageUrl = '/images/no-data.png'
            }
            
            res.status(error.statusCode || 404).render('error/error404', {
                title: 'Not Found Data',
                path: null,
                clientName: req.session.clientName,
                photo: req.session.photo,
                channels: req.session.userChannels,
                error: error,
                errorImageUrl: errorImageUrl
            });
        }

        if (error.statusCode == 500) {
            res.status(error.statusCode || 500).render('error/error500', {
                title: 'Server Error..',
                path: null,
                clientName: req.session.clientName,
                photo: req.session.photo,
                channels: req.session.userChannels,
                error: error
            });
        }

        // view 렌더링 오류 제외한 오류 처리
        res.status(error.statusCode || 500).json({
            error: error
        })
    } catch (error) {
        res.status(error.statusCode || 500).render('error/error500', {
            title: 'Server Error..',
            path: null,
            clientName: req.session.clientName,
            photo: req.session.photo,
            channels: null,
            error: error
        });
    }
}

export default errorHandler;