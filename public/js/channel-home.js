window.onload = () => {
    const url = window.location.href;
    this.channelId = url.split('/')[4].split('?')[0];
    this.selectedFeedImages = [];
}
/** ----------------- 이벤트 함수 ----------------- */
const onClickFeedUploadBtn = () => {
    createModalTagtoUploadFeed(channelId, '피드');

    document.getElementById('cancel').addEventListener('click', () => {
        console.log('event');
        onClickCloseBtn('modal-background');
    });
}

const onClickCreateFeedByReqUserBtn = async () => {
    await postCreateFeedByReqUserBtn(this.channelId, this.selectedFeedImages);
}

const onClickFeedLikeBtn = async e => {
    const feedId = e.target.parentNode.dataset.feedid;
    console.log('feedId: ', feedId);
    await patchPlusOrMinusNumberOfLikeInFeed(this.channelId, feedId, e);
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

const onClickCloseBtn = className => {
    removeChildrenTag(className);
    this.selectedFeedImages = [];
}


const onClickImageRemoveBtn = e => {
    console.log(e.target);
}
/** ----------------- 태그관련 함수 ----------------- */
const createModalTagtoUploadFeed = (channelId, title) => {
    const modal =
        `<div class="modal-background">
        <div class="modal-add-mode">
            <h2>${title}</h2>
            <div class="box__input">
                <label for="title">제목</label>
                <span><input type="text" name="title" id="title"></span>
            </div>
            <div class="box__input">
                <span><textarea class="contents-form__textarea" id="content" name="content" placeholder="피드에 업로드할 스크립트를 자유롭게 입력하세요."></textarea>
            </div>
            <div id="preview-images">
                <div id="feed-images-empty-box"></div>
                <div id="feed-images-empty-box">
                    <label for="feed-images">
                        <i class="fa-solid fa-upload fa-xl"></i>사진 업로드하기
                        <input type="file" name="images" id="feed-images" multiple>
                    </label>
                </div>
                <div id="feed-images-empty-box"></div>
            </div>
            <div class="box__button__submit">
                <a id="preview-btn">미리 보기</a>
                <button id="feed-add-request__btn" type="button">완료</button>
                <a id="cancel">취소</a>
            </div>
        </div>
    </div>`;
    document.querySelector('script').insertAdjacentHTML('beforebegin', modal);
    document.querySelector('label[for="feed-images"]').addEventListener('change', onChangeSelectFile);
    document.getElementById('feed-add-request__btn').addEventListener('click', onClickCreateFeedByReqUserBtn);
}

// 부모 태그에서 자식 태그 삭제 -> 모달창 제거
const removeChildrenTag = className => {
    const parentNode = document.querySelector(`.${className}`);
    document.body.removeChild(parentNode);
}

const createPreviewTag = e => {
    try {
        console.log('createPreviewTag')
        const base64EncodedFile = e.target.result;
        const fileInfo = document.getElementById('feed-images').files[0];//이미 e.target.files[0]은 인코딩되어 없어짐 따라서 dom요소에 접근해 인코딩전 파일 정보가져오기

        if (!base64EncodedFile) {
            throw new Error('파일을 읽지 못했습니다!!');
        }
        const parentNode = document.getElementById('preview-images');

        // 파일 식별 아이디 생성
        const fileId = new Date().getTime().toString(36);
        fileInfo.fileId = fileId;

        parentNode.innerHTML +=
            `<div class="attached-image-box" data-fileid="${fileId}">
            <img src="${base64EncodedFile}">
            <button type="button" id="remove-upload-file__btn" data-fileid="${fileId}">
                <i class="fa-solid fa-circle-xmark fa-xl"></i>
            </button>
        </div>`;

        // 전역변수 selectedFiles 배열에 저장
        this.selectedFeedImages = [...this.selectedFeedImages, fileInfo];

        // 이벤트 리스너 생성
        parentNode.querySelector(`button[data-fileid="${fileId}"]`).addEventListener('click', e => {
            console.log('click like');
            onClickImageRemoveBtn(fileId);
        })
        document.querySelector('label[for="feed-images"]').addEventListener('change', onChangeSelectFile);
    } catch (error) {
        alert(error)
        console.log(error)
    }
}

// 업데이트 태그
const createFeedTag = data => {
    const feedBox = document.createElement('div');
    feedBox.classList.add('feed-box');

    setTimeout(() => {
        document.querySelector('.feed-container').removeChild(document.getElementById('load-box'));
        feedBox.innerHTML +=
            `<div class="feed-creator-box">
                <img src="${data.creator.photo}">
            </div>
            <div class="feed-content-box">
                <div class="feed-creator-name-box">
                    <span>${data.creator.name}</span><span id="feed-date">1일전</span>
                </div>
                <div class="feed-comment-box">${data.content}</div>
                <div class="feed-icons-box">
                    <div class="icon-box">
                        <i class="fa-regular fa-thumbs-up fa-xl"></i>
                        <span>${data.likes.length}</span>
                    </div>
                    <div class="icon-box">
                        <i class="fa-regular fa-comment-dots fa-xl"></i>
                        <span>${data.feedReplys.length}</span>
                    </div>
                </div>
            </div>
            <div class="feed-creator-box">
                <button id="feed-edit"><i class="fa-regular fa-pen-to-square"></i>수정</button>
            </div>`;
        document.querySelector('.feed-container').children[0].insertAdjacentElement('afterend', feedBox);
        for (const image of data.imageUrls) {
            feedBox.querySelector('.feed-comment-box').insertAdjacentHTML('afterend', `<img src="http://localhost:8080/${image}">`);
        }
    }, 5000);
}

const dataLoading = () => {
    const loadingBox =
        `<div id="load-box">
        <i class="fa-solid fa-upload fa-bounce fa-2xl"></i>
        <h3>피드 올리는 중입니다...</h3>
    </div>`
    document.querySelector('.feed-container').children[0].insertAdjacentHTML('afterend', loadingBox);
    console.log('데이터 로딩')
}
const dataLoadingFail = () => {
    document.querySelector('.feed-container').removeChild(document.getElementById('load-box'));
    const failBox =
        `<div id="load-box">
        <h3>서버에 문제가 발생하였습니다...</h3>
    </div>`
    document.querySelector('.feed-container').children[0].insertAdjacentHTML('afterend', failBox);
    setTimeout(() => {
        document.querySelector('.feed-container').removeChild(document.getElementById('load-box'));
    }, 2000);
    console.log('데이터 로딩')
}

const updateNumberOfLikeAndThumbIconInFeed = (e, numberOfLikeInFeed) => {
    // e.target: <i class="fa-regular fa-thumbs-up fa-xl"></i>
    // e.target.parentNode: 
    // <div id="feed-like__btn" class="icon-box" data-feedid="<%= feed._id%>">
    //     <i class="fa-regular fa-thumbs-up fa-xl"></i>
    //     <span><%= feed.likes.length %></span>
    // </div>
    e.target.parentNode.querySelector('span').textContent = numberOfLikeInFeed;
    e.target.parentNode.querySelector('i').className = 'fa-regular fa-thumbs-up fa-bounce fa-xl';
    setTimeout(() => {
        e.target.parentNode.querySelector('i').className = 'fa-regular fa-thumbs-up fa-xl';
    }, 1000)
}

/** ----------------- API 요청 함수 -----------------*/
const postCreateFeedByReqUserBtn = async (channelId, selectedFeedImages) => {
    const title = document.getElementById('title').value;
    const feedScript = document.getElementById('content').value;

    if (feedScript == '' && selectedFeedImages.length <= 0) {
        return;
    }

    try {
        const formData = new FormData();
        formData.set('title', title);
        formData.set('content', feedScript);
        for (const image of selectedFeedImages) {
            formData.append('files', image);
        }

        dataLoading();

        const resData = await fetch(`http://localhost:3000/client/channel/create-feed/${channelId}`, {
            method: 'POST',
            body: formData
        })

        const data = await resData.json();

        console.log('Feed: ', data);

        removeChildrenTag('modal-background');
        if (!data.error) {
            createFeedTag(data.feed);
        } else {
            dataLoadingFail();
        }
        this.selectedFeedImages = [];
        console.log('피드 생성 완료');
    } catch (error) {
        console.log(error);
    }
}

const patchPlusOrMinusNumberOfLikeInFeed = async (channelId, feedId, e) => {
    try {
        const response = await fetch(`http://localhost:3000/client/channel/plus-or-minus-feed-like`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channelId: channelId,
                feedId: feedId
            })
        })

        const data = await response.json();
        console.log(data);
        if (!data.error) {
            updateNumberOfLikeAndThumbIconInFeed(e, data.numberOfLikeInFeed);
        }
    } catch (err) {
        console.log(err);
    }
}
/** ----------------- 이벤트리스너 ----------------- */
document.getElementById('feed-upload-modal__btn').addEventListener('click', () => {
    console.log('피드 모달창 오픈!');
    onClickFeedUploadBtn();
});

document.getElementById('feed-like__btn').addEventListener('click', e => {
    console.log('좋아요!');
    onClickFeedLikeBtn(e);
});