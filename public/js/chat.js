// 채팅 버튼
const createUnitChat = async () => {
    console.log('tag 생성!!!');
    try {
        const url = window.location.href;
        // const jsonWebToken = document.cookie;
        const channelId = url.split('/')[5];
        const chatRoomId = url.split('/')[6];
        const content = document.getElementById('content').value;
        console.log('channelId : ',channelId);
        console.log('chatRoomId : ',chatRoomId);
        console.log('content : ',content);

        const response = await fetch('http://localhost:3000/client/chat/' + channelId + '/' + chatRoomId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat: content
            })
        });
        console.log('채팅 처리 완료!!!');
    }catch(err){
        console.log(err);
    }
}

const keyUpCreateUnitChat = () => {
    if (event.keyCode == 13) {
        createUnitChat();
    }
}

document.getElementById('send').addEventListener('click', createUnitChat);
document.getElementById('content').addEventListener('keyup', keyUpCreateUnitChat);

// 서브 보드 토글버튼
const toggleButton = type => {
    const board = document.querySelector('.board-user')
    console.log('토글!!!');
    console.log('board: ', board);
    if (type === '참여자') {
        // 토글버튼
        document.getElementById('user').classList.add('active');
        document.getElementById('task').classList.remove('active');

        //유저 보드, 유저 박스
        document.querySelector('.board-user').classList.remove('hidden');

        //업무 보드
        document.querySelector('.board-task').classList.add('hidden');

    } else if (type === '업무') {
        // 토글버튼
        document.getElementById('user').classList.remove('active');
        document.getElementById('task').classList.add('active');

        //유저 보드, 유저 박스
        document.querySelector('.board-user').classList.add('hidden');

        //업무 보드
        document.querySelector('.board-task').classList.remove('hidden');
    }
}
