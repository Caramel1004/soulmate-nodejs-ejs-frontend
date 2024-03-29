/** ----------------- 이벤트 함수 ----------------- */
const onClickRemoveWishChannelBtn = async e => {
    await postRemoveOpenChannelToWishChannel(e);
}

const onClickChannelBox = async e => {
    const channelId = e.target.parentNode.dataset.channelid;
    window.location.href = `/open/${channelId}`;
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
const removeWishChannelTag = e => {
    const removeTag = e.target.parentNode.parentNode;
    const parentNode = removeTag.parentNode;

    parentNode.removeChild(removeTag);

    if (parentNode.children.length <= 0) {
        const topParentNode = parentNode.parentNode;
        console.log(parentNode.parentNode);
        topParentNode.removeChild(parentNode);
        topParentNode.innerHTML += `
        <div class="no-data-comment-container">
            <div class="no-data-comment-box">
                <img src="/images/channel-plus.png">
                <p id="no-data-comment">관심 채널을 추가해보세요.</p>
            </div>
        </div>`;
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
const postRemoveOpenChannelToWishChannel = async e => {
    const channelId = e.target.parentNode.parentNode.dataset.channelid;
    try {
        const response = await fetch('/client/add-or-remove-wishchannel', {
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
        removeWishChannelTag(e);
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
        URL = `/wishchannels?category=${category}&searchWord=${searchWord}`;
    } else {
        URL = ``;
    }
    try {
        window.location.href = URL;
    } catch (err) {
        console.log(err);
    }
}

/** ----------------- 이벤트 리스너 -----------------*/
window.addEventListener('DOMContentLoaded', activeSearchTypeBtnColor);
if(document.getElementById('thumbnail')) {
    document.getElementById('thumbnail').addEventListener('mouseover', () => {
        document.getElementById('thumbnail').style.cursor = 'pointer';
    })
}
document.getElementById('search').addEventListener('keydown', e => {
    onKeyDownSearchBox(e);
})

/** 관심채널 카드 태그 삭제 버튼 이벤트 */
/** 관심채널 이미지 클릭 이벤트 */
document.querySelectorAll('.contents__div-wrapper').forEach(target => {
    target.querySelector('button').addEventListener('click', onClickRemoveWishChannelBtn);
    target.querySelector('img').addEventListener('click', onClickChannelBox);
});