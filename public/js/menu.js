const activeMenuBtnColor = () => {
    const url = window.location.href;
    const replaceUrl = url.replace('?', '/');
    const path = replaceUrl.split('/')[3];

    if (!path || path === 'open') {
        document.getElementById('/').style.background = 'rgba(219, 219, 232, 0.3)';
        // document.getElementById('/').querySelector('i').style.color = '#ffffff';
    }

    if(path === 'myprofile') {
        document.getElementById(path).style.background = 'rgba(219, 219, 232, 0.3)';
        document.getElementById(path).querySelector('i').className = 'fa-solid fa-user';
        // document.getElementById(path).querySelector('i').style.color = '';
        return;
    }

    if(path === 'mychannel') {
        const channelPath = replaceUrl.split('/')[4];
        document.getElementById(`${path}-${channelPath}`).style.background = 'rgba(219, 219, 232, 0.3)';
        return;
    }

    if(path === 'channel') {
        const channelPath =  replaceUrl.split('/')[5];
        if(!channelPath) {
            document.getElementById(path).style.background = 'rgba(219, 219, 232, 0.3)';
        }
        
        document.getElementById(`mychannel-${channelPath}`).style.background = 'rgba(219, 219, 232, 0.3)';
        return;
    }
    
    if(path === 'mychannels') {
        document.getElementById(path).style.background = 'rgba(219, 219, 232, 0.3)';
        return;
    }

    if(path === 'wishchannels'){
        document.getElementById(path).style.background = 'rgba(219, 219, 232, 0.3)';
        document.getElementById(path).querySelector('i').className = 'fa-solid fa-heart';
        document.getElementById(path).querySelector('i').style.color = 'red';
    }
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
// document.getElementById('chat').addEventListener('click', () => {
//     toggleBtn('chat-list');
// });
// document.getElementById('workspace').addEventListener('click', () => {
//     toggleBtn('workspace-list');
// });