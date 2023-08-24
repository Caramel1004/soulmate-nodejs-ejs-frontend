window.onload = Init();

function Init() {
    this.selectedMembers = [];// 선택한 유저들 doc아이디 배열로 저장
    console.log(selectedMembers);
}

// 게시물 내용 post요청
const postCreatePostToWorkSpace = async () => {
    if (!confirm('게시물을 업로드 하시겠습니까?')) {
        return;
    }
    try {
        const content = document.getElementById('content').value;
        if (content == "") {
            return;
        }

        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];
        const replaceContent = content.replace('\r\n', '<br>');
        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);
        console.log('replaceContent : ', replaceContent);

        const formData = new FormData();
        formData.append('content', replaceContent);

        await fetch(`http://localhost:3000/client/workspace/create-post/${channelId}/${workSpaceId}`, {
            method: 'POST',
            body: formData
        });
        console.log('게시물 처리 완료!!!');
    } catch (err) {
        console.log(err);
    }
}

const postCreateReplyToWorkSpace = async postId => {
    if (!confirm('댓글을 업로드 하시겠습니까?')) {
        return;
    }
    try {
        const content = document.getElementById('replyContent').value;
        if (content == "") {
            return;
        }
        document.getElementById('replyContent').value = "";
        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];
        const replaceContent = content.replace('\r\n', '<br>');
        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);
        console.log('postId : ', postId);
        console.log('replaceContent : ', replaceContent);

        const formData = new FormData();
        formData.append('postId', postId);
        formData.append('content', replaceContent);

        await fetch(`http://localhost:3000/client/workspace/${channelId}/${workSpaceId}/post/create-reply`, {
            method: 'POST',
            body: formData
        });

        console.log('댓글 처리 완료!!!');
    } catch (err) {
        console.log(err);
    }
}

const patchAddMemeberToWorkSpace = async () => {
    try {
        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];
        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);
        console.log(this.selectedMembers);
        await fetch(`http://localhost:3000/client/workspace/invite/${channelId}/${workSpaceId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                selectedId: this.selectedMembers
            })
        });

        return window.location.replace(`http://localhost:3000/channel/workspace/${channelId}/${workSpaceId}?sort=lastest&&sortNum=-1`);
    } catch (err) {
        console, log(err);
    }
}

const patchRemoveMemeberToWorkSpace = async () => {
    try {
        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];
        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);

        await fetch(`http://localhost:3000/client/workspace/exit/${channelId}/${workSpaceId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channelId: channelId,
                workSpaceId: workSpaceId
            })
        });

        return window.location.replace(`http://localhost:3000/channel/workspace/${channelId}/${workSpaceId}?sort=lastest&&sortNum=-1`);
    } catch (err) {
        console, log(err);
    }
}

const patchEditCommentScriptToWorkSpace = async () => {
    try {
        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];
        const comment = document.querySelector('.textarea__comment-box').value;
        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);

        await fetch(`http://localhost:3000/client/workspace/edit-comment/${channelId}/${workSpaceId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channelId: channelId,
                workSpaceId: workSpaceId,
                comment: comment
            })
        });

        return window.location.replace(`http://localhost:3000/channel/workspace/${channelId}/${workSpaceId}?sort=lastest&&sortNum=-1`);
    } catch (err) {
        console.log(err);
    }
}

const replaceText = text => {
    let replacedText = text;
    replacedText = text.replace(/\s|/gi, '');
    // replacedText = text.replace(/\r\n| /gi, '<br>');

    return replacedText;
}

//--------------이벤트 함수------------------//

// 채팅 박스에 textarea 키보드 엔터 시 이벤트
// 이슈: 한글입력 후 엔터시 중복 입력되는 현상 발생. -> 이벤트가 두번 발생함
// keyup 일때 영문입력시 event.isComposing이 false 즉, 문자 조합을 하지 않는다는 소리이다.
// 근데 영어와 다르게 한글입력시 문자를 조합하기 때문에 event.isComposing가 true이다.
// 그래서 한글 입력 후 엔터를 누르게 되면 아직 조합중인 상태이기 때문에 한글: keyup + 엔터 keydown -> keypress -> keyup 두번 발생
// keypress는 한글 인식을 하지 않기 떄문에 단순히 enter처리만 할거면 keypress로 하자.
// 만약 줄 바꿈 키를 만들고 싶다면....
const onKeyDownCreateUnitPost = async event => {
    console.log(event.keyCode);
    console.log(event.isComposing);

    const content = document.getElementById('content').value;
    const replacedContent = replaceText(content);

    if (event.keyCode === 13 && replacedContent === "") {
        return document.getElementById('content').value.replace('\r\n', '');
    }

    if (event.keyCode === 13 && !event.shiftKey && replacedContent !== "") {
        try {
            console.log('엔터키 누름!!');
            await onKeyPressEnter(event);
        } catch (err) {
            console.log(err);
        }
    }

    const textarea = document.getElementById('content');
    textarea.style.height = '2px';
    textarea.style.height = (12 + textarea.scrollHeight) + 'px';

    const history = document.getElementById('history');
    // history.style.height = '2px';
    history.style.height = (history.style.height - 2) + 'px';

    console.log('replacedContent: ', replacedContent);
    console.log('엔터키 안누름!!');
}

