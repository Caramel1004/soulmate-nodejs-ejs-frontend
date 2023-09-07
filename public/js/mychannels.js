const activeSearchTypeBtnColor = () => {
    const url = window.location.href;
    const searchType = url.split('=')[1];
    
    console.log('searchType: ', searchType);
    document.getElementById(searchType).querySelector('i').style.color = '#ffffff'
    document.getElementById(searchType).style.color = '#ffffff';
    document.getElementById(searchType).style.background = 'black';
}

window.addEventListener('DOMContentLoaded', activeSearchTypeBtnColor);