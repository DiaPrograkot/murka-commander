// Определение переменных
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

let loss = false;
// Переменные состояния
let moveLeft = false;
let moveRight = false;
let isSpacePressed = false;
let canShoot = true;
let isLaserPlaying = false;
let stars = 3;

// Отображение звезд
let showStars = () => {
  lives.innerHTML = '';
  for (let i = 0; i < stars; i++) {
    star = document.createElement('img');
    star.setAttribute('src', 'img/paw.png');
    star.classList.add('star');
    lives.append(star);
  }
};

// Обновление счетчика
let setCounter = () => {
  counter.textContent = parseInt(counter.textContent) + 1;
};

// Воспроизведение звука лазера
let laserSound = async () => {
  if (isLaserPlaying) return;

  isLaserPlaying = true;
  try {
    if (!lasersound.paused) {
      lasersound.pause();
      lasersound.currentTime = 0;
    }
    lasersound.volume = 0.1;
    await lasersound.play();
  } catch (error) {
    console.error("Ошибка воспроизведения лазера:", error);
  } finally {
    isLaserPlaying = false;
  }
};

// Удаление лазера
let removeLaser = laser => {
  if (laser && laser.parentNode === container) {
    container.removeChild(laser);
  }
};

// Удаление лазеров внизу окна
let removeLasers = () => {
  document.querySelectorAll('.laser').forEach(laser => {
    if (laser.getBoundingClientRect().top >= window.innerHeight) {
      removeLaser(laser);
    }
  });
};

// Движение лазера
let laserMovement = laser => {
  laser.style.top = window.innerHeight + 'px';
  let laserInterval = setInterval(() => {
    let asteroids = document.querySelectorAll('.asteroid');

    asteroids.forEach(currentAsteroid => {
      if (
        laser.offsetTop <= currentAsteroid.offsetTop + currentAsteroid.offsetHeight - 10 &&
        laser.offsetTop >= currentAsteroid.offsetTop &&
        laser.offsetLeft > currentAsteroid.offsetLeft - currentAsteroid.offsetWidth / 2 &&
        laser.offsetLeft < currentAsteroid.offsetLeft + currentAsteroid.offsetWidth
      ) {
        removeLaser(laser);
        if (container.contains(currentAsteroid)) {
          if (currentAsteroid.offsetWidth > 80) {
            currentAsteroid.style.width = (currentAsteroid.offsetWidth - 40) + 'px';
            currentAsteroid.style.height = (currentAsteroid.offsetHeight - 40) + 'px';
          } else {
            crash.play();
            crash.volume = 0.1;
            container.removeChild(currentAsteroid);
            setCounter();
            asteroidFunction();
          }
        }
        clearInterval(laserInterval); // Прекратить движение лазера после попадания
      }
    });
  }, 50);
};


// Создание лазера
let createLaser = (asteroidId) => {
  let laser = document.createElement('img');
  laser.classList.add('laser');
  laser.setAttribute('src', 'img/bullet.svg');
  container.append(laser);
  laser.setAttribute('data-asteroid-id', asteroidId);
  laser.style.left = `${ship.offsetLeft + 46}px`;
  laser.style.visibility = 'visible';
  laserMovement(laser);
};

// Обработка стрельбы
let laserShot = () => {
  if (canShoot) {
    let asteroidId = document.querySelector('.asteroid')?.getAttribute('data-id');
    if (asteroidId) {
      createLaser(asteroidId);
      removeLasers();
      laserSound();
      canShoot = false;
      setTimeout(() => { canShoot = true; }, 1); // через 1 мс игрок сможет снова стрелять
    }
  }
};

// Установка позиции астероида
let setAsteroidPosition = asteroid => {
  let maxWidth = container.offsetWidth - asteroid.offsetWidth;
  let randomPosition = Math.floor(Math.random() * (maxWidth - 1) + 1);
  asteroid.style.left = randomPosition + 'px';
  setTimeout(() => {
    asteroid.style.bottom = window.innerHeight + 155 + 'px';
  }, 1);
};

// Установка формы астероида
let setAsteroidShape = asteroid => {
  let shapes = [
    'img/asteroid-purple.svg',
    'img/green-asteroid.svg',
    'img/orange-meteorite.svg',
    'img/asteroid-black.svg',
    'img/rock.svg',
    'img/meteorite-white.svg',
    'img/lightorange-asteroid.svg',
    'img/rocky-asteroid.svg',
    'img/purple-asteroid.svg'
  ];
  let size = Math.floor(Math.random() * 16) + 4;
  let shape = shapes[Math.floor(Math.random() * shapes.length)];
  asteroid.setAttribute('src', shape);
  asteroid.style.height = `${size}rem`;
  asteroid.style.width = `${size}rem`;
};