const onKeyPressEnter = async event => {
    try {
        console.log('엔터키 누름!!');
        await postCreatePostToWorkSpace();
    } catch (err) {
        console.log(err);
    }
}

const onClickWorkSpaceExitBtn = async event => {
    try {
        await patchRemoveMemeberToWorkSpace();
    } catch (err) {
        console.log(err);
    }
}

// 설명 스크립트 편집 버튼 클릭 이벤트 -> 입력 태그로 변환
const onClickWorkSpaceEditCommentScriptBtn = () => {
    console.log('스크립트!!');
    createEditCommentTag();
}

const onClickWorkSpacePostEditOrRemoveBtn = (action, postId) => {
    console.log(action);
    switch (action) {
        case 'edit': changePostEditModeTag(postId);
            break;
        case 'remove': deletePostByCreatorInWorkSpace(postId);
            break;
    }
}

// 게시물 수정 모드 태그로 변경
const changePostEditModeTag = postId => {
    const postContentTag = document.getElementById(`post-${postId}`);
    console.log(postContentTag);
    const textarea = document.createElement('textarea');
    textarea.value = postContentTag.textContent;
    textarea.id = 'post-edit-content';
    postContentTag.textContent = "";
    // postContentTag.style.width = '100%';
    // postContentTag.style.height = 'auto';

    // 수정 버튼 생성
    const editIcon = document.createElement('i');
    editIcon.className = 'fa-regular fa-pen-to-square fa-xl';

    const editBtn = document.createElement('button');
    editBtn.classList.add('button__edit-mode-comment-script');
    editBtn.setAttribute('onclick', `onClickWorkSpacePostEditContent('${postId}')`)
    editBtn.append(editIcon);

    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-x';

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('button__edit-mode-comment-script');
    closeBtn.setAttribute('onclick', `onClickPostEditModTagCloseBtn()`)
    closeBtn.append(closeIcon);


    document.querySelector('.post-comment').appendChild(textarea);
    document.querySelector('.post-comment').appendChild(editBtn);
    document.querySelector('.post-comment').appendChild(closeBtn);
}

const onClickWorkSpacePostEditContent = async postId => {
    console.log(postId)
    patchEditPostByCreatorInWorkSpace(postId);
}

const patchEditPostByCreatorInWorkSpace = async postId => {
    if (!confirm('게시물 내용을 수정 하시겠습니까?')) {
        return;
    }
    try {
        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];
        const content = document.getElementById('post-edit-content').value;
        const replaceContent = content.replace('\r\n', '<br>');

        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);
        console.log('postId : ', postId);
        console.log('content : ', content);

        const formData = new FormData();
        formData.append('postId', postId);
        formData.append('content', replaceContent);

        const data = await fetch(`http://localhost:3000/client/workspace/edit-post/${channelId}/${workSpaceId}`, {
            method: 'PATCH',
            body: formData
        });

        if(data.error) {
            alert(data.error);
            return;
        }
        console.log('게시물 처리 완료!!!');

        return window.location.replace(`http://localhost:3000/channel/workspace/${channelId}/${workSpaceId}?sort=lastest&&sortNum=-1`);
    } catch (err) {
        console.log(err);
    }
}

const deletePostByCreatorInWorkSpace = async postId => {
    if (!confirm('게시물을 삭제 하시겠습니까?')) {
        return;
    }
    try {
        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];

        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);
        console.log('postId : ', postId);

        await fetch(`http://localhost:3000/client/workspace/delete-post/${channelId}/${workSpaceId}/${postId}`, {
            method: 'DELETE'
        });
        console.log('게시물 처리 완료!!!');

        return window.location.replace(`http://localhost:3000/channel/workspace/${channelId}/${workSpaceId}?sort=lastest&&sortNum=-1`);
    } catch (err) {
        console.log(err);
    }
}

