window.onload = Init();
function Init() {
    //채팅박스 스크롤 맨 아래로 위치
    const historyTag = document.querySelector('.board-chat__box-history');
    historyTag.scrollTop = historyTag.scrollHeight;

    document.getElementById('participants').style.color = '#ffffff';
    document.getElementById('participants').style.background = '#000000';

    // 전역 변수
    this.selectedFiles = [];
}

/** ----------------- 이벤트 함수 ----------------- */
const onLoadChatRoom = e => {
    document.getElementById('participants').style.color = '#ffffff';
    document.getElementById('participants').style.background = '#000000';
}

// 1. 채팅 박스에서 keydown 이벤트 
// 채팅 박스에 textarea 키보드 엔터 시 이벤트
// 이슈: 한글입력 후 엔터시 중복 입력되는 현상 발생. -> 이벤트가 두번 발생함
// keyup 일때 영문입력시 event.isComposing이 false 즉, 문자 조합을 하지 않는다는 소리이다.
// 근데 영어와 다르게 한글입력시 문자를 조합하기 때문에 event.isComposing가 true이다.
// 그래서 한글 입력 후 엔터를 누르게 되면 아직 조합중인 상태이기 때문에 한글: keyup + 엔터 keydown -> keypress -> keyup 두번 발생
// keypress는 한글 인식을 하지 않기 떄문에 단순히 enter처리만 할거면 keypress로 하자.
// 만약 줄 바꿈 키를 만들고 싶다면....
const onKeyDownInChatBox = async event => {
    console.log(event.keyCode);
    console.log(event.isComposing);

    const content = document.getElementById('content').value;
    const replacedContent = replaceText(content);

    if ((event.keyCode === 13 && !event.shiftKey && replacedContent !== "") || (event.keyCode === 13 && !event.shiftKey && this.selectedFiles.length > 0)) {
        try {
            console.log('엔터키 누름!!');
            document.getElementById('content').innerText = ''; // 입력폼 텍스트 없애기
            await onKeyPressEnter(event);
            this.selectedFiles = [];// 파일들 비우기
        } catch (err) {
            console.log(err);
        }
    }

    if (event.keyCode === 13 && replacedContent === "") {
        return document.getElementById('content').innerText.replace('\r\n', '');
    }

    console.log('replacedContent: ', replacedContent);
    console.log('엔터키 안누름!!');
}

// 2. 채팅 박스안에서 엔터키 키프레스 이벤트
const onKeyPressEnter = async event => {
    console.log(event.keyCode);
    console.log(event.isComposing);
    try {
        console.log('엔터키 누름!!');
        await postSendChatAndUploadFilesToChatRoom();
    } catch (err) {
        console.log(err);
    }
}

// 3. 팀원 추가 버튼(쓰레드 생성 버튼)
const onClickAddMemberBtn = async event => {
    const data = await postLoadUsersInChannel();
    createUserListInChannelTag(data);
}

// 이미지 파일 선택했을 때
const onChangeSelectFile = async e => {
    const fileTag = e.target;
    console.log(fileTag.result)
    // console.log(fileTag.files[0]);
    // console.log(fileTag.files[0].name);
    // console.log(fileTag.files[0].size);
    // console.log(fileTag.files[0].lastModifiedDate);
    const fileInfo = {
        name: fileTag.files[0].name,
        size: fileTag.files[0].size,
        createdAt: fileTag.files[0].lastModifiedDate
    }

    if (fileTag.files && fileTag.files[0]) {
        const fileReader = new FileReader();
        fileReader.onload = createPreviewTag;
        fileReader.readAsDataURL(fileTag.files[0]);
    }
}

