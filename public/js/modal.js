//1. 채널 생성 클릭시 모달창 오픈: class="modal hidden" => class="modal"
//2. 상단에 x 버튼 클릭시 모달창 클로즈: class="modal" => class="modal hidden"
const onClickOpenModalChannel = () => {
    document.querySelector('.container-channel').classList.remove('hidden');
    document.querySelector('.modal-channel').classList.remove('hidden');
}

const onClickCloseModalChannel = () => {
    document.querySelector('.container-channel').classList.add('hidden');
    document.querySelector('.modal-channel').classList.add('hidden');
}

const onClickOpenModalChat = () => {
    document.querySelector('.container-chat').classList.remove('hidden');
    document.querySelector('.modal-chat').classList.remove('hidden');
}

const onClickCloseModalChat = () => {
    document.querySelector('.container-chat').classList.add('hidden');
    document.querySelector('.modal-chat').classList.add('hidden');
}

// 채널 생성 모달창 오픈
document.querySelector('.open-modal-channel').addEventListener('click',onClickOpenModalChannel);

// 채널 생성 모달창 클로즈
document.querySelector('.close-modal-channel').addEventListener('click',onClickCloseModalChannel);

// 채팅방 생성 모달창 오픈
document.querySelector('.open-modal-chat').addEventListener('click',onClickOpenModalChat);

// 채팅방 생성 모달창 클로즈
document.querySelector('.close-modal-chat').addEventListener('click',onClickCloseModalChat);