const onLoadLoadingPage = () => {
    setTimeout(() => {
        const removeTag = document.getElementById('load');
        const parent = removeTag.parentElement;//body 태그
        parent.removeChild(removeTag);
    }, 500);
}

window.addEventListener('DOMContentLoaded', onLoadLoadingPage);