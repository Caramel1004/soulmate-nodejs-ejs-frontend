window.onload = () => {
    const url = window.location.href;
    this.channelId = url.split('/')[4].split('?')[0];
    this.selectedFeedImages = [];
    this.existFeedFiles = [];
}
/** ----------------- 이벤트 함수 ----------------- */
const onClickFeedUploadBtn = () => {
    createModalTagtoUploadFeed('피드');
    console.log('이벤트 리스너 생성!!!')
    document.getElementById('cancel').addEventListener('click', () => {
        onClickCloseBtn('modal-background');
    });
    document.querySelector('label[for="feed-images"]').addEventListener('change', e => {
        onChangeSelectFile(e);
    });
    document.getElementById('feed-add-request__btn').addEventListener('click', async e => {
        await onClickCreateFeedByReqUserBtn();
    });
    document.getElementById('preview-btn').addEventListener('click', onClickFeedPreviewBtn);
}

const onClickCreateFeedByReqUserBtn = async () => {
    await postCreateFeedByReqUserBtn(this.channelId, this.selectedFeedImages);
}

const onClickEditFeedByReqUserBtn = async e => {
    await patchEditFeedByReqUserBtn(this.channelId, this.selectedFeedImages, e);
}

const onClickFeedRemoveBtn = async e => {
    await deleteRemoveFeedByReqUser(e);
}

const onClickFeedLikeBtn = async e => {
    const feedId = e.target.parentNode.dataset.feedid;
    console.log('feedId: ', feedId);
    await patchPlusOrMinusNumberOfLikeInFeed(this.channelId, feedId, e);
}

const onClickFeedEditModeOpenBtn = e => {
    const feedId = e.target.dataset.feedid;
    console.log('feedId: ', feedId);
    createModalTagtoEditFeed(e, '피드', feedId);
    document.getElementById('preview-images').querySelectorAll('.attached-image-box').forEach(target => {
        target.querySelector('button[id="remove-upload-file__btn"]').addEventListener('click', e => {
            onClickFileRemoveBtn(e);
        })
    })
    document.getElementById('cancel').addEventListener('click', () => {
        onClickCloseBtn('modal-background');
    });
    document.querySelector('label[for="feed-images"]').addEventListener('change', e => {
        onChangeSelectFile(e);
    });
    document.getElementById('feed-edit-request__btn').addEventListener('click', e => {
        onClickEditFeedByReqUserBtn(e);
    });
    document.getElementById('preview-btn').addEventListener('click', onClickFeedPreviewBtn);
}
const onClickFeedPreviewBtn = e => {
    createFeedPreviewTag(e);
    document.getElementById('feed-preview-exit').addEventListener('click', onClickFeedPreviewExitBtn);
}
const onClickFeedPreviewExitBtn = () => {
    document.querySelector('.modal-background').querySelector('.modal-add-mode').style.display = 'block';
    document.getElementById('content').textContent = document.getElementById('modal-preview-mode').querySelector('.feed-comment-box').textContent;
    document.querySelector('.modal-background').removeChild(document.getElementById('modal-preview-mode'));
    document.getElementById('preview-btn').addEventListener('click', onClickFeedPreviewBtn);
    document.getElementById('cancel').addEventListener('click', () => {
        onClickCloseBtn('modal-background');
    });
    document.querySelector('label[for="feed-images"]').addEventListener('change', e => {
        onChangeSelectFile(e);
    });
    document.getElementById('feed-add-request__btn').addEventListener('click', () => {
        onClickCreateFeedByReqUserBtn();
    });
    document.getElementById('preview-images').querySelectorAll('.attached-image-box').forEach(target => {
        target.querySelector('button[id="remove-upload-file__btn"]').addEventListener('click', e => {
            onClickFileRemoveBtn(e);
        })
    })
    document.getElementById('feed-edit-request__btn').addEventListener('click', e => {
        onClickEditFeedByReqUserBtn(e);
    });
}
const createFeedPreviewTag = e => {
    const modalBackground = document.querySelector('.modal-background');
    const modal = modalBackground.querySelector('.modal-add-mode');
    const headerUserInfoTag = document.getElementById('header').querySelector('.user-info');
    const photo = headerUserInfoTag.querySelector('img').src;
    const clientName = headerUserInfoTag.querySelector('.user-name').innerText;
    const content = modal.querySelector('.contents-form__textarea').value;
    const title = modal.querySelector('.box__input').querySelector('input[name="title"]').value;
    modal.style.display = 'none';
    modalBackground.innerHTML +=
        `<div id="modal-preview-mode">
            <div class="feed-box">
                <div class="feed-creator-box">
                    <img src="${photo}">
                </div>
                <div class="feed-content-box">
                    <div class="feed-creator-name-box">
                        <span>${clientName}</span><span id="feed-date">오늘</span>
                    </div>
                    <div class="feed-comment-box">${content}</div>
                    <div class="feed-icons-box">
                        <div class="icon-box">
                            <i class="fa-regular fa-thumbs-up fa-xl"></i>
                            <span>1</span>
                        </div>
                        <div class="icon-box">
                            <i class="fa-regular fa-comment-dots fa-xl"></i>
                            <span>1</span>
                        </div>
                    </div>
                </div>
                <div class="feed-creator-box">
                    <button id="feed-preview-exit"><i class="fa-solid fa-arrow-right-from-bracket"></i> 나가기</button>
                </div>
            </div>
        </div>`;

    const feedBox = document.getElementById('modal-preview-mode').querySelector('.feed-box');
    const attachedImageBoxs = document.getElementById('preview-images').querySelectorAll('.attached-image-box');

    feedBox.querySelector('.feed-creator-box').style.paddingLeft = '15px'
    feedBox.style.margin = '20px';

    if (title !== '' || title) {
        document.getElementById('modal-preview-mode').querySelector('.feed-creator-name-box').innerHTML += `<div class="feed-title-box"><span>Tt.</span><span class="feed-title">${title}</span></div>`
    }

    for (const imageBox of attachedImageBoxs) {
        const imageSrc = imageBox.querySelector('img').src
        feedBox.querySelector('.feed-comment-box').insertAdjacentHTML('afterend', `<img src="${imageSrc}">`);
    }
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
    this.selectedFeedImages = [];
    this.existFeedFiles = [];
    removeChildrenTag(className);
}


