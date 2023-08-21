// const show = () => {
//     const wrapper = document.querySelector('.contents__div-wrapper');

//     wrapper.style.background = '#ffffff';
//     wrapper.style.opacity = 0.3;
//     wrapper.style.border = '1px groove black';

//     const div = document.createElement('div');
//     div.id = 'fadeIn'
//     div.style.position = 'fixed';
//     div.style.display = 'flex';
//     div.style.justifyContent = 'center';
//     div.style.alignItems = 'center';
//     div.style.zIndex = '99';
//     div.style.top = '0';
//     div.style.left = '0';
//     div.style.width = '100%';
//     div.style.height = '100%';

//     const btn = document.createElement('button');
//     btn.textContent = '삭제';
//     btn.id = 'removeBtn';
//     btn.style.cursor = 'pointer';
//     btn.style.zIndex = '100';
//     div.appendChild(btn);

//     wrapper.appendChild(div);
// }

// const hide = () => {
//     const wrapper = document.querySelector('.contents__div-wrapper');
//     const fadeIn = document.getElementById('fadeIn');

//     wrapper.removeChild(fadeIn);

//     wrapper.style.background = '#ffffff';
//     wrapper.style.opacity = 1;
//     wrapper.style.border = '1px groove rgba(0, 0, 0, 0.26)';

    
// }

// document.querySelector('.contents__div-wrapper').addEventListener('mouseover', show);
// document.querySelector('.contents__div-wrapper').addEventListener('mouseout', hide);