//----------태그 생성 함수들-------------//

// 설명 스크립트 편집 쓰레드 생성
const createEditCommentTag = () => {
    if (document.querySelector('.thread')) {
        document.body.removeChild(document.querySelector('.thread'));
    }

    document.querySelector('.board-workspace').style.width = '60%';

    // 쓰레드 생성
    const thread = document.createElement('div');
    thread.classList.add('thread');

    // 박스안에 닫기 버튼
    const closeBox = document.createElement('div');
    closeBox.classList.add('box-close');
    closeBox.style.borderBottom = '1px groove rgba(0, 0, 0, 0.1)';

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('onclick', "onClickCloseBtn('thread')")
    closeBtn.textContent = 'x';

    closeBox.appendChild(closeBtn);

    //닫기 박스, 게시물 박스
    thread.appendChild(closeBox);

    // 코멘트 입력 태그생성
    const textarea = document.createElement('textarea');
    textarea.classList.add('textarea__comment-box');
    textarea.value = document.getElementById('script-comment').textContent;
    thread.appendChild(textarea);

    const i = document.createElement('i');
    i.className = 'fa-regular fa-pen-to-square fa-xl';

    const button = document.createElement('button');
    button.classList.add('button__edit-mode-comment-script');
    button.setAttribute('onclick', `patchEditCommentScriptToWorkSpace()`)
    button.append(i);

    thread.appendChild(button);

    document.body.appendChild(thread);
}

