/** ----------------- 이벤트 함수 ----------------- */

// 프로필 박스에 한개의 엘리먼트 클릭 이벤트
const onClickMyProfileEditBtn = reqBody => {
    createMyProfileEditModalTag(reqBody);
}

const onClickCloseBtn = className => {
    const parentNode = document.querySelector(`.${className}`);

    document.body.removeChild(parentNode);
}

/** ----------------- 태그관련 함수 ----------------- */

// 이름, 이미지, 등등
const createMyProfileEditModalTag = reqBody => {
    const body = document.body;

    // 모달창 백그라운드
    const modalBackGround = document.createElement('div');
    modalBackGround.classList.add('modal-background');

    body.appendChild(modalBackGround);

    // 모달창
    const modal = document.createElement('div');
    modal.classList.add('modal-edit-mode');

    // 버튼 박스
    const btnBox = document.createElement('div');
    btnBox.classList.add('icon-btn-box');
    const h2 = document.createElement('h2');
    h2.style.textAlign = 'center';
    h2.textContent = '이름';
    btnBox.appendChild(h2);

    // 수정 버튼 안에 아이콘 생성
    const editIcon = document.createElement('i');
    editIcon.className = 'fa-regular fa-pen-to-square';
    editIcon.textContent = '수정'

    // 수정 취소 버튼 생성
    // 수정 버튼
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-icon');
    editBtn.setAttribute('onclick', `patchEditMyProfileByReqUser('${reqBody}')`)
    editBtn.append(editIcon);

    // 취소 버튼
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('edit-icon');
    cancelBtn.setAttribute('onclick', `onClickCloseBtn('modal-background')`)
    cancelBtn.textContent = '취소';
    cancelBtn.style.color = '#1d1c1d';
    cancelBtn.style.background = '#ffffff';
    cancelBtn.style.paddingLeft = '17px';
    cancelBtn.style.paddingRight = '17px';

    // 닫기 버튼 생성
    // const closeBtn = document.createElement('button');
    // closeBtn.id = 'modal-close-btn';
    // closeBtn.setAttribute('onclick', "onClickCloseBtn('modal-background')")
    // closeBtn.textContent = 'x';
    // modal.appendChild(closeBtn);

    modal.appendChild(btnBox);

    const input = document.createElement('input');
    input.name = reqBody;
    input.type = 'text'
    input.value = document.getElementById(`${reqBody}`).querySelector('p').textContent;

    modal.appendChild(input);
    modal.appendChild(editBtn);
    modal.appendChild(cancelBtn);
    modalBackGround.appendChild(modal);
}

/** ----------------- 이벤트리스너 ----------------- */
document.getElementById('name').addEventListener('click', () => {
    onClickMyProfileEditBtn('name');
});
document.getElementById('phone').addEventListener('click', () => {
    onClickMyProfileEditBtn('phone');
});

/** ----------------- API 요청 함수 -----------------*/
const patchEditMyProfileByReqUser = async body => {
    console.log(body);
    const dataToBeEdit = document.querySelector(`input[name="${body}"]`).value;
    console.log(dataToBeEdit)
    try {
        let hasNameToBeEdit = false;
        let hasPhotoToBeEdit = false;
        let hasPhoneToBeEdit = false;
        switch (body) {
            case 'name': hasNameToBeEdit = true;
                break;
            case 'photo': hasPhotoToBeEdit = true;
                break;
            case 'phone': hasPhoneToBeEdit = true;
                break;
        }

        const formData = new FormData();
        formData.append('data', dataToBeEdit);
        formData.append('hasNameToBeEdit', hasNameToBeEdit);
        formData.append('hasPhotoToBeEdit', hasPhotoToBeEdit);
        formData.append('hasPhoneToBeEdit', hasPhoneToBeEdit);

        const response = await fetch(`http://localhost:3000/client/edit-myprofile`, {
            method: 'PATCH',
            body: formData
        });

        const data = await response.json();
        console.log(data);
        // return window.location.replace(`http://localhost:3000/myprofile`);
    } catch (err) {
        console.log(err)
    }
}