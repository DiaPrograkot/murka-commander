let container = document.querySelector('.container')
let playerNameContainer = document.querySelector('.playerNameContainer')
let playerInput = document.querySelector('.playerInput')
let playerName = ''
let playerPlay = document.querySelector('.playerPlay')
let playerLabel = document.querySelector('.playerLabel')
let ship = document.querySelector('.ship')
let start = document.querySelector('.start')
let gameover = document.querySelector('.gameover')
let audio = document.querySelector('.audio')
let lasersound = document.querySelector('.lasersound')
let crash = document.querySelector('.crash')
let counter = document.querySelector('.counter')
let toggleMusic = document.querySelector('.toggleMusic')
let muteSpeaker = toggleMusic.querySelector('.muteSpeaker')
let musicButton = toggleMusic.querySelector('.musicButton')
let play = document.querySelector('.play')
let earth = document.querySelector('.earthImg')
let mars = document.querySelector('.marsImg')
let space = document.querySelector('.spaceImg')
let lives = document.querySelector('.lives')
let videoContainer = document.querySelector('.videoContainer')
let videoSource = videoContainer.querySelector('source')
let star
let pauseButton = document.querySelector('.pause-button')
let isPaused = false
let easyButton = document.querySelector('#easy')
let mediumButton = document.querySelector('#medium')
let hardButton = document.querySelector('#hard')
let yourscoreNumber = document.querySelector('.yourscoreNumber')
let tryAgainButton = document.querySelector('.tryAgainButton')

let asteroidElement
let asteroidShapeNumber
let asteroidShapeSize
let asteroidShape
let asteroidX
let asteroidY
let stars

//для клавиатуры
let moveLeft = false;  // Флаг для движения влево
let moveRight = false; // Флаг для движения вправо
let isSpacePressed = false

//before start

isGameOver = false

//проверка уровня сложности
let checkingDiff

easyButton.addEventListener('click', () => {
  checkingDiff = 'easyWasPressed'
})

mediumButton.addEventListener('click', () => {
  checkingDiff = 'mediumWasPressed'
})

hardButton.addEventListener('click', () => {
  checkingDiff = 'hardWasPressed'
})


//Display stars
let showStars = () => {

  switch (checkingDiff) {
    case 'easyWasPressed':
      stars = 4
      break;
    case 'mediumWasPressed':
      stars = 3
      break;
    case 'hardWasPressed':
      stars = 2
      break;
    default:
      stars = 3
  }

  lives.innerHTML = ''
  while (stars > 0) {
    star = document.createElement('img')
    star.setAttribute('src', 'img/paw.png')
    star.classList.add('star')
    lives.append(star)
    stars--
  }
  switch (checkingDiff) {
    case 'easyWasPressed':
      stars = 4
      break;
    case 'mediumWasPressed':
      stars = 3
      break;
    case 'hardWasPressed':
      stars = 2
      break;
    default:
      stars = 3
  }
}


let setCounter = () => {
  counter.textContent = parseInt(counter.textContent) + 1
}

//Plays laser sound
let laserSound = () => {
  lasersound.pause()
  lasersound.currentTime = 0
  lasersound.volume = 0.1
  lasersound.play()
}

//Remove laser when asteroid is hit
let removeLaser = laser => {
  if (laser) {
    container.removeChild(laser)
  }
}
//Remove lasers when hit the bottom of the window
let removeLasers = () => {
  let oldLasers = document.querySelectorAll('.laser')
  for (let oldLaser of oldLasers) {
    if (oldLaser.getBoundingClientRect().top >= window.innerHeight) {
      oldLaser.remove()
  }
  }
}

//Laser movement
let laserMovement = laser => {
  // laser.style.top = laser.offsetTop - window.innerHeight + 'px'
  laser.style.top = window.innerHeight + 'px'
    if (
      laser.offsetTop <=
        asteroidElement.offsetTop + asteroidElement.offsetHeight - 10 &&
      laser.offsetTop >= asteroidElement.offsetTop
    ) {
      if (
        laser.offsetLeft >
          asteroidElement.offsetLeft - asteroidElement.offsetWidth / 2 &&
        laser.offsetLeft <
          asteroidElement.offsetLeft + asteroidElement.offsetWidth
      ) {
        removeLaser(laser)
        //Make asteroid smaller when hit
        if (asteroidElement.offsetWidth > 80) {
          asteroidElement.style.width = asteroidElement.offsetWidth - 40 + 'px'
          asteroidElement.style.height =
            asteroidElement.offsetHeight - 40 + 'px'
        } else {
          crash.play()
          crash.volume = 0.1
          container.removeChild(asteroidElement)
          setCounter()
          asteroidFunction()
        }
      }
    }
}

//Create laser and initial positioning
let createLaser = () => {
  let laser = document.createElement('img')
  laser.classList.add('laser')
  laser.setAttribute('src', 'img/bullet.svg')
  container.insertAdjacentElement('beforeend', laser)
  laser.style.left = ship.offsetLeft + 45 + 'px'
  // laser.style.top = ship.offsetTop + 110 + 'px'
  laserMovement(laser)
}

