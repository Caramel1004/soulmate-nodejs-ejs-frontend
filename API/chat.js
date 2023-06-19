import fetch from 'node-fetch';
import { successType, errorType } from '../util/status.js';

const chatAPI = {
    // 실시간 채팅
    postSendChat: async (token, channelId, chatRoomId, formData) => {
        try {
            const response = await fetch('http://localhost:8080/v1/chat/' + channelId + '/' + chatRoomId, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: formData
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            throw err;
        }
    },
    // 실시간으로 채팅방에 파일 업로드(이미지, 문서등)
    postUploadFileToChatRoom: async (token, channelId, chatRoomId, formData) => {
        try {
            const response = await fetch('http://localhost:8080/v1/chat/upload-file/' + channelId + '/' + chatRoomId, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: formData
            });

            // console.log('response: ',response);
            const resData = await response.json();

            return resData;
        } catch (err) {
            throw err;
        }
    },
    // 해당 채널에 속한 선택된 유저들을 초대
    postInviteUsersToChatRoom: async (token, body, channelId, chatRoomId) => {
        try {
            const response = await fetch('http://localhost:8080/v1/chat/invite/' + channelId + '/' + chatRoomId, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            throw err;
        }
    }
}

export default chatAPI;