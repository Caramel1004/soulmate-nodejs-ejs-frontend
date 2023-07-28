import { io } from 'socket.io-client';

let socket;

const socketClient = {
    init: connectUrl => {
        socket = io(connectUrl);
        console.log('백엔드 서버와 웹소켓 통신 준비 완료!!')
        return socket;
    },
    getSocketClient: socket => {
        if (!socket) {
            const error = new Error('소켓이 선언되지 않았습니다.');
            error.stausCode = 404;
        }
        return socket;
    }
}

export default socketClient;