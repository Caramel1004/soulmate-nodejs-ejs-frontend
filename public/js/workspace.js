//백스페이스 키 8번 


document.getElementById('content').addEventListener('keydown',event => {
    const textarea =  document.getElementById('content');
    textarea.style.height = '2px';
    textarea.style.height = (12 + textarea.scrollHeight) + 'px';
    console.log(event.keyCode);
});