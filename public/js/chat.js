window.onload = init();

function init() {
    const historyTag = document.querySelector('.board-chat__box-history');

    //채팅박스 스크롤 맨 아래로 위치
    historyTag.scrollTop = historyTag.scrollHeight;
}

// 채팅 방 파일 업로드 post요청
const postUploadFileToChatRoom = async () => {
    console.log('tag 생성!!!');
    try {
        const file = document.getElementById('file').files[0];
        if(!file) {
            return;
        }
        const url = window.location.href;

        const channelId = url.split('/')[5];
        const chatRoomId = url.split('/')[6];
        console.log('channelId : ', channelId);
        console.log('chatRoomId : ', chatRoomId);
        console.log('file : ', file);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:3000/client/chat/upload-file/' + channelId + '/' + chatRoomId, {
            method: 'POST',
            body: formData
        });
        console.log('채팅 처리 완료!!!');
    } catch (err) {
        console.log(err);
    }
}
// 채팅 내용 post요청
const postSendChat = async () => {
    console.log('tag 생성!!!');
    try {
        const content = document.getElementById('content').value;
        if(content == ""){
            return;
        }

        const url = window.location.href;

        const channelId = url.split('/')[5];
        const chatRoomId = url.split('/')[6];
        const replaceContent = content.replace('\r\n', '<br>');
        console.log('channelId : ', channelId);
        console.log('chatRoomId : ', chatRoomId);
        console.log('replaceContent : ', replaceContent);

        const formData = new FormData();
        formData.append('chat', replaceContent);

        await fetch('http://localhost:3000/client/chat/' + channelId + '/' + chatRoomId, {
            method: 'POST',
            body: formData
        });
        console.log('채팅 처리 완료!!!');
    } catch (err) {
        console.log(err);
    }
}

// 채팅 박스에 textarea 키보드 엔터 시 이벤트
// 이슈: 한글입력 후 엔터시 중복 입력되는 현상 발생. -> 이벤트가 두번 발생함
// keyup 일때 영문입력시 event.isComposing이 false 즉, 문자 조합을 하지 않는다는 소리이다.
// 근데 영어와 다르게 한글입력시 문자를 조합하기 때문에 event.isComposing가 true이다.
// 그래서 한글 입력 후 엔터를 누르게 되면 아직 조합중인 상태이기 때문에 한글: keyup + 엔터 keydown -> keypress -> keyup 두번 발생
// keypress는 한글 인식을 하지 않기 떄문에 단순히 enter처리만 할거면 keypress로 하자.
// 만약 줄 바꿈 키를 만들고 싶다면....
const onKeyDownCreateUnitChat = async event => {
    console.log(event.keyCode);
    console.log(event.isComposing);

    const content = document.getElementById('content').value;
    const replacedContent = replaceText(content);

    if (event.keyCode === 13 && replacedContent === "") {
        return document.getElementById('content').value.replace('\r\n', '');
    }

    if (event.keyCode === 13 && !event.shiftKey && replacedContent !== "") {
        try {
            console.log('엔터키 누름!!');
            await onKeyPressEnter(event);
        } catch (err) {
            console.log(err);
        }
    }

    console.log('replacedContent: ', replacedContent);
    console.log('엔터키 안누름!!');
}

const replaceText = text => {
    let replacedText = text;
    replacedText = text.replace(/\s| /gi, '');
    // replacedText = text.replace(/\r\n| /gi, '<br>');

    return replacedText;
}

const onKeyPressEnter = async event => {
    console.log(event.keyCode);
    console.log(event.isComposing);
    try {
        console.log('엔터키 누름!!');
        await postSendChat();
    } catch (err) {
        console.log(err);
    }
}

