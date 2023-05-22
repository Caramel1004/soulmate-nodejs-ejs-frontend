import socketClient from "../../socket-client";

const send = btn => {

    const channelId = btn.parentNode.querySelector('[name = channelId]').value;
    const chat = btn.parentNode.querySelector('[name = content]').value;
    const chatRoomId = btn.parentNode.querySelector('[name = chatRoomId]').value;
    console.log('chat : ', chat);
    console.log('chatRoomId: ', chatRoomId);

}