document.getElementById('invite').addEventListener('click', () => {
    console.log('모달창 오픈!!!');
    document.getElementById('container').classList.remove('hidden');
    document.getElementById('modal').classList.remove('hidden');
});

document.getElementById('cancel').addEventListener('click', () => {
    console.log('모달창 클로즈!!!');

    document.getElementById('clientName').value = "";
    document.getElementById('error').textContent = "";
    document.getElementById('container').classList.add('hidden');
    document.getElementById('modal').classList.add('hidden');
})

document.getElementById('cancelInvite').addEventListener('click', () => {
    console.log('초대 유저 프로필 모달창 클로즈!!!');
    document.getElementById('clientName').value = "";

    const nameTag = document.getElementById('matchedClientName');
    const photoTag = document.getElementById('photo');

    console.log(nameTag);
    console.log(photoTag);
    // nameTag.removeChild(nameTag.firstChild);
    // photoTag.removeChild(photoTag.firstChild);
    document.getElementById('msg').textContent = "";
    document.getElementById('error').textContent = "";
    document.getElementById('searchBox').classList.add('hidden');
    document.getElementById('resultModal').classList.add('hidden');
});