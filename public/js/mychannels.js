const onKeyDownSearchBox = async e => {
    if (e.keyCode === 13 && e.target.value !== '') {
        try {
            console.log('엔터키 누름!!');
            await getSearchUserOfChannelsByKeyWord(e);
        } catch (err) {
            console.log(err);
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

const getSearchUserOfChannelsByKeyWord = async e => {
    const categoryTag = document.getElementById('box-search').querySelector('select[name="category"], select[id="category"]');
    let category = categoryTag.options[categoryTag.selectedIndex].value;
    const searchWord = e.target.value;
    const urlParams = new URLSearchParams(window.location.search);
    const searchType = urlParams.get('searchType');

    if(category == '전체') {
        category = '';
    }

    if(searchWord == undefined) {
        searchWord = '';
    }
    let URL;
    if (searchWord !== '' && category !== '') {
        URL = `http://localhost:3000/mychannels?searchType=${searchType}&category=${category}&searchWord=${searchWord}`;
    } else if(category == '' && searchWord == ''){
        URL = `http://localhost:3000/mychannels?searchType=${searchType}`;
    }else if(category == '' && searchWord !== '') {
        URL = `http://localhost:3000/mychannels?searchType=${searchType}&searchWord=${searchWord}`;
    }
    try {
        window.location.href = URL;
    } catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', setSearchWordInSearchBoxAndCategoryInSelectBox);
document.getElementById('search').addEventListener('keydown', e => {
    onKeyDownSearchBox(e);
})