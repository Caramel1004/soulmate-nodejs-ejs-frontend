import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const DOMAIN = 'http://localhost:8080'

const socket = io(DOMAIN);
console.log('스크립트 소켓 가동 중!!!');

/** ----------------- 웹 소켓 이벤트 ----------------- */
// #채팅방
// 1. 실시간 채팅창 업데이트
socket.on('sendChat', data => {
    console.log('미들웨어 sendChat!!!');
    console.log('백엔드에서 넘어온 데이터: ', data);
    console.log('채팅 내용: ', data.currentChat);

    createUnitChatTag(data, 'sendChat');
});

// 2. 실시간 채팅창 파일 업로드
socket.on('sendFile', data => {
    console.log('미들웨어 sendChat!!!');
    console.log('백엔드에서 넘어온 데이터: ', data);
    console.log('파일 URL: ', data.fileUrl);

    createUnitChatTag(data, 'sendFile');
});

// 3. 실시간 채팅방 유저 퇴장 멘트
socket.on('exitUser', data => {
    console.log('data: ', data)
    const p = document.createElement('p');
    p.style.color = '#1d1c1d';
    p.textContent = `${data.exitUser.name}님이 퇴장하셨습니다.`

    document.querySelector('.board-chat__box-history').appendChild(p);
})

// #워크스페이스
// 1. 실시간 게시물 업데이트
socket.on('uploadPost', async data => {
    console.log('미들웨어 uploadPost!!!');
    console.log('백엔드에서 넘어온 데이터: ', data);

    if (data) {
        dataLoading(data, '.box-post-history', createUnitPostTag);
    } else {
        return;
    }
});

// 2. 실시간 댓글 업데이트
socket.on('createReply', async data => {
    console.log('미들웨어 uploadPost!!!');
    console.log('백엔드에서 넘어온 데이터: ', data);

    if (data) {
        dataLoading(data, '.thread', createUnitReplyTag);
    } else {
        return;
    }
});


/** ----------------- 태그 관련 함수 ----------------- */
// 1. 채팅박스 생성
const createUnitChatTag = async (data, action) => {
    // 제일 큰 유닛 박스
    const chatUnitBox = document.createElement('div');
    chatUnitBox.classList.add('board-chat__unit-chat-box');

    // 이미지 박스
    const imgBox = document.createElement('div');
    const img = document.createElement('img');
    img.setAttribute('src', data.photo);
    imgBox.classList.add('board-chat__unit-chat-img');
    imgBox.appendChild(img);
    console.log('imgBox: ', imgBox);

    // 챗박스
    const chatBox = document.createElement('div');
    chatBox.classList.add('chat');

    // 닉네임
    const clientNameTag = document.createElement('div');
    clientNameTag.classList.add('client-name');
    clientNameTag.textContent = data.name;
    chatBox.appendChild(clientNameTag);
    console.log('clientNameTag: ', clientNameTag);

    // 챗
    if(action === 'sendChat') {
        const unitChat = document.createElement('div');
        unitChat.classList.add('board-chat__unit-chat');
        unitChat.textContent = data.currentChat;
        chatBox.appendChild(unitChat);
    }else if(action === 'sendFile') {
        // const fileBox = document.createElement('div');
        // fileBox.classList.add('board-chat__unit-chat');
        const image = document.createElement('img');
        image.src = `${DOMAIN}/${data.fileUrl}`;
        image.id = 'images';
        // fileBox.appendChild(image);
        chatBox.appendChild(image);
    }

    // 타임 스탬프
    const time = document.createElement('div');
    const formatedTime = formatter(new Date());
    time.classList.add('chat-date');
    time.textContent = formatedTime;

    chatUnitBox.appendChild(imgBox);
    chatUnitBox.appendChild(chatBox);
    chatUnitBox.appendChild(time);
    console.log('chatUnitBox: ', chatUnitBox);

    const historyTag = document.querySelector('.board-chat__box-history');
    historyTag.appendChild(chatUnitBox);

    document.getElementById('content').value = "";

    //스크롤 맨아래로 조정
    historyTag.scrollTop = historyTag.scrollHeight;
}

