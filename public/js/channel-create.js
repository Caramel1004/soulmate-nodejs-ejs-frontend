/** ----------------- 이벤트 함수 ----------------- */
const onClickOpenYNRadio = () => {
    const circleIcon = document.getElementById('open').querySelectorAll('i');
    for (circle of circleIcon) {
        circle.className = 'fa-regular fa-circle fa-lg';
        circle.style.color = 'rgba(0, 0, 0, 0.1)';
    }

    console.log('radio!!');
    const checkedRadio = document.querySelector('input[name="open"]:checked');

    const checkedIcon = checkedRadio.parentNode.children[0];

    checkedIcon.className = 'fa-solid fa-circle-check fa-lg';
    checkedIcon.style.color = '#42af2c';
    checkedIcon.style.opacity = '0.8';
}

const onClickThumbnailBtn = () => {
    const modal = createModalTagtoSelectThumbnail();
    document.getElementById('cancel').addEventListener('click', () => {
        onClickCloseBtn('modal-background');
    });
    document.getElementById('complete').addEventListener('click', () => {
        onClickCompleteBtn('modal-background');
    });
    modal.querySelector('label[for="file"]').addEventListener('change', onChangeSelectFile);
}

const onClickCloseBtn = className => {
    removeChildrenTag(className);
}

const onClickCompleteBtn = className => {
    const modal = document.querySelector('.modal-add-mode');
    const thumbnail = modal.querySelector('label[for="file"]').querySelector('input[type="file"]').files;
    const base64EncodedFile = document.getElementById('create-channel-thumbnail-box').querySelector('img').src;

    if(thumbnail.length > 0) {
        document.getElementById('thumbnail-file').textContent = thumbnail.name;
        document.getElementById('thumbnail-file').files = thumbnail;
        document.getElementById('thumbnail-file').setAttribute('data-src', base64EncodedFile);
        document.getElementById('filename').textContent = thumbnail[0].name;
        document.getElementById('filename').style.color = '#1d1c1d';
        removeChildrenTag(className);
    } else {
        modal.querySelector('.create-channel-thumbnail-input-box').insertAdjacentHTML('afterend', `<div id="empty-box"></div><span class="valid" id="valid">*파일을 선택해주세요.</span>`)
    }
}

const onClickSubmitBodyBtn = async () => {
    await postCreateChannel();
}

/** ----------------- 태그관련 함수 ----------------- */
const createModalTagtoSelectThumbnail = () => {
    const base64EncodedFile = document.getElementById('thumbnail-file').dataset.src || 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg';
    const fileName = document.getElementById('filename').textContent;
    const thumbnailFiles = document.getElementById('thumbnail-file').files;
    // 모달창 백그라운드
    const modalBackGround = document.createElement('div');
    modalBackGround.classList.add('modal-background');

    // 모달창
    const modal = document.createElement('div');
    modal.classList.add('modal-add-mode');
    modal.innerHTML +=
        `<div id="create-channel-thumbnail-box">
            <img src="${base64EncodedFile}">
        </div>
        <div class="create-channel-thumbnail-input-box">
            <label for="filename">파일명</label>
            <label for="file">
                <span>${fileName}</span>
                <input type="file" id="file" name="photo" multiple>
                <i class="fa-regular fa-image fa-lg"></i>
            </label>
        </div>
        <div class="box__button__submit">
            <button type="submit" id="complete">완료</button>
            <a id="cancel">취소</a>
        </div>`;
    
    // document.getElementById('file').files = thumbnailFiles;
    modalBackGround.appendChild(modal);
    document.body.appendChild(modalBackGround);
    return modal;
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

const changePreviewPhoto = e => {
    try {
        const base64EncodedFile = e.target.result;

        if (!base64EncodedFile) {
            throw new Error('파일을 읽지 못했습니다!!');
        }
        const imgTag = document.querySelector('.modal-add-mode').querySelector('img');
        console.log(imgTag);
        imgTag.src = base64EncodedFile;
        document.querySelector('.create-channel-thumbnail-input-box').querySelector('label[for="file"]').querySelector('span').innerText = document.getElementById('file').files[0].name
        
        // document.querySelector('.create-channel-thumbnail-input-box').querySelector('label[for="file"]').insertAdjacentText('afterbegin', document.getElementById('file').files[0].name);
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

const insertVaildationErrorMsg = async errorObj => {
    try {
        const inputForm = document.querySelector('.box__div-form');
        const inputFormChildren = inputForm.querySelectorAll('.box__input');
    
        if(document.getElementById('valid')) {
            document.getElementById('valid').parentNode.removeChild(document.getElementById('valid'));
            document.getElementById('empty-box').parentNode.removeChild(document.getElementById('empty-box'));
        }
        for (const inputBox of inputFormChildren) {
            const matchedTag = inputBox.querySelector(`input[name="${errorObj.path}"]`) || inputBox.querySelector(`select[name="${errorObj.path}"]`);
    
            if (matchedTag) {
                inputBox.insertAdjacentHTML('beforeend', `<div id="empty-box"></div><span class="valid" id="valid">*${errorObj.msg}</span>`);
                break;
            }
        }
    } catch (error) {
        console.log(error);
    }
}

/** ----------------- API 요청 함수 -----------------*/
const postCreateChannel = async () => {
    let open = '';
    const openRadioTags = document.querySelector('.box__div-form').querySelectorAll('input[type="radio"], input[name="open"]');
    for (const radio of openRadioTags) {
        if (radio.checked) {
            open = radio.value;
        }
    }
    const channelName = document.querySelector('.box__div-form').querySelector('input[name="channelName"]');
    const thumbnail = document.querySelector('.box__div-form').querySelector('input[type="file"], input[name="thumbnail"]');
    const category = document.querySelector('.box__div-form').querySelector('select[name="category"]');
    const summary = document.querySelector('.box__div-form').querySelector('textarea[name="summary"]');
    const comment = document.querySelector('.box__div-form').querySelector('textarea[name="comment"]');
    try {
        const formData = new FormData();
        formData.append('open', open);
        formData.append('channelName', channelName.value);
        formData.append('thumbnail', thumbnail.files[0]);
        formData.append('category', category.options[category.selectedIndex].value);
        formData.append('summary', summary.value);
        formData.append('comment', comment.value);
        const response = await fetch(`http://3.39.235.59:3000/client/channel/create`, {
            method: 'POST',
            body: formData
        })

        const data = await response.json();
        console.log(data);
        if (data.error) {
            insertVaildationErrorMsg(data.error);
            return;
        } else {
            return window.location.href = `/mychannel/${data.channelId}?searchType=info`;
        }
    } catch (err) {
        console.log(err);
    }
}

/** ----------------- 이벤트리스너 ----------------- */
document.getElementById('btn__submit').addEventListener('click', onClickSubmitBodyBtn);
document.getElementById('channelThumbnail').addEventListener('click', onClickThumbnailBtn);
document.querySelector('label[for="thumbnail"]').addEventListener('click', onClickThumbnailBtn);
document.getElementById('yes').addEventListener('click', onClickOpenYNRadio);
document.getElementById('no').addEventListener('click', onClickOpenYNRadio);