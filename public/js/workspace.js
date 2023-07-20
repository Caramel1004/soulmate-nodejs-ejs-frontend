window.onload = init();

function init() {
    const historyTag = document.querySelector('.box-post-history');

    //채팅박스 스크롤 맨 아래로 위치
    historyTag.scrollTop = historyTag.scrollHeight;
}

// 채팅 내용 post요청
const postCreatePostToWorkSpace = async () => {
    if(!confirm('게시물을 업로드 하시겠습니까?')) {
        return;
    }
    try {
        const content = document.getElementById('content').value;
        if(content == ""){
            return;
        }

        const url = window.location.href;

        const channelId = url.split('/')[5];
        const workSpaceId = url.split('/')[6];
        const replaceContent = content.replace('\r\n', '<br>');
        console.log('channelId : ', channelId);
        console.log('workSpaceId : ', workSpaceId);
        console.log('replaceContent : ', replaceContent);

        const formData = new FormData();
        formData.append('content', replaceContent);

        await fetch(`http://localhost:3000/client/workspace/create-post/${channelId}/${workSpaceId}`, {
            method: 'POST',
            body: formData
        });
        console.log('게시물 처리 완료!!!');
    } catch (err) {
        console.log(err);
    }
}

const replaceText = text => {
    let replacedText = text;
    replacedText = text.replace(/\s| /gi, '');
    // replacedText = text.replace(/\r\n| /gi, '<br>');

    return replacedText;
}

// 채팅 박스에 textarea 키보드 엔터 시 이벤트
// 이슈: 한글입력 후 엔터시 중복 입력되는 현상 발생. -> 이벤트가 두번 발생함
// keyup 일때 영문입력시 event.isComposing이 false 즉, 문자 조합을 하지 않는다는 소리이다.
// 근데 영어와 다르게 한글입력시 문자를 조합하기 때문에 event.isComposing가 true이다.
// 그래서 한글 입력 후 엔터를 누르게 되면 아직 조합중인 상태이기 때문에 한글: keyup + 엔터 keydown -> keypress -> keyup 두번 발생
// keypress는 한글 인식을 하지 않기 떄문에 단순히 enter처리만 할거면 keypress로 하자.
// 만약 줄 바꿈 키를 만들고 싶다면....
const onKeyDownCreateUnitPost = async event => {
    console.log(event.keyCode);
    console.log(event.isComposing);

    const content = document.getElementById('content').value;
    const replacedContent = replaceText(content);

    if (event.keyCode === 13 && replacedContent === "") {
        return document.getElementById('content').value.replace('\r\n', '');
    }

    if (event.keyCode === 13 && !event.shiftKey && replacedContent !== "") {
        try {
            console.log('엔터키 누름!!');
            await onKeyPressEnter(event);
        } catch (err) {
            console.log(err);
        }
    }

    const textarea =  document.getElementById('content');
    textarea.style.height = '2px';
    textarea.style.height = (12 + textarea.scrollHeight) + 'px';

    console.log('replacedContent: ', replacedContent);
    console.log('엔터키 안누름!!');
}

const onKeyPressEnter = async event => {
    try {
        console.log('엔터키 누름!!');
        await postCreatePostToWorkSpace();
    } catch (err) {
        console.log(err);
    }
}

document.getElementById('send').addEventListener('click', postCreatePostToWorkSpace);
document.getElementById('content').addEventListener('keydown', onKeyDownCreateUnitPost);
// document.getElementById('file').addEventListener('change', onChangeSelectFile);


document.getElementById('content').addEventListener('keydown', event => {
    //백스페이스 키 8번 
    const textarea =  document.getElementById('content');
    textarea.style.height = '2px';
    textarea.style.height = (12 + textarea.scrollHeight) + 'px';
    console.log(event.keyCode);
});