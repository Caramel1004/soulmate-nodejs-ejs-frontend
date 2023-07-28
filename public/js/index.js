const onClickHeart = async channelId => {
    try {
        //firstChild는 텍스트 까지 취급
        // childNodes는 태그 아래에있는 텍스트 자식태그 등등 다가져옴
        // children은 자직 태그만 취급
        const heartIcon = document.getElementById(channelId).children[0];
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

        // 추가: 테두리만 색이 있는 하트, 삭제: red로 채워진 하트
        if(data.action === 'add') {
            heartIcon.className = 'fa-solid fa-heart fa-2xl';
        }else if(data.action === 'remove') {
            heartIcon.className = 'fa-regular fa-heart fa-2xl';
        }
        return;
    } catch (err) {
        console.log(err);
    }
}