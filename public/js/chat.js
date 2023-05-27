const createUnitChat = async () => {
    try {
        const url = window.location.href;
        // const jsonWebToken = document.cookie;
        const channelId = url.split('/')[5];
        const chatRoomId = url.split('/')[6];
        const content = document.getElementById('content').value;
        console.log('channelId : ',channelId);
        console.log('chatRoomId : ',chatRoomId);
        console.log('content : ',content);

        const response = await fetch('http://localhost:3000/client/chat/' + channelId + '/' + chatRoomId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat: content
            })
        });

        // const data = await response.json();
        // console.log('data: ',data);
        // // 이미지 박스
        // const imgBox = document.createElement('div');
        // const img = document.createElement('img');
        // img.setAttribute('src', data.photo);
        // imgBox.classList.add('board-chat__unit-chat-img');
        // imgBox.appendChild(img);
        // console.log('imgBox: ', imgBox);
    
        // // 챗박스
        // const chatBox = document.createElement('div');
        // chatBox.classList.add('chat');
    
        // // 닉네임
        // const clientNameTag = document.createElement('div');
        // clientNameTag.classList.add('client-name');
        // clientNameTag.textContent = data.clientId;
        // chatBox.appendChild(clientNameTag);
        // console.log('clientNameTag: ', clientNameTag);
    
        // // 챗
        // const unitChat = document.createElement('div');
        // unitChat.classList.add('board-chat__unit-chat');
        // unitChat.textContent = document.getElementById('content').value;
        // chatBox.appendChild(unitChat);
        // console.log('unitChat: ', unitChat);
    
        // // 제일 큰 유닛 박스
        // const chatUnitBox = document.createElement('div');
        // chatUnitBox.classList.add('board-chat__unit-chat-box');
    
        // chatUnitBox.appendChild(imgBox);
        // chatUnitBox.appendChild(chatBox);
        // console.log('chatUnitBox: ', chatUnitBox);
    
    
        // const historyTag = document.querySelector('.board-chat__box-history');
        // historyTag.append(chatUnitBox);
    
        // document.getElementById('content').value = "";
    } catch (err) {
        
    }


}

// const createUnitChat = e => {
//     const chatUnitBox = document.createElement('div');
//     chatUnitBox.style.border = 
//     chatUnitBox.classList.add('board-chat__chat-unit-box');
//     chatUnitBox.textContent = document.getElementById('content').value;
//     const history = document.querySelector('.board-chat__box-history').appendChild(chatUnitBox);
//     document.querySelector('.board-chat').appendChild(history);
//     // box-shadow: 0 1px 4px rgba(0, 0, 0, 0.26);
//     /* padding-top: 1px; */
//     // padding: 5px;
//     // padding-left: 10px;
//     // max-width: 170px;
//     // display: block;
//     // text-align: left;
//     // font-size: 15px;
//     // background: #ffffff;
//     // /* border: groove black 0.5px; */
//     // border-radius: 0.5rem;
//     // box-sizing: border-box;
// }


document.getElementById('send').addEventListener('click', createUnitChat);
// document.getElementById('content').addEventListener('keyup', createUnitChatKeyUp(event));