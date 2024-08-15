let container = document.querySelector('.container')
let playerNameContainer = document.querySelector('.playerNameContainer')
let playerInput = document.querySelector('.playerInput')
let playerName = ''
let playerPlay = document.querySelector('.playerPlay')
let playerLabel = document.querySelector('.playerLabel')
let ship = document.querySelector('.ship')
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
let startGame = document.querySelector('.startGame')
let startPlay = document.querySelector('.startPlay')

let asteroidElement
let asteroidShapeNumber
let asteroidShapeSize
let asteroidShape
let asteroidX
let asteroidY
let stars = 3



//Display stars
let showStars = () => {
  lives.innerHTML = ''
  while (stars > 0) {
    star = document.createElement('img')
    star.setAttribute('src', 'img/paw.png')
    star.classList.add('star')
    lives.append(star)
    stars--
  }
  stars = 3
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
  let laserInterval = setInterval(() => {
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
          clearInterval(laserInterval)
        }
      }
    }
  }, 10)
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
  createLaser()
  removeLasers()
  laserSound()
}

//Set the asteroid position
let setAsteroidPosition = asteroid => {
  let maxWidth = container.offsetWidth - asteroid.offsetWidth
  let randomPosition = Math.floor(Math.random() * (maxWidth - 1) + 1)
  asteroid.style.left = randomPosition + 'px'
  setTimeout(() => {
    asteroid.style.bottom = window.innerHeight + 140 + 'px'
  }, 1)
}

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

//Gameover Popup
let gameoverFunc = () => {
  gameover.style.display = 'flex';
  
  // Убедитесь, что элемент play правильно выбран из gameover
  let playButton = gameover.querySelector('.play');
  
  playButton.addEventListener('click', e => {
    restartGame()
   // Прячем окно gameover
  gameover.style.display = 'none';
  });
}
 
// Restart Game
const restartGame = () => {
  stars = 3;
  counter.textContent = '0';
  showStars();
};

// No stars before game
const noStars =() => {
  stars = 0;
}



//Removes stars
let removeStars = () => {
  if (stars > 1) {
    lives.removeChild(star)
    stars--
    console.log(stars)
  } else if (stars === 1) {
    console.log('egual 1')
    lives.removeChild(star)
    stars--
    gameoverFunc()
    
  } 
  } 

 
  
// Button Play 
window.addEventListener('load', () => {
    const startGameButtonContainer = document.querySelector('.startgameButtonContainer');
    const playButton = startGameButtonContainer.querySelector('.play');
    noStars ()
    // Показать экран "Start Game"
    startGameButtonContainer.style.display = 'flex';
    // Обработка нажатия кнопки "Play" для начала игры
    playButton.addEventListener('click', () => {
      startGameButtonContainer.style.display = 'none'; // Скрыть экран "Start Game"
      // Запустить игру
      restartGame()
    });
    
  });


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
  asteroidElement = document.createElement('img')
  asteroidElement.classList.add('asteroid')
  asteroidElement.setAttribute('draggable', 'false')
  return asteroidElement
}

//Full asteroid functionality
let asteroidFunction = () => {
  let asteroid = createAsteroid()
  container.append(asteroid)
  setAsteroidShape(asteroid)
  setAsteroidPosition(asteroid)
  removeAsteroid(asteroid)
}

showStars()
let nameStorage = localStorage.getItem('name')
console.log(nameStorage)
if (nameStorage) {
  playerLabel.textContent = nameStorage
  asteroidFunction()
  document.addEventListener('click', () => {
    laserShot()
  })
} else {
  playerNameContainer.style.display = 'flex'
  playerPlay.addEventListener('click', () => {
    playerName = playerInput.value
    if (playerName) {
      localStorage.setItem('name', playerName)
      playerLabel.textContent = playerName
      playerNameContainer.style.display = 'none'
      asteroidFunction()
      //Mouse laser shot event listener
      document.addEventListener('click', () => {
        laserShot()
      })
    }
  })
}

//Music playback start after 3 seconds
let musicPlay = setTimeout(() => {
  audio.play()
  audio.volume = 0.1
}, 4000)

//Toggle music
toggleMusic.addEventListener('click', () => {
  if (audio.paused) {
    muteSpeaker.style.opacity = '0'
    return audio.play()
  }
  audio.pause()
  audio.currentTime = 0
  muteSpeaker.style.opacity = '1'
})

//Keyboard ship movement
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    if (ship.offsetLeft - 25 >= 0) {
      ship.style.left = ship.offsetLeft - 25 + 'px';
    } else {
      ship.style.left = '0px';
    }
  }
  if (event.key === 'ArrowRight') {
    ship.style.left = ship.offsetLeft + 25 + 'px'
  }
  if (event.key === ' ') {
    console.log('Space')
  }
})

//Mouse ship movement
document.addEventListener('mousemove', event => {
  ship.style.left = event.clientX - 25 + 'px'
  document.addEventListener('mousemove', event => {
    // Рассчитываем новую позицию по горизонтали
    let newLeft = event.clientX -7;
  
    // Проверяем, не выходит ли котик за правый край
    if (newLeft + ship.offsetWidth > window.innerWidth) {
      newLeft = window.innerWidth - ship.offsetWidth;
    }
  
    // Устанавливаем новую позицию
    ship.style.left = newLeft + 'px';
  }); 
})

//Touch ship movement
ship.addEventListener('touchmove', event => {
  if (Math.floor(event.touches[0].clientX) > window.innerWidth * 0.7) {
  } else {
    ship.style.left = Math.floor(event.touches[0].clientX) + 'px'
  }
})

//Earth background
earth.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/earth.mp4')
  videoContainer.load()
})
//Mars background
mars.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/mars.mp4')
  videoContainer.load()
})
//Space background
space.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/galaxy.mp4')
  videoContainer.load()
})
  

// Плавное движение корабля
ship.style.transition = 'left 0.05s';

// Keyboard ship movement
document.addEventListener('keydown', event => {
  const shipSpeed = 100; // Скорость движения корабля
  const shipRect = ship.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Определение направления движения
  let moveLeft = false;
  let moveRight = false;

  // Установка флага направления в зависимости от нажатой клавиши
  if (event.key === 'ArrowLeft' || event.key === 'a') {
    moveLeft = true;
  }
  if (event.key === 'ArrowRight' || event.key === 'd') {
    moveRight = true;
  }
  
  // Двигаем влево
  if (moveLeft) {
    ship.style.left = `${Math.max(0, shipRect.left - containerRect.left - shipSpeed)}+100px`;
  }
  // Двигаем вправо
  if (moveRight) {
    ship.style.left = `${Math.min(containerRect.width - shipRect.width, shipRect.left - containerRect.left + shipSpeed)}+100px`;
  }
  // Лазерный выстрел
  if (event.key === ' ' || event.key === ' ') {
    laserShot();
  }
});



