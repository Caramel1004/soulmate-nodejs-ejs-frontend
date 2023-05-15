import fetch from 'node-fetch';


const clientControlller = {
    // 해당유저의 채널리스트
    getMyChannelList: async (req, res, next) => {
        try {
            const response = await fetch('http://localhost:8080/v1/channel/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            const channelList = data.channels;
            // console.log(channelList);

            res.render('channel/mychannel', {
                title: 'Soulmate',
                channelList: channelList
            })
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
            const channelId = req.params.channelId;
            // 1. 해당 채널아이디 보내주고 해당채널입장 요청
            const response = await fetch('http://localhost:8080/v1/channel/' + channelId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();//동기화 해줘야해!!

            const matchedChannel = data.channel;

            console.log('matchedChannel: ', matchedChannel);

            // 2. 해당 채널 렌더링
            // res.redirect('/mychannels/'+matchedChannel._id);
            await res.status(200).render('channel/enter-channel-profile', {
                title: 'Soulmate',
                channel: matchedChannel
            });
            // await res.status(200).render('includes/navigation', {
            //     title: 'Soulmate',
            //     channel: matchedChannel
            // });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    //채팅 방
    getMyChatRoombyChannelId: async (req, res, next) => {
        try {
            console.log('chat room!!!');
            res.render('chat/chat-board', {
                title: 'Soulmate-board'
            })
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
            const channelName = req.body.channelName;
            const thumbnail = req.body.thumbnail;
            console.log('req.body: ', req.body);
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelName: channelName,
                    thumbnail: thumbnail,
                    owner: {
                        ownerId: '645bc55b7d8b60a0021cb1b5',
                        ownerName: '카라멜'
                    }
                })
            });

            const data = await response.json();
            const channel = data.channel;
            console.log(channel);

            res.render('channel/enter-channel-profile', {
                title: channel.channelName,
                channel: channel,
            });
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
            const channelId = req.params.channelId;
            console.log(channelId);
            const response = await fetch('http://localhost:8080/v1/channel/exit/' + channelId, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channelId: channelId
                })
            });

            const data = await response.json();
            console.log('data: ', data);
            // const channel = data.channel;
            res.redirect('http://localhost:3000/client/mychannels');

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
}

export default clientControlller;


