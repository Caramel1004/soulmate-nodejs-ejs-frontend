window.onload = Init();

function Init() {
    this.selectedFiles = [];
    this.selectedMembers = [];// 선택한 유저들 doc아이디 배열로 저장
    this.tmpContent = '';
    this.postEditMode = false;
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
    // console.log(event.keyCode);
    // console.log(event.isComposing);

    const content = document.getElementById('content').innerText;
    const replacedContent = replaceText(content);

    if ((event.keyCode === 13 && !event.shiftKey && replacedContent !== "") || (event.keyCode === 13 && !event.shiftKey && this.selectedFiles.length > 0)) {
        try {
            console.log('엔터키 누름!!');
            event.preventDefault();
            await onKeyPressEnter(event);
            createPlaceholder(); // placeholder생성
            document.getElementById('content').blur(); // 블러처리
            document.getElementById('content').value = '';
            this.selectedFiles = [];// 파일들 비우기
        } catch (err) {
            console.log(err);
        }
    }

    if (event.keyCode === 13 && replacedContent === "" || event.keyCode === 13 && event.shiftKey) {
        console.log(event.keyCode);
        changeTextAreaTagHeight(event);
        return document.getElementById('content').innerText.replace('\r\n', '');
    }

    console.log('replacedContent: ', replacedContent);
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

const onClickWorkSpacePostEditOrRemoveBtn = (action, postId, e) => {
    console.log(action);
    switch (action) {
        case 'edit': changePostEditModeTag(postId, e);
            break;
        case 'remove': deletePostByCreatorInWorkSpace(postId, e);
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

const onClickPostEditModTagCloseBtn = e => {
    const parentNode = e.target.parentNode.parentNode.parentNode.parentNode;// post
    console.log(parentNode)
    const postContentTag = parentNode.querySelector('.post-comment');

    postContentTag.parentNode.parentNode.style.background = '#ffffff';
    parentNode.removeChild(postContentTag);

    const div = document.createElement('div');
    div.className = 'post-comment';
    div.textContent = this.tmpContent;

    parentNode.querySelector('.client-name').insertAdjacentElement('afterend', div);

    this.tmpContent = '';
    this.postEditMode = false;
}

const onClickWorkSpacePostEditContent = async postId => {
    console.log(postId)
    patchEditPostByCreatorInWorkSpace(postId);
}

const onClickCloseBtn = className => {
    const parentNode = document.querySelector(`.${className}`);
    document.querySelector('.board-workspace').style.width = '100%';
    document.body.removeChild(parentNode);
    this.selectedMembers = [];

    // 이미지 모달창 꺼질때 키 이벤트 삭제
    document.body.removeEventListener('keydown', onKeyDownArrowBtnInPreviewModal);
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

const onClickFileRemoveBtn = e => {
    removeFileTag(e);
}

const onClickAttachedFileBox = e => {
    createPreviewModaForLargeViewOfAttachment(e);

    // 이벤트 리스너 등록
    // 오른쪽: 39 왼쪽: 37 ESC: 27 화살표와 ESC키 작동
    document.body.addEventListener('keydown', onKeyDownArrowBtnInPreviewModal);

    document.getElementById('next').addEventListener('click', onClickArrowBtnInPreviewModal);
    document.getElementById('previous').addEventListener('click', onClickArrowBtnInPreviewModal);

    // 모달창 클로즈 이벤트
    // 콜백함수: 모달창 닫는 이벤트함수 실행, 모달창 오픈할때 등록되었던 이벤트리스너 삭제
    document.getElementById('cancel').addEventListener('click', () => {
        onClickCloseBtn('modal-background');

        // 제거할 이벤트 리스너
        document.getElementById('next').removeEventListener('click', onClickArrowBtnInPreviewModal);
        document.getElementById('previous').removeEventListener('click', onClickArrowBtnInPreviewModal);
    });
}

const onClickArrowBtnInPreviewModal = e => {
    changeImageInPreviewModal(e.target.id);
}

const onKeyDownArrowBtnInPreviewModal = e => {
    switch (e.keyCode) {
        case 37: changeImageInPreviewModal('previous');
            break;
        case 39: changeImageInPreviewModal('next');
            break;
        case 27: onClickCloseBtn('modal-background');
            break;
    }
}
/** ----------------- 태그관련 함수 ----------------- */
const changeImageInPreviewModal = action => {
    const modal = document.querySelector('.attached-file-big-view-mode');
    const gridBox = modal.querySelector('.big-size-box').children[1];
    const currentIndex = parseInt(gridBox.dataset.index);
    let selectedIndex = currentIndex;
    const fileTagNodeList = gridBox.querySelectorAll('img');

    switch (action) {
        case 'next': selectedIndex += 1;
            break;
        case 'previous': selectedIndex -= 1
            break;
        default:
            break;
    }

    if (selectedIndex >= fileTagNodeList.length) {
        selectedIndex = 0;
    } else if (selectedIndex <= -1) {
        selectedIndex = fileTagNodeList.length - 1;
    }

    gridBox.querySelector(`img[data-index="${currentIndex}"]`).className = 'hidden';
    document.getElementById('file-current-index').textContent = selectedIndex + 1;
    fileTagNodeList[selectedIndex].className = 'active';
    gridBox.dataset.index = selectedIndex;
}

const createPreviewModaForLargeViewOfAttachment = e => {
    const previewBox = e.target.parentNode;
    const fileTagNodeList = previewBox.querySelectorAll('img');// NodeList
    const fileTagArr = Array.prototype.slice.call(fileTagNodeList);// NodeList를 배열로 변환
    const selectedIndex = fileTagArr.indexOf(e.target);
    const modal =
        `<div class="modal-background" id="modal">
            <div class="attached-file-big-view-mode">
                <div class="box__button__submit">
                    <a id="cancel">x</a>
                </div>
                <div class="big-size-box">
                    <div class="view-grid-inner-box">
                        <i class="fa-solid fa-chevron-left fa-xl" id="previous"></i>
                    </div>
                    <div class="view-grid-inner-box" data-index="${selectedIndex}"></div>
                    <div class="view-grid-inner-box">
                        <i class="fa-solid fa-chevron-right fa-xl" id="next"></i>
                    </div>
                </div>
            </div>
        </div>`;

    document.querySelector('script').insertAdjacentHTML('beforebegin', modal);
    let tmpIndex = 0;
    fileTagArr.forEach(target => {
        let insertTag = `<img src=${target.src} class="hidden" data-index="${tmpIndex}">`;
        const targetIndex = fileTagArr.indexOf(target);
        if (selectedIndex == targetIndex) {
            insertTag = `<img src=${target.src} class="active" data-index="${tmpIndex}">`
        }
        document.querySelector('.attached-file-big-view-mode').querySelector('.big-size-box').children[1].innerHTML += insertTag;
        tmpIndex++;
    })
    document.querySelector('.attached-file-big-view-mode').innerHTML += `<p><span id="file-current-index">${selectedIndex + 1}</span> / ${fileTagArr.length}</p>`
}

const replaceText = text => {
    let replacedText = text;
    replacedText = text.replace(/\s|/gi, '');
    // replacedText = text.replace(/\r\n| /gi, '<br>');

    return replacedText;
}

const deletePlaceholder = () => {
    if(document.getElementById('placeholder')) {
        document.getElementById('content').removeChild(document.getElementById('placeholder'));
    }
}

const createPlaceholder = () => {
    const contentTag = document.getElementById('content');
    const workSpaceName = document.getElementById('workSpaceName').innerText;

    if (contentTag.innerText === '') {
        contentTag.insertAdjacentHTML('afterbegin', '<div id="placeholder">' + workSpaceName + '에 내용 올리기</div>');
    }
}

const changeTextAreaTagHeight = e => {
    const textarea = e.target.parentNode;
    const inputBoxParentNode = textarea.parentNode;
  
    console.log('전',inputBoxParentNode.scrollHeight);

    // let inputBoxParentNodeHeight = parseInt(inputBoxParentNode.style.height.split('px')[0]);
    let inputBoxParentNodeHeight = inputBoxParentNode.scrollHeight;

    inputBoxParentNodeHeight += 2;
    console.log('플러스', inputBoxParentNodeHeight);
    console.log('후', inputBoxParentNode.scrollHeight);
    return inputBoxParentNode.style.height = `${inputBoxParentNodeHeight}px`;
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
const changePostEditModeTag = (postId, e) => {
    if (!this.postEditMode) {
        this.postEditMode = true;
        const parentNode = e.target.parentNode.parentNode.parentNode;
        console.log(parentNode)
        const textarea = document.createElement('div');
        const postContentTag = parentNode.querySelector('.post-comment');
        if (postContentTag) {
            textarea.textContent = postContentTag.textContent;
        } else {
            textarea.textContent = '';
        }
        textarea.id = 'post-edit-content';
        textarea.contentEditable = 'true';
        this.tmpContent = textarea.textContent;
        console.log(this.tmpContent)
        // const replacedContent = replaceText(content);

        // 스타일 변경
        postContentTag.parentNode.style.width = '93%';
        // postContentTag.parentNode.parentNode.style.background = 'rgb(235, 222, 203)';
        postContentTag.parentNode.parentNode.style.background = 'rgba(243, 243, 246, 0.5)';
        postContentTag.style.width = '100%';
        textarea.style.padding = '10px';
        textarea.style.width = '99%';
        textarea.style.height = 'auto';
        textarea.style.border = '1px groove rgba(0,0,0,0.26)';
        textarea.style.borderBottom = 'none';
        textarea.style.borderTopRightRadius = '10px';
        textarea.style.borderTopLeftRadius = '10px';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.background = 'rgb(243, 243, 246)'
        textarea.style.fontSize = '15px'
        textarea.style.lineHeight = '23px'
        postContentTag.textContent = "";

        const filePreviewBox = document.createElement('div');
        filePreviewBox.id = 'edit-mode-preview-files';
        filePreviewBox.style.width = '99.3%';
        filePreviewBox.style.border = '1px groove rgba(0,0,0,0.26)';
        filePreviewBox.style.borderBottom = 'none';
        filePreviewBox.style.borderRadius = '0';

        const btnBox = document.createElement('div');
        btnBox.style.padding = '10px 20px 10px 5px';
        btnBox.style.width = '99%';
        btnBox.style.border = '1px groove rgba(0,0,0,0.26)';
        btnBox.style.display = 'flex';
        btnBox.style.alignItems = 'center';
        btnBox.style.justifyContent = 'space-between';
        btnBox.style.borderBottomRightRadius = '10px';
        btnBox.style.borderBottomLeftRadius = '10px';

        const positionRightBox = document.createElement('div');
        const positionLeftBox = document.createElement('div');
        // 수정 버튼 생성
        const editIcon = document.createElement('i');
        editIcon.className = 'fa-regular fa-pen-to-square fa-xl';
        editIcon.style.color = '#ffffff';

        const editBtn = document.createElement('button');
        editBtn.classList.add('post-edit-complete-btn');
        editBtn.style.background = '#000000';
        editBtn.style.color = '#ffffff';
        editBtn.setAttribute('onclick', `onClickWorkSpacePostEditContent('${postId}')`)
        editBtn.append(editIcon);
        editBtn.append('완료');

        const closeBtn = document.createElement('button');
        closeBtn.classList.add('post-edit-complete-btn');
        closeBtn.id = 'post-edit-cancel__btn';
        closeBtn.append('취소');

        const fileLabel = document.createElement('label');
        fileLabel.htmlFor = 'post-edit-file';
        fileLabel.style.background = 'rgb(243, 243, 246)'
        fileLabel.innerHTML += `<i class="fa-solid fa-file fa-lg"></i>`;
        const fileBtn = document.createElement('input');
        fileBtn.type = 'file';
        fileBtn.id = 'post-edit-file';
        fileBtn.style.display = 'none';
        fileLabel.appendChild(fileBtn);

        positionLeftBox.appendChild(fileLabel);

        positionRightBox.appendChild(editBtn);
        positionRightBox.appendChild(closeBtn);

        btnBox.appendChild(positionLeftBox);
        btnBox.appendChild(positionRightBox);

        postContentTag.appendChild(textarea);
        postContentTag.appendChild(filePreviewBox);
        postContentTag.appendChild(btnBox);

        console.log(postContentTag.parentNode.querySelector('.post-attached-files'));
        // 이미지 파일태그
        if (postContentTag.parentNode.querySelector('.post-attached-files') !== null) {
            const imagesTag = postContentTag.parentNode.querySelector('.post-attached-files').querySelectorAll('img');
            console.log(imagesTag);
            for (const imageTag of imagesTag) {
                filePreviewBox.innerHTML += `<div class="edit-mode-attached-file"><img src="${imageTag.src}"></div>`
            }
        }

        // 등록될 이벤트 리스너
        document.getElementById('post-edit-cancel__btn').addEventListener('click', e => {
            onClickPostEditModTagCloseBtn(e);
        });

        document.getElementById('post-edit-file').addEventListener('change', onChangeSelectFile);
    }
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

        const response = await fetch(`http://localhost:3000/client/workspace/post/replies/${channelId}/${workSpaceId}/${postId}`, {
            method: 'GET'
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

const removeFileTag = e => {
    const removeBtn = e.target.parentNode;
    const attachedImageBox = removeBtn.parentNode;
    const previewBox = attachedImageBox.parentNode;

    previewBox.removeChild(attachedImageBox);
    const dataSetedFileId = attachedImageBox.dataset.fileid;

    this.selectedFiles = [...this.selectedFiles.filter(file => file.fileId !== dataSetedFileId)];
    console.log(this.selectedFiles);
}

/**
 * 이미지 미리보기 박스 태그 생성
 * @param {e: event}
 * e.target.files: 파일 오브젝트
 * e.target.files[0]: 파일 정보
 * e.target.result: base64로 인코딩된 파일
 */
const createPreviewTag = e => {
    try {
        let previewTagId = 'preview-files';
        let fileTagId = 'file';
        let attachedFileBoxClass = 'attached-file';

        if (this.postEditMode) {
            previewTagId = 'edit-mode-preview-files';
            attachedFileBoxClass = 'edit-mode-attached-file';
            fileTagId = 'post-edit-file';
        }

        const base64EncodedFile = e.target.result;
        const fileInfo = document.getElementById(fileTagId).files[0];//이미 e.target.files[0]은 인코딩되어 없어짐 따라서 dom요소에 접근해 인코딩전 파일 정보가져오기

        if (!base64EncodedFile) {
            throw new Error('파일을 읽지 못했습니다!!');
        }

        const parentNode = document.getElementById(previewTagId);

        // 파일 식별 아이디 생성
        const fileId = new Date().getTime().toString(36);
        fileInfo.fileId = fileId;

        parentNode.innerHTML +=
            `<div class="${attachedFileBoxClass}" data-fileid="${fileId}">
            <img src="${base64EncodedFile}">
            <button type="button" id="remove-upload-file__btn" data-fileid="${fileId}"><i class="fa-solid fa-circle-xmark fa-xl"></i></button>
        </div>`;

        parentNode.querySelectorAll('.attached-file').forEach(target => {
            target.querySelector('button[id="remove-upload-file__btn"]').addEventListener('click', e => {
                onClickFileRemoveBtn(e);
            })
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
    console.log('api!!!')
    let content = document.getElementById('content').innerText;
    const placeholder = document.getElementById('placeholder');// placeholder
    console.log('placeholder: ', placeholder);
    console.log('content: ', content);

    // placeholder있고 파일 없으면 리턴
    if (placeholder && this.selectedFiles.length <= 0) {
        console.log('내용 비어있음');
        return;
    }

    if (placeholder && this.selectedFiles.length > 0) {
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

// 친구 초대
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
                selectedIds: this.selectedMembers
            })
        });

        return window.location.replace(`http://localhost:3000/channel/workspace/${channelId}/${workSpaceId}?sortType=lastest&&sortNum=-1`);
    } catch (err) {
        console, log(err);
    }
}

const patchRemoveMemeberToWorkSpace = async () => {
    try {
        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6].split('?')[0];

        await fetch(`http://localhost:3000/client/workspace/exit`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channelId: channelId,
                workSpaceId: workSpaceId
            })
        });

        return window.location.replace(`/mychannel/${channelId}?searchType=workspaces`);
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
        const content = document.getElementById('post-edit-content').textContent;
        const replaceContent = content.replace('\r\n', '<br>');

        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);
        console.log('postId : ', postId);
        console.log('content : ', content);

        const formData = new FormData();
        formData.append('postId', postId);
        formData.append('content', replaceContent);
        for (const file of this.selectedFiles) {
            formData.append('files', file);
        }

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

const deletePostByCreatorInWorkSpace = async (postId, e) => {
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
document.querySelectorAll('.post-attached-files').forEach(parent => {
    parent.querySelectorAll('img').forEach(target => {
        target.addEventListener('click', e => {
            onClickAttachedFileBox(e);
        });
    })
})
document.querySelectorAll('.edit-icon').forEach(target => {
    target.addEventListener('click', e => {
        const postId = target.dataset.postid
        onClickWorkSpacePostEditOrRemoveBtn('edit', `${postId}`, e);
    })
})
document.querySelectorAll('.delete-icon').forEach(target => {
    target.addEventListener('click', e => {
        const postId = target.dataset.postid
        onClickWorkSpacePostEditOrRemoveBtn('remove', `${postId}`, e);
    })
})
window.addEventListener('DOMContentLoaded', activeSortTypeBtnColor);
