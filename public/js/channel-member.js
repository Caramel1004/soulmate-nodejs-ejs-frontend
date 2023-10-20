window.onload = () => {
    const url = window.location.href;
    this.channelId = url.split('/')[4].split('?')[0];
}

/** ----------------- 이벤트 함수 ----------------- */
const onClickMemberToAddBtn = () => {
    createModalTagtoAddMember('멤버');

    document.getElementById('cancel').addEventListener('click', () => {
        onClickCloseBtn('modal-background');
    });
}

const onClickCloseBtn = className => {
    removeChildrenTag(className);
}

/** ----------------- 태그관련 함수 ----------------- */
const createModalTagtoAddMember = title => {
    const modal =
    `<div class="modal-background">
        <div class="modal-add-mode">
            <h2>${title}</h2>
            <div class="selected-member-container">
                멤버를 선택하세요.
                <div class="selected-member-box">
                    <img src="http://localhost:8080/images/user_profiles/soulmate_Photo_lnjvk0yj.gif">
                    <p>카라멜프라푸치노</p>
                </div>
            </div>
            <div class="member-search-box">
                <label for="search">
                    <input type="text" name="search" id="name" placeholder="이메일 또는 이름으로 검색">
                    <i class="fa-solid fa-magnifying-glass fa-lg"></i>
                </label>
            </div>
            <div id="preview-search-user-list-box">
                <div class="search-member-list-box">
                    <img src="http://localhost:8080/images/user_profiles/soulmate_Photo_lnjvk0yj.gif">
                    <span>카라멜프라푸치노</span>
                    <i class="fa-regular fa-circle fa-xl"></i>
                </div>
                <div class="search-member-list-box">
                    <img src="http://localhost:8080/images/user_profiles/soulmate_Photo_lnjvk0yj.gif">
                    <span>카라멜프라푸치노</span>
                    <i class="fa-regular fa-circle fa-xl"></i>
                </div>
                <div class="search-member-list-box">
                    <img src="http://localhost:8080/images/user_profiles/soulmate_Photo_lnjvk0yj.gif">
                    <span>카라멜프라푸치노</span>
                    <i class="fa-regular fa-circle fa-xl"></i>
                </div>
                <div class="search-member-list-box">
                    <img src="http://localhost:8080/images/user_profiles/soulmate_Photo_lnjvk0yj.gif">
                    <span>카라멜프라푸치노</span>
                    <i class="fa-regular fa-circle fa-xl"></i>
                </div>
                <div class="search-member-list-box">
                    <img src="http://localhost:8080/images/user_profiles/soulmate_Photo_lnjvk0yj.gif">
                    <span>카라멜프라푸치노</span>
                    <i class="fa-regular fa-circle fa-xl"></i>
                </div>
            </div>
            <div class="box__button__submit">
                <button id="" type="button">완료</button>
                <a id="cancel">취소</a>
            </div>
        </div>
    </div>`;
    console.log(modal);
    document.querySelector('script').insertAdjacentHTML('beforebegin', modal);
}

// 부모 태그에서 자식 태그 삭제 -> 모달창 제거
const removeChildrenTag = className => {
    const parentNode = document.querySelector(`.${className}`);
    document.body.removeChild(parentNode);
}
/** ----------------- 이벤트리스너 ----------------- */
document.getElementById('invite-member-modal__btn').addEventListener('click', () => {
    onClickMemberToAddBtn();
});