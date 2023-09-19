import { onClickOpenModalWorkSpace } from './workspace-modal.js'
import { onClickOpenModalChat } from './chat-modal.js'
/** ----------------- 이벤트 함수 ----------------- */
const onClickWorkSpaceAddBtn = () => {
    console.log('워크스페이스 추가 모달창!');
}


/** ----------------- 태그관련 함수 ----------------- */


/** ----------------- 이벤트리스너 ----------------- */
document.getElementById('workspace-add__btn').addEventListener('click', onClickOpenModalWorkSpace);
document.getElementById('chatRoom-add__btn').addEventListener('click', onClickOpenModalChat);