/** ----------------- 이벤트 함수 ----------------- */
const onClickChatRoomAddBtn = () => {
    const url = window.location.href;
    const channelId = url.split('/')[4].split('?')[0];

    createModalTagtoAddChatRoom(channelId, '채팅룸');

    document.getElementById('cancel').addEventListener('click', () => {
        console.log('event');
        onClickCloseBtn('modal-background');
    });
}

const onClickCloseBtn = className => {
    removeChildrenTag(className);
}

/** ----------------- 태그관련 함수 ----------------- */
const createModalTagtoAddChatRoom = (channelId, title) => {
    const modal =
    `<div class="modal-background">
        <div class="modal-add-mode">
            <form action="/client/chat/${channelId}" method="post">
                <h2>${title}</h2>
                <div class="box__input">
                    <label for="roomName">채팅방 명</label>
                    <span><input type="text" name="roomName" id="roomName" placeholder="채팅방명을 입력하세요."></span>
                </div>
                <div class="box__button__submit">
                    <button type="submit">완료</button>
                    <a id="cancel">취소</a>
                </div>
            </form>
        </div>
    </div>`;
    document.querySelector('script').insertAdjacentHTML('beforebegin', modal);
}

// 부모 태그에서 자식 태그 삭제 -> 모달창 제거
const removeChildrenTag = className => {
    const parentNode = document.querySelector(`.${className}`);
    document.body.removeChild(parentNode);
}
/** ----------------- 이벤트리스너 ----------------- */
document.getElementById('chatRoom-add__btn').addEventListener('click', onClickChatRoomAddBtn);