import fetch from 'node-fetch';

const clientControlller = {
    // 해당유저의 채널리스트
    getMyChannelList: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;

            const response = await fetch('http://localhost:8080/v1/channel', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            const channelList = data.channels;
            const chatRooms = null;
            // console.log(channelList);

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
    // 해당 채널 입장
    getEnterMyChannel: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId;

            // 1. 해당 채널아이디 보내주고 해당채널입장 요청
            const response = await fetch('http://localhost:8080/v1/channel/' + channelId, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();//동기화 해줘야해!!

            const matchedChannel = data.channel;

            console.log('matchedChannel: ', matchedChannel);

            // 2. 채팅방 목록 요청
            const response2 = await fetch('http://localhost:8080/v1/channel/' + channelId + '/chat', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                }
            });

            const data2 = await response2.json();//동기화 해줘야해!!

            const matchedChatRooms = data2.chatRooms;
            console.log('matchedChatRooms: ', matchedChatRooms);
            // 2. 해당 채널 렌더링
            res.status(200).render('channel/enter-channel-profile', {
                path: '채널 입장',
                title: matchedChannel.channelName,
                clientId: req.cookies.clientId,
                channel: matchedChannel,
                chatRooms: matchedChatRooms
            });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    //채팅 방 접속
    getMyChatRoombyChannelId: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId;
            const chatRoomId = req.params.chatRoomId;
            // console.log(`channelId: ${channelId}, chatRoomId: ${chatRoomId}`);
            const response = await fetch('http://localhost:8080/v1/chat/' + channelId + '/' + chatRoomId, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();//동기화 해줘야해!!
            // console.log('data: ', data);
            const userChatRooms = data.chatRooms;//네이브바에 채팅목록 데이터
            const chatRoomData = data.chatRoomData;// 채팅 박스
            const userList = data.userList;// 참여자 보드에 들어갈 참여자 데이터

            // console.log('chatRoomData: ', chatRoomData);
            // console.log('userChatRooms: ', userChatRooms);

            res.render('chat/chat-board', {
                title: chatRoomData.roomName,
                clientId: req.cookies.clientId,
                chatRooms: userChatRooms,
                chatList: chatRoomData.chatList,
                userList: userList,
                channel: { _id: channelId },
                chatRoomId: chatRoomData._id
            });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 채널 추가
    postCreateChannel: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelName = req.body.channelName;
            const thumbnail = req.body.thumbnail;
            console.log('요청 바디 : ', req.body);
            // {
            //     "channelName":"Soulmate 앱 개발팀",
            //     "owner": {
            //         "ownerId": "645bc55b7d8b60a0021cb1b5",
            //         "ownerName": "카라멜"
            //     },
            //     "thumbnail":"/images/android-chrome-192x192.png"
            // }
            const response = await fetch('http://localhost:8080/v1/channel/create', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelName: channelName,
                    thumbnail: thumbnail
                })
            });

            const data = await response.json();
            const channel = data.channel;
            console.log(channel);

            res.redirect('http://localhost:3000/client/mychannels');

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 채널 퇴장
    postExitChannel: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId;
            console.log(channelId);
            const response = await fetch('http://localhost:8080/v1/channel/exit/' + channelId, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId
                })
            });

            const data = await response.json();
            res.redirect('http://localhost:3000/client/mychannels');

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 채널에 유저 초대
    postInviteUserToChannel: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId;
            const invitedUserId = req.body.invitedUserId;

            console.log('invitedUserId: ', invitedUserId);
            console.log('channelId: ', channelId);

            const response = await fetch('http://localhost:8080/v1/channel/invite/' + channelId, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId,
                    invitedUserId: invitedUserId
                })
            });

            const data = await response.json();

            res.redirect('http://localhost:3000/client/mychannels/' + data.channel._id);
        } catch (error) {

        }
    },
    //채팅방 생성
    postCreateChatRoom: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId
            const roomName = req.body.roomName;

            const response = await fetch('http://localhost:8080/v1/channel/' + channelId + '/chatRoom/create', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId,
                    roomName: roomName
                })
            });

            const data = await response.json();

            res.redirect('http://localhost:3000/client/chat/' + data.chatRoom.channelId + '/' + data.chatRoom._id);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 채팅방 유저 초대
    postInviteUsersToChatRoom: async (req, res, next) => {
        try {
            const jsonWebToken = req.cookies.token;
            const channelId = req.params.channelId
            const chatRoomId = req.params.chatRoomId;
            const usersJson = req.body.users;
            const checkedUsersId = [];

            console.log(usersJson);
            if (!usersJson) {
                return res.redirect('http://localhost:3000/client/chat/' + channelId + '/' + chatRoomId);;
            }

            if (Array.isArray(usersJson)) {
                const ids = usersJson.map(user => {
                    const parsingData = JSON.parse(user);
                    return parsingData._id;
                });
                checkedUsersId = [...ids];
            } else {
                checkedUsersId.push(JSON.parse(usersJson)._id);
            }


            console.log(checkedUsersId);
            const response = await fetch('http://localhost:8080/v1/chat/invite/' + channelId + '/' + chatRoomId, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + jsonWebToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId,
                    chatRoomId: chatRoomId,
                    selectedId: checkedUsersId
                })
            });

            res.redirect('http://localhost:3000/client/chat/' + channelId + '/' + chatRoomId);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 실시간 채팅
    postSendChat: async (req, res, next) => {
        console.log('req.body: ', req.body);
        const jsonWebToken = req.cookies.token;
        const channelId = req.params.channelId;
        const chatRoomId = req.params.chatRoomId;
        const chat = req.body.chat;
        console.log('chat: ', chat);
        console.log('channelId: ', channelId);
        console.log('chatRoomId: ', chatRoomId);
        const response = await fetch('http://localhost:8080/v1/chat/' + channelId + '/' + chatRoomId, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + jsonWebToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channelId: channelId,
                chatRoomId: chatRoomId,
                chat: chat
            })
        });

        const data = await response.json();

        res.status(200).json({
            chatRoom: data.chatRoom,
            clientId: req.cookies.clientId,
            photo: data.photo
        });
    }
}

export default clientControlller;


