const activeSearchTypeBtnColor = () => {
    const url = window.location.href;
    const searchType = url.split('=')[1];
    
    console.log('searchType: ', searchType);
    document.getElementById(searchType).style.color = '#ffffff';
    document.getElementById(searchType).style.background = 'black';
    document.getElementById(searchType).classList.add('active');
}

window.addEventListener('DOMContentLoaded', activeSearchTypeBtnColor);