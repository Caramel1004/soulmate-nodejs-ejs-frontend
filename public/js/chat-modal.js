//1. 채팅방 생성 클릭시 모달창 오픈: class="modal hidden" => class="modal"
//2. 상단에 x 버튼 클릭시 모달창 클로즈: class="modal" => class="modal hidden"
const onClickOpenModalChat = () => {
    document.querySelector('.container-chat').classList.remove('hidden');
    document.querySelector('.modal-chat').classList.remove('hidden');
}

const onClickCloseModalChat = () => {
    document.querySelector('.container-chat').classList.add('hidden');
    document.querySelector('.modal-chat').classList.add('hidden');
}

// 채팅방 생성 모달창 오픈
document.getElementById('modal-open-add-chat').addEventListener('click',onClickOpenModalChat);

// 채팅방 생성 모달창 클로즈
document.getElementById('modal-close-add-chat').addEventListener('click',onClickCloseModalChat);