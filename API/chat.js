import fetch from 'node-fetch';
import { successType, errorType } from '../util/status.js';

const chatAPI = {
    // 1. 채팅방 세부정보 요청
    getLoadChatRoom: async (token, channelId, chatRoomId, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/chat/' + channelId + '/' + chatRoomId, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 2. 실시간 채팅 저장 요청
    postSendChat: async (token, channelId, chatRoomId, formData, next) => {
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
            next(err);
        }
    },
    // 3. 실시간으로 채팅방에 파일 업로드(이미지, 문서등) 요청
    postUploadFileToChatRoom: async (token, channelId, chatRoomId, formData, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/chat/upload-file/' + channelId + '/' + chatRoomId, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: formData
            });

            const resData = await response.json();

            return resData;
        } catch (err) {
            next(err);
        }
    },
    // 4. 해당 채널에 속한 선택된 유저들을 초대
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
            next(err);
        }
    }
}

export default chatAPI;