const onClickFileRemoveBtn = e => {
    removeFileTag(e);
}
/** ----------------- 태그관련 함수 ----------------- */
const createModalTagtoUploadFeed = title => {
    const modal =
        `<div class="modal-background">
        <div class="modal-add-mode" id="modal-add-mode">
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
}

const createModalTagtoEditFeed = (e, title, feedId) => {
    const feedBox = e.target.parentNode.parentNode;
    const feedTitle = feedBox.querySelector('.feed-title-box').querySelector('.feed-title').innerText;
    const content = feedBox.querySelector('.feed-comment-box').textContent;
    const images = feedBox.querySelector('.feed-content-box').querySelectorAll('img');

    const modal =
        `<div class="modal-background">
        <div class="modal-add-mode" id="modal-add-mode">
            <h2>${title}</h2>
            <div class="box__input">
                <label for="title">제목</label>
                <span><input type="text" name="title" id="title" value="${feedTitle}"></span>
            </div>
            <div class="box__input">
                <span><textarea class="contents-form__textarea" id="content" name="content" placeholder="피드에 업로드할 스크립트를 자유롭게 입력하세요.">${content}</textarea>
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
                <button id="feed-edit-request__btn" type="button" data-feedid="${feedId}">완료</button>
                <a id="cancel">취소</a>
            </div>
        </div>
    </div>`;

    document.querySelector('script').insertAdjacentHTML('beforebegin', modal);

    for (const img of images) {
        const fileId = new Date().getTime().toString(36);
        document.getElementById('preview-images').innerHTML +=
            `<div class="attached-image-box" data-fileid="${fileId}">
            <img src="${img.src}">
            <button type="button" id="remove-upload-file__btn"">
                <i class="fa-solid fa-circle-xmark fa-xl"></i>
            </button>
        </div>`;

        this.existFeedFiles.push({ name: img.src.split('http://localhost:8080/')[1], fileId: fileId });
    }
    console.log(this.existFeedFiles);
    console.log(this.selectedFeedImages);
}

// 부모 태그에서 자식 태그 삭제 -> 모달창 제거
const removeChildrenTag = className => {
    const parentNode = document.querySelector(`.${className}`);
    document.body.removeChild(parentNode);
}

const createPreviewTag = e => {
    try {
        const base64EncodedFile = e.target.result;
        const fileInfo = document.getElementById('feed-images').files[0];//이미 e.target.files[0]은 인코딩되어 없어짐 따라서 dom요소에 접근해 인코딩전 파일 정보가져오기

        if (!base64EncodedFile) {
            throw new Error('파일을 읽지 못했습니다!!');
        }
        const parentNode = document.getElementById('preview-images');

        // 파일 식별 아이디 생성
        const fileId = new Date().getTime().toString(36);
        fileInfo.fileId = fileId;
        console.log(fileInfo);

        parentNode.innerHTML +=
            `<div class="attached-image-box" data-fileid="${fileId}">
            <img src="${base64EncodedFile}">
            <button type="button" id="remove-upload-file__btn" data-fileid="${fileId}">
                <i class="fa-solid fa-circle-xmark fa-xl"></i>
            </button>
        </div>`;

        // 전역변수 selectedFeedImages 배열에 저장
        this.selectedFeedImages = [...this.selectedFeedImages, fileInfo];

        // 이벤트 리스너 생성
        parentNode.querySelectorAll('.attached-image-box').forEach(target => {
            target.querySelector('button[id="remove-upload-file__btn"]').addEventListener('click', e => {
                onClickFileRemoveBtn(e);
            })
        })
        document.querySelector('label[for="feed-images"]').addEventListener('change', onChangeSelectFile);
    } catch (error) {
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

const updateFeedTag = feed => {
    const feedBoxs = document.querySelectorAll('.feed-box');

    for (const feedBox of feedBoxs) {
        const titleBox = feedBox.querySelector('.feed-content-box').querySelector('.feed-title');
        const contentBox = feedBox.querySelector('.feed-comment-box');

        const btn = feedBox.querySelector('.feed-edit-btn-box').querySelector(`button[data-feedid="${feed._id}"]`);

        if (btn) {
            titleBox.innerText = feed.title;
            contentBox.innerText = feed.content;

            feedBox.querySelector('.feed-content-box').querySelectorAll('img').forEach(target => {
                feedBox.querySelector('.feed-content-box').removeChild(target);
            });
            if (feed.imageUrls.length > 0) {
                for (const imageUrl of feed.imageUrls) {
                    contentBox.insertAdjacentHTML('afterend', `<img src="http://localhost:8080/${imageUrl}">`)
                }
            }
        }
    }
}

// 자식요소 모두 제거 하는 함수
const removeAllChild = parent => {
    console.log(parent);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
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
    const color = parseInt(e.target.parentNode.querySelector('span').textContent) > parseInt(numberOfLikeInFeed) ? 'regular' : 'solid'
    e.target.parentNode.querySelector('span').textContent = numberOfLikeInFeed;

    e.target.parentNode.querySelector('i').className = `fa-${color} fa-thumbs-up fa-bounce fa-xl`;
    setTimeout(() => {
        e.target.parentNode.querySelector('i').className = `fa-${color} fa-thumbs-up fa-xl`;
    }, 1000)
}

const removeFileTag = e => {
    const removeBtn = e.target.parentNode;
    const attachedImageBox = removeBtn.parentNode;
    const previewBox = attachedImageBox.parentNode;

    previewBox.removeChild(attachedImageBox);
    const dataSetedFileId = attachedImageBox.dataset.fileid;

    this.selectedFeedImages = [...this.selectedFeedImages.filter(file => file.fileId !== dataSetedFileId)];
    this.existFeedFiles = [...this.existFeedFiles.filter(file => file.fileId !== dataSetedFileId)];
}

const insertVaildationErrorMsg = errorObj => {
    console.log('errorObj: ', errorObj);
    const modal = document.querySelector('.modal-add-mode');
    const modalChildren = modal.querySelectorAll('.box__input');

    if (document.getElementById('valid')) {
        document.getElementById('valid').parentNode.removeChild(document.getElementById('valid'));
        document.getElementById('empty-box').parentNode.removeChild(document.getElementById('empty-box'));
    }
    for (const inputBox of modalChildren) {
        const matchedTag = inputBox.querySelector(`textarea[name="${errorObj.path}"]`);
        if (matchedTag) {
            inputBox.insertAdjacentHTML('beforeend', `<div id="empty-box"></div><div id="empty-box"></div><span class="valid" id="valid">*${errorObj.msg}</span>`);
            break;
        }
    }
}
/** ----------------- API 요청 함수 -----------------*/
const postCreateFeedByReqUserBtn = async (channelId, selectedFeedImages) => {
    const title = document.getElementById('title').value;
    const feedScript = document.getElementById('content').value;

    // if (feedScript == '' && selectedFeedImages.length <= 0) {
    //     return;
    // }

    try {
        console.log('요청요청요청!!!')
        const formData = new FormData();
        formData.set('title', title);
        formData.set('content', feedScript);
        for (const image of selectedFeedImages) {
            formData.append('files', image);
        }


        const resData = await fetch(`http://localhost:3000/client/channel/create-feed/${channelId}`, {
            method: 'POST',
            body: formData
        })

        const data = await resData.json();

        console.log('Feed: ', data);

        if (!data.error) {
            dataLoading();
            removeChildrenTag('modal-background');
            createFeedTag(data.feed);
        } else if (data.error.statusCode == 422) {
            console.log(data.error.statusCode);
            insertVaildationErrorMsg(data.error);
        } else if (data.error.statusCode == 500) {
            dataLoadingFail();
        }
        this.selectedFeedImages = [];
        this.selectedFeedImages = [];
        console.log('피드 생성 완료');
    } catch (error) {
        console.log(error);
    }
}

