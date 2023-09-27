window.onload = Init();

function Init() {
    this.selectedFiles = [];
    this.selectedMembers = [];// 선택한 유저들 doc아이디 배열로 저장
    console.log(selectedMembers);
}

/** ----------------- 이벤트 함수 ----------------- */

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
    // const kbdEvent = new KeyboardEvent("syntheticKey", false);
    // console.log(kbdEvent.isComposing); // return false

    const content = document.getElementById('content').innerText;
    const replacedContent = replaceText(content);
    console.log(replacedContent);

    if ((event.keyCode === 13 && !event.shiftKey && replacedContent !== "") || (event.keyCode === 13 && !event.shiftKey && this.selectedFiles.length > 0)) {
        try {
            console.log('엔터키 누름!!');
            await onKeyPressEnter(event);
            document.getElementById('content').innerText = ''; // 입력폼 텍스트 없애기
            createPlaceholder(); // placeholder생성
            document.getElementById('content').blur(); // 블러처리
            this.selectedFiles = [];// 파일들 비우기
        } catch (err) {
            console.log(err);
        }
    }

    if (event.keyCode === 13 && replacedContent === "") {
        return document.getElementById('content').innerText.replace('\r\n', '');
    }

    console.log('replacedContent: ', replacedContent);
    console.log('엔터키 안누름!!');
}