const createUnitPostTag = data => {
    const post = data.post;
    // 게시물 컨테이너
    const postContainer = document.createElement('div');
    postContainer.classList.add('post-container');

    // 타임 스탬프
    const postDate = document.createElement('div');
    const formatedTime = formatter(new Date());
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
    if(data.post.content !== '' && data.post.content !== null){
        const postComment = document.createElement('div');
        postComment.classList.add('post-comment');
        postComment.textContent = post.content;
        postBox.appendChild(postComment);
        console.log('postComment: ', postComment);
    }

    postsBox.appendChild(postImgBox);
    postsBox.appendChild(postBox);

    postContainer.appendChild(postDate);
    postContainer.appendChild(postsBox);

    const historyTag = document.querySelector('.box-post-history');
    historyTag.appendChild(postContainer);

    // 추가 태그
    if(data.post.fileUrls.length > 0){
        postBox.innerHTML += `<p id="attached-files-number">첨부파일 ${data.post.fileUrls.length}개</p>`;
        for(const fileUrl of data.post.fileUrls){
            postBox.innerHTML += 
            `<div class="post-attached-files">
                <img src="http://localhost:8080/${fileUrl}">
            </div>`
        }
    }

    postBox.innerHTML += `
        <p id="reply-number" data-postid="${data.post._id}" onclick="createThreadTag('${data.post._id}')">${post.replies.length}개의 댓글</p>`

    document.getElementById('content').value = "";
    removeAllChild(document.getElementById('preview-files'));

    //스크롤 맨아래로 조정
    historyTag.scrollTop = historyTag.scrollHeight;
}

const createUnitReplyTag = data => {
    const thread = document.querySelector('.thread');

    // 댓글 박스
    const replyBox = document.createElement('div');
    replyBox.classList.add('replies');

    // 이미지 박스
    const replyImgBox = document.createElement('div');
    const img = document.createElement('img');
    img.setAttribute('src', data.reply.creator.photo);
    replyImgBox.classList.add('reply-img-box');
    replyImgBox.appendChild(img);
    console.log('replyImgBox: ', replyImgBox);

    // 생성자 이름, 댓글멘트
    const creatorBox = document.createElement('div');
    creatorBox.classList.add('reply-creator');

    // 경과 일수
    const passedTimeSpan = document.createElement('span');
    const passedTime = Math.ceil(new Date(data.reply.createdAt).getDay() - new Date().getDay());
    const formatterDay = new Intl.RelativeTimeFormat('ko', {
        numeric: 'auto'
    });
    passedTimeSpan.classList.add('passed-time');
    passedTimeSpan.textContent = formatterDay.format(passedTime, 'day');

    // 닉네임
    const clientNameTag = document.createElement('div');
    clientNameTag.classList.add('client-name');
    clientNameTag.textContent = data.reply.creator.name;
    clientNameTag.appendChild(passedTimeSpan);
    creatorBox.appendChild(clientNameTag);
    console.log('clientNameTag: ', clientNameTag);


    // 댓글멘트
    const replyComment = document.createElement('div');
    replyComment.classList.add('reply-comment');
    replyComment.textContent = data.reply.content;
    creatorBox.appendChild(replyComment);
    console.log('replyComment: ', replyComment);

    replyBox.appendChild(replyImgBox);
    replyBox.appendChild(creatorBox);

    thread.appendChild(replyBox);
}

/** ----------------- 유틸 함수 ----------------- */

// 1. 날짜 포맷
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

// 2. 데이터 로딩 할때 UI
const dataLoading = (data, className, callback) => {
    const div = document.createElement('div');
    const img = document.createElement('img')
    const p = document.createElement('p');
    img.setAttribute('src', '/images/icons8-spinner.gif');
    img.setAttribute('width', '100px');
    img.setAttribute('height', '100px');
    img.setAttribute('text-align', 'center');
    div.id = 'load'
    p.textContent = '새로운 데이터가 업로드 되고있습니다.';
    div.style.textAlign = 'center';
    div.appendChild(p);
    div.appendChild(img);
    document.querySelector(className).appendChild(div);
    const historyTag = document.querySelector(className);

    //채팅박스 스크롤 맨 아래로 위치
    historyTag.scrollTop = historyTag.scrollHeight;

    setTimeout(() => {
        const removeTag = document.getElementById('load');
        document.querySelector(className).removeChild(removeTag);
        // 실시간으로 게시물 업데이트
        callback(data);
    }, 1000);
}

// 자식요소 모두 제거 하는 함수
const removeAllChild = parent => {
    console.log(parent);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}