const patchEditFeedByReqUserBtn = async (channelId, selectedFeedImages, e) => {
    console.log(e.target)
    const feedId = e.target.dataset.feedid;
    const title = document.getElementById('title').value;
    const feedScript = document.getElementById('content').value;

    // if (feedScript == '' && selectedFeedImages.length <= 0) {
    //     return;
    // }

    try {
        console.log('요청요청요청!!!')
        const formData = new FormData();
        formData.set('title', title);
        formData.set('content', feedScript);
        formData.append('existFileUrls', this.existFeedFiles);
        for (const image of selectedFeedImages) {
            formData.append('files', image);
        }

        const resData = await fetch(`http://localhost:3000/client/channel/edit-feed/${channelId}/${feedId}`, {
            method: 'PATCH',
            body: formData
        })

        const data = await resData.json();

        console.log('Feed: ', data);

        if (!data.error) {
            removeChildrenTag('modal-background');
            updateFeedTag(data.feed);
        } else if (data.error.statusCode == 422) {
            console.log(data.error.statusCode);
            insertVaildationErrorMsg(data.error);
        } else if (data.error.statusCode == 500) {
            dataLoadingFail();
        }
        this.selectedFeedImages = [];
        this.existFeedFiles = [];
        console.log('피드 생성 완료');
    } catch (error) {
        console.log(error);
    }
}

const deleteRemoveFeedByReqUser = async e => {
    const feedId = e.target.dataset.feedid;
    try {
        const data = await fetch(`http://localhost:3000/client/channel/delete-feed/${this.channelId}/${feedId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        if (!data.error) {
            alert('삭제 완료');
            const feedBox = e.target.parentNode.parentNode;
            document.querySelector('.feed-container').removeChild(feedBox);
        }
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

// 동일한 클래스에 여러개의 태그가 있을 때, 해당 여러태그에 이벤트리스너 등록
document.querySelectorAll('.feed-edit').forEach(target => {
    target.addEventListener('click', e => {
        onClickFeedEditModeOpenBtn(e);
    });
});

document.querySelectorAll('.feed-delete').forEach(target => {
    target.addEventListener('click', e => {
        onClickFeedRemoveBtn(e);
    });
});