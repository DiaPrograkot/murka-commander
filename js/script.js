let container = document.querySelector('.container');
let playerNameContainer = document.querySelector('.playerNameContainer');
let playerInput = document.querySelector('.playerInput');
let playerName = '';
let playerPlay = document.querySelector('.playerPlay');
let playerLabel = document.querySelector('.playerLabel');
let ship = document.querySelector('.ship');
let gameover = document.querySelector('.gameover');
let startgame = document.querySelector('.startgame');
let audio = document.querySelector('.audio');
let lasersound = document.querySelector('.lasersound');
let crash = document.querySelector('.crash');
let counter = document.querySelector('.counter');
let toggleMusic = document.querySelector('.toggleMusic');
let muteSpeaker = toggleMusic.querySelector('.muteSpeaker');
let musicButton = toggleMusic.querySelector('.musicButton');
let play = document.querySelector('.play');
let startplay = document.querySelector('.startplay');
let earth = document.querySelector('.earthImg');
let mars = document.querySelector('.marsImg');
let space = document.querySelector('.spaceImg');
let lives = document.querySelector('.lives');
let videoContainer = document.querySelector('.videoContainer');
let videoSource = videoContainer.querySelector('source');
let star;

let moveInterval = null;
let asteroidElement;
let asteroidShapeNumber;
let asteroidShapeSize;
let asteroidShape;
let asteroidX;
let asteroidY;
let stars = 3;

// Flag to prevent overlapping play/pause calls
let isLaserPlaying = false;

// Display stars
let showStars = () => {
  lives.innerHTML = '';
  for (let i = 0; i < stars; i++) {
    star = document.createElement('img');
    star.setAttribute('src', 'img/paw.png');
    star.classList.add('star');
    lives.append(star);
  }
};

// Update counter
let setCounter = () => {
  counter.textContent = parseInt(counter.textContent) + 1;
};

// Play laser sound
let laserSound = async () => {
  if (isLaserPlaying) return; // Prevent overlapping plays

  isLaserPlaying = true;
  try {
    if (!lasersound.paused) {
      lasersound.pause(); // Stop the sound if it is already playing
      lasersound.currentTime = 0; // Reset time to the start
    }
    lasersound.volume = 0.1;
    await lasersound.play(); // Play sound
  } catch (error) {
    console.error("Ошибка воспроизведения лазера:", error);
  } finally {
    isLaserPlaying = false; // Allow next play
  }
};

// Remove laser
let removeLaser = laser => {
  if (laser && laser.parentNode === container) {
    container.removeChild(laser);
  }
};

// Remove lasers at the bottom of the window
let removeLasers = () => {
  let oldLasers = document.querySelectorAll('.laser');
  oldLasers.forEach(oldLaser => {
    if (oldLaser.getBoundingClientRect().top >= window.innerHeight) {
      oldLaser.remove();
    }
  });
};

// Laser movement
let laserMovement = laser => {
  laser.style.top = window.innerHeight + 'px';
  let laserInterval = setInterval(() => {
  let asteroidId = laser.getAttribute('data-asteroid-id'); // Получаем идентификатор астероида
  let currentAsteroid = document.querySelector('.asteroid[data-id="' + asteroidId + '"]'); // Поиск астероида по ID
  if (currentAsteroid) {
    // Определяем границы лазера
    let laserRect = laser.getBoundingClientRect();
    // Определяем границы астероида
    let asteroidRect = currentAsteroid.getBoundingClientRect();
    // Проверка пересечения прямоугольников
    if (laserRect.top < asteroidRect.bottom &&
        laserRect.bottom > asteroidRect.top &&
        laserRect.left < asteroidRect.right &&
        laserRect.right > asteroidRect.left) {

          removeLaser(laser);

      if (container.contains(currentAsteroid)) {
        if (currentAsteroid.offsetWidth > 80) {
          currentAsteroid.style.width = currentAsteroid.offsetWidth - 40 + 'px';
          currentAsteroid.style.height = currentAsteroid.offsetHeight - 40 + 'px';
        } else {
          crash.play();
          crash.volume = 0.1;
          container.removeChild(currentAsteroid);
          setCounter();
          asteroidFunction(); // Создаем новый астероид
        }
        clearInterval(laserInterval);
      }
    }
    }
  }, 10);
}