// 맨 오른쪽 쓰레드 박스 생성
const createThreadTag = async postId => {
    try {
        if (document.querySelector('.thread')) {
            document.body.removeChild(document.querySelector('.thread'));
        }
        console.log('댓글 불러오는 중');
        document.querySelector('.board-workspace').style.width = '60%';

        const url = window.location.href;
        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];
        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);

        const response = await fetch(`http://localhost:3000/client/workspace/${channelId}/${workSpaceId}/post/replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postId: postId
            })
        });
        const data = await response.json();
        console.log('data: ', data);

        // 게시물 태그 생성
        const postTag = createUnitPostTag(data.post);

        // 쓰레드 생성
        const thread = document.createElement('div');
        thread.classList.add('thread');

        // 박스안에 닫기 버튼
        const closeBox = document.createElement('div');
        closeBox.classList.add('box-close');

        const closeBtn = document.createElement('button');
        closeBtn.setAttribute('onclick', "onClickCloseBtn('thread')")
        closeBtn.textContent = 'x';

        closeBox.appendChild(closeBtn);

        //닫기 박스, 게시물 박스
        thread.appendChild(closeBox);
        thread.appendChild(postTag);

        // 멘트: 몇개의 댓글
        const p = document.createElement('p');
        p.id = 'text';
        p.textContent = `${data.post.replies.length}개의 댓글`
        postTag.appendChild(p);

        // 댓글 작성 박스 생성
        const replyContentForm = document.createElement('div');
        replyContentForm.classList.add('reply-content-form');

        const textarea = document.createElement('textarea');
        textarea.id = 'replyContent';

        replyContentForm.appendChild(textarea);
        thread.appendChild(replyContentForm);

        const button = document.createElement('button');
        button.setAttribute('onclick', `postCreateReplyToWorkSpace('${data.post._id}')`)
        button.textContent = '댓글 올리기';

        replyContentForm.appendChild(button);

        for (const reply of data.post.replies) {
            // 댓글 박스
            const replyBox = document.createElement('div');
            replyBox.classList.add('replies');

            // 이미지 박스
            const replyImgBox = document.createElement('div');
            const img = document.createElement('img');
            img.setAttribute('src', reply.creator.photo);
            replyImgBox.classList.add('reply-img-box');
            replyImgBox.appendChild(img);
            console.log('replyImgBox: ', replyImgBox);

            // 생성자 이름, 댓글멘트
            const creatorBox = document.createElement('div');
            creatorBox.classList.add('reply-creator');

            // 경과 일수
            const passedTimeSpan = document.createElement('span');
            const passedTime = Math.ceil(new Date(reply.createdAt).getDay() - new Date().getDay());
            const formatterDay = new Intl.RelativeTimeFormat('ko', {
                numeric: 'auto'
            });
            passedTimeSpan.classList.add('passed-time');
            passedTimeSpan.textContent = formatterDay.format(passedTime, 'day');

            // 닉네임
            const clientNameTag = document.createElement('div');
            clientNameTag.classList.add('client-name');
            clientNameTag.textContent = reply.creator.name;
            clientNameTag.appendChild(passedTimeSpan);
            creatorBox.appendChild(clientNameTag);
            console.log('clientNameTag: ', clientNameTag);


            // 댓글멘트
            const replyComment = document.createElement('div');
            replyComment.classList.add('reply-comment');
            replyComment.textContent = reply.content;
            creatorBox.appendChild(replyComment);
            console.log('replyComment: ', replyComment);

            replyBox.appendChild(replyImgBox);
            replyBox.appendChild(creatorBox);

            thread.appendChild(replyBox);
        }

        document.body.appendChild(thread);
    } catch (err) {
        console.log(err);
    }
}

// 쓰레드에 게시물 생성
const createUnitPostTag = post => {
    // 게시물 컨테이너
    const postContainer = document.createElement('div');
    postContainer.classList.add('post-container');

    // 타임 스탬프
    const postDate = document.createElement('div');
    const formatedTime = formatter(post.createdAt);
    postDate.classList.add('post-date');
    postDate.textContent = formatedTime;

    // 게시물 정보를 담는 박스 태그
    const postsBox = document.createElement('div');
    postsBox.classList.add('posts');

    // 이미지 박스
    const postImgBox = document.createElement('div');
    const img = document.createElement('img');
    img.setAttribute('src', post.creator.photo);
    postImgBox.classList.add('post-img-box');
    postImgBox.appendChild(img);
    console.log('postImgBox: ', postImgBox);

    // 생성자 이름, 생성 내용, 댓글멘트
    const postBox = document.createElement('div');
    postBox.classList.add('post');

    // 닉네임
    const clientNameTag = document.createElement('div');
    clientNameTag.classList.add('client-name');
    clientNameTag.textContent = post.creator.name;
    postBox.appendChild(clientNameTag);
    console.log('clientNameTag: ', clientNameTag);

    // 내용
    const postComment = document.createElement('div');
    postComment.classList.add('post-comment');
    postComment.textContent = post.content;
    postBox.appendChild(postComment);
    console.log('postComment: ', postComment);

    postsBox.appendChild(postImgBox);
    postsBox.appendChild(postBox);

    postContainer.appendChild(postDate);
    postContainer.appendChild(postsBox);

    return postContainer;
}

const formatter = createdAt => {
    let year = new Date(createdAt).getFullYear();
    let month = new Date(createdAt).getMonth() + 1;
    let day = new Date(createdAt).getDate();
    const timestamp = new Date(createdAt).toTimeString().split(' ')[0];//ex)09:51:35 GMT+0900 (한국 표준시)

    let hour = parseInt(timestamp.split(':')[0]);

    const when = hour >= 12 ? '오후' : '오전';

    if (month < 10) {
        month = '0' + month;
    } else if (month > 12) {
        month = '0' + 1;
    }

    if (day < 10) {
        day = '0' + day
    }
    if (when === '오후' && hour > 12) {
        hour %= 12;
    }

    const min = timestamp.split(':')[1];

    const fomatDate = `${year}-${month}-${day}  ${when} ${hour}:${min}`;

    return fomatDate;
}

const onClickCloseBtn = className => {
    console.log('close');
    const parentNode = document.querySelector(`.${className}`);

    document.querySelector('.board-workspace').style.width = '100%';
    document.body.removeChild(parentNode);
    this.selectedMembers = [];
}

const activeSortTypeBtnColor = () => {
    const url = window.location.href;
    const queryString = url.split('?')[1];
    const query = queryString.split('&&')[0];
    const sortType = query.split('=')[1] || 'lastest';
    console.log('query : ', query);
    console.log('sortType: ', sortType);
    document.getElementById(sortType).style.color = '#ffffff';
    document.getElementById(sortType).style.background = 'black';
    document.getElementById(sortType).classList.add('active');
}

document.getElementById('send').addEventListener('click', postCreatePostToWorkSpace);
document.getElementById('content').addEventListener('keydown', onKeyDownCreateUnitPost);
document.getElementById('comment-edit-mode').addEventListener('click', onClickWorkSpaceEditCommentScriptBtn);
window.addEventListener('DOMContentLoaded', activeSortTypeBtnColor);

// ---------------- 멤버 초대 모달창 로직 구간 ------------------ //
const createInviteMemberModalTag = data => {
    const body = document.body;

    const modalBackGround = document.createElement('div');
    modalBackGround.classList.add('modal-background');

    const modal = document.createElement('div');
    modal.classList.add('modal-invite-member');

    // 박스안에 닫기 버튼
    const btnBox = document.createElement('div');
    btnBox.classList.add('icon-btn-box');
    btnBox.style.border = 'none';
    // closeBox.style.display = 'block'; 
    // closeBox.style.float = 'right'; 

    const addBtn = document.createElement('button');
    const addIcon = document.createElement('i');
    addIcon.className = 'fa-solid fa-user-plus';

    addBtn.appendChild(addIcon);
    addBtn.id = 'add';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'modal-close-btn';
    closeBtn.setAttribute('onclick', "onClickCloseBtn('modal-background')")
    closeBtn.textContent = 'x';

    btnBox.appendChild(addBtn);
    btnBox.appendChild(closeBtn);
    modal.appendChild(btnBox);

    const selectedMemberListBox = document.createElement('div');
    selectedMemberListBox.classList.add('selected-member-container');
    selectedMemberListBox.textContent = '멤버들을 선택하세요.';
    modal.appendChild(selectedMemberListBox);

    for (const member of data.members) {
        const memberListBox = document.createElement('div');
        memberListBox.classList.add('channel-member-list');
        memberListBox.id = `${member._id}`;
        memberListBox.setAttribute('onclick', `onClickSelectMemberBox(${JSON.stringify(member)})`);
        // 이미지
        const img = document.createElement('img');
        img.setAttribute('src', member.photo);
        const span = document.createElement('span');
        span.textContent = member.name;

        const i = document.createElement('i');
        i.className = 'fa-regular fa-circle fa-xl';

        memberListBox.appendChild(img);
        memberListBox.appendChild(span);
        memberListBox.appendChild(i);

        modal.appendChild(memberListBox);
    }

    modalBackGround.appendChild(modal);
    body.appendChild(modalBackGround);
    document.getElementById('add').addEventListener('click', patchAddMemeberToWorkSpace);
}

const getMemberListOnChannel = async () => {
    try {
        const url = window.location.href;
        const channelId = url.split('/')[5];
        const response = await fetch('http://localhost:3000/client/channel/member-list/' + channelId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        createInviteMemberModalTag(data);
    } catch (error) {
        console.log(error);
    }
}

const onClickSelectMemberBox = member => {
    const selectedMemberListBox = document.querySelector('.selected-member-container');
    if (selectedMembers.length <= 0) {
        selectedMemberListBox.textContent = '';
        selectedMembers.push(member._id);
        pushSelectedMemberToMemberListBox(member);
        checkIcon(member._id);
        return;
    }

    const result = selectedMembers.includes(member._id);

    if (result) {
        const filter = selectedMembers.filter(id => id !== member._id);
        selectedMembers = [...filter];
        removeMember(member._id);
        unCheckIcon(member._id);
    } else {
        selectedMembers.push(member._id);
        pushSelectedMemberToMemberListBox(member);
        checkIcon(member._id);
    }

    console.log(selectedMembers);
}

const pushSelectedMemberToMemberListBox = member => {
    const selectedMemberListBox = document.querySelector('.selected-member-container');

    const div = document.createElement('div');
    div.setAttribute('class', 'selected-member-box');
    div.setAttribute('id', member._id);

    const img = document.createElement('img');
    img.setAttribute('src', member.photo);

    const p = document.createElement('p');
    p.textContent = member.name;

    div.appendChild(img);
    div.appendChild(p);

    selectedMemberListBox.appendChild(div);
}

const removeMember = id => {
    const parentNode = document.querySelector('.selected-member-container');
    const removeTag = document.getElementById(id);

    parentNode.removeChild(removeTag);

    if (selectedMembers.length <= 0) {
        parentNode.textContent = '멤버들을 선택하세요.';
    }
}

const checkIcon = _id => {
    const memberListBox = document.querySelectorAll('.channel-member-list');

    let circleIcon;

    for (let i = 0; i < memberListBox.length; i++) {
        if (memberListBox[i].id == _id) {
            circleIcon = memberListBox[i].children[2];
            break;
        }
    }

    circleIcon.className = 'fa-solid fa-circle-check fa-xl';
    circleIcon.style.color = '#42af2c';
    circleIcon.style.opacity = '0.8';
}

const unCheckIcon = _id => {
    const memberListBox = document.querySelectorAll('.channel-member-list');

    let circleIcon;

    for (let i = 0; i < memberListBox.length; i++) {
        if (memberListBox[i].id == _id) {
            circleIcon = memberListBox[i].children[2];
            break;
        }
    }
    circleIcon.className = 'fa-regular fa-circle fa-xl';
    circleIcon.style.color = 'rgba(0, 0, 0, 0.26)';
}