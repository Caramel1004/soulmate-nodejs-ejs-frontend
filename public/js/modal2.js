document.getElementById('invite').addEventListener('click', () => {
    console.log('모달창 오픈!!!');
    document.getElementById('container').classList.remove('hidden');
    document.getElementById('modal').classList.remove('hidden');
});

document.getElementById('cancel').addEventListener('click', () => {
    console.log('모달창 클로즈!!!');

    document.getElementById('clientId').value = "";
    document.getElementById('container').classList.add('hidden');
    document.getElementById('modal').classList.add('hidden');
})

document.getElementById('cancelInvite').addEventListener('click', () => {
    console.log('초대 유저 프로필 모달창 클로즈!!!');
    document.getElementById('clientId').value = "";

    const name = document.getElementById('matchedClientId').firstChild;
    const photo = document.getElementById('photo').firstChild;

    document.getElementById('matchedClientId').removeChild(name);
    document.getElementById('photo').removeChild(photo);
    document.getElementById('msg').textContent = "";
    document.getElementById('searchBox').classList.add('hidden');
    document.getElementById('resultModal').classList.add('hidden');
});