// 체크박스 이벤트
const onClickCheckBox = event => {
    // 체킹된 아이템 박스
    const parentNode = document.querySelector('.box__div-select-push');

    //자식 요소 모두 제거
    removeAllChild(parentNode);

    const userBoxNodeList = document.querySelectorAll('input[name="users"]');
    toggleCheckBoxIcon(userBoxNodeList);

    const selectedUserList = document.querySelectorAll('input[name="users"]:checked');

    // console.log(selectedUser);
    // console.log(`selectedUser: ${JSON.stringify(selectedUser)}`);
    // console.log('selectedUser: ', selectedUser);
    if (selectedUserList.length <= 0) {
        parentNode.classList.add('hidden');
        // 버튼 비활성화
        btnDeactivation('add-member');
        document.getElementById('span__text').style.opacity = 0.3;
        return;
    }
    // console.log(selectedUser);
    selectedUserList.forEach(element => {
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
    document.querySelector('.sub-board__btn-box').classList.remove('hidden');
    document.querySelector('.board-user').classList.remove('hidden');
    document.querySelector('.board-channel-user-list').classList.add('hidden');
    pushedBox.classList.add('hidden');
}

// 서브 보드 토글버튼
const onClickSubBtn = (e, activeClassName) => {
    setColorForActiveSubBoardBtn(e);
    openSelectedSubBoard(activeClassName);
}

const onClickHamburgerIcon = () => {
    console.log('햄버거 메뉴');
    const hamburger = document.getElementById('hamburger');

    if (hamburger.className.indexOf('active') === -1) {
        hamburger.className = 'active fa-solid fa-x fa-lg';
        createHamburgerMenu();
    } else {
        hamburger.className = 'fa-solid fa-bars fa-lg';
        removeAllChild(document.querySelector('.hamburger-menu-container'));
    }
}

const toggleCheckBoxIcon = nodeList => {
    // nodelist 부모에 접근할때는 parentNode
    for (node of nodeList) {
        // parentNode or parentElement
        const checkedIcon = node.parentNode.querySelector('i');

        // 체크박스인 nodeList에 checked라는 프로퍼티가 있음 체킹되있으면 true 아니면 false
        if (node.checked) {
            checkedIcon.className = 'fa-solid fa-circle-check fa-xl';
            checkedIcon.style.color = '#42af2c';
            checkedIcon.style.opacity = '0.8';
        } else {
            checkedIcon.className = 'fa-regular fa-circle fa-xl';
            checkedIcon.style.color = 'rgba(0, 0, 0, 0.2)';
        }
    }

}

const onClickChatRoomEixtBtn = async () => {
    await patchExitChatRoom();
}

const onClickSendChatAndFilesBtn = async () => {
    await postSendChatAndUploadFilesToChatRoom();
    document.getElementById('content').value = "";
    this.selectedFiles = [];// 파일들 비우기
}
/** ----------------- 태그관련 함수 ----------------- */
const createUserListInChannelTag = data => {
    // 채널에 속한 유저리스트 보드 열기
    document.querySelector('.sub-board__btn-box').classList.add('hidden');
    document.querySelector('.board-user').classList.add('hidden');
    document.querySelector('.board-channel-user-list').classList.remove('hidden');

    // 선택 유저가 없으므로 초대 버튼 비활성화, 텍스트 투명
    btnDeactivation('add-member');
    document.getElementById('span__text').style.opacity = 0.3;

    for (let user of data.users) {
        // 인포 박스
        const infoBox = document.createElement('div');
        infoBox.classList.add('new-box');

        // 라벨 박스
        const label = document.createElement('label');

        const imgClientNameBox = document.createElement('div');
        imgClientNameBox.style.display = 'flex';
        imgClientNameBox.style.alignItems = 'center';

        // 클라이언트 프로필사진
        const img = document.createElement('img');
        img.setAttribute('src', user.photo);

        // 클라이언트 아이디
        const clientNameTag = document.createElement('p');
        clientNameTag.textContent = user.name;

        imgClientNameBox.appendChild(img);
        imgClientNameBox.appendChild(clientNameTag);

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

            const i = document.createElement('i');
            i.className = 'fa-regular fa-circle fa-xl';
            const iconBox = document.createElement('iconBox');

            // 완성된 박스
            label.appendChild(imgClientNameBox);
            label.appendChild(checkBox);
            iconBox.appendChild(i);
            label.appendChild(iconBox);
            infoBox.appendChild(label);
            // label.appendChild(infoBox)
        } else {
            infoBox.className = 'box'
            infoBox.style.cursor = 'default';
            infoBox.style.pointerEvents = 'none'
            img.style.opacity = 0.5;
            clientNameTag.style.opacity = 0.5;
            infoBox.appendChild(imgClientNameBox);
        }
        //부모 태그에 어펜드
        document.getElementById('form').appendChild(infoBox);

    }
}

const createPreviewTag = e => {
    try {
        const base64EncodedFile = e.target.result;
        const fileInfo = document.getElementById('file').files[0];//이미 e.target.files[0]은 인코딩되어 없어짐 따라서 dom요소에 접근해 인코딩전 파일 정보가져오기

        if (!base64EncodedFile) {
            throw new Error('파일을 읽지 못했습니다!!');
        }
        const parentNode = document.getElementById('preview-files');

        // 파일 식별 아이디 생성
        const fileId = new Date().getTime().toString(36);
        fileInfo.fileId = fileId;

        parentNode.innerHTML +=
            `<div class="attached-file" data-fileid="${fileId}">
            <img src="${base64EncodedFile}">
            <button type="button" id="remove-upload-file__btn" data-fileid="${fileId}">
                <i class="fa-solid fa-circle-xmark fa-xl"></i>
            </button>
        </div>`;

        parentNode.querySelector(`button[data-fileid="${fileId}"]`).addEventListener('click', e => {
            console.log('click like');
            onClickFileRemoveBtn(fileId);
        })

        // 전역변수 selectedFiles 배열에 저장
        this.selectedFiles = [...this.selectedFiles, fileInfo];
        return fileId;
    } catch (error) {
        alert(error)
        console.log(error)
    }
}

const replaceText = text => {
    let replacedText = text;
    replacedText = text.replace(/\s| /gi, '');
    // replacedText = text.replace(/\r\n| /gi, '<br>');

    return replacedText;
}

// 자식요소 모두 제거 하는 함수
const removeAllChild = parent => {
    console.log(parent);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
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

//roomname 박스 밑에 생성 시킬거임
const createHamburgerMenu = () => {
    const url = window.location.href;
    const channelId = url.split('/')[5];

    const hamburgerMenu = document.createElement('div');
    const hamburgerMenu2 = document.createElement('div');
    hamburgerMenu.className = 'hamburger-menu';
    hamburgerMenu2.className = 'hamburger-menu';

    const chatRoomListAtag = document.createElement('a');
    const listIcon = document.createElement('i');
    const span = document.createElement('span');
    listIcon.className = 'fa-solid fa-list';
    span.textContent = '채팅방 목록';
    chatRoomListAtag.append(listIcon);
    chatRoomListAtag.append(span);
    chatRoomListAtag.setAttribute('href', `/mychannel/${channelId}?searchWord=chatRooms`);

    const chatRoomExitBtn = document.createElement('button');
    const exitIcon = document.createElement('i');
    const span2 = document.createElement('span');
    exitIcon.className = 'fa-solid fa-arrow-right-from-bracket';
    span2.textContent = '채팅방 나가기';
    chatRoomExitBtn.append(exitIcon);
    chatRoomExitBtn.append(span2);
    chatRoomExitBtn.setAttribute('type', 'button');
    chatRoomExitBtn.setAttribute('onclick', 'onClickChatRoomEixtBtn()');


    hamburgerMenu.appendChild(chatRoomListAtag);
    hamburgerMenu2.appendChild(chatRoomExitBtn);

    document.querySelector('.hamburger-menu-container').appendChild(hamburgerMenu);
    document.querySelector('.hamburger-menu-container').appendChild(hamburgerMenu2);
}

// 활성화된 서브보드버튼에대한 색 세팅
const setColorForActiveSubBoardBtn = e => {
    const targetId = e.target.id;
    const buttons = document.querySelector('.sub-board__btn-box').querySelectorAll('button');
    e.target.style.background = '#000000';
    e.target.style.color = '#ffffff';

    for(const btn of buttons) {
        if(btn.id !== targetId) {
            btn.style.color = '#1d1c1d';
            btn.style.background = 'rgb(243, 243, 246)';
        }
    }
}

// 선택된 서브보드 오픈 나머지는 display hidden으로 전환
const openSelectedSubBoard = activeClassName => {
    const subBoard = document.querySelector('.board-sub');
    const subBoardChild = subBoard.children;
    const activeSubBoardChild = subBoard.querySelector(`.${activeClassName}`);
    
    activeSubBoardChild.classList.remove('hidden');

    // 서브보드 자손 태그에서 활성화되지 않은 보드는 히든
    for(let idx = 1; idx < subBoardChild.length; idx++) {
        if(subBoardChild[idx] !== activeSubBoardChild) {
            subBoardChild[idx].classList.add('hidden');
        }
    }
}

/** ----------------- API 요청 함수 -----------------*/

// 채팅 내용 post요청
const postSendChatAndUploadFilesToChatRoom = async () => {
    console.log('tag 생성!!!');
    try {
        const content = document.getElementById('content').value;

        if (content == "" && this.selectedFiles.length <= 0) {
            return;
        }

        const url = window.location.href;

        const channelId = url.split('/')[5];
        const chatRoomId = url.split('/')[6];
        const replaceContent = content.replace('\r\n', '<br>');
        console.log('channelId : ', channelId);
        console.log('chatRoomId : ', chatRoomId);
        console.log('replaceContent : ', replaceContent);
        console.log(this.selectedFiles);

        const formData = new FormData();
        formData.append('chat', replaceContent);
        formData.set('content', replaceContent);
        for (const file of this.selectedFiles) {
            formData.append('files', file);
        }

        await fetch('http://localhost:3000/client/chat/' + channelId + '/' + chatRoomId, {
            method: 'POST',
            body: formData
        });

        console.log('채팅 처리 완료!!!');
    } catch (err) {
        console.log(err);
    }
}

// 채팅방 퇴장
const patchExitChatRoom = async () => {
    try {
        if (!confirm('퇴장시 모든 채팅내용이 삭제됩니다.\n퇴장 하시겠습니까?')) {
            return;
        }

        const url = window.location.href;

        const channelId = url.split('/')[5];
        const chatRoomId = url.split('/')[6];
        console.log('channelId : ', channelId);
        console.log('chatRoomId : ', chatRoomId);

        const response = await fetch(`http://localhost:3000/client/chat/exit-chat-room/${channelId}/${chatRoomId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channelId: channelId,
                chatRoomId: chatRoomId
            })
        });

        const data = await response.json();

        window.location.href = 'http://localhost:3000/mychannels?searchWord=all';
    } catch (err) {
        console.log(err);
    }
}

// 채널에 속한 유저 정보 가져오기
const postLoadUsersInChannel = async () => {
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

    return data;
}

/** ----------------- 이벤트리스너 ----------------- */

// 클릭 이벤트
document.getElementById('send').addEventListener('click', onClickSendChatAndFilesBtn);
document.querySelector('.room-name-box').addEventListener('click', onClickHamburgerIcon);

document.getElementById('participants').addEventListener('click', e => {
    onClickSubBtn(e, 'board-user');
});// 서브보드 버튼들

document.getElementById('file-box').addEventListener('click', e => {
    onClickSubBtn(e, 'board-file-box');
});// 서브보드 버튼들

// 키보드 이벤트
document.getElementById('content').addEventListener('keydown', onKeyDownInChatBox);

// 변화 이벤트
document.getElementById('file').addEventListener('change', onChangeSelectFile);