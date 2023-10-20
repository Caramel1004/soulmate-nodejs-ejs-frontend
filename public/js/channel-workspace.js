/** ----------------- 이벤트 함수 ----------------- */
const onClickWorkSpaceAddBtn = () => {
    const url = window.location.href;
    const channelId = url.split('/')[4].split('?')[0];
    createModalTagtoAddWorkSpace(channelId, '워크스페이스');

    // 모달창 오픈후 필요한 이벤트 리스너
    document.getElementById('yes').addEventListener('click', onClickOpenYNRadio);
    document.getElementById('no').addEventListener('click', onClickOpenYNRadio);
    document.getElementById('submit').addEventListener('click', () => {
        onCilckCompleteBtn(channelId);
    })
    document.getElementById('cancel').addEventListener('click', () => {
        console.log('event');
        onClickCloseBtn('modal-background');
    });
}

const onClickOpenYNRadio = () => {
    const circleIcon = document.getElementById('open').querySelectorAll('i');
    console.log(circleIcon);
    for (circle of circleIcon) {
        circle.className = 'fa-regular fa-circle fa-lg';
        circle.style.color = 'rgba(0, 0, 0, 0.1)';
    }

    const checkedRadio = document.querySelector('input[type="radio"]:checked, input[name="open"]:checked');

    const checkedIcon = checkedRadio.parentNode.children[0];
    checkedIcon.className = 'fa-solid fa-circle-check fa-lg';
    checkedIcon.style.color = '#42af2c';
    checkedIcon.style.opacity = '0.8';
}

const onCilckCompleteBtn = channelId => {
    postCreateWorkSpace(channelId);
}

const onClickCloseBtn = className => {
    removeChildrenTag(className);
}

/** ----------------- 태그관련 함수 ----------------- */
const createModalTagtoAddWorkSpace = (channelId, title) => {
    const labelText = ['공개설정', '워크스페이스 명'];
    const NEED_BOX_TAG_NUM = 3;

    // 모달창 백그라운드
    const modalBackGround = document.createElement('div');
    modalBackGround.classList.add('modal-background');

    document.querySelector('script').insertAdjacentElement('beforebegin', modalBackGround);

    // 모달창
    const modal = document.createElement('div');
    modal.classList.add('modal-add-mode');
    modalBackGround.appendChild(modal);

    // 모달창 제목
    const h2 = document.createElement('h2');
    h2.textContent = title;
    modal.appendChild(h2);

    const inputBoxList = [];
    const labelList = [];
    const inputList = [];
    const iconList = [];
    const spanTags = [];
    // 인풋 박스
    for (let i = 0; i < NEED_BOX_TAG_NUM; i++) {
        inputBoxList[i] = document.createElement('div');
        inputList[i] = document.createElement('input');

        inputBoxList[i].classList.add('box__input');
        modal.appendChild(inputBoxList[i]);
    }
    // 라벨 태그
    for (let i = 0; i < labelText.length; i++) {
        labelList[i] = document.createElement('label');
        iconList[i] = document.createElement('i');
        spanTags[i] = document.createElement('span');

        labelList[i].textContent = labelText[i];

        inputList[i].type = 'radio';
        inputList[i].name = 'open';

        iconList[i].className = 'fa-regular fa-circle fa-lg';

        inputBoxList[i].appendChild(labelList[i]);
    }
    labelList[1].htmlFor = 'workSpaceName';
    inputList[2].type = 'text';
    inputList[2].id = inputList[2].name = 'workSpaceName';
    inputList[2].placeholder = '워크스페이스명을 입력하세요.';
    spanTags[0].appendChild(inputList[2]);
    inputBoxList[1].appendChild(spanTags[0]);

    // 인풋 태그
    // radio
    const openBox = document.createElement('div');
    openBox.id = 'open';
    inputBoxList[0].appendChild(openBox);
    const labelYes = document.createElement('label');
    const labelNo = document.createElement('label');
    labelYes.htmlFor = 'yes';
    labelNo.htmlFor = 'no';
    openBox.appendChild(labelYes);
    openBox.appendChild(labelNo);

    labelYes.appendChild(iconList[0]);
    labelNo.appendChild(iconList[1]);
    labelYes.appendChild(document.createTextNode('공개'));
    labelNo.appendChild(document.createTextNode('비공개'));

    inputList[0].id = 'yes';
    inputList[0].value = 'Y';
    inputList[1].id = 'no';
    inputList[1].value = 'N';

    labelYes.appendChild(inputList[0]);
    labelNo.appendChild(inputList[1]);

    // input
    inputBoxList[2].innerHTML = '<span><textarea class="contents-form__textarea" name="comment" placeholder="워크스페이스 설명 스크립트를 자유롭게 입력하세요."></textarea></span>';
    // insertAdjacentHTML(position, htmlText)
    // beforebegin - 선택된 노드의 앞
    // afterend - 선택된 노드의 뒤
    // afterbegin - 선택된 노드의 첫 번째 자식 노드 앞
    // beforeend - 선택된 노드의 마지막 자식 노드 뒤
    modal.insertAdjacentHTML('beforeend', '<div class="box__button__submit"><button type="button" id="submit">완료</button><a id="cancel">취소</a></div>');
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
            inputBox.insertAdjacentHTML('beforeend', `<div id="empty-box"></div><span class="valid" id="valid">*${errorObj.msg}</span>`);
            break;
        }
    }
}

/** ----------------- API 요청 함수 -----------------*/
const postCreateWorkSpace = async channelId => {
    let open = null;
    const openRadioTags = document.querySelector('.modal-add-mode').querySelectorAll('input[type="radio"], input[name="open"]');
    for(const radio of openRadioTags) {
        if(radio.checked) {
            open = radio.value;
        }
    }
    const workSpaceName = document.querySelector('.modal-background').querySelector('input[name="workSpaceName"]');
    const comment = document.querySelector('.modal-background').querySelector('textarea[name="comment"]');
    try {
        const response = await fetch(`http://localhost:3000/client/workspace/${channelId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                open: open,
                workSpaceName: workSpaceName.value,
                comment: comment.value,
            })
        })

        const data = await response.json();
        console.log(data);
        if (data.error) {
            insertVaildationErrorMsg(data.error);
            return;
        } else {
            return window.location.href = `/channel/workspace/${data.workSpace.channelId}/${data.workSpace._id}?sortType=lastest&&sortNum=-1`;
        }
    } catch (err) {
        console.log(err);
    }
}

/** ----------------- 이벤트리스너 ----------------- */
document.getElementById('workspace-add__btn').addEventListener('click', onClickWorkSpaceAddBtn);