/** ----------------- 이벤트 함수 ----------------- */
const onClickHeartToggleBtn = async channelId => {
    await postAddOpenChannelToWishChannel(channelId);
}

const onClickChannelBox = async channelId => {
    window.location.href = `http://localhost:3000/open/${channelId}`;
}

/** ----------------- 태그관련 함수 ----------------- */
const removeWishChannelTag = channelId => {
    const removeTag = document.querySelector('.contents__div-wrapper');
    const parentNode = document.querySelector('.channel-box-items');

    parentNode.removeChild(removeTag);

    if (parentNode.children.length <= 0) {
        parentNode.innerHTML = '<h4>관심 채널을 추가해보세요.</h4>';
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

        // 하트 아이콘 업데이트
        removeWishChannelTag(channelId);
    } catch (err) {
        console.log(err);
    }
}

/** ----------------- 이벤트 리스너 -----------------*/
document.getElementById('thumbnail').addEventListener('mouseover', () => {
    document.getElementById('thumbnail').style.cursor = 'pointer';
})