//1. 채널 생성 클릭시 모달창 오픈: class="modal hidden" => class="modal"
//2. 상단에 x 버튼 클릭시 모달창 클로즈: class="modal" => class="modal hidden"
const onClickOpenModal = () => {
    document.querySelector('.container').classList.remove('hidden');
    document.querySelector('.modal').classList.remove('hidden');
}

const onClickCloseModal = () => {
    document.querySelector('.container').classList.add('hidden');
    document.querySelector('.modal').classList.add('hidden');
}

// 모달창 오픈
document.querySelector('.open-modal').addEventListener('click',onClickOpenModal);

//모달창 클로즈
document.querySelector('.close-modal').addEventListener('click',onClickCloseModal);

//백그라운드 컬러