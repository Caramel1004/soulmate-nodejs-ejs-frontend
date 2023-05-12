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
            console.log(channelList);

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
    // 채널 추가
    postCreateChannel: async (req, res, next) => {
        try {
            const channelName = req.body.channelName;
            const thumbnail = req.body.thumbnail;
            console.log('req.body: ',req);
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
            const channel = await response.json();
            console.log(channel);
            res.render('channel/enter-channel', {
                channel: channel
            })
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
}

export default clientControlller;