// Обработка клавиатуры для стрельбы
let handleLaserShotKey = (event) => {
  if (event.key === ' ' && !isSpacePressed) {
    laserShot();
    isSpacePressed = true;
    setTimeout(() => {
      isSpacePressed = false; 
    }, 1);
  }
};

document.addEventListener('keydown', event => {  
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {  
    moveLeft = true;
  }  
  if (event.code === 'ArrowRight' || event.code === 'KeyD') {  
    moveRight = true;
  }  
});

document.addEventListener('keyup', event => {  
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {  
    moveLeft = false;
  }  
  if (event.code === 'ArrowRight' || event.code === 'KeyD') {  
    moveRight = false;
  }  
});

// Анимация
function animate() {
  const rect = ship.getBoundingClientRect();
  if (moveLeft && rect.left > 0) {
    ship.style.left = ship.offsetLeft - 9 + 'px';
  }
  if (moveRight && rect.right < window.innerWidth) {
    ship.style.left = ship.offsetLeft + 9 + 'px';
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Движение корабля мышью
const moveShip = (clientX) => {
  const containerRect = container.getBoundingClientRect();
  const shipRect = ship.getBoundingClientRect();
  let newLeft = clientX - 60;
  if (newLeft < 0) newLeft = 0;
  else if (newLeft + shipRect.width > containerRect.width) newLeft = containerRect.width - shipRect.width;
  ship.style.left = newLeft + 'px';
};

document.addEventListener('mousemove', event => moveShip(event.clientX));
ship.addEventListener('touchmove', event => moveShip(event.touches[0].clientX));

// Изменение фона видео
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

// Удаление звезд
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

// Функция тайм-аута для астероида
let timeoutFunc = asteroid => {
  if (asteroid.offsetTop <= -80) {
    if (container.contains(asteroid)) {
      container.removeChild(asteroid);
      removeStars();
      asteroidFunction();
    }
  } else {
    setTimeout(() => timeoutFunc(asteroid), 1000);
  }
};

// Удаление астероида
let removeAsteroid = asteroid => {
  setTimeout(() => timeoutFunc(asteroid), 3000);
};

// Создание астероида
let createAsteroid = () => {
  let asteroidElement = document.createElement('img');
  asteroidElement.classList.add('asteroid');
  asteroidElement.setAttribute('draggable', 'false');
  return asteroidElement;
};

// Полная функциональность астероида
let asteroidFunction = () => {
  if (!loss){
  let asteroid = createAsteroid();
  let asteroidId = Date.now();
  asteroid.setAttribute('data-id', asteroidId);
  container.append(asteroid);
  setAsteroidShape(asteroid);
  setAsteroidPosition(asteroid);
  removeAsteroid(asteroid);
  return asteroidId;
  }
};

// Начало игры
let startGame = () => {
  ship.style.visibility = 'visible';
  asteroidFunction();
  document.addEventListener('click', laserShot);
  document.addEventListener('keydown', handleLaserShotKey);
  document.addEventListener('keyup', handleLaserShotKey);
};

// Окончание игры
let gameoverFunc = () => {
  loss = true
  gameover.style.display = 'flex';
  ship.style.visibility = 'hidden';
  isSpacePressed = false;
  canShoot = false;
  document.removeEventListener('keydown', handleLaserShotKey);
  document.removeEventListener('keyup', handleLaserShotKey);
  document.removeEventListener('click', laserShot);
  play.addEventListener('click', startNewGame);
};

// Начало новой игры
let startNewGame = () => {
  loss = false
  asteroidFunction();
  ship.style.visibility = 'visible';
  stars = 3;
  counter.textContent = '0';
  showStars();
  gameover.style.display = 'none';
  isSpacePressed = false;
  canShoot = true;
  document.addEventListener('click', laserShot);
  document.addEventListener('keydown', handleLaserShotKey);
  document.addEventListener('keyup', handleLaserShotKey);
};

// Стартовая заставка игры
let startgameFunc = () => {
  startgame.style.display = 'flex';
  startplay.addEventListener('click', () => {
    startgame.style.display = 'none';
    startGame();
    document.addEventListener('click', () => {
      audio.play().catch(error => {
        console.error("Ошибка воспроизведения музыки:", error);
      });
    }, { once: true });
  });
};

// Проверка имени игрока и запуск игры
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

// Управление музыкой
let musicPlay = () => {
  document.addEventListener('click', () => {
    audio.play().catch(error => {
      console.error("Ошибка воспроизведения музыки:", error);
    });
  }, { once: true });
};
setTimeout(musicPlay, 3000);

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
