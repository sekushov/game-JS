const level2 = () => {

    //ПЕРЕМЕННЫЕ
    
    let rightPosition = 0;
    let imgBlockPosition = 0;
    let direction = 'right';
    let hit = false;
    let jump = false;
    let fall = false;
    let timer = null;
    let x = 0;
    let halfWidth = window.screen.width / 2;
    let tileArray = [];
    let objectsArray = [];
    let enemiesArray = [];
    let maxLives = 8;
    let lives = 8;
    let heartsArray = [];
    let isRightSideBlocked = false;
    let isLeftSideBlocked = false;
    let wasHeroHit = false;
    let f1WallArray = [[-10, 0], [21, 40], [54, 70]];
    let f2WallArray = [[25, 40], [54, 70]];
    let isWallRight = false;
    let isWallLeft = false;
    let heroStep = 3;
    let gameTime = 0;
    let gameTimeInterval;
    
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
    
    jumpBlock.style.top = `${window.screen.height/2 - 144/2}px`;
    hitBlock.style.top = `${window.screen.height/2 - 144/2}px`;
    
    heroImg.onclick = (event) => {
        event.preventDefault();
    }
    fsBtn.onclick = () => {
        if(document.fullscreenElement){
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
    
    document.addEventListener('keydown', (event) => {
        if(!event.repeat){
            clearInterval(timer);
            timer = setInterval(() => {
                if(event.code === 'KeyD') {
                    direction = 'right';
                    rightHandler();
                } else if(event.code === 'KeyA'){
                    direction = 'left';
                    leftHandler();
                }
            }, 130);
        }
    });
    document.addEventListener('keyup', (event) => {
        if(event.code === 'KeyW') jump = true;
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
        tile.src = 'assets/1 Tiles/Tile_11.png';
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
        nextButton;
        skipButton;
        page;
        timer;
        constructor(text, isStart){
            this.page = 0;
            this.text = text;
            this.isStart = isStart;
            this.block = document.createElement('div');
            this.block.style.position = 'absolute';
            this.block.style.left = '10%';
            this.block.style.bottom = '10vh';
            this.block.style.width = '80%';
            this.block.style.height = '80vh';
            //#38002c - фон
            //#8babbf - текст
            this.block.style.backgroundColor = '#38002c';
            this.block.style.border = '5px solid #8babbf';
            this.appendP();
            this.appendNextButton();
            this.appendSkipButton();
            this.setText(this.text[this.page]);
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
            this.p.onclick = () => {
                this.nextButton.style.display = 'block';
                clearInterval(this.timer);
                this.p.innerText = this.text[this.page];
            }
            this.block.appendChild(this.p);
        }
        startLevelTimer = () => {
            this.block.style.display = 'none';
                if (this.isStart) {
                    gameTimeInterval = setInterval(() => {
                        gameTime++;
                        timeInfo.textContent = `Время: ${gameTime}`;
                    }, 1000);
                }
        }
        appendNextButton(){
            this.nextButton = document.createElement('button');
            this.setButtonStyle(this.nextButton, 'Next');
            this.nextButton.style.right = `${0}px`;
            this.nextButton.style.display = 'none';
            this.nextButton.onclick = () => {
                if(this.page < this.text.length - 1){
                    this.page++;
                    this.setText(this.text[this.page]);
                    this.nextButton.style.display = 'none';
                }else{
                    this.block.style.display = 'none';
                }
                this.startLevelTimer();
            }
            this.block.appendChild(this.nextButton);
        }
        appendSkipButton(){
            this.skipButton = document.createElement('button');
            this.setButtonStyle(this.skipButton, 'Skip');
            this.skipButton.style.left = `${0}px`;
            this.skipButton.onclick = () => this.startLevelTimer();
            this.block.appendChild(this.skipButton);			
        }
        setButtonStyle(button, title){
            button.style.position = 'absolute';
            button.style.bottom = `${0}px`;
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
            if(this.page === this.text.length - 1) this.nextButton.innerText = 'Go';
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
                    this.nextButton.style.display = 'block';
                }
            },20);
            // this.p.innerText = text;
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
        size;
        constructor(x, y, size, src, isLast = false, lives = 30){
            this.isLast = isLast;
            this.posX = x + this.getRandomOffset(6);
            this.startX = x;
            this.posY = y;
            this.blockSize = 96 * size;
            this.spritePos = 0;
            this.spriteMaxPos = 3;
            this.sourcePath = src;
            this.dir = 1;
            this.stop = false;
            this.lives = lives;
    
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
                    if(this.state != this.DEATH){
                        if(this.state != this.HURT){
                            this.changeAnimate(this.ATTACK);
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
                        if(this.isLast){
                        }
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
            this.block.style.left = `${this.posX * 32 - this.blockSize/3}px`;
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
        constructor(x, y, size, mess){
            super(x, y, size, 'assets/Enemies/1/',mess);
        }
    }
    class Enemy2 extends Enemy {
        constructor(x, y, size, mess, isLast){
            super(x, y, size, 'assets/Enemies/2/', mess, isLast);
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
        setWalk(){
            this.img.src = this.sourcePath + 'Walk.png';
            this.spriteMaxPos = 3;
        }					
    }
    class Enemy5 extends Enemy {
        constructor(x, y, size, mess){
            super(x, y, size, 'assets/Enemies/5/', mess);
        }
        setAttack(){
            this.img.src = this.sourcePath + 'Attack.png';
            this.spriteMaxPos = 3;
        }
        setDeath(){
            this.img.src = this.sourcePath + 'Death.png';
            this.spriteMaxPos = 2;
            score += 10;
            scoreInfo.textContent = `Очки: ${score}`;
        }
        setWalk(){
            this.img.src = this.sourcePath + 'Walk.png';
            this.spriteMaxPos = 3;
        }		
    }		
    class Enemy6 extends Enemy {
        bullet;
        isShoot;
        bulletX;
        constructor(x, y, size, mess){
            super(x, y, size, 'assets/Enemies/6/', mess);
            this.bullet = document.createElement('img');
            this.bullet.src = this.sourcePath + 'Ball1.png';
            this.bullet.style.position = 'absolute';
            this.bullet.style.left = this.block.style.left;
            this.bullet.style.bottom = `${Number.parseInt(this.block.style.bottom) + 32}px`;
            this.bullet.style.transform = 'scale(2,2)';
            this.bullet.style.display = 'none';
            canvas.appendChild(this.bullet);
        }
        setAttack(){
            this.img.src = this.sourcePath + 'Attack.png';
            this.spriteMaxPos = 3;
        }
        setDeath(){
            this.img.src = this.sourcePath + 'Death.png';
            this.spriteMaxPos = 2;
            score += 10;
            scoreInfo.textContent = `Очки: ${score}`;
        }
        setWalk(){
            this.img.src = this.sourcePath + 'Walk.png';
            this.spriteMaxPos = 3;
        }		
        checkCollide(){
            if(heroY == this.posY){
                this.stop = true;
                if(heroX > this.posX){
                    this.dir = 1;
                    this.img.style.transform = 'scale(1,1)';
                }else{
                    this.dir = -1;
                    this.img.style.transform = 'scale(-1,1)';
                }
                if(heroX == this.posX){
                    // attack left side
                    this.checkHurt();
                    isRightSideBlocked = true;
                    // this.stop = true;
                } else if(heroX == (this.posX + 3)){
                    // attack right side
                    this.checkHurt();
                    isLeftSideBlocked = true;
                    // this.stop = true;
                } else {
                    isRightSideBlocked = false;
                    isLeftSideBlocked = false;
                    // this.stop = false;
                    this.changeAnimate(this.WALK);
                }
            } else {
                isRightSideBlocked = false;
                isLeftSideBlocked = false;
                this.stop = false;
                this.changeAnimate(this.WALK);
            }
        }	
        animate(){
            if(this.spritePos > this.spriteMaxPos){
                this.spritePos = 0;
                if(this.state === this.ATTACK){
                    if(!this.isShoot) this.shoot();
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
                    if(this.message) new Cutscene([this.message]);
                }
            }
            if(this.isShoot && this.state === this.ATTACK){
                this.bulletFunc();
            }else{
                this.bullet.style.display = 'none';
            }
            this.img.style.left = `${-(this.spritePos * this.blockSize)}px`;
        }	
        shoot(){
            this.isShoot = true;
            this.bullet.style.display = 'block';
            (this.dir > 0) ? this.bulletX = this.posX + 2 : this.bulletX = this.posX + 1;
        }
        bulletFunc(){
            (this.dir > 0) ? this.bulletX += 1 : this.bulletX -= 1;
            this.bullet.style.left = `${this.bulletX * 32}px`;
            if(this.bulletX === heroX && this.posY === heroY){
                this.isShoot = false;
                this.bullet.style.display = 'none';
                lives -= 0.5;
                updateHearts();
            }
            if(this.dir > 0){
                if(this.bulletX > (this.posX + 6)){
                    this.isShoot = false;
                    this.bullet.style.display = 'none';					
                }
            }else{
                if(this.bulletX < (this.posX - 5)){
                    this.isShoot = false;
                    this.bullet.style.display = 'none';					
                }				
            }
        }
    }
    class Enemy7 extends Enemy {
        constructor(x, y, size, isLast, lives){
            super(x, y, size, 'assets/Enemies/7/', isLast, lives);
        }
        animate(){
            if(this.spritePos > this.spriteMaxPos){
                this.spritePos = 0;
                if(this.state === this.ATTACK){
                    lives -= 1;
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
                    if(this.isLast){
                        finalTimerText.innerText = 'You win!';
                        scoreInfo.textContent = `Очки: ${score += Math.floor(200 / gameTime)}`;
                        setTimeout(() => {
                            let showFinalScore = new Cutscene([`
                                Время - ${gameTime} секунд
                                Бонусные очки за время: ${Math.floor(200 / gameTime)}
                                Очки - ${score}\n
                            `]);
                        }, 2000);
                        clearInterval(gameTimeInterval);
                        const nextLevelTimer = setTimeout(() => {
                            canvas.innerHTML = '';
                            start();
                            level3();
                            clearInterval(nextLevelTimer)
                        }, 8000)
                    }
                }
            }
            this.img.style.left = `${-(this.spritePos * this.blockSize)}px`;
        }
        setDeath(){
            this.img.src = this.sourcePath + 'Death.png';
            this.spriteMaxPos = 5;
            score += 30;
            scoreInfo.textContent = `Очки: ${score}`;
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
            this.img.style.bottom = `${((window.screen.height / 32) - 2) * 32}px`;
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
            clearInterval(gameTimeInterval);
            gameRecords.push({'name': userName, 'score': score});
            localStorage.setItem('gameRecords', JSON.stringify(gameRecords));
            gameRecords.sort((a, b) => a.score < b.score ? 1 : -1);
            let gameRecordsText = 'Мои рекорды: \n';
            for (let i = 0; i < gameRecords.length && i < 5; i++) {
                gameRecordsText += `${gameRecords[i].name} - ${gameRecords[i].score} \n`;
            }
            setTimeout(() => {
                let showFinalScore = new Cutscene([`
                    Время - ${gameTime}
                    Очки - ${score} \n
                    ${gameRecordsText}
                `]);
            }, 2000)
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
        img.src = 'assets/2 Background/Night/Background.png';
        img.style.position = 'absolute';
        img.style.left = `${(i*window.screen.width)-32}px`;
        img.style.bottom = '32px';
        img.style.width = `${window.screen.width}px`;
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
    const addDecorationElements = (f1, f2, f3) => {
        let basePath = 'assets/3 Objects/';
        
        // createImgEl(basePath + '/Other/Tree2.png', 6, f1);
        createImgEl(basePath + '/Stones/6.png', 6, f1);
        createImgEl(basePath + '/Bushes/18.png', 18, f1);
        createImgEl(basePath + '/Bushes/16.png', 42, f1);
        createImgEl(basePath + '/Bushes/13.png', 53, f1);
        createImgEl(basePath + '/Benches/4.png', 52, f1);
    }
    const addEnemies = () => {
        let boss = new Enemy7(42, 1, 3, true, 80);
        let enemy1 = new Enemy6(10, 1, 1);
        let enemy2 = new Enemy2(7, 1, 1);
    }
    const buildLevel = () => {
        let floor1 = 0;
        let floor2 = 4;
        let floor3 = 8;
    
        addDecorationElements(floor1 + 1, floor2 + 1, floor3 + 1);
    
        createTilesPlatform(0, 80, floor1);
    
        createTilesPlatform(21, 24, floor2);

        createTilesBlackBlock(21, 40, floor2);
        createTilesBlackBlock(55, 70, floor2);

        createTilesPlatform(25, 40, floor3);
        createTilesPlatform(55, 70, floor3);
    
        createTilesBlackBlock(25, 40, floor3);
        createTilesBlackBlock(55, 70, floor3);
    
        addEnemies();
    }
    const addStartScreen = () => {
        fsBtn.src = './assets/Param buttons/cancel.png';
        let cutscene = new Cutscene([
            'Уровень 2 \n\n Вы попали в потусторонний мир. Сбежать отсюда можно только через ПОРТАЛ, который находится в конце 3 уровня. \n\n Победите главного монстра'
        ], true);					
        document.querySelector('.start-menu').style.display = 'none';
    }
    
    addBackgroundImages();
    buildLevel();
    lifeCycle();
    addHearts();
    updateHearts();
    addStartScreen();
    canvas.requestFullscreen();
}
