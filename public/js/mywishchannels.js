/** ----------------- 이벤트 함수 ----------------- */
const onClickHeartToggleBtn = async channelId => {
    await postAddOpenChannelToWishChannel(channelId);
}

const onClickChannelBox = async channelId => {
    window.location.href = `http://localhost:3000/open/${channelId}`;
}

const onKeyDownSearchBox = async e => {
    if (e.keyCode === 13 && e.target.value !== '') {
        try {
            console.log('엔터키 누름!!');
            await getSearchWishChannelsByKeyWord(e);
        } catch (err) {
            console.log(err);
        }
    }
}

/** ----------------- 태그관련 함수 ----------------- */
const removeWishChannelTag = channelId => {
    const removeTag = document.getElementById(channelId).parentNode.parentNode;
    const parentNode = document.querySelector('.channel-box-items');

    parentNode.removeChild(removeTag);

    if (parentNode.children.length <= 0) {
        parentNode.innerHTML = '<h4>관심 채널을 추가해보세요.</h4>';
    }
}

const activeSearchTypeBtnColor = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    console.log(category);
    const tabBox = document.getElementById('tab-box');
    const tabBtns = tabBox.querySelectorAll('a');

    for(const btn of tabBtns) {
        const href = new URL(btn.href);
        const query = href.searchParams.get('category');
        if(query === category) {
            btn.style.color = '#ffffff';
            btn.style.background = '#000000';
            break;
        }
    }
}

/** ----------------- API 요청 함수 -----------------*/
const postAddOpenChannelToWishChannel = async channelId => {
    try {
        const response = await fetch('http://localhost:3000/client/add-or-remove-wishchannel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channelId: channelId
            })
        });
        const data = await response.json();
        
        // 해당 태그 삭제
        removeWishChannelTag(channelId);
    } catch (err) {
        console.log(err);
    }
}

const getSearchWishChannelsByKeyWord = async e => {
    const categoryTag = document.getElementById('box-search').querySelector('select[name="category"], select[id="category"]');
    const category = categoryTag.options[categoryTag.selectedIndex].value;
    const searchWord = e.target.value;
    console.log(category)
    console.log(searchWord);
    let URL;
    if (searchWord !== '') {
        URL = `http://localhost:3000/wishchannels?category=${category}&searchWord=${searchWord}`;
    } else {
        URL = `http://localhost:3000`;
    }
    try {
        window.location.href = URL;
    } catch (err) {
        console.log(err);
    }
}

/** ----------------- 이벤트 리스너 -----------------*/
window.addEventListener('DOMContentLoaded', activeSearchTypeBtnColor);
document.getElementById('thumbnail').addEventListener('mouseover', () => {
    document.getElementById('thumbnail').style.cursor = 'pointer';
})
document.getElementById('search').addEventListener('keydown', e => {
    onKeyDownSearchBox(e);
})