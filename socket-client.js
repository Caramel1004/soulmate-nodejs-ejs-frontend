import { io } from 'socket.io-client';

const socketClient = (req, res, next) => {
    const socket = io('http://localhost:8080');
    console.log('클라이언트 소켓 가동 중!!!');

    // socket.on('loadChat', data => {
    //     console.log('미들웨어 loadChat!!!');
    //     console.log('백엔드에서 넘어온 데이터: ', data);
    // });

    socket.on('sendChat', data => {
        console.log('미들웨어 sendChat!!!');
        console.log('백엔드에서 넘어온 데이터: ', data);
        return data;
    });

    socket.on('connection', data => {
        console.log('미들웨어 connection!!!');
    });
}

export default socketClient;