//Lasershot function
let laserShot = () => {
  if (gameFSM.currentState !== 'PAUSE') {
    createLaser()
    removeLasers()
    laserSound()
  }
}


//Set the asteroid position
let setAsteroidPosition = asteroid => {
  
   switch (checkingDiff) {
    case 'easyWasPressed':
      speed = 140
      break;
    case 'mediumWasPressed':
      speed = 700
      break;
    case 'hardWasPressed':
      speed = 1400
      break;
    default: 
      speed = 140
  }

  let maxWidth = container.offsetWidth - asteroid.offsetWidth
  let randomPosition = Math.floor(Math.random() * (maxWidth - 1) + 1)
  asteroid.style.left = randomPosition + 15 + 'px'


    asteroid.style.bottom = window.innerHeight + speed + 'px'


};

  //Set asteroid shape
  let setAsteroidShape = asteroid => {
    asteroidShapeNumber = Math.floor(Math.random() * 9) + 1
    asteroidShapeSize = Math.floor(Math.random() * 16) + 4
    switch (asteroidShapeNumber) {
      case 1:
        asteroidShape = 'img/asteroid-purple.svg'
        break
      case 2:
        asteroidShape = 'img/green-asteroid.svg'
        break
      case 3:
        asteroidShape = 'img/orange-meteorite.svg'
        break
      case 4:
        asteroidShape = 'img/asteroid-black.svg'
        break
      case 5:
        asteroidShape = 'img/rock.svg'
        break
      case 6:
        asteroidShape = 'img/meteorite-white.svg'
        break
      case 7:
        asteroidShape = 'img/lightorange-asteroid.svg'
        break
      case 8:
        asteroidShape = 'img/rocky-asteroid.svg'
        break
      case 9:
        asteroidShape = 'img/purple-asteroid.svg'
        break
      default:
        break
    }
    asteroid.setAttribute('src', asteroidShape)
    asteroid.style.height = `${asteroidShapeSize}rem`
    asteroid.style.width = `${asteroidShapeSize}rem`
  }

  let scoreStorage = localStorage.getItem('')
  //Gameover Popup
  let gameoverFunc = () => {
    gameover.style.display = 'flex'
    ship.style.display = 'none'
    tryAgainButton.addEventListener('click', e => {
      location.reload()
    })
    document.removeEventListener('click', laserShot)
    isGameOver = true
    yourscoreNumber.textContent = counter.textContent
    localStorage.setItem('highscore', yourscoreNumber.textContent)
  }

  
  //start 
let startGame = () => {
    
  play.addEventListener('click', event => {
      
      
      event.stopPropagation()
    document.addEventListener('click', laserShot)
    gameFSM.setState(States.STARTGAME)
    })
    let nameStorage = localStorage.getItem('name')
    if (nameStorage) {
      playerLabel.textContent = nameStorage
    } else {
      playerNameContainer.style.display = 'flex'
      playerPlay.addEventListener('click', () => {
        playerName = playerInput.value
        if (playerName) {
          localStorage.setItem('name', playerName)
          playerLabel.textContent = playerName
          playerNameContainer.style.display = 'none'
          gameFSM.setState(States.STARTGAME)
        }
      })
    }
  }
  
  

  //Removes stars
  let removeStars = () => {
    if (stars > 1) {
      lives.removeChild(star)
      stars--
      console.log(stars)
    } else if (stars === 1) {
      lives.removeChild(star)
      stars--
      gameoverFunc()
    }
  }

  let timeoutFunc = asteroid => {
    let asteroidPosition = asteroid.offsetTop
    if (asteroidPosition <= -80) {
      if (container.contains(asteroid)) {
        container.removeChild(asteroid)

        star = document.querySelector('.star')
        removeStars()
        asteroidFunction()
        return
      }
    }
    setTimeout(() => timeoutFunc(asteroid), 1000)
  }

  // Remove asteroid
  let removeAsteroid = asteroid => {
    setTimeout(() => timeoutFunc(asteroid), 3000)
  }

  //Create asteroid