// 이미지 파일 선택했을 때
const onChangeSelectFile = async e => {
    const fileTag = e.target;
    // console.log(fileTag.files[0]);
    // console.log(fileTag.files[0].name);
    // console.log(fileTag.files[0].size);
    // console.log(fileTag.files[0].lastModifiedDate);
    const fileInfo = {
        name: fileTag.files[0].name,
        size: fileTag.files[0].size,
        createdAt: fileTag.files[0].lastModifiedDate
    }

    this.info = fileInfo;

    if (fileTag.files && fileTag.files[0]) {
        const fileReader = new FileReader();
        fileReader.onload = createPreviewTag;
        fileReader.readAsDataURL(fileTag.files[0]);
    }
}

// 이미지 미리보기 박스 태그 생성 
const createPreviewTag = e => {
    const fileInfo = this.info;
    console.log(fileInfo);
    console.log(fileInfo.name);
    console.log(fileInfo.size);
    console.log(fileInfo.createdAt);
    const file = e.target.result;

    const parentNode = document.querySelector('.task-date__box');
    removeAllChild(parentNode);

    const previewBox = document.createElement('div');//사진 박스
    previewBox.id = 'preview';
    previewBox.classList.add('content');

    // 미리보기 사진 태그
    const previewImg = document.createElement('img');
    previewImg.src = file;

    console.log('previewImg: ', previewImg);


    // 파일 이름
    const fileName = document.createElement('p');
    fileName.textContent = '파일 명: ' + fileInfo.name;
    // 파일 용량
    const fileSize = document.createElement('p');
    fileSize.textContent = '파일 용량: ' + fileInfo.size;
    // 생성 날짜
    const createdAt = document.createElement('p');
    createdAt.textContent = '생성 날짜: ' + fileInfo.createdAt;

    previewBox.appendChild(previewImg);
    previewBox.appendChild(fileName);
    previewBox.appendChild(fileSize);
    previewBox.appendChild(createdAt);

    console.log('previewBox: ', previewBox);
    parentNode.appendChild(previewBox);
}

document.getElementById('send').addEventListener('click', postSendChat);
document.getElementById('content').addEventListener('keydown', onKeyDownCreateUnitChat);
document.getElementById('file').addEventListener('change', onChangeSelectFile);
document.getElementById('sendFile').addEventListener('click', postUploadFileToChatRoom);

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

// 팀원 추가 버튼 -> 채널 팀원 목록 보드 활성화 -> 채널에 속한 유저 정보 가져오기
const onClickLoadUsersInChannel = async event => {
    const url = window.location.href;
    const channelId = url.split('/')[5];
    const chatRoomId = url.split('/')[6];

    const response = await fetch('http://localhost:8080/v1/chat/channel-members/' + channelId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chatRoomId: chatRoomId
        })
    });
    const data = await response.json();
    console.log('data: ', data);

    // 채널에 속한 유저리스트 보드 열기
    document.querySelector('.box__btn-toggle').classList.add('hidden');
    document.querySelector('.board-user').classList.add('hidden');
    document.querySelector('.board-channel-user-list').classList.remove('hidden');

    // 선택 유저가 없으므로 초대 버튼 비활성화, 텍스트 투명
    btnDeactivation('add-member');
    document.getElementById('span__text').style.opacity = 0.3;

    for (let user of data.users) {
        // 인포 박스
        const infoBox = document.createElement('div');
        infoBox.classList.add('box')

        // 클라이언트 프로필사진
        const img = document.createElement('img');
        img.setAttribute('src', user.photo);
        infoBox.appendChild(img);

        // 클라이언트 아이디
        const clientNameTag = document.createElement('a');
        clientNameTag.textContent = user.name;
        clientNameTag.setAttribute('href', '#');
        
        if (!user.exist) {
            // 체크 박스 생성 + 라벨
            const checkBox = document.createElement('input');
            // checkBox.classList.add('check-box');
            checkBox.setAttribute('type', 'checkbox');
            checkBox.setAttribute('id', 'users');
            checkBox.setAttribute('name', 'users');
            checkBox.setAttribute('value', JSON.stringify({
                _id: user._id,
                photo: user.photo,
                name: user.name
            }));
            checkBox.setAttribute('onclick', 'onClickCheckBox(event)');

            const label = document.createElement('label');
            label.setAttribute('for', 'users');
            label.appendChild(checkBox);
            const circle = document.createElement('div');
            circle.setAttribute('class', 'checkbox');
            label.appendChild(circle);
            // 완성된 박스
            infoBox.appendChild(img);
            infoBox.appendChild(clientNameTag);
            infoBox.appendChild(label);
        } else {
            img.style.opacity = 0.5;
            clientNameTag.style.opacity = 0.5;
            infoBox.appendChild(img);
            infoBox.appendChild(clientNameTag);
        }

        //부모 태그에 어펜드
        document.getElementById('form').appendChild(infoBox);
    }

}

