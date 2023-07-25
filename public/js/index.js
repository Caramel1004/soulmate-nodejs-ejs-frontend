const onClickHeart = async channelId => {
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

        document.getElementById(channelId).firstChild.class = 'fa-solid fa-heart fa-2xl';
    } catch (err) {
        console.log(err);
    }
}