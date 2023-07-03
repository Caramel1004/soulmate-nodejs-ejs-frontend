const activeMenuBtnColor = () => {
    const url = window.location.href;
    const replaceUrl = url.replace('?','/');
    const path = replaceUrl.split('/')[3];

    if(!path) {
        document.getElementById('/').style.background = 'rgb(219, 219, 232)';
    }

    console.log('replaceUrl: ', replaceUrl);
    document.getElementById(path).style.background = 'rgb(219, 219, 232)';
}

window.addEventListener('DOMContentLoaded', activeMenuBtnColor);