// 자식요소 모두 제거 하는 함수
const removeAllChild = parent => {
    console.log(parent);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
// 체크박스 이벤트
const onClickCheckBox = event => {
    // 체킹된 아이템 박스
    const parentNode = document.querySelector('.box__div-select-push');

    //자식 요소 모두 제거
    removeAllChild(parentNode);

    const selectedUser = document.querySelectorAll('input[name="users"]:checked');
    console.log(selectedUser)
    console.log(`selectedUser: ${JSON.stringify(selectedUser)}`);
    console.log('selectedUser: ', selectedUser);
    if (selectedUser.length <= 0) {
        parentNode.classList.add('hidden');
        // 버튼 비활성화
        btnDeactivation('add-member');
        document.getElementById('span__text').style.opacity = 0.3;
        return;
    }

    console.log(selectedUser);
    selectedUser.forEach(element => {
        const json = element.value;
        const user = JSON.parse(json);

        document.querySelector('.box__div-select-push').classList.remove('hidden');

        const div = document.createElement('div');
        div.setAttribute('id', 'select-user');
        div.setAttribute('class', 'select-user');

        const img = document.createElement('img');
        img.setAttribute('src', user.photo);

        const p = document.createElement('p');
        p.textContent = user.name;

        div.appendChild(img);
        div.appendChild(p);

        document.querySelector('.box__div-select-push').appendChild(div);
    });
    // 버튼 활성화
    btnActivation('add-member');
    document.getElementById('span__text').style.opacity = 1;
}

// 팀원 추가 보드 나가기
const onClickExitUsers = event => {
    const formTag = document.getElementById('form');
    const pushedBox = document.querySelector('.box__div-select-push');

    let item = document.getElementById('item');

    removeAllChild(formTag);
    const div = document.createElement('div');
    div.classList.add('box__btn__add-member');
    const btn = document.createElement('button');
    btn.setAttribute('type', 'submit');
    btn.setAttribute('class', 'btn__add-member');
    btn.setAttribute('id', 'add-member');
    btn.textContent = ' + ';
    const span = document.createElement('span');
    span.id = 'span__text'
    span.textContent = '초대하기';

    div.appendChild(btn);
    div.appendChild(span);
    formTag.appendChild(div);

    removeAllChild(pushedBox);
    // origin.ver
    // while (item) {
    //     pushedBox.removeChild(item);
    //     item = document.getElementById('item');
    // }

    // let box = formTag.querySelector('.box');
    // // console.log(box);
    // while (box) {
    //     formTag.removeChild(box);
    //     box = formTag.querySelector('.box');
    //     console.log(box);
    // }

    btnDeactivation('add-member');
    document.getElementById('span__text').style.opacity = 0.3;
    document.querySelector('.box__btn-toggle').classList.remove('hidden');
    document.querySelector('.board-user').classList.remove('hidden');
    document.querySelector('.board-channel-user-list').classList.add('hidden');
    pushedBox.classList.add('hidden');
}

const btnDeactivation = id => {
    const tag = document.getElementById(id);

    // 선택 유저가 없으므로 초대 버튼 비활성화, 텍스트 투명
    tag.disabled = true;
    tag.style.opacity = 0.3;
    tag.style.cursor = 'default';
}

const btnActivation = id => {
    const tag = document.getElementById(id);

    // 선택된 유저가 있으면 초대 버튼 활성화, 텍스트 visable
    tag.disabled = false;
    tag.style.opacity = 1;
    tag.style.cursor = 'pointer';
}
