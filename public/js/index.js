/** ----------------- 이벤트 함수 ----------------- */
const onClickHeartToggleBtn = async channelId => {
    await postAddOpenChannelToWishChannel(channelId);
}

const onClickChannelBox = async channelId => {
    window.location.href = `http://3.39.235.59:3000/open/${channelId}`;
}

const onKeyDownSearchBox = async e => {
    if (e.keyCode === 13 && e.target.value !== '') {
        try {
            console.log('엔터키 누름!!');
            await getSearchOpenChannelsByKeyWord(e);
        } catch (err) {
            console.log(err);
        }
    }
}

/** ----------------- 태그관련 함수 ----------------- */
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

const setSearchWordInSearchBoxAndCategoryInSelectBox = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchWord = urlParams.get('searchWord');
    const category = urlParams.get('category');
    
    // 검색 키워드
    document.getElementById('search').value = searchWord;
    
    //카테고리 체크 => select 박스는 프로퍼티 selected
    const categoryTagOptions = document.querySelector('select[name="category"], select[id="category"]').options;
    const categoryTag = Array.prototype.slice.call(categoryTagOptions).find(target => target.value == category);
    categoryTag.selected = true
    categoryTag.options[categoryTag.selectedIndex].value = category;
}

const updateHeartStatusIcon = (data, channelId) => {
    // firstChild는 텍스트 까지 취급
    // childNodes는 태그 아래에있는 텍스트 자식태그 등등 다가져옴
    // children은 자식 태그만 취급
    const heartIcon = document.getElementById(channelId);
    // 추가: 테두리만 색이 있는 하트, 삭제: red로 채워진 하트
    if (data.action === 'add') {
        heartIcon.className = 'fa-solid fa-heart fa-xl';
    } else if (data.action === 'remove') {
        heartIcon.className = 'fa-regular fa-heart fa-xl';
    }
}

/** ----------------- API 요청 함수 -----------------*/
const postAddOpenChannelToWishChannel = async channelId => {
    try {
        const response = await fetch('http://3.39.235.59:3000/client/add-or-remove-wishchannel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channelId: channelId
            })
        });
        const data = await response.json();

        // 하트 아이콘 업데이트
        updateHeartStatusIcon(data, channelId);
    } catch (err) {
        console.log(err);
    }
}

const getSearchOpenChannelsByKeyWord = async e => {
    const categoryTag = document.getElementById('box-search').querySelector('select[name="category"], select[id="category"]');
    let category = categoryTag.options[categoryTag.selectedIndex].value;
    const searchWord = e.target.value;

    if(category == '전체') {
        category = ''
    }
    let URL;
    if (searchWord !== '' && category !== '') {
        URL = `http://3.39.235.59:3000?category=${category}&searchWord=${searchWord}`;
    } else if(category == '' && searchWord == ''){
        URL = `http://3.39.235.59:3000`;
    }else if(category == '' && searchWord !== '') {
        URL = `http://3.39.235.59:3000?searchWord=${searchWord}`;
    }
    try {
        window.location.href = URL;
    } catch (err) {
        console.log(err);
    }
}

/** ----------------- 이벤트리스너 ----------------- */
window.addEventListener('DOMContentLoaded', activeSearchTypeBtnColor);
window.addEventListener('DOMContentLoaded', setSearchWordInSearchBoxAndCategoryInSelectBox);
document.getElementById('search').addEventListener('keydown', e => {
    onKeyDownSearchBox(e);
})