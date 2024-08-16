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

let asteroidElement
let asteroidShapeNumber
let asteroidShapeSize
let asteroidShape
let asteroidX
let asteroidY
let stars = 3

// Display stars
let showStars = () => {
  lives.innerHTML = ''
  while (stars > 0) {
    star = document.createElement('img')
    star.setAttribute('src', 'img/paw.png')
    star.classList.add('star')
    lives.append(star)
    setTimeout(stars--, 4);
  }
  stars = 3
}

let setCounter = () => {
  counter.textContent = parseInt(counter.textContent) + 1
}

// Plays laser sound
let laserSound = () => {
  lasersound.pause()
  lasersound.currentTime = 0
  lasersound.volume = 0.1
  lasersound.play()
}

// Remove laser when asteroid is hit
let removeLaser = laser => {
  if (laser) {
    container.removeChild(laser)
  }
}

// Remove lasers when hit the bottom of the window
let removeLasers = () => {
  let oldLasers = document.querySelectorAll('.laser')
  for (let oldLaser of oldLasers) {
    if (oldLaser.getBoundingClientRect().top >= window.innerHeight) {
      oldLaser.remove()
    }
  }
}

// Laser movement
let laserMovement = laser => {
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
        // Make asteroid smaller when hit
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

// Create laser and initial positioning
let createLaser = () => {
  let laser = document.createElement('img')
  laser.classList.add('laser')
  laser.setAttribute('src', 'img/bullet.svg')
  container.insertAdjacentElement('beforeend', laser)
  laser.style.left = ship.offsetLeft + 45 + 'px'
  laserMovement(laser)
}

// Lasershot function
let laserShot = () => {
  createLaser()
  removeLasers()
  laserSound()
}

// Set the asteroid position
let setAsteroidPosition = asteroid => {
  let maxWidth = container.offsetWidth - asteroid.offsetWidth
  let randomPosition = Math.floor(Math.random() * (maxWidth - 1) + 1)
  asteroid.style.left = randomPosition + 'px'
  setTimeout(() => {
    asteroid.style.bottom = window.innerHeight + 140 + 'px'
  }, 1)
}

// Set asteroid shape
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

let isGameRunning = false; // Флаг, показывающий, идет ли игра

// Запуск игры при клике на кнопку "Play"
play.addEventListener('click', () => {
  isGameRunning = true; // Устанавливаем флаг, что игра началась
  gameover.style.display = 'none'; // Скрываем экран "Game Over"
  ship.style.display = 'block'; // Показываем корабль
  counter.textContent = 0; // Сбрасываем счетчик
  startGame(); // Запускаем игру
});
// Функция завершения игры
let gameoverFunc = () => {
  isGameRunning = false; // Останавливаем игру
  stars = 3
  ship.style.display = 'none';
  gameover.style.display = 'flex';
  showStars()
}


// Remove stars
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

let timeoutFunc = asteroid => {
  let asteroidPosition = asteroid.offsetTop
  if (asteroidPosition <= -80) {
    if (container.contains(asteroid)) {
      container.removeChild(asteroid)

      star = document.querySelector('.star')
      removeStars()
      
    }
  }
  setTimeout(() => timeoutFunc(asteroid), 1000)
}

// Remove asteroid
let removeAsteroid = asteroid => {
  setTimeout(() => {
    timeoutFunc(asteroid);
    asteroidActive = false; // Сбрасываем флаг активности после удаления астероида
    setTimeout(asteroidFunction, 1000);// Вызываем функцию снова для создания следующего астероида
  }, 3000);
}

// Create asteroid
let createAsteroid = () => {
  asteroidElement = document.createElement('img')
  asteroidElement.classList.add('asteroid')
  asteroidElement.setAttribute('draggable', 'false')
  return asteroidElement
}

let asteroidActive = false; // Флаг активности астероида

// Full asteroid functionality
let asteroidFunction = () => {
  if (isGameRunning && !asteroidActive) {
    asteroidActive = true;
    let asteroid = createAsteroid();
    container.append(asteroid);
    setAsteroidShape(asteroid);
    setAsteroidPosition(asteroid);
    removeAsteroid(asteroid);
  }
}

// Start game
let startGame = () => {
  showStars();
  asteroidFunction();
  document.addEventListener('click', () => {
    if (isGameRunning) {
      laserShot();
    }
  });
}

// Initialize game
let nameStorage = localStorage.getItem('name')
console.log(nameStorage)
if (nameStorage) {
  gameoverFunc()
} else {
  playerNameContainer.style.display = 'flex'
  playerPlay.addEventListener('click', () => {
    playerName = playerInput.value
    if (playerName) {
      localStorage.setItem('name', playerName)
      playerLabel.textContent = playerName
      playerNameContainer.style.display = 'none'
      startGame()
    }
  })
}

// Music playback start after 3 seconds
let musicPlay = setTimeout(() => {
  audio.play()
  audio.volume = 0.1
}, 4000)

// Toggle music
toggleMusic.addEventListener('click', () => {
  if (audio.paused) {
    muteSpeaker.style.opacity = '0'
    return audio.play()
  }
  audio.pause()
  audio.currentTime = 0
  muteSpeaker.style.opacity = '1'
})

let isMovingLeft = false;
let isMovingRight = false;
let speed = 9; // Скорость движения корабля

// Обработка нажатия клавиш
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    isMovingLeft = true;
  }
  if (event.key === 'ArrowRight') {
    isMovingRight = true;
  }
  if (event.key === 'ArrowDown') {
    laserShot();
  }
});

document.addEventListener('keyup', event => {
  if (event.key === 'ArrowLeft') {
    isMovingLeft = false;
  }
  if (event.key === 'ArrowRight') {
    isMovingRight = false;
  }
});

const moveShip = () => {
  const containerRect = container.getBoundingClientRect();
  const shipRect = ship.getBoundingClientRect();

  if (isMovingLeft) {
    let newLeft = ship.offsetLeft - speed; // Плавное движение влево
    if (newLeft >= 0) {
      ship.style.left = newLeft + 'px';
    }
  }

  if (isMovingRight) {
    let newLeft = ship.offsetLeft + speed; // Плавное движение вправо
    if (newLeft + shipRect.width <= containerRect.width) {
      ship.style.left = newLeft + 'px';
    }
  }

  requestAnimationFrame(moveShip);
};

moveShip();

// Mouse ship movement with boundary checks
document.addEventListener('mousemove', event => {
  const containerRect = container.getBoundingClientRect();
  const shipRect = ship.getBoundingClientRect();
  let newLeft = event.clientX - 60;

  if (newLeft < 0) {
    newLeft = 0;
  } else if (newLeft + shipRect.width > containerRect.width) {
    newLeft = containerRect.width - shipRect.width;
  }

  ship.style.left = newLeft + 'px';
});

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

// Earth background
earth.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/earth.mp4');
  videoContainer.load();
});

// Mars background
mars.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/mars.mp4');
  videoContainer.load();
});

// Space background
space.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/galaxy.mp4');
  videoContainer.load();
})
