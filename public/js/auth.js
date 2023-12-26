const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');

const onClickOpenSignupForm = () => {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    console.log('회원가입 창 오픈!!!');
}

const onClickOpenLoginForm = () => {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    console.log('로그인 창 오픈!!!');
}

const onClickOpenYNRadio = () => {
    const circleIcon = document.getElementById('gender').querySelectorAll('i');

    // 라디오버튼 초화
    for (circle of circleIcon) {
        circle.className = 'fa-regular fa-circle fa-lg';
        circle.style.color = 'rgba(0, 0, 0, 0.1)';
    }

    const checkedRadio = document.querySelector('input[type="radio"]:checked,input[name="gender"]:checked');

    const checkedIcon = checkedRadio.parentNode.querySelector('i');

    checkedIcon.className = 'fa-solid fa-circle-check fa-lg';
    checkedIcon.style.color = '#42af2c';
    checkedIcon.style.opacity = '0.8';
}

const onClickPhotoModalBtn = () => {
    const modal = createModalTagtoSelectUserProfilePhoto();
    document.getElementById('cancel').addEventListener('click', () => {
        onClickCloseBtn('modal-background');
    });
    document.getElementById('complete').addEventListener('click', () => {
        onClickCompleteBtn('modal-background');
    });
    modal.querySelector('label[for="file"]').addEventListener('change', onChangeSelectFile);
}

const onClickSubmitBodyBtn = async () => {
    await postSignUp();
}

const createModalTagtoSelectUserProfilePhoto = () => {
    const base64EncodedFile = document.getElementById('photo-file').dataset.src || 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg';
    const fileName = document.getElementById('filename').textContent;
    const thumbnailFiles = document.getElementById('photo-file').files;
    // 모달창 백그라운드
    const modalBackGround = document.createElement('div');
    modalBackGround.classList.add('modal-background');

    // 모달창
    const modal = document.createElement('div');
    modal.classList.add('modal-add-mode');
    modal.innerHTML +=
        `<div id="create-channel-photo-box">
            <img src="${base64EncodedFile}">
        </div>
        <div class="create-channel-photo-input-box">
            <label for="filename">파일명</label>
            <label for="file">
                ${fileName}
                <input type="file" id="file" name="photo" multiple>
                <i class="fa-regular fa-image fa-lg"></i>
            </label>
        </div>
        <div class="box__button__submit">
            <button type="submit" id="complete">완료</button>
            <a id="modal-close">취소</a>
        </div>`;

    // document.getElementById('file').files = thumbnailFiles;
    modalBackGround.appendChild(modal);
    document.body.appendChild(modalBackGround);
    document.getElementById('modal-close').addEventListener('click', () => {
        document.body.removeChild(document.querySelector('.modal-background'));
    })
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
        document.querySelector('.create-channel-photo-input-box').querySelector('label[for="file"]').insertAdjacentText('afterbegin', document.getElementById('file').files[0].name);
    } catch (error) {
        alert(error)
        console.log(error)
    }
}

const onClickCloseBtn = className => {
    removeChildrenTag(className);
}

const onClickCompleteBtn = className => {
    const modal = document.querySelector('.modal-add-mode');
    const photo = modal.querySelector('label[for="file"]').querySelector('input[type="file"]').files;
    const base64EncodedFile = document.getElementById('create-channel-photo-box').querySelector('img').src;
    console.log(base64EncodedFile)
    document.getElementById('photo-file').textContent = photo.name;
    document.getElementById('photo-file').files = photo;
    document.getElementById('photo-file').setAttribute('data-src', base64EncodedFile);
    document.getElementById('filename').textContent = photo[0].name;
    document.getElementById('filename').style.color = '#1d1c1d';
    removeChildrenTag(className);
}

// 부모 태그에서 자식 태그 삭제 -> 모달창 제거
const removeChildrenTag = className => {
    const parentNode = document.querySelector(`.${className}`);
    document.body.removeChild(parentNode);
}

