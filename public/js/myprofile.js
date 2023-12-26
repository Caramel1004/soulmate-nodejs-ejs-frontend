/** ----------------- 이벤트 함수 ----------------- */

// 프로필 박스에 한개의 엘리먼트 클릭 이벤트
const onClickMyProfileEditBtn = (id, text, type) => {
    createMyProfileEditModalTag(id, text, type);
}

const onClickPatchEditMyProfileByReqUserBtn = id => {
    patchEditMyProfileByReqUser(id);
}

const onClickCloseBtn = className => {
    removeChildrenTag(className);
}

const onChangeSelectFile = async e => {
    try {
        const fileTag = e.target;

        if (fileTag.files && fileTag.files[0]) {
            const fileReader = new FileReader();
            fileReader.onload = changePreviewPhoto;
            fileReader.readAsDataURL(fileTag.files[0]);
        }
    } catch (error) {
        alert(error);
        console.log(error)
    }
}

/** ----------------- 태그관련 함수 ----------------- */

// 이름, 이미지, 등등
const createMyProfileEditModalTag = (id, text, type) => {
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
    h2.textContent = text;
    btnBox.appendChild(h2);

    // 수정 버튼 안에 아이콘 생성
    const editIcon = document.createElement('i');
    editIcon.className = 'fa-regular fa-pen-to-square';
    editIcon.textContent = '수정'

    // 수정 취소 버튼 생성
    // 수정 버튼
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-icon');
    editBtn.setAttribute('onclick', `onClickPatchEditMyProfileByReqUserBtn('${id}')`)
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

    modal.appendChild(btnBox);

    const input = document.createElement('input');

    switch (id) {
        case 'name':
            // 입력 태그
            input.name = id;
            input.type = type;
            input.value = document.getElementById(`${id}`).querySelector('p').textContent;
            modal.appendChild(input);
            break;
        case 'photo':
            modal.innerHTML +=
                `<div>
                    <img src="${document.querySelector('.photo-box').querySelector('img').src}">
                </div>
                <div class="file-name-box">
                    <label for="file">
                        <span>파일을 업로드 하세요.</span>
                        <input type="file" id="file" name="photo" multiple>
                        <i class="fa-regular fa-pen-to-square"></i>
                    </label>
                </div>`;
            modal.querySelector('label[for="file"]').addEventListener('change', onChangeSelectFile);
            break;
        case 'phone':
            // 입력 태그
            input.name = id;
            input.type = type;
            input.value = document.getElementById(`${id}`).querySelector('p').textContent;
            modal.appendChild(input);
            break;
    }

    modal.appendChild(editBtn);
    modal.appendChild(cancelBtn);
    modalBackGround.appendChild(modal);
}

const changePreviewPhoto = e => {
    try {
        const base64EncodedFile = e.target.result;

        if (!base64EncodedFile) {
            throw new Error('파일을 읽지 못했습니다!!');
        }
        const imgTag = document.querySelector('.modal-edit-mode').querySelector('img');
        imgTag.src = base64EncodedFile;
        const fileNameBox = document.querySelector('.file-name-box').querySelector('label[for="file"]');
        // if(fileNameBox.querySelector('span')) {
        //     fileNameBox.removeChild(fileNameBox.querySelector('span'));
        // }
        fileNameBox.querySelector('span').innerText = document.getElementById('file').files[0].name;
        // fileNameBox.insertAdjacentText('afterbegin', document.getElementById('file').files[0].name);
        
    } catch (error) {
        alert(error)
        console.log(error)
    }
}

// 부모 태그에서 자식 태그 삭제 -> 모달창 제거
const removeChildrenTag = className => {
    const parentNode = document.querySelector(`.${className}`);
    document.body.removeChild(parentNode);
}

// 업데이트 태그
const updatedTag = (id, data) => {
    if (id === 'name') {
        document.getElementById(id).querySelector('p').textContent = data.updatedData.data;
        document.getElementById('client').textContent = data.updatedData.data;
        const i = document.createElement('i');
        i.className = 'fa-regular fa-pen-to-square';

        document.getElementById(id).querySelector('p').appendChild(i);
        document.querySelector('.user-info').querySelectorAll('a')[0].textContent = `${data.updatedData.data}`;
    } else if(id === 'phone'){
        document.getElementById(id).querySelector('p').textContent = data.updatedData.data;
        const i = document.createElement('i');
        i.className = 'fa-regular fa-pen-to-square';

        document.getElementById(id).querySelector('p').appendChild(i);
    } else if(id === 'photo') {
        document.querySelector('.photo-box').querySelector('img').src = document.querySelector('.user-info').querySelector('img').src = `${data.updatedData.photo}`;
    }
}

/** ----------------- API 요청 함수 -----------------*/
const patchEditMyProfileByReqUser = async id => {
    let dataToBeEdit;
    try {
        let hasNameToBeEdit = false;
        let hasPhotoToBeEdit = false;
        let hasPhoneToBeEdit = false;
        switch (id) {
            case 'name': hasNameToBeEdit = true;
                dataToBeEdit = document.querySelector(`input[name="${id}"]`).value;
                break;
            case 'photo': hasPhotoToBeEdit = true;
                dataToBeEdit = document.getElementById('file').files[0];
                break;
            case 'phone': hasPhoneToBeEdit = true;
                dataToBeEdit = document.querySelector(`input[name="${id}"]`).value;
                break;
        }
        console.log(dataToBeEdit);
        const formData = new FormData();
        formData.append('data', dataToBeEdit);
        formData.append('hasNameToBeEdit', hasNameToBeEdit);
        formData.append('hasPhotoToBeEdit', hasPhotoToBeEdit);
        formData.append('hasPhoneToBeEdit', hasPhoneToBeEdit);

        const response = await fetch(`http://3.39.235.59:3000/client/edit-myprofile`, {
            method: 'PATCH',
            body: formData
        });

        const data = await response.json();
        console.log(data);
        removeChildrenTag('modal-background');
        updatedTag(id, data);
    } catch (err) {
        console.log(err)
    }
}

/** ----------------- 이벤트리스너 ----------------- */
document.getElementById('name').addEventListener('click', () => {
    onClickMyProfileEditBtn('name', '이름', 'text');
});
document.getElementById('phone').addEventListener('click', () => {
    onClickMyProfileEditBtn('phone', '핸드폰 번호', 'text');
});
document.getElementById('photo').addEventListener('click', () => {
    console.log('photo')
    onClickMyProfileEditBtn('photo', '프로필 이미지', 'file');
});