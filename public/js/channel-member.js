window.onload = () => {
    const url = window.location.href;
    this.channelId = url.split('/')[4].split('?')[0];
    this.selectedUserIds = [];
}

/** ----------------- 이벤트 함수 ----------------- */
const onClickMemberToAddBtn = () => {
    createModalTagtoAddMember('멤버');

    document.getElementById('cancel').addEventListener('click', () => {
        onClickCloseBtn('modal-background');
    });
    document.querySelector('.modal-add-mode').querySelector('input[type="search"], input[name="search"]').addEventListener('keydown', onKeyDownSearchBox);
    document.getElementById('user-channel-invite').addEventListener('click', onClickUserInviteBtn);
}

const onClickCloseBtn = className => {
    removeChildrenTag(className);
}

const onKeyDownSearchBox = async e => {
    if (e.keyCode === 13 && e.target.value !== '') {
        try {
            console.log('엔터키 누름!!');
            removeAllChild(document.getElementById('preview-search-user-list-box'));
            await getSearchUserByKeyWord(e);
        } catch (err) {
            console.log(err);
        }
    }
}

// 체크박스 이벤트
const onClickCheckBox = e => {
    // 체킹된 아이템 박스
    const parentNode = document.querySelector('.selected-member-container');

    //자식 요소 모두 제거
    removeAllChild(parentNode);
    // if(parentNode.querySelector('span')){
    //     parentNode.removeChild(parentNode.querySelector('span'));
    // }

    const userBoxNodeList = document.querySelectorAll('input[name="users"]');
    toggleCheckBoxIcon(userBoxNodeList);

    const selectedUserList = document.querySelectorAll('input[name="users"]:checked');

    if (selectedUserList.length <= 0) {
        parentNode.innerHTML += '<span>멤버를 선택하세요.</span>'
        parentNode.querySelector('span').style.opacity = 0.7;
        parentNode.querySelector('span').style.padding = '10px';
        return;
    }

    selectedUserList.forEach(target => {
        console.log(target.parentNode)
        const src = target.parentNode.querySelector('img').src;
        const name = target.parentNode.querySelector('span').innerText
        const userId = target.parentNode.querySelector('input[type="checkbox"], input[name="users"]:checked').value
        const selectedMemberBox = document.querySelector('.modal-add-mode').querySelector('.selected-member-container');
        selectedMemberBox.innerHTML += `
       <div class="selected-member-box" data-userid=${userId}>
            <img src="${src}">
            <p>${name}</p>
        </div>`
    });
}

const onClickUserInviteBtn = async () => {
    await patchInviteUserToChannel();
}

/** ----------------- 태그관련 함수 ----------------- */
const createModalTagtoAddMember = title => {
    const modal =
        `<div class="modal-background">
        <div class="modal-add-mode">
            <h2>${title}</h2>
            <div class="selected-member-container">
                <span>멤버를 선택하세요.</span>
            </div>
            <div class="member-search-box">
                <label for="search">
                    <input type="search" name="search" id="search-name" placeholder="이메일 또는 이름으로 검색">
                    <i class="fa-solid fa-magnifying-glass fa-lg"></i>
                </label>
            </div>
            <div id="preview-search-user-list-box">
            </div>
            <div class="box__button__submit">
                <button id="user-channel-invite" type="button">완료</button>
                <a id="cancel">취소</a>
            </div>
        </div>
    </div>`;
    document.querySelector('script').insertAdjacentHTML('beforebegin', modal);
}

// 부모 태그에서 자식 태그 삭제 -> 모달창 제거
const removeChildrenTag = className => {
    const parentNode = document.querySelector(`.${className}`);
    document.body.removeChild(parentNode);
}

const createUserBox = data => {
    if (data.users.length <= 0) {
        console.log('없음')
        const notDataText = `
            <p>검색 결과를 찾지못했습니다.</p>
        `
        document.getElementById('preview-search-user-list-box').insertAdjacentHTML('beforeend', notDataText);
        return;
    }
    for (const user of data.users) {
        let className = 'search-member-list-box';
        inputTag = `<input type="checkbox" name="users" value="${user._id}">`
        if (user.isChannelMember) {
            className = 'search-exist-member-list-box'
            inputTag = ''
        }
        const userBox = `
            <div class="${className}">
                <label>
                    <img src="${user.photo}">
                    <span>${user.name}</span>
                    ${inputTag}<i class="fa-regular fa-circle fa-xl"></i>
                </label>
            </div>`;
        document.getElementById('preview-search-user-list-box').insertAdjacentHTML('beforeend', userBox);
    }
    document.getElementById('preview-search-user-list-box').querySelectorAll('.search-member-list-box').forEach(target => {
        target.addEventListener('click', onClickCheckBox);
    })
}

const toggleCheckBoxIcon = nodeList => {
    // nodelist 부모에 접근할때는 parentNode
    for (node of nodeList) {
        // parentNode or parentElement
        const checkedIcon = node.parentNode.querySelector('i');

        // 체크박스인 nodeList에 checked라는 프로퍼티가 있음 체킹되있으면 true 아니면 false
        if (node.checked) {
            checkedIcon.className = 'fa-solid fa-circle-check fa-xl';
            checkedIcon.style.color = '#42af2c';
            checkedIcon.style.opacity = '0.8';
        } else {
            checkedIcon.className = 'fa-regular fa-circle fa-xl';
            checkedIcon.style.color = 'rgba(0, 0, 0, 0.2)';
        }
    }
}

const createMemberTag = data => {
    const tag = `
        <div class="user__div-wrapper">
            <img src="${data.photo}">
            <div class="card">
                <h2></h2>
            </div>
        </div>`;

    document.querySelector('.user-inner').insertAdjacentHTML('beforeend', tag);
}

// 자식요소 모두 제거 하는 함수
const removeAllChild = parent => {
    console.log(parent);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const getSearchUserByKeyWord = async e => {
    const searchWord = e.target.value;

    try {
        const response = await fetch(`http://3.39.235.59:3000/client/user/search/${searchWord}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channelId: this.channelId
            })
        })

        const data = await response.json();

        if (!data.error) {
            createUserBox(data);
        } else if (data.error.statusCode == 500 || data.error.statusCode == 404) {
            if (data.users.length <= 0) {
                console.log('없음')
                const notDataText = `
                    <p>검색 결과를 찾지못했습니다.</p>
                `
                document.getElementById('preview-search-user-list-box').insertAdjacentHTML('beforeend', notDataText);
                return;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

const patchInviteUserToChannel = async () => {
    const userBoxs = document.querySelector('.modal-add-mode').querySelector('.selected-member-container').querySelectorAll('.selected-member-box');
    console.log(userBoxs);
    const userIds = [];
    for (const userBox of userBoxs) {
        userIds.push(userBox.dataset.userid);
    }
    console.log(userIds);
    try {
        const response = await fetch(`http://3.39.235.59:3000/client/channel/invite/${channelId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                selectedIds: userIds
            })
        })

        const data = await response.json();
        if (!data.error) {
            window.location = `/mychannel/${this.channelId}?searchType=member`;
            // createMemberTag(data);
            // removeChildrenTag('modal-background');
        } else if (data.error.statusCode == 500 || data.error.statusCode == 404) {
            removeChildrenTag('modal-background');
        }
    } catch (error) {
        console.log(error)
    }
}
/** ----------------- 이벤트리스너 ----------------- */
document.getElementById('invite-member-modal__btn').addEventListener('click', () => {
    onClickMemberToAddBtn();
});