import chatAPI from '../API/chat.js'

const chatService = {
    // 1. 채팅룸 로딩
    getLoadChatRoom: async (jsonWebToken, refreshToken, channelId, chatRoomId, next) => {
        try {
            const data = await chatAPI.getLoadChatRoom(jsonWebToken, refreshToken, channelId, chatRoomId, next);

            const chatObjList = data.chatRoom.chats;

            if (chatObjList.length > 0) {
                let year;
                let month;
                let day;
                chatObjList.map(chat => {
                    year = new Date(chat.createdAt).getFullYear();
                    month = new Date(chat.createdAt).getMonth() + 1;
                    day = new Date(chat.createdAt).getDate();
                    const timestamp = new Date(chat.createdAt).toTimeString().split(' ')[0];//ex)09:51:35 GMT+0900 (한국 표준시)

                    let hour = parseInt(timestamp.split(':')[0]);

                    const when = hour >= 12 ? '오후' : '오전';

                    if (month < 10) {
                        month = '0' + month;
                    } else if (month > 12) {
                        month = '0' + 1;
                    }

                    if (day < 10) {
                        day = '0' + day
                    }
                    if (when === '오후' && hour > 12) {
                        hour %= 12;
                    }

                    const min = timestamp.split(':')[1];

                    chat.fomatDate = `${year}-${month}-${day}  ${when} ${hour}:${min}`;

                    return chat;
                });

                // console.log(chatObjList)
                // console.log('data: ', data.chatRoom.chats[0]);
                // data.chatRoomData.chats = [...chatObjList];
            }
            return data;
        } catch (err) {
            next(err);
        }
    },
    // 2. 실시간 채팅
    postSendChat: async (token, refreshToken, channelId, chatRoomId, formData, next) => {
        try {
            const data = await chatAPI.postSendChat(token, refreshToken, channelId, chatRoomId, formData, next);

            return data;
        } catch (err) {
            next(err);
        }
    },
    // 3. 채팅방 퇴장
    patchExitChatRoom: async (token, refreshToken, channelId, chatRoomId, next) => {
        try {
            const data = await chatAPI.patchExitChatRoom(token, refreshToken, channelId, chatRoomId, next);

            return data;
        } catch (err) {
            next(err)
        }
    }
}

export default chatService