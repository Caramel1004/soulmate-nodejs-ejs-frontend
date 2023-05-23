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


document.querySelector('.open-sign-form').addEventListener('click',onClickOpenSignupForm);
document.querySelector('.open-login-form').addEventListener('click',onClickOpenLoginForm);

