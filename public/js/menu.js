const activeMenuBtnColor = () => {
    const url = window.location.href;
    const replaceUrl = url.replace('?', '/');
    const path = replaceUrl.split('/')[3];

    if (!path) {
        document.getElementById('/').style.background = 'rgb(219, 219, 232)';
    }

    console.log('replaceUrl: ', replaceUrl);
    document.getElementById(path).style.background = 'rgb(219, 219, 232)';
}

const toggleBtn = id => {
    const itemBoxStyle = document.getElementById(id).style;

    if (itemBoxStyle.display === 'none') {
        itemBoxStyle.display = 'block';
        itemBoxStyle.animation = '3s infinite alternate slidein';
    } else {
        itemBoxStyle.display = 'none';
    }
}

window.addEventListener('DOMContentLoaded', activeMenuBtnColor);
document.getElementById('chat').addEventListener('click', () => {
    toggleBtn('chat-list');
});
document.getElementById('workspace').addEventListener('click', () => {
    toggleBtn('workspace-list');
});