const insertVaildationErrorMsg = async errorObj => {
    try {
        const inputForm = document.querySelector('.signup-form__box');
        const inputFormChildren = inputForm.querySelectorAll('.input-box');

        if (document.getElementById('valid')) {
            document.getElementById('valid').parentNode.removeChild(document.getElementById('valid'));
            document.getElementById('valid-box').parentNode.removeChild(document.getElementById('valid-box'));
        }
        if (errorObj.path === 'gender') {
            document.getElementById('gender').insertAdjacentHTML('beforeend', `<div id="valid-box"><span class="valid" id="valid">*${errorObj.msg}</span></div>`);
            return;
        }
        for (const inputBox of inputFormChildren) {
            const matchedTag = inputBox.querySelector(`input[name="${errorObj.path}"]`);
 
            if (matchedTag) {
                inputBox.insertAdjacentHTML('beforeend', `<div id="valid-box"><span class="valid" id="valid">*${errorObj.msg || errorObj.message}</span></div>`);
                break;
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const postSignUp = async () => {
    const email = document.querySelector('.signup-form__box').querySelector('input[name="email"]');
    const password = document.querySelector('.signup-form__box').querySelector('input[name="password"]');
    const name = document.querySelector('.signup-form__box').querySelector('input[name="name"]');
    const photo = document.querySelector('.signup-form__box').querySelector('input[type="file"], input[name="photo"]');
    let gender = '';
    const openRadioTags = document.getElementById('gender').querySelectorAll('input[type="radio"], input[name="gender"]');
    for (const radio of openRadioTags) {
        if (radio.checked) {
            gender = radio.value;
        }
    }
    const phone = document.querySelector('.signup-form__box').querySelector('input[name="phone"]');
    const comment = document.querySelector('.signup-form__box').querySelector('textarea[name="comment"]');
    try {
        const formData = new FormData();
        formData.append('email', email.value);
        formData.append('emailFront', email.value.split('@')[0]);
        formData.append('password', password.value);
        formData.append('name', name.value);
        formData.append('gender', gender);
        formData.append('photo', photo.files[0]);
        formData.append('phone', phone.value);
        formData.append('comment', comment.value);
        const response = await fetch(`http://3.39.235.59:3000/signup`, {
            method: 'POST',
            body: formData
        })

        const data = await response.json();
        console.log(data);
        if (data.error) {
            insertVaildationErrorMsg(data.error);
            return;
        } else {
            return window.location.href = `/login`;
        }
    } catch (err) {
        console.log(err);
    }
}

document.querySelector('.open-sign-form').addEventListener('click', onClickOpenSignupForm);
document.getElementById('cancel').addEventListener('click', onClickOpenLoginForm);
document.querySelector('label[for="male"]').addEventListener('click', onClickOpenYNRadio);
document.querySelector('label[for="female"]').addEventListener('click', onClickOpenYNRadio);
document.querySelector('label[for="user-profile-photo"]').addEventListener('click', onClickPhotoModalBtn);
document.getElementById('submit').addEventListener('click', onClickSubmitBodyBtn);
// document.getElementById('user-profile-photo').addEventListener('click', onClickPhotoModalBtn);
// 구글 버튼
// const googleUser = {};
// const startApp = function () {
//     gapi.load('auth2', function () {
//         // Retrieve the singleton for the GoogleAuth library and set up the client.
//         auth2 = gapi.auth2.init({
//             client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
//             cookiepolicy: 'single_host_origin',
//             // Request scopes in addition to 'profile' and 'email'
//             //scope: 'additional_scope'
//         });
//         attachSignin(document.getElementById('google'));
//     });
// };

// function attachSignin(element) {
//     console.log(element.id);
//     auth2.attachClickHandler(element, {},
//         function (googleUser) {
//             document.getElementById('name').innerText = "Signed in: " +
//                 googleUser.getBasicProfile().getName();
//         }, function (error) {
//             alert(JSON.stringify(error, undefined, 2));
//         });
// }