// Create laser
let createLaser = (asteroidId) => {
  let laser = document.createElement('img');
  laser.classList.add('laser');
  laser.setAttribute('src', 'img/bullet.svg');
  container.insertAdjacentElement('beforeend', laser);
  laser.setAttribute('data-asteroid-id', asteroidId); // Присваиваем идентификатор астероида
  container.insertAdjacentElement('beforeend', laser);
  laser.style.left = ship.offsetLeft + 46 + 'px';
  laser.style.visibility = 'visible';
  laserMovement(laser);
};

// Laser shot function
let laserShot = () => {
  let asteroidId = document.querySelector('.asteroid').getAttribute('data-id');
  createLaser(asteroidId);
  removeLasers();
  laserSound(); // Updated function to handle sound playback
};

// Set asteroid position
let setAsteroidPosition = asteroid => {
  let maxWidth = container.offsetWidth - asteroid.offsetWidth;
  let randomPosition = Math.floor(Math.random() * (maxWidth - 1) + 1);
  asteroid.style.left = randomPosition + 'px';
  setTimeout(() => {
    asteroid.style.bottom = window.innerHeight + 140 + 'px';
  }, 1);
};

// Set asteroid shape
let setAsteroidShape = asteroid => {
  asteroidShapeNumber = Math.floor(Math.random() * 9) + 1;
  asteroidShapeSize = Math.floor(Math.random() * 16) + 4;
  switch (asteroidShapeNumber) {
    case 1:
      asteroidShape = 'img/asteroid-purple.svg';
      break;
    case 2:
      asteroidShape = 'img/green-asteroid.svg';
      break;
    case 3:
      asteroidShape = 'img/orange-meteorite.svg';
      break;
    case 4:
      asteroidShape = 'img/asteroid-black.svg';
      break;
    case 5:
      asteroidShape = 'img/rock.svg';
      break;
    case 6:
      asteroidShape = 'img/meteorite-white.svg';
      break;
    case 7:
      asteroidShape = 'img/lightorange-asteroid.svg';
      break;
    case 8:
      asteroidShape = 'img/rocky-asteroid.svg';
      break;
    case 9:
      asteroidShape = 'img/purple-asteroid.svg';
      break;
    default:
      break;
  }
  asteroid.setAttribute('src', asteroidShape);
  asteroid.style.height = `${asteroidShapeSize}rem`;
  asteroid.style.width = `${asteroidShapeSize}rem`;
};

// Handle keyboard shot
let laserShotKey = event => {
  if (event.key === ' ') {
    laserShot();
  }
};

// Gameover Popup
let gameoverFunc = () => {
  gameover.style.display = 'flex';
  ship.style.visibility = 'hidden';
  document.removeEventListener('click', laserShot);
  document.removeEventListener('keydown', laserShotKey);
  play.removeEventListener('click', startNewGame);
  play.addEventListener('click', startNewGame);
};

// Restart game
let startNewGame = () => {
  ship.style.visibility = 'visible';
  stars = 3;
  counter.textContent = '0';
  showStars();
  gameover.style.display = 'none';
  document.addEventListener('click', laserShot);
  document.addEventListener('keydown', laserShotKey);
};

// Remove stars
let removeStars = () => {
  if (stars > 1) {
    lives.removeChild(lives.querySelector('.star'));
    stars--;
  } else if (stars === 1) {
    lives.removeChild(lives.querySelector('.star'));
    stars--;
    gameoverFunc();
  }
};

