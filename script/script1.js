const level1 = () => {

    //ПЕРЕМЕННЫЕ 
    
    let rightPosition = 0;
    let imgBlockPosition = 0;
    let direction = 'right';
    let hit = false;
    let jump = false;
    let fall = false;
    let areYouWin = false;
    let timer = null;
    let x = 0;
    let halfWidth = window.screen.availWidth / 2;
    let tileArray = [];
    let objectsArray = [];
    let enemiesArray = [];
    let maxLives = 8;
    let lives = 8;
    let heartsArray = [];
    let isRightSideBlocked = false;
    let isLeftSideBlocked = false;
    let wasHeroHit = false;
    let f1WallArray = [[-10, 0]];
    let f2WallArray = [[54, 63]];
    let isWallRight = false;
    let isWallLeft = false;
    let heroStep = 3;
    let gameTime = 0;
    let gameTimeInterval;
    let fountainImg;
    
    let jumpBlock = document.querySelector('#jump-block');
    let hitBlock = document.querySelector('#hit-block');
    let heroImg = document.querySelector('#hero-img');
    let imgBlock = document.querySelector('#img-block');
    let canvas = document.querySelector('#canvas');
    let fsBtn = document.querySelector('#fsBtn');
    let info = document.querySelector('#info');
    let backgroundCanvas = document.querySelector('#background-canvas');
    let finalTimerText = document.querySelector('#final-timer-text');
    let restartBtn = document.querySelector('#restartBtn');
    
    let heroX = Math.floor((Number.parseInt(imgBlock.style.left)+32)/32);
    let heroY = Math.floor(Number.parseInt(imgBlock.style.bottom)/32);
    
    const startTimer = setTimeout(() => {
        fountainImg = objectsArray.filter(elem => elem.outerHTML.split('"')[1] === 'assets/3 Objects/Fountain/2.png')[0];
    }, 3000);

    jumpBlock.style.top = `${window.screen.availHeight/2 - 144/2}px`;
    hitBlock.style.top = `${window.screen.availHeight/2 - 144/2}px`;
    
    heroImg.onclick = (event) => {
        event.preventDefault();
    }
    fsBtn.onclick = () => {
        if(document.webkitFullscreenElement){
            fsBtn.src = './assets/Param buttons/fullscreen.png';
            document.exitFullscreen();
        }else{
            fsBtn.src = './assets/Param buttons/cancel.png';
            canvas.requestFullscreen();
        }
    }
    restartBtn.addEventListener('click', ()=>{
        document.location.reload();
    });
    
    jumpBlock.onclick = () => {jump = true};
    hitBlock.onclick = () => {hit = true};
    
    //ФУНКЦИИ
    
    const moveWorldLeft = () => {
        objectsArray.map((elem, index)=>{
            elem.style.left = `${Number.parseInt(elem.style.left) - 32}px`;
        });
        tileArray.map(elem => {
            elem[0] = elem[0] - 1;
        });
        enemiesArray.map(elem => elem.moveLeft());
        f1WallArray.map(elem => {
            elem[0] -= 1;
            elem[1] -= 1;
        });
        f2WallArray.map(elem => {
            elem[0] -= 1;
            elem[1] -= 1;
        });		
    }
    const moveWorldRight = () => {
        objectsArray.map((elem, index)=>{
            elem.style.left = `${Number.parseInt(elem.style.left) + 32}px`;
        });
        tileArray.map(elem => {
            elem[0] = elem[0] + 1;
        });
        enemiesArray.map(elem => elem.moveRight());
        f1WallArray.map(elem => {
            elem[0] += 1;
            elem[1] += 1;
        });
        f2WallArray.map(elem => {
            elem[0] += 1;
            elem[1] += 1;
        });
    }
    const updateHeroXY = () => {
        heroX = Math.ceil((Number.parseInt(imgBlock.style.left)+32)/32);
        heroY = Math.ceil(Number.parseInt(imgBlock.style.bottom)/32);
        if (heroX === Number.parseInt(+objectsArray.filter(elem => elem.outerHTML.split('"')[1] === 'assets/3 Objects/Fountain/2.png')[0].style.left.slice(0, -2))/32 && !areYouWin) {
            areYouWin = true;
            finalTimerText.innerText = 'You win!';

            scoreInfo.textContent = `Очки: ${score}`;
            setTimeout(() => {
                let showFinalScore = new Cutscene(`Игрок: ${userName} \n Время - ${gameTime} секунд \n Бонусные очки за время: ${Math.floor(50 / gameTime)} \n Очки - ${score += Math.floor(50 / gameTime)}`);
            }, 2000);
            clearInterval(gameTimeInterval);

            const nextLevelTimer = setTimeout(() => {
                canvas.innerHTML = '';
                start();
                level2();
                clearInterval(nextLevelTimer)
            }, 8000)
        }
    }
    const checkFalling = () => {
        updateHeroXY();
        let isFalling = true;
        for(let i = 0; i < tileArray.length; i++){
            if ((tileArray[i][0] === heroX) && ((tileArray[i][1]+1) === heroY )) {
                isFalling = false;
            }
        }
    
        if(isFalling) {
            info.innerText = info.innerText + ', Falling';
            fall = true;
        } else {
            info.innerText = info.innerText + ', Not falling';
            fall = false;
        }
    }
    const fallHandler = () => {
        heroImg.style.top = '-96px';
        imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)-32}px`;
        checkFalling();
    }
    const checkRightWallCollide = () => {
        isWallLeft = false;
        isWallRight = false;
        if(heroY === 1){
            f1WallArray.map(elem => {
                if(heroX === elem[0] - 2){
                    isWallRight = true;
                }
            })
        }else if(heroY === 5){
            f2WallArray.map(elem => {
                if(heroX === elem[0] - 2){
                    isWallRight = true;
                }
            })
        }
    }
    const checkLeftWallCollide = () => {
        isWallLeft = false;
        isWallRight = false;
        if(heroY === 1){
            f1WallArray.map(elem => {
                if(heroX === elem[1]){
                    isWallLeft = true;
                }
            })
        }else if(heroY === 5){
            f2WallArray.map(elem => {
                if(heroX === elem[1]){
                    isWallLeft = true;
                }
            })
        }
    }
    const rightHandler = () => {
        if(!fall){
            if(!isRightSideBlocked && !isWallRight){
                heroImg.style.transform = "scale(-1,1)";
                rightPosition = rightPosition + 1;
                imgBlockPosition = imgBlockPosition + 1;
                if (rightPosition > 5) {
                    rightPosition = 0;
                }
                heroImg.style.left = `-${rightPosition * 96}px`;
                heroImg.style.top = '-192px';
                imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
                
                checkFalling();       
                wasHeroHit = false; 
                moveWorldLeft();
                checkRightWallCollide();  
            }
        }else{
            fallHandler();
        }
    }
    const leftHandler = () => {
        if(!fall){
            if(!isLeftSideBlocked && !isWallLeft){
                heroImg.style.transform = "scale(1,1)";
                rightPosition = rightPosition + 1;
                imgBlockPosition = imgBlockPosition - 1;
                if (rightPosition > 5) {
                    rightPosition = 0;
                }
                heroImg.style.left = `-${rightPosition * 96}px`;
                heroImg.style.top = '-192px';
                imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
    
                checkFalling();   
                wasHeroHit = false;
                moveWorldRight();
                checkLeftWallCollide();
            }	
        }else{
            fallHandler();
        }									
    }	
    const standHanlder = () => {
        switch (direction) {
            case 'right': {
                heroImg.style.transform = "scale(-1,1)";		
                if (rightPosition > 4) {
                    rightPosition = 1;
                }				
                break;
            }
            case 'left': {
                heroImg.style.transform = "scale(1,1)";		
                if (rightPosition > 3) {
                    rightPosition = 0;
                }					
                break;
            }
            default: break;
        }
    
        rightPosition = rightPosition + 1;
        heroImg.style.left = `-${rightPosition * 96}px`;
        heroImg.style.top = '0px';
    
        checkFalling();
    }
    const hitHandler = () => {
        switch (direction) {
            case 'right': {
                heroImg.style.transform = "scale(-1,1)";		
                if (rightPosition > 4) {
                    rightPosition = 1;
                    hit = false;
                    wasHeroHit = true;
                }				
                break;
            }
            case 'left': {
                heroImg.style.transform = "scale(1,1)";		
                if (rightPosition > 3) {
                    rightPosition = 0;
                    hit = false;
                    wasHeroHit = true;
                }					
                break;
            }
            default: break;
        }
    
        rightPosition = rightPosition + 1;
        heroImg.style.left = `-${rightPosition * 96}px`;
        heroImg.style.top = '-288px';
    }
    const jumpHandler = () => {
        isWallRight = false;
        isWallLeft = false;
        switch (direction) {
            case 'right': {
                heroImg.style.transform = "scale(-1,1)";		
                if (rightPosition > 4) {
                    rightPosition = 1;
                    jump = false;
                    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)+160}px`;
                    imgBlockPosition = imgBlockPosition + 15;
                    imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
                }				
                break;
            }
            case 'left': {
                heroImg.style.transform = "scale(1,1)";		
                if (rightPosition > 3) {
                    rightPosition = 0;
                    jump = false;
                    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)+160}px`;
                    imgBlockPosition = imgBlockPosition - 15;
                    imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
                }					
                break;
            }
            default: break;
        }
    
        rightPosition = rightPosition + 1;
        heroImg.style.left = `-${rightPosition * 96}px`;
        heroImg.style.top = '-96px';
    }	

    // ОБРАБОТЧИКИ СОБЫТИЙ
    
    let onTouchStart = (event) => {
        event.preventDefault();
        clearInterval(timer);
        x = (event.type === 'mousedown') ? event.screenX : event.touches[0].screenX;
        timer = setInterval(() => {
            if(x > halfWidth) {
                direction = 'right';
                rightHandler();
            } else {
                direction = 'left';
                leftHandler();
            }
        }, 130);
    }
    let onTouchEnd = (event) => {
        clearInterval(timer);
        lifeCycle();
    }
    
    window.onmousedown = onTouchStart;
    window.ontouchstart = onTouchStart;
    window.onmouseup = onTouchEnd;
    window.ontouchend = onTouchEnd;	
    window.ondblclick = (event) => event.preventDefault();
    
    document.addEventListener('keydown', (event) => {
        if(!event.repeat){
            clearInterval(timer);
            timer = setInterval(() => {
                if(event.code === 'KeyD' || event.code === 'ArrowRight') {
                    direction = 'right';
                    rightHandler();
                } else if(event.code === 'KeyA' || event.code === 'ArrowLeft'){
                    direction = 'left';
                    leftHandler();
                }
            }, 130);
        }
    });
    document.addEventListener('keyup', (event) => {
        if(event.code === 'KeyW' || event.code === 'ArrowUp') jump = true;
        if(event.code === 'KeyE') hit = true;
        clearInterval(timer);
        lifeCycle();
    });
    
    const lifeCycle = () => {
        timer = setInterval(()=>{
            if (hit) {
                hitHandler();
            } else if (jump) {
                jumpHandler();
            } else if (fall) {
                fallHandler(); 
            } else {
                standHanlder();
            }
        }, 100);
    }
    const createTile = (x, y = 1) => {
        let tile = document.createElement('img');
        tile.src = 'assets/1 Tiles/Tile_02.png';
        tile.style.position = 'absolute';
        tile.style.left = `${x*32}px`;
        tile.style.bottom = `${y*32}px`;
        backgroundCanvas.appendChild(tile);	
        objectsArray.push(tile);
        tileArray.push([x, y]);
    }
    const createTileBlack = (x, y = 0) => {
        let tileBlack = document.createElement('img');
        tileBlack.src = 'assets/1 Tiles/Tile_04.png';
        tileBlack.style.position = 'absolute';
        tileBlack.style.left = `${x*32}px`;
        tileBlack.style.bottom = `${y*32}px`;	
        backgroundCanvas.appendChild(tileBlack);
        objectsArray.push(tileBlack);
    }
    const createTilesPlatform = (startX, endX, floor) => {
        for (let x_pos = startX - 1 ; x_pos < endX; x_pos++) {
            createTile(x_pos, floor);
        }
    }
    const createTilesBlackBlock = (startX, endX, floor) => {
        for (let y_pos = 0; y_pos < floor; y_pos++){
            for (let x_pos = startX - 1 ; x_pos < endX; x_pos++) {
                createTileBlack(x_pos, y_pos);
            }
        }
    }
    const addTiles = (i) => {
        createTile(i);
        createTileBlack(i);
    }
    
    class Cutscene {
        text;
        isStart;
        block;
        p;
        skipButton;
        timer;
        constructor(text, isStart){
            this.text = text;
            this.isStart = isStart;
            this.block = document.createElement('div');
            this.block.style.cssText = 'position: absolute; left: 10%; bottom: 10vh; width: 80%; height: 80vh; display: flex; justify-content: center; background-color: #38002c; border: 5px solid #8babbf;';
            this.appendP();
            this.appendSkipButton();
            this.setText(this.text);
            canvas.appendChild(this.block);
        }
        appendP(){
            this.p = document.createElement('p');
            this.p.style.position = 'absolute';
            this.p.style.left = '10%';
            this.p.style.top = '4vh';
            this.p.style.width = '80%';
            this.p.style.color = '#8babbf';
            this.p.style.fontSize = '8pt';
            this.p.style.lineHeight = '1.5';
            this.p.style.fontFamily = "'Press Start 2P', cursive";
            this.block.appendChild(this.p);
        }
        appendSkipButton(){
            this.skipButton = document.createElement('button');
            this.setButtonStyle(this.skipButton, 'Go');
            this.skipButton.onclick = () => {
                this.block.style.display = 'none';
                if (this.isStart) {
                    gameTimeInterval = setInterval(() => {
                        gameTime++;
                        timeInfo.textContent = `Время: ${gameTime}`;
                    }, 1000);
                }
            }
            this.block.appendChild(this.skipButton);			
        }
        setButtonStyle(button, title){
            button.style.position = 'absolute';
            button.style.bottom = `${30}px`;
            button.style.backgroundColor = '#8babbf';
            button.style.color = '#38002c';
            button.innerText = title;
            button.style.fontSize = '20pt';
            button.style.margin = '10pt';
            button.style.padding = '10pt';
            button.style.border = 'none';
            button.style.fontFamily = "'Press Start 2P', cursive";
        }
        setText(text){
            let innerText = '';
            let targetText = text;
            let pos = 0;
            this.timer = setInterval(()=>{
                if(pos <= targetText.length - 1){
                    innerText += targetText[pos];
                    this.p.innerText = innerText;
                    pos++;
                }else{
                    clearInterval(this.timer);
                }
            },10);
        }
    }

    class Enemy {
    
        ATTACK = 'attack';
        DEATH = 'death';
        HURT = 'hurt';
        IDLE = 'idle';
        WALK = 'walk';
    
        state;
        animateWasChanged;
        lives;
    
        startX;
        posX;
        posY;
        img;
        block;
        blockSize;
        spritePos;
        spriteMaxPos;
        timer;
        dir;
        stop;
    
        sourcePath;
        message;
        isLast;
        constructor(x, y, src, message = '', isLast = false){
            this.isLast = isLast;
            this.message = message;
            this.posX = x + this.getRandomOffset(6);
            this.startX = x;
            this.posY = y;
            this.blockSize = 96;
            this.spritePos = 0;
            this.spriteMaxPos = 3;
            this.sourcePath = src;
            this.dir = 1;
            this.stop = false;
            this.lives = 30;
    
            this.state = this.IDLE;
            this.animateWasChanged = false;
    
            this.createImg();
    
            this.changeAnimate(this.WALK);
            enemiesArray.push(this);
            this.lifeCycle();
        }
        createImg(){
            this.block = document.createElement('div');
            this.block.style.position = 'absolute';
            this.block.style.left = `${this.posX*32}px`;
            this.block.style.bottom = `${this.posY*32}px`;
            this.block.style.width = `${this.blockSize}px`;
            this.block.style.height = `${this.blockSize}px`;
            this.block.style.overflow = 'hidden';
    
            this.img = document.createElement('img');
            this.img.src = this.sourcePath + 'Idle.png';
            this.img.style.position = 'absolute';
            this.img.style.left = `${0}px`;
            this.img.style.bottom = `${0}px`;
            this.img.style.widht = `${this.blockSize*4}px`;
            this.img.style.height = `${this.blockSize}px`;
    
            this.block.appendChild(this.img);
            canvas.appendChild(this.block);		
        }
        lifeCycle(){
            this.timer = setInterval(()=>{
    
                if(this.animateWasChanged){
                    this.animateWasChanged = false;
                    switch(this.state){
                        case this.ATTACK: {
                            this.setAttack();
                            break;
                        }
                        case this.DEATH: {
                            this.setDeath();
                            break;
                        }
                        case this.HURT: {
                            this.setHurt();
                            break;
                        }
                        case this.IDLE: {
                            this.setIdle();
                            break;
                        }
                        case this.WALK: {
                            this.setWalk();
                            break;
                        }												
                        default: break;
                    }
                }
    
                this.spritePos++;
                this.checkCollide();
                if(!this.stop){
                    this.move();
                } else {
                    if(this.state != this.DEATH) {
                        if (this.state != this.HURT) {
                            this.changeAnimate(this.ATTACK)
                        }
                    }
                }
                this.animate();
            }, 150);
        }
        animate(){
            if(this.spritePos > this.spriteMaxPos){
                this.spritePos = 0;
                if(this.state === this.ATTACK){
                    lives -= 0.5;
                    updateHearts();
                }
                if(this.state === this.HURT){
                    this.changeAnimate(this.ATTACK);
                    if(this.dir > 0) this.spritePos = 1;
                }
                if(this.state === this.DEATH){
                    clearInterval(this.timer);
                    isRightSideBlocked = false;
                    isLeftSideBlocked = false;
                    if(this.dir > 0) this.spritePos = 5;
                    if(this.message) {
                        new Cutscene([this.message]);
                    }
                }
            }
            this.img.style.left = `${-(this.spritePos * this.blockSize)}px`;
        }
        setAttack(){
            this.img.src = this.sourcePath + 'Attack.png';
            this.spriteMaxPos = 5;
        }
        setDeath(){
            this.img.src = this.sourcePath + 'Death.png';
            this.spriteMaxPos = 5;
            score += 10;
            scoreInfo.textContent = `Очки: ${score}`;
        }
        setHurt(){
            this.img.src = this.sourcePath + 'Hurt.png';
            this.spriteMaxPos = 1;
        }
        setIdle(){
            this.img.src = this.sourcePath + 'Idle.png';
            this.spriteMaxPos = 3;
        }		
        setWalk(){
            this.img.src = this.sourcePath + 'Walk.png';
            this.spriteMaxPos = 5;
        }		
        changeAnimate(stateStr){
            this.state = stateStr;
            this.animateWasChanged = true;
        }
        move(){
            if(this.posX > (this.startX + 6)){
                this.dir *= -1;
                this.img.style.transform = "scale(-1,1)";
            } else if(this.posX <= this.startX){
                this.dir = Math.abs(this.dir);
                this.img.style.transform = "scale(1,1)";
            }
            this.posX += this.dir;
            this.block.style.left = `${this.posX * 32}px`;
        }
        checkHurt(){
            if(wasHeroHit){
                if(this.lives <= 10){
                    wasHeroHit = false;
                    this.changeAnimate(this.DEATH);
                } else {
                    wasHeroHit = false;
                    this.changeAnimate(this.HURT);
                    this.showHurt();
                    this.lives -= 10;
                }
            }
        }
        checkCollide(){
            if(heroY == this.posY){
                if(heroX == this.posX){
                    // attack left side
                    this.checkHurt();
                    isRightSideBlocked = true;
                    this.stop = true;
                } else if(heroX == (this.posX + 3)){
                    // attack right side
                    this.checkHurt();
                    isLeftSideBlocked = true;
                    this.stop = true;
                } else {
                    isRightSideBlocked = false;
                    isLeftSideBlocked = false;
                    this.stop = false;
                    this.changeAnimate(this.WALK);
                }
            } else {
                isRightSideBlocked = false;
                isLeftSideBlocked = false;
                this.stop = false;
                this.changeAnimate(this.WALK);
            }
        }
        showHurt(){
            let pos = 0;
            let text = document.createElement('p');
            text.innerText = '-10';
            text.style.position = 'absolute';
            text.style.left = (this.dir < 0) ? `${Number.parseInt(this.block.style.left) + 50}px` : `${Number.parseInt(this.block.style.left) + 10}px`;
            text.style.bottom = `${Number.parseInt(this.block.style.bottom) + 32}px`;
            text.style.fontFamily = "'Bungee Spice', cursive";
            let hurtTimer = setInterval(()=>{
                text.style.bottom = `${Number.parseInt(text.style.bottom) + 16}px`;
                if(pos > 2){
                    clearInterval(hurtTimer);
                    text.style.display = 'none';
                }
                pos++;
            }, 100);
            canvas.appendChild(text);
        }
        moveRight(){
            this.startX += 1;
            this.posX += 1;
            if(this.stop || this.state === this.DEATH){
                this.block.style.left = `${Number.parseInt(this.block.style.left)+32}px`;
            }
        }
        moveLeft(){
            this.startX -= 1;
            this.posX -= 1;
            if(this.stop || this.state === this.DEATH){
                this.block.style.left = `${Number.parseInt(this.block.style.left)-32}px`;
            }			
        }
        getRandomOffset(max){
            let rand = Math.floor(Math.random() * max);
            return rand;
        }
    }
    class Enemy1 extends Enemy {
        constructor(x, y, mess){
            super(x, y, 'assets/Enemies/1/', mess);
        }
    }
    
    class Heart {
        img;
        x;
        constructor(x, src){
            this.x = x + 1;
            this.img = document.createElement('img');
            this.img.src = src;
            this.img.style.position = 'absolute';
            this.img.style.left = `${this.x * 32}px`;
            this.img.style.bottom = `${((window.screen.availHeight / 32) - 2) * 32}px`;
            this.img.style.width = '32px';
            this.img.style.height = '32px';
    
            canvas.appendChild(this.img);
        }
    }
    class HeartEmpty extends Heart {
        constructor(x){
            super(x, 'assets/Hearts/heart_empty.png');
        }
    }
    class HeartRed extends Heart {
        constructor(x){
            super(x, 'assets/Hearts/heart_red.png');
        }
    }
    const addHearts = () => {
        for(let i = 0; i < maxLives; i++){
            let heartEmpty = new HeartEmpty(i);
            let heartRed = new HeartRed(i);
            heartsArray.push(heartRed);
        }
    }
    const updateHearts = () => {
        if(lives <= 0){
            finalTimerText.innerText = 'Game over';
            fall = true;
            scoreInfo.textContent = `Очки: ${score}`;
            gameRecords.push({'name': userName, 'score': score});
            localStorage.setItem('gameRecords', JSON.stringify(gameRecords));
            gameRecords.sort((a, b) => a.score < b.score ? 1 : -1);
            let gameRecordsText = 'Мои рекорды: \n';
            for (let i = 0; i < gameRecords.length && i < 5; i++) {
                gameRecordsText += `${gameRecords[i].name} - ${gameRecords[i].score} \n`;
            }
            setTimeout(() => {
                let showFinalScore = new Cutscene(`
                    Время - ${gameTime}
                    Очки - ${score} \n 
                    ${gameRecordsText}
                `);
            }, 2000);
            clearInterval(gameTimeInterval);
        }
        for(let i = 0; i < lives; i++){
            heartsArray[i].img.style.display = 'block';
        }
        for(let i = lives; i < maxLives; i++){
            heartsArray[i].img.style.display = 'none';
        }
    }
    const createBackImg = (i) => {
        let img = document.createElement('img');
        img.src = 'assets/2 Background/Day/Background.png';
        img.style.position = 'absolute';
        img.style.left = `${(i*window.screen.availWidth)-32}px`;
        img.style.bottom = '32px';
        img.style.width = `${window.screen.availWidth}px`;
        backgroundCanvas.appendChild(img);
        objectsArray.push(img);
    }
    const addBackgroundImages = () => {
        for(let i = 0; i < 5; i++){
            createBackImg(i);
        }
    }
    const createImgEl = (src, x, y) => {
        let img = document.createElement('img');
        img.src = src;
        img.style.position = 'absolute';
        img.style.left = `${x*32}px`;
        img.style.bottom = `${y*32}px`;
        img.style.transform = 'scale(2,2) translate(-25%, -25%)';
        backgroundCanvas.appendChild(img);
        objectsArray.push(img);
    }
    const addDecorationElements = (f1) => {
        let basePath = 'assets/3 Objects/';
        //Stone
        createImgEl(basePath + '/Stones/6.png', 10, f1);
        createImgEl(basePath + '/Stones/4.png', 111, f1);
        createImgEl(basePath + '/Stones/4.png', 38, f1);
        //Bushes
        createImgEl(basePath + '/Bushes/17.png', 84, f1);
        //Fountain
        createImgEl(basePath + 'Fountain/2.png', 50, f1);
        //Box
        createImgEl(basePath + '/Other/Box.png', 84, f1);
    }

    const addEnemies = () => {
        let enemy1 = new Enemy1(15, 1);
    }

    const buildLevel = () => {
        let floor1 = 0;
        addDecorationElements(floor1 + 1);
        createTilesPlatform(0, 140, floor1);
        addEnemies();
    }

    const addStartScreen = () => {
        fsBtn.src = './assets/Param buttons/cancel.png';
        let cutscene = new Cutscene(
            'Первый уровень - дойдите до фонтана \n\n Управление: \n\n Передвижение - стрелками, клавишами AD или зажатием экрана с правой или левой стороны \n\n Прыжок - стрелка вверх, клавиша W или кнопка интерфейса "Прыжок" (слева) \n\n Атака - клавиша E или кнопка интерфейса "Атака" (справа)'
        , true);					
        document.querySelector('.start-menu').style.display = 'none';
    }
    // let startTimeout = setTimeout(() => {
    //     const fountainImg = objectsArray.filter(elem => elem.outerHTML.split('"')[1] === 'assets/3 Objects/Fountain/2.png')[0];
    //     if(heroX === Number.parseInt(+fountainImg.style.left.slice(0, -2))/32){
    //         new Terminal();
    //     }
    //     console.log('ФОНТАН??? ' + (+fountainImg.style.left.slice(0, -2))/32);
    // }, 3000);
    
    addBackgroundImages();
    buildLevel();
    lifeCycle();
    addHearts();
    updateHearts();
    addStartScreen();
    canvas.requestFullscreen();
}
