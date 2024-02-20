let score = 0;
let userName = '';
let gameRecords = [];
if (localStorage.getItem('gameRecords')) gameRecords = JSON.parse(localStorage.getItem('gameRecords'))

const start = () => {
    document.addEventListener('DOMContentLoaded', () => {
        
    })

    let canvas = document.querySelector('#canvas');
    const backgroundCanvas = document.createElement('div');
    backgroundCanvas.id = 'background-canvas';
    canvas.append(backgroundCanvas);

    const finalTimerCanvas = document.createElement('div');
    finalTimerCanvas.id = 'final-timer-canvas';
    const finalTimerCanvasP = document.createElement('p');
    finalTimerCanvasP.id = 'final-timer-text';
    finalTimerCanvasP.style.cssText = 'position: absolute; font-family: "Bungee Spice", cursive; font-size: 100pt; text-align: center; width: 100%; color: #ff7e0c';
    finalTimerCanvas.append(finalTimerCanvasP);
    canvas.append(finalTimerCanvas);

    const restartBtn = document.createElement('img');
    restartBtn.id = 'restartBtn';
    restartBtn.src = './assets/Param buttons/refresh.png';
    restartBtn.style.cssText = 'width: 40px; height: 40px; position: absolute; top: 20px; right: 80px;';
    canvas.append(restartBtn);

    const fsBtn = document.createElement('img');
    fsBtn.id = 'fsBtn';
    fsBtn.src = './assets/Param buttons/refresh.png';
    fsBtn.style.cssText = 'width: 40px; height: 40px; position: absolute; top: 20px; right: 20px;';
    canvas.append(fsBtn);

    const timeInfo = document.createElement('span');
    timeInfo.id = 'timeInfo';
    timeInfo.style.cssText = `font-size: 24px; position: absolute; left: 32px; bottom: ${((window.screen.availHeight / 32) - 3) * 32}px; font-family: 'Roboto Slab', sans-serif; text-shadow: 2px 2px 1px #000; color: #ff9a23;`;
    timeInfo.textContent = 'Время: 0';
    canvas.append(timeInfo);

    const scoreInfo = document.createElement('span');
    scoreInfo.id = 'scoreInfo';
    scoreInfo.style.cssText = `font-size: 24px; position: absolute; left: 32px; bottom: ${((window.screen.availHeight / 32) - 4) * 32}px; font-family: 'Roboto Slab', sans-serif; text-shadow: 2px 2px 1px #000; color: #ff9a23;`;
    scoreInfo.textContent = `Очки: ${Math.floor(score)}`;
    canvas.append(scoreInfo);

    const userInfo = document.createElement('span');
    userInfo.id = 'userInfo';
    userInfo.style.cssText = `font-size: 24px; position: absolute; right: 32px; bottom: ${((window.screen.availHeight / 32) - 3) * 32}px; font-family: 'Roboto Slab', sans-serif; text-shadow: 2px 2px 1px #000; color: #ff9a23;`;
    userInfo.textContent = `Игрок: ${userName}`;
    canvas.append(userInfo);

    const imgBlock = document.createElement('div');
    imgBlock.id = 'img-block';
    imgBlock.style.cssText = 'width: 96px; height: 96px; overflow: hidden; position: absolute; left: 0px; bottom: 64px;';
    const imgBlockImg = document.createElement('img');
    imgBlockImg.id = 'hero-img';
    imgBlockImg.src = './assets/hero-sprite.png';
    imgBlockImg.style.cssText = 'width: 576px; height: 384px; position: relative; top: 0px; left: -96px; transform: scale(-1,1);';
    imgBlock.append(imgBlockImg);
    canvas.append(imgBlock);

    const jumpBlock = document.createElement('div');
    jumpBlock.id = 'jump-block';
    jumpBlock.style.cssText = 'position: absolute; top: 0; left: 0; width: 144px; height: 144px; overflow: hidden; opacity: 0.5;';
    const jumpBlockImg = document.createElement('img');
    jumpBlockImg.src = './assets/hero-sprite.png';
    jumpBlockImg.style.cssText = 'position: absolute; top: -144px; left: -144px; width: 864px; height: 576px; transform: scale(-1,1);';
    const jumpBlockDiv = document.createElement('div');
    jumpBlockDiv.style.cssText = 'position: absolute; top: 0; left: 0; width: 140px; height: 140px; border: 2px solid rgb(0, 119, 255); border-radius: 50%;';
    jumpBlock.append(jumpBlockImg);
    jumpBlock.append(jumpBlockDiv);
    canvas.append(jumpBlock);

    const hitBlock = document.createElement('div');
    hitBlock.id = 'hit-block';
    hitBlock.style.cssText = 'position: absolute; top: 0; right: 0; width: 144px; height: 144px; overflow: hidden; opacity: 0.5;';
    const hitBlockImg = document.createElement('img');
    hitBlockImg.src = './assets/hero-sprite.png';
    hitBlockImg.style.cssText = 'position: absolute; top: -452px; left: -442px; width: 864px; height: 576px; transform: scale(-1,1);';
    const hitBlockDiv = document.createElement('div');
    hitBlockDiv.style.cssText = 'position: absolute; top: 0; right: 0; width: 140px; height: 140px; border: 2px solid rgb(0, 119, 255); border-radius: 50%;';
    hitBlock.append(hitBlockImg);
    hitBlock.append(hitBlockDiv);
    canvas.append(hitBlock);

    const info = document.createElement('p');
    info.id = 'info';
    info.style.cssText = 'display: none; position: absolute; left: 64px; top: 96px; background-color: black; color: white; font-size: 20pt; padding: 20px;';
    canvas.append(info);

    const setUserName = () => {
        const [startMenu] = document.getElementsByClassName('start-menu');
        const modal = document.createElement('div');
        modal.className = 'modal-window';
        const modalText = document.createElement('div');
        modalText.textContent = 'Имя игрока';

        const modalInput = document.createElement('input');
        modalInput.className = 'modal-window-input';
        modalInput.setAttribute('spellcheck', 'false');
        modalInput.setAttribute('placeholder', 'Введите своё имя');

        const modalBtn = document.createElement('input');
        modalBtn.setAttribute('type', 'button');
        modalBtn.setAttribute('value', 'Начать');
        modalBtn.className = 'modal-window-btn';
        modalBtn.addEventListener('click', () => {
            userName = modalInput.value;
            modal.style.display = 'none';
            userInfo.textContent = `Игрок: ${userName}`;
        });

        const recordsBtn = document.createElement('span');
        recordsBtn.className = 'modal-window-links';
        recordsBtn.textContent = 'Мои рекорды';
        recordsBtn.addEventListener('click', () => {
            const modalResult = document.createElement('div');
            modalResult.className = 'modal-window modal-window-result';
            startMenu.append(modalResult);
            
            gameRecords.sort((a, b) => a.score < b.score ? 1 : -1);
            let gameRecordsText = 'Мои рекорды: \n';
            for (let i = 0; i < gameRecords.length && i < 5; i++) {
                gameRecordsText += `${gameRecords[i].name} - ${gameRecords[i].score} \n`;
            }
            modalResult.innerText = gameRecordsText;

            const historyCleanBtn = document.createElement('span');
            historyCleanBtn.className = 'modal-window-links';
            historyCleanBtn.textContent = 'Очистить историю рекордов';
            historyCleanBtn.addEventListener('click', () => {
                localStorage.clear();
                location.reload();
            });
            modalResult.append(historyCleanBtn);

            const modalCloseTrigger = document.createElement('div');
            modalCloseTrigger.innerHTML = '&#215;'
            modalCloseTrigger.className = 'modal-close-trigger';
            modalResult.append(modalCloseTrigger);
            modalCloseTrigger.addEventListener('click', () => {
                modalResult.remove();
            });
        });

        modal.append(modalText);
        modal.append(modalInput);
        modal.append(modalBtn);
        modal.append(recordsBtn);
        startMenu.append(modal);
    }
    setUserName();
}
start();