const sendMessage = btn => {
    const message = btn.parentNode.querySelector('[name = content]').value;
    console.log(message);

    const box = btn.parentNode.closest('.board');
    console.log(box);
    // const history = box.closest('.board-chat__history');
    // console.log(history);

    // document.body.appendChild(document.createElement('p'));

}