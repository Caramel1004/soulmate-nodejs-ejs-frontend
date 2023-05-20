// import { io } from '/socket.io/socket.io.js';
// import { io } from 'socket.io-client';

const send = async btn => {
    try {
        const channelId = btn.parentNode.querySelector('[name = channelId]').value;
        const chat = btn.parentNode.querySelector('[name = content]').value;
        const chatRoomId = btn.parentNode.querySelector('[name = chatRoomId]').value;
        console.log('chat : ', chat);
        console.log('chatRoomId: ', chatRoomId);
        const res = await fetch('http://localhost:3000/client/chat/' + channelId + '/' + chatRoomId + '/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channelId: channelId,
                chatRoomId: chatRoomId,
                chat: chat
            })
        });
        const data = await res.json();
        console.log(data);
    } catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

    // const box = btn.parentNode.closest('.board');
    // console.log(box);
    // // const history = box.closest('.board-chat__history');
    // // console.log(history);

    // // document.body.appendChild(document.createElement('p'));
    const socket = io.connect('http://localhost:3000');
    socket.on('chat', data => {
        const chat = data.chat;
        console.log('data.chat: ', chat);
        const pTag = document.createElement('p');
        console.log('p: ', p);
    });

}