// Timeout function for asteroid
let timeoutFunc = asteroid => {
  let asteroidPosition = asteroid.offsetTop;
  if (asteroidPosition <= -80) {
    if (container.contains(asteroid)) {
      container.removeChild(asteroid);
      removeStars();
      asteroidFunction();
    }
  } else {
    setTimeout(() => timeoutFunc(asteroid), 1000);
  }
};

// Remove asteroid
let removeAsteroid = asteroid => {
  setTimeout(() => timeoutFunc(asteroid), 3000);
};

// Create asteroid
let createAsteroid = () => {
  asteroidElement = document.createElement('img');
  asteroidElement.classList.add('asteroid');
  asteroidElement.setAttribute('draggable', 'false');
  return asteroidElement;
};

// Full asteroid functionality
let asteroidFunction = () => {
  let asteroid = createAsteroid();
  let asteroidId = Date.now(); // Генерация уникального идентификатора
  asteroid.setAttribute('data-id', asteroidId); // Присваиваем идентификатор элементу
  container.append(asteroid);
  setAsteroidShape(asteroid);
  setAsteroidPosition(asteroid);
  removeAsteroid(asteroid);
  return asteroidId; // Возвращаем идентификатор
};

// Start game popup
let startgameFunc = () => {
  startgame.style.display = 'flex';
  startplay.addEventListener('click', () => {
    startgame.style.display = 'none';
    startGame();
    // Music playback start after user interaction
    document.addEventListener('click', () => {
      audio.play().catch(error => {
        console.error("Ошибка воспроизведения музыки:", error);
      });
    }, { once: true });
  });
};

// Start game
let startGame = () => {
  ship.style.visibility = 'visible';
  asteroidFunction();
  document.addEventListener('click', laserShot);
  document.addEventListener('keydown', laserShotKey);
};

// Show stars and start game based on player name
showStars();
let nameStorage = localStorage.getItem('name');
if (nameStorage) {
  playerLabel.textContent = nameStorage;
  startgameFunc();
} else {
  playerNameContainer.style.display = 'flex';
  playerPlay.addEventListener('click', () => {
    playerNameContainer.style.display = 'none';
    playerName = playerInput.value;
    if (playerName) {
      localStorage.setItem('name', playerName);
      playerLabel.textContent = playerName;
      startgameFunc();
    }
  });
}

// Music playback start after 3 seconds
let musicPlay = () => {
  document.addEventListener('click', () => {
    audio.play().catch(error => {
      console.error("Ошибка воспроизведения музыки:", error);
    });
  }, { once: true });
};
setTimeout(musicPlay, 3000);

// Toggle music
toggleMusic.addEventListener('click', () => {
  if (audio.paused) {
    muteSpeaker.style.opacity = '0';
    audio.play().then(() => {
      audio.volume = 0.1;
    }).catch(error => {
      console.error("Ошибка воспроизведения музыки:", error);
    });
  } else {
    audio.pause();
    muteSpeaker.style.opacity = '1';
  }
});

// Ship movement with arrow keys
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    if (!moveInterval) {
      moveInterval = setInterval(() => {
        let direction = event.key === 'ArrowLeft' ? -8 : 8;
        let newPosition = ship.offsetLeft + direction;
        if (newPosition >= 0 && newPosition <= container.offsetWidth - ship.offsetWidth) {
          ship.style.left = newPosition + 'px';
        }
      }, 20);
    }
  }
});

document.addEventListener('keyup', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    clearInterval(moveInterval);
    moveInterval = null;
  }
});

// Mouse ship movement
document.addEventListener('mousemove', event => {
  ship.style.left = event.clientX - 60 + 'px';
});

// Touch ship movement
ship.addEventListener('touchmove', event => {
  if (Math.floor(event.touches[0].clientX) > window.innerWidth * 0.7) {
    // Optionally handle touch movement logic here
  } else {
    ship.style.left = Math.floor(event.touches[0].clientX) + 'px';
  }
});

// Background video change
earth.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/earth.mp4');
  videoContainer.load();
});

mars.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/mars.mp4');
  videoContainer.load();
});

space.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/galaxy.mp4');
  videoContainer.load();
});
