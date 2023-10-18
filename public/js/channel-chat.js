/** ----------------- 이벤트 함수 ----------------- */
const onClickChatRoomAddBtn = () => {
    const url = window.location.href;
    const channelId = url.split('/')[4].split('?')[0];

    createModalTagtoAddChatRoom(channelId, '채팅룸');

    document.getElementById('submit').addEventListener('click', () => {
        onCilckCompleteBtn(channelId);
    })
    document.getElementById('cancel').addEventListener('click', () => {
        console.log('event');
        onClickCloseBtn('modal-background');
    });
}

const onClickCloseBtn = className => {
    removeChildrenTag(className);
}

const onCilckCompleteBtn = channelId => {
    postCreateChatRoom(channelId);
}

/** ----------------- 태그관련 함수 ----------------- */
const createModalTagtoAddChatRoom = (channelId, title) => {
    const modal =
    `<div class="modal-background">
        <div class="modal-add-mode">
            <h2>${title}</h2>
            <div class="box__input">
                <label for="roomName">채팅방 명</label>
                <span><input type="text" name="roomName" id="roomName" placeholder="채팅방명을 입력하세요."></span>
            </div>
            <div class="box__button__submit">
                <button type="button" id="submit">완료</button>
                <a id="cancel">취소</a>
            </div>
        </div>
    </div>`;
    document.querySelector('script').insertAdjacentHTML('beforebegin', modal);
}

// 부모 태그에서 자식 태그 삭제 -> 모달창 제거
const removeChildrenTag = className => {
    const parentNode = document.querySelector(`.${className}`);
    document.body.removeChild(parentNode);
}

const insertVaildationErrorMsg = errorObj => {
    const modal = document.querySelector('.modal-add-mode');
    const modalChildren = modal.querySelectorAll('.box__input');
    
    if(document.getElementById('valid')) {
        document.getElementById('valid').parentNode.removeChild(document.getElementById('valid'));
        document.getElementById('empty-box').parentNode.removeChild(document.getElementById('empty-box'));
    }

    for (const inputBox of modalChildren) {
        const matchedTag = inputBox.querySelector(`input[name="${errorObj.path}"]`);
        if (matchedTag) {
            inputBox.insertAdjacentHTML('beforeend', `<div id="empty-box"></div><span id="valid">*${errorObj.msg}</span>`);
            break;
        }
    }
}
/** ----------------- API 요청 함수 -----------------*/
const postCreateChatRoom = async channelId => {
    const roomName = document.querySelector('.modal-background').querySelector('input[name="roomName"]');
    try {
        const response = await fetch(`http://localhost:3000/client/chat/${channelId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomName: roomName.value
            })
        })

        const data = await response.json();
        console.log(data);
        if (data.error) {
            insertVaildationErrorMsg(data.error);
            return;
        }else {
            return window.location.href = '/channel/chat/' + data.chatRoom.channelId + '/' + data.chatRoom._id;
        }
    } catch (err) {
        console.log(err);
    }
}
/** ----------------- 이벤트리스너 ----------------- */
document.getElementById('chatRoom-add__btn').addEventListener('click', onClickChatRoomAddBtn);