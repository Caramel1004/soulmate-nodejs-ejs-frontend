
document.getElementById('content').addEventListener('keypress',() => {
    const textarea =  document.getElementById('content');
    textarea.style.height = '2px';
    textarea.style.height = (12 + textarea.scrollHeight) + 'px';
});