let createAsteroid = () => {
  if (!asteroidElement) {
    asteroidElement = document.createElement('img')
    asteroidElement.classList.add('asteroid')
    asteroidElement.setAttribute('draggable', 'false')
    return asteroidElement
    }
    
  }

  //Full asteroid functionality
  let asteroidFunction = () => {
    if (isGameOver) return

    let asteroid = createAsteroid()
    container.append(asteroid)
    setAsteroidShape(asteroid)
    setAsteroidPosition(asteroid)
    removeAsteroid(asteroid)
  }

  //Music playback start after 3 seconds
  let musicPlay = setTimeout(() => {
    audio.play()
    audio.volume = 0.1
  }, 2000)

  //Toggle music
  toggleMusic.addEventListener('click', event => {
    if (audio.paused) {
      muteSpeaker.style.opacity = '0'
      event.stopPropagation();
      return audio.play()
    }
    audio.pause()
    audio.currentTime = 0
    muteSpeaker.style.opacity = '1'

    event.stopPropagation()
  })

  //Keyboard ship movement
  document.addEventListener('keydown', event => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      moveLeft = true;
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      moveRight = true;
    }
    if (event.key === ' ' && !isSpacePressed) {
      laserShot()
      isSpacePressed = true
    }
  });

  document.addEventListener('keyup', event => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      moveLeft = false;
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      moveRight = false;
    }
    if (event.key === ' ') {
      isSpacePressed = false
    }
  });


  // Функция анимации
  function animate() {
    const rect = ship.getBoundingClientRect();
    if (moveLeft && rect.left > 0) {
      ship.style.left = ship.offsetLeft - 9 + 'px';
    }
    if (moveRight && rect.right < window.innerWidth) {
      ship.style.left = ship.offsetLeft + 9 + 'px';
    }
  }

  let mouseMovement = event => {
    const containerRect = container.getBoundingClientRect();
    const shipRect = ship.getBoundingClientRect();
    let newLeft = event.clientX - 60;

    if (newLeft < 0) {
      newLeft = 0;
    } else if (newLeft + shipRect.width > containerRect.width) {
      newLeft = containerRect.width - shipRect.width;
    }

    ship.style.left = newLeft + 'px';
  }

  // Mouse ship movement with boundary checks
  document.addEventListener('mousemove', mouseMovement);

  // Touch ship movement with boundary checks
  ship.addEventListener('touchmove', event => {
    const containerRect = container.getBoundingClientRect();
    const shipRect = ship.getBoundingClientRect();
    let newLeft = Math.floor(event.touches[0].clientX);

    if (newLeft < 0) {
      newLeft = 0;
    } else if (newLeft + shipRect.width > containerRect.width) {
      newLeft = containerRect.width - shipRect.width;
    }

    ship.style.left = newLeft + 'px';
  });

  //Earth background
  earth.addEventListener('click', event => {
    videoSource.setAttribute('src', 'video/earth.mp4')
    videoContainer.load()
    event.stopPropagation()
  })
  //Mars background
  mars.addEventListener('click', event => {
    videoSource.setAttribute('src', 'video/mars.mp4')
    videoContainer.load()
    event.stopPropagation()
  })
  //Space background
  space.addEventListener('click', event => {
    videoSource.setAttribute('src', 'video/galaxy.mp4')
    videoContainer.load()
    event.stopPropagation()
  })

pauseButton.addEventListener('click', event => {

  gameFSM.setState(States.PAUSE)
  if (gameFSM.currentState === 'PAUSE') {
    gameFSM.setState(States.STARTGAME)
  }
  event.stopPropagation()
  })







const States = {
  BEFORESTART: 'beforeStart',
  STARTGAME: 'startGame',
  PAUSE: 'pause',
  GAMEOVER: 'gameover'
};

class FSM {
  constructor() {
    this.currentState = null;
    this.states = {};
  }

  addState(stateName, state) {
    this.states[stateName] = state;
  }

  setState(stateName) {
    if (this.currentState) {
      this.currentState.exit();
    }
    this.currentState = this.states[stateName];
    this.currentState.enter();
  }

  update() {
    if (this.currentState) {
      this.currentState.update();
    }
  }
}

const beforeStartState  = {
  enter: () => {
    console.log('Entering beforeStart state');
    ship.style.display = 'none'
    start.style.display = 'flex'
    

    


  },
  update: () => {
    // Логика для состояния beforeStart
    showStars()
    
  },
  exit: () => {
    console.log('Exiting beforeStart state');
    
   
  }
};
startGame()

const startGameState  = {
  enter: () => {
    console.log('Entering startGameState state');

    start.style.display = 'none'
    gameover.style.display = 'none'
    ship.style.display = 'flex'  

    


  },
  update: () => {
    animate()
    asteroidFunction()
    // Логика для состояния
  },
  exit: () => {
    console.log('Exiting startGameState state');
  }
};

const pauseState  = {
  enter: () => {
    console.log('Entering pauseState state');
  },
  update: () => {
    // Логика для состояния
  },
  exit: () => {
    console.log('Exiting pauseState state');
  }
};


const gameoverState  = {
  enter: () => {
    console.log('Entering gameoverState state');
    gameover.style.display = 'flex'
    ship.style.display = 'none'


  },
  update: () => {
    // Логика для состояния
  },
  exit: () => {
    console.log('Exiting gameoverState state');

  }
};





const gameFSM = new FSM();



gameFSM.addState(States.BEFORESTART, beforeStartState);
gameFSM.addState(States.STARTGAME, startGameState);
gameFSM.addState(States.PAUSE, pauseState);
gameFSM.addState(States.GAMEOVER, gameoverState);
// Добавляем другие состояния

gameFSM.setState(States.BEFORESTART);

function gameLoop() {
  gameFSM.update();
  requestAnimationFrame(gameLoop);
};

gameLoop()