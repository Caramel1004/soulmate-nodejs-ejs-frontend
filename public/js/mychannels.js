const activeSearchWordBtnColor = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchWord = urlParams.get('searchWord');
    
    console.log('searchWord: ', searchWord);
    document.getElementById(searchWord).style.color = '#ffffff';
    document.getElementById(searchWord).style.background = 'black';
}

const activeSearchTypeBtnColor = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchType = urlParams.get('searchType');
    
    console.log('searchType: ', searchType);
    document.getElementById(searchType).style.color = '#ffffff';
    document.getElementById(searchType).style.background = 'black';
    document.getElementById(searchType).querySelector('i').style.color = '#ffffff';
}

window.addEventListener('DOMContentLoaded', activeSearchWordBtnColor);
window.addEventListener('DOMContentLoaded', activeSearchTypeBtnColor);