const onClickContentInputBox = () => {
    console.log('포커싱!!');
    deletePlaceholder();
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

const onClickReplyEditOrRemoveBtn = (action, postId, replyId) => {
    switch (action) {
        case 'edit': createReplyEditModalTag(postId, replyId);
            break;
        case 'delete': deleteReplyByCreatorInPost(postId, replyId);
            break;
    }
}

const onClickPostEditModTagCloseBtn = (postId, content) => {
    const parentNode = document.getElementById(`post-${postId}`).parentNode;// post
    const postContentTag = document.getElementById(`post-${postId}`);
    const replyTag = parentNode.querySelector('p');

    postContentTag.parentNode.parentNode.style.background = '#ffffff';
    parentNode.removeChild(postContentTag);
    parentNode.removeChild(replyTag);

    const div = document.createElement('div');
    div.id = `post-${postId}`;
    div.className = 'post-comment';
    div.textContent = content;
    parentNode.appendChild(div);
    parentNode.appendChild(replyTag);
}

const onClickWorkSpacePostEditContent = async postId => {
    console.log(postId)
    patchEditPostByCreatorInWorkSpace(postId);
}

const onClickCloseBtn = className => {
    console.log('close');
    const parentNode = document.querySelector(`.${className}`);

    document.querySelector('.board-workspace').style.width = '100%';
    document.body.removeChild(parentNode);
    this.selectedMembers = [];
}

/**
 * 이미지 파일 선택했을 때
 * @param {e: event}
 * e.target.files: 파일 오브젝트
 * e.target.files[0]: 파일 정보
 * e.target.result: base64로 인코딩된 파일
 */
const onChangeSelectFile = async e => {
    try {
        const fileTag = e.target;
        const fileInfo = e.target.files[0];
        console.log(e.target.files[0]);
        // console.log(fileTag.files[0]);
        // console.log(fileTag.files[0].name);
        // console.log(fileTag.files[0].size);
        // console.log(fileTag.files[0].lastModifiedDate);

        if (fileTag.files && fileTag.files[0]) {
            const fileReader = new FileReader();
            fileReader.onload = createPreviewTag;
            fileReader.readAsDataURL(fileTag.files[0]);
        }
    } catch (error) {
        alert(error);
        console.log(error)
    }
}

// const onClickFileRemoveBtn = e => {
//     console.log(e.target);
// }

/** ----------------- 태그관련 함수 ----------------- */
const replaceText = text => {
    let replacedText = text;
    replacedText = text.replace(/\s|/gi, '');
    // replacedText = text.replace(/\r\n| /gi, '<br>');

    return replacedText;
}

const deletePlaceholder = () => {
    return document.getElementById('content').removeChild(document.getElementById('placeholder'));
}

const createPlaceholder = () => {
    const contentTag = document.getElementById('content');
    const workSpaceName = document.getElementById('workSpaceName').innerText;

    if (contentTag.innerText === '') {
        contentTag.insertAdjacentHTML('afterbegin', '<div id="placeholder">' + workSpaceName + '에 내용 올리기</div>');
    }
}

const changeTextAreaTagHeight = () => {
    const textarea = document.getElementById('content');
    textarea.style.height = '2px';
    textarea.style.height = (12 + textarea.scrollHeight) + 'px';
    console.log(textarea.style.height = (12 + textarea.scrollHeight) + 'px');

    const history = document.getElementById('history');
    // history.style.height = '2px';
    // history.style.height = (history.style.height - 2) + 'px';
}

const createReplyEditModalTag = (postId, replyId) => {
    const body = document.body;

    // 모달창 백그라운드
    const modalBackGround = document.createElement('div');
    modalBackGround.classList.add('modal-background');

    body.appendChild(modalBackGround);

    // 모달창
    const modal = document.createElement('div');
    modal.classList.add('modal-reply-edit-mode');

    // 버튼 박스
    const btnBox = document.createElement('div');
    btnBox.classList.add('icon-btn-box');
    btnBox.style.border = 'none';
    btnBox.style.float = 'right';

    // 수정 버튼 안에 아이콘 생성
    const editIcon = document.createElement('i');
    editIcon.className = 'fa-regular fa-pen-to-square';
    editIcon.textContent = '수정'

    // 수정 버튼 생성
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-icon');
    editBtn.style.marginLeft = '10px';
    editBtn.setAttribute('onclick', `patchEditReplyByCreatorInPost('${postId}','${replyId}')`)
    editBtn.append(editIcon);

    // 닫기 버튼 생성
    const closeBtn = document.createElement('button');
    closeBtn.id = 'modal-close-btn';
    closeBtn.setAttribute('onclick', "onClickCloseBtn('modal-background')")
    closeBtn.textContent = 'x';

    btnBox.appendChild(closeBtn);

    modal.appendChild(btnBox);

    const textarea = document.createElement('textarea');
    const replyTag = document.getElementById(`reply-${replyId}`);// 특정 하나의 댓글 태그
    textarea.value = replyTag.querySelector('.reply-comment').textContent;// 댓글 내용 가져오기
    modal.appendChild(textarea);
    modal.appendChild(editBtn);

    modalBackGround.appendChild(modal);
}

// 게시물 수정 모드 태그로 변경
const changePostEditModeTag = postId => {
    const postContentTag = document.getElementById(`post-${postId}`);
    // console.log(document.querySelector('.post-container').children);
    const textarea = document.createElement('textarea');
    textarea.value = postContentTag.textContent;
    textarea.id = 'post-edit-content';
    const content = textarea.value;
    const replacedContent = replaceText(content);

    // 스타일 변경
    postContentTag.parentNode.style.width = '93%';
    postContentTag.parentNode.style.height = 'auto';
    postContentTag.parentNode.parentNode.style.background = 'rgb(235, 222, 203)';
    postContentTag.style.width = '200%';
    postContentTag.style.height = 'auto';
    textarea.style.width = '98%';
    textarea.style.height = '60vh';
    postContentTag.textContent = "";

    const btnBox = document.createElement('div');
    btnBox.style.paddingLeft = '8px';

    // 수정 버튼 생성
    const editIcon = document.createElement('i');
    editIcon.className = 'fa-regular fa-pen-to-square fa-xl';

    const editBtn = document.createElement('button');
    editBtn.classList.add('button__edit-mode-comment-script');
    editBtn.style.float = 'left';
    editBtn.setAttribute('onclick', `onClickWorkSpacePostEditContent('${postId}')`)
    editBtn.append(editIcon);

    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-x';

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('button__edit-mode-comment-script');
    closeBtn.style.marginLeft = '-3px';
    closeBtn.style.float = 'left';
    closeBtn.setAttribute('onclick', `onClickPostEditModTagCloseBtn('${postId}', '${replacedContent}')`)
    closeBtn.append(closeIcon);

    btnBox.appendChild(editBtn);
    btnBox.appendChild(closeBtn);

    postContentTag.appendChild(textarea);
    postContentTag.appendChild(btnBox);
    // postContentTag.appendChild(closeBtn);
}
// 자식요소 모두 제거 하는 함수
const removeAllChild = parent => {
    console.log(parent);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

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
            replyBox.id = `reply-${reply._id}`;

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

            if (reply.isCreator) {
                clientNameTag.textContent = reply.creator.name + '(나)';

                // 수정 버튼 생성
                const editIcon = document.createElement('i');
                editIcon.className = 'fa-regular fa-pen-to-square';
                editIcon.textContent = '수정'

                const editBtn = document.createElement('button');
                editBtn.classList.add('edit-icon');
                editBtn.style.marginLeft = '10px';
                editBtn.setAttribute('onclick', `onClickReplyEditOrRemoveBtn('edit','${postId}','${reply._id}')`)
                editBtn.append(editIcon);

                // 삭제 버튼 생성
                const removeIcon = document.createElement('i');
                removeIcon.className = 'fa-regular fa-trash-can';
                removeIcon.style.color = 'red';
                removeIcon.textContent = '삭제';

                const removeBtn = document.createElement('button');
                removeBtn.classList.add('edit-icon');
                removeBtn.style.marginLeft = '3px';
                removeBtn.setAttribute('onclick', `onClickReplyEditOrRemoveBtn('delete','${postId}','${reply._id}')`)
                removeBtn.append(removeIcon);

                // btnBox.appendChild(editBtn);
                // btnBox.appendChild(removeBtn);
                clientNameTag.appendChild(passedTimeSpan);
                clientNameTag.appendChild(editBtn);
                clientNameTag.appendChild(removeBtn);
                creatorBox.appendChild(clientNameTag);
                console.log('clientNameTag: ', clientNameTag);
            } else {
                clientNameTag.textContent = reply.creator.name;
                clientNameTag.appendChild(passedTimeSpan);
                creatorBox.appendChild(clientNameTag);
            }


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

/**
 * 이미지 미리보기 박스 태그 생성
 * @param {e: event}
 * e.target.files: 파일 오브젝트
 * e.target.files[0]: 파일 정보
 * e.target.result: base64로 인코딩된 파일
 */
const onClickFileRemoveBtn = fileId => {
    console.log(fileId)
    const target = document.querySelector(`button[data-fileid="${fileId}"]`);
    console.log(target)
    const targetParentNode = target.parentNode;
    const topParentNode = targetParentNode.parentNode;

    topParentNode.removeChild(targetParentNode);
    const dataSetedFileId = targetParentNode.dataset.fileid;

    this.selectedFiles = [...this.selectedFiles.filter(file => file.fileId !== dataSetedFileId)];
    console.log(this.selectedFiles);
}
const createPreviewTag = e => {
    try {
        const base64EncodedFile = e.target.result;
        const fileInfo = document.getElementById('file').files[0];//이미 e.target.files[0]은 인코딩되어 없어짐 따라서 dom요소에 접근해 인코딩전 파일 정보가져오기

        if (!base64EncodedFile) {
            throw new Error('파일을 읽지 못했습니다!!');
        }
        const parentNode = document.getElementById('preview-files');

        // 파일 식별 아이디 생성
        const fileId = new Date().getTime().toString(36);
        fileInfo.fileId = fileId;

        parentNode.innerHTML +=
            `<div class="attached-file" data-fileid="${fileId}">
            <img src="${base64EncodedFile}">
            <button type="button" id="remove-upload-file__btn" data-fileid="${fileId}">
                <i class="fa-solid fa-circle-xmark fa-xl"></i>
            </button>
        </div>`;

        document.querySelector(`button[data-fileid="${fileId}"]`).addEventListener('click', e => {
            console.log('click like');
            onClickFileRemoveBtn(fileId);
        })

        // 전역변수 selectedFiles 배열에 저장
        this.selectedFiles = [...this.selectedFiles, fileInfo];
        return fileId;
    } catch (error) {
        alert(error)
        console.log(error)
    }
}

/** ----------------- API 요청 함수 -----------------*/
// 게시물 내용 post요청
const postCreatePostToWorkSpace = async () => {
    let content = document.getElementById('content').innerText;
    const contentTagChildren = document.getElementById('content').children;// placeholder
    console.log('contentTagChildren: ', contentTagChildren.length);
    console.log('content: ', content);

    // placeholder있고 파일 없으면 리턴
    if (contentTagChildren.length > 0 && this.selectedFiles.length <= 0) {
        return;
    }

    if (contentTagChildren.length > 0 && this.selectedFiles.length > 0) {
        content = '';
    }

    if (!confirm('게시물을 업로드 하시겠습니까?')) {
        return;
    }

    try {
        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];
        const replaceContent = content.replace('\r\n', '<br>');
        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);
        console.log('replaceContent : ', replaceContent);
        console.log('selectedFiles: ', this.selectedFiles);

        // 폼데이터
        const formData = new FormData();
        formData.set('content', replaceContent);
        for (const file of this.selectedFiles) {
            formData.append('files', file);
        }

        const response = await fetch(`http://localhost:3000/client/workspace/create-post/${channelId}/${workSpaceId}`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (!data) {
            throw new Error('게시물 업로드 실패');
        }
        console.log('게시물 처리 완료!!!');
    } catch (err) {
        console.log(err);
        alert(err);
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

        await fetch(`http://localhost:3000/client/workspace/post/create-reply/${channelId}/${workSpaceId}`, {
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

const deleteReplyByCreatorInPost = async (postId, replyId) => {
    if (!confirm('댓글 삭제 하시겠습니까?')) {
        return;
    }
    try {
        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];

        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);
        console.log('postId : ', postId);
        console.log('replyId : ', replyId);

        const response = await fetch(`http://localhost:3000/client/workspace/post/delete-reply/${channelId}/${workSpaceId}/${postId}/${replyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('댓글 삭제 완료!!!');
        console.log(data);
        console.log(document.querySelector('thread'));
        if (data) {
            document.querySelector('.thread').removeChild(document.getElementById(`reply-${replyId}`));
        }
    } catch (err) {
        console.log(err);
    }
}

const patchEditReplyByCreatorInPost = async (postId, replyId) => {
    const content = document.querySelector('.modal-reply-edit-mode').querySelector('textarea').value;
    console.log(content)
    if (!confirm('댓글 수정 하시겠습니까?')) {
        return;
    }
    try {
        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];
        const replaceContent = content.replace('\r\n', '<br>');

        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);
        console.log('postId : ', postId);
        console.log('replyId : ', replyId);
        console.log('replaceContent : ', replaceContent);

        const formData = new FormData();
        formData.append('postId', postId);
        formData.append('replyId', replyId);
        formData.append('content', replaceContent);

        const response = await fetch(`http://localhost:3000/client/workspace/post/edit-reply/${channelId}/${workSpaceId}`, {
            method: 'PATCH',
            body: formData
        });

        const data = await response.json();
        console.log('댓글 수정 완료!!!');
        console.log(data);
        onClickCloseBtn('modal-background');
        document.getElementById(`reply-${replyId}`).querySelector('.reply-comment').textContent = data.updatedReply.content;
    } catch (err) {
        console.log(err);
    }
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

        if (data.error) {
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

/** ----------------- 유틸 함수 -----------------*/

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
        const response = await fetch(`http://localhost:3000/client/channel/member-list/${channelId}`, {
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

/** ----------------- 이벤트 리스너 ----------------- */
document.getElementById('send').addEventListener('click', postCreatePostToWorkSpace);
document.getElementById('content').addEventListener('keydown', onKeyDownCreateUnitPost);
document.getElementById('content').addEventListener('focus', onClickContentInputBox);
document.getElementById('content').addEventListener('blur', () => {
    console.log('blur!!');
    createPlaceholder();
});
document.getElementById('file').addEventListener('change', onChangeSelectFile);
document.getElementById('comment-edit-mode').addEventListener('click', onClickWorkSpaceEditCommentScriptBtn);
window.addEventListener('DOMContentLoaded', activeSortTypeBtnColor);