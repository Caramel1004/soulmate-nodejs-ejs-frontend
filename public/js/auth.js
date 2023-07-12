const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');

// window.onload = startApp();

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

console.log('로그인 페이지!!!!')
document.querySelector('.open-sign-form').addEventListener('click', onClickOpenSignupForm);
document.querySelector('.open-login-form').addEventListener('click', onClickOpenLoginForm);

// 구글 버튼
const googleUser = {};
const startApp = function () {
    gapi.load('auth2', function () {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        });
        attachSignin(document.getElementById('google'));
    });
};

function attachSignin(element) {
    console.log(element.id);
    auth2.attachClickHandler(element, {},
        function (googleUser) {
            document.getElementById('name').innerText = "Signed in: " +
                googleUser.getBasicProfile().getName();
        }, function (error) {
            alert(JSON.stringify(error, undefined, 2));
        });
}