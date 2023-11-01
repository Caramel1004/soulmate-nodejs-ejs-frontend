const activeSearchTypeBtnColor = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchType = urlParams.get('searchType');
    
    console.log('searchType: ', searchType);
    document.getElementById(searchType).querySelector('i').style.color = '#ffffff'
    document.getElementById(searchType).style.color = '#ffffff';
    document.getElementById(searchType).style.background = 'black';
}

window.addEventListener('DOMContentLoaded', activeSearchTypeBtnColor);