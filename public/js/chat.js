// 채팅 버튼
const createUnitChat = async () => {
    console.log('tag 생성!!!');
    try {
        const url = window.location.href;
        // const jsonWebToken = document.cookie;
        const channelId = url.split('/')[5];
        const chatRoomId = url.split('/')[6];
        const content = document.getElementById('content').value;
        console.log('channelId : ', channelId);
        console.log('chatRoomId : ', chatRoomId);
        console.log('content : ', content);

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
    } catch (err) {
        console.log(err);
    }
}

// 이슈: 한글입력 후 엔터시 중복 입력되는 현상 발생. -> 이벤트가 두번 발생함
// keyup 일때 영문입력시 event.isComposing이 false 즉, 문자 조합을 하지 않는다는 소리이다.
// 근데 영어와 다르게 한글입력시 문자를 조합하기 때문에 event.isComposing가 true이다.
// 그래서 한글 입력 후 엔터를 누르게 되면 아직 조합중인 상태이기 때문에 한글: keyup + 엔터 keydown -> keypress -> keyup 두번 발생
// keypress는 한글 인식을 하지 않기 떄문에 단순히 enter처리만 할거면 keypress로 하자.
// 만약 줄 바꿈 키를 만들고 싶다면....
const keyPressCreateUnitChat = async event => {
    console.log(event);
    console.log(event.isComposing);

    if (event.keyCode === 13) {
        try {
            console.log('엔터키 누름!!');
            await createUnitChat();
        } catch (err) {
            console.log(err);
        }
    }

    console.log('엔터키 안누름!!');
}

document.getElementById('send').addEventListener('click', createUnitChat);
document.getElementById('content').addEventListener('keypress', keyPressCreateUnitChat);

// 서브 보드 토글버튼
const toggleButton = type => {
    const board = document.querySelector('.board-user')
    console.log('토글!!!');
    console.log('board: ', board);
    if (type === '참여자') {
        // 토글버튼
        document.getElementById('btn-toggle-user').classList.add('active');
        document.getElementById('btn-toggle-task').classList.remove('active');

        //유저 보드, 유저 박스
        document.querySelector('.board-user').classList.remove('hidden');

        //업무 보드
        document.querySelector('.board-task').classList.add('hidden');

    } else if (type === '업무') {
        // 토글버튼
        document.getElementById('btn-toggle-user').classList.remove('active');
        document.getElementById('btn-toggle-task').classList.add('active');

        //유저 보드, 유저 박스
        document.querySelector('.board-user').classList.add('hidden');

        //업무 보드
        document.querySelector('.board-task').classList.remove('hidden');
    }
}

const onClickLoadUsersInChannel = async event => {
    const url = window.location.href;
    const channelId = url.split('/')[5];
    const response = await fetch('http://localhost:8080/v1/chat/' + channelId + '/channel-users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log('data: ', data.users);

    document.querySelector('.box__btn-toggle').classList.add('hidden');
    document.querySelector('.board-user').classList.add('hidden');
    document.querySelector('.board-channel-user-list').classList.remove('hidden');
    console.log('팀원추가!!!');
}

const onClicExitUsers = event => {
    document.querySelector('.box__btn-toggle').classList.remove('hidden');
    document.querySelector('.board-user').classList.remove('hidden');
    document.querySelector('.board-channel-user-list').classList.add('hidden');
}
