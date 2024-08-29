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

let isPaused = false;

let loss = false;
// Переменные состояния
let moveLeft = false;
let moveRight = false;
let isSpacePressed = false;
let canShoot = true;
let isLaserPlaying = false;
let stars = 3;
let difficulty = 'medium'; // Значение по умолчанию

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
  if (!loss){
  counter.textContent = parseInt(counter.textContent) + 1;
  }
  return counter.textContent
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
  if (canShoot & !isPaused) {
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

let moveAsteroid = (asteroid) => {
  const animate = () => {
    if (!isPaused) {
      asteroid.style.top = (parseInt(asteroid.style.top) - asteroidSpeed) + 'px'; // Используйте глобальную переменную asteroidSpeed
    }
    if (parseInt(asteroid.style.top) <= -asteroid.offsetHeight) {
      if (asteroid.parentNode) {
        asteroid.remove(); // Удаляем астероид, если он все еще находится в DOM
        removeStars();
        asteroidFunction();
      }
    } else {
      requestAnimationFrame(animate);
    }
  };
  asteroid.style.top = window.innerHeight + 'px';
  animate();
};


let setAsteroidPosition = asteroid => {
  let maxWidth = container.offsetWidth - asteroid.offsetWidth;
  let randomPosition = Math.floor(Math.random() * (maxWidth - 1) + 1);
  asteroid.style.left = randomPosition + 'px';
  asteroid.style.top = window.innerHeight + 'px'; // Начальное положение астероида за нижней границей экрана
  moveAsteroid(asteroid); // Начало движения вверх
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
const handleLaserShotKey = () => {
  document.addEventListener('keydown', event => {  
     if (event.key === ' '&& !isSpacePressed) { 
      isSpacePressed = !isSpacePressed;
     }
     })
     document.addEventListener('keyup', event => {  
       if (event.key === ' ') { 
        laserShot();
       }
       })
};

document.addEventListener('keydown', event => {  
  event.preventDefault(); // Это предотвращает стандартное поведение клавиши пробела
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
  if (!isPaused) {
    if (moveLeft && rect.left > 0) {
      ship.style.left = ship.offsetLeft - 9 + 'px';
    }
    if (moveRight && rect.right < window.innerWidth) {
      ship.style.left = ship.offsetLeft + 9 + 'px';
    }
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Движение корабля мышью
const moveShip = (clientX) => {
  if (!isPaused) {
  const containerRect = container.getBoundingClientRect();
  const shipRect = ship.getBoundingClientRect();
  let newLeft = clientX - 60;
  if (newLeft < 0) newLeft = 0;
  else if (newLeft + shipRect.width > containerRect.width) newLeft = containerRect.width - shipRect.width;
  ship.style.left = newLeft + 'px';
  }
};

document.addEventListener('mousemove', event => moveShip(event.clientX));
ship.addEventListener('touchmove', event => moveShip(event.touches[0].clientX));

// Изменение фона видео
earth.addEventListener('click', (event) => {
  event.stopPropagation()
  videoSource.setAttribute('src', 'video/earth.mp4');
  videoContainer.load();
});

mars.addEventListener('click', (event) => {
  event.stopPropagation()
  videoSource.setAttribute('src', 'video/mars.mp4');
  videoContainer.load();
});

space.addEventListener('click', (event) => {
  event.stopPropagation()
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

// Установка уровня сложности
const setDifficulty = (level) => {
    difficulty = level; // Сохраняем выбранный уровень сложности
    switch (difficulty) {
        case 'easy':
            stars = 4; // Больше жизней
            asteroidSpeed = 2; // Медленнее астероиды
            break;
        case 'medium':
            stars = 3; // Стандартное количество жизней
            asteroidSpeed = 4; // Средняя скорость астероидов
            break;
        case 'hard':
            stars = 2; // Меньше жизней
            asteroidSpeed = 6; // Быстрые астероиды
            break;
    }
    showStars(); // Обновляем отображение звезд сразу после изменения сложности
     console.log('Current difficulty:', difficulty); // Вывод уровня сложности в консоль
};

// Функции для обработки выбора сложности
const handleEasyClick = () => {
  setDifficulty('easy');
};
const handleMediumClick = () => {
  setDifficulty('medium');
};
const handleHardClick = () => {
  setDifficulty('hard');
};

// Окончание игры
let gameoverFunc = () => {
  loss = true;
  updateRecord();
  gameover.style.display = 'flex';
  ship.style.visibility = 'hidden';
  isSpacePressed = false;
  canShoot = false;
  // Обновляем счет и рекорд
  highscoreNumber.textContent = record;
  highscore.textContent = `Highscore: ${record}`;
  scoreNumber.textContent = `Score: ${setCounter()}`;
  // Подключаем кнопку начала новой игры
  play.addEventListener('click', startNewGame);
};

let startNewGame = () => {
  // Сброс всех параметров игры перед началом новой
  loss = false;
  isSpacePressed = false;
  canShoot = true;
  moveLeft = false;
  moveRight = false;
  counter.textContent = '0';

  // Применение уровня сложности перед началом игры
  setDifficulty(difficulty); // Применяем выбранную сложность

  // Обновляем интерфейс и запускаем игру
  ship.style.visibility = 'visible';
  gameover.style.display = 'none';
  
  // Начинаем создание астероидов после применения сложности
  asteroidFunction();

  // Подключаем обработчики для стрельбы и движения
  document.addEventListener('click', laserShot);
  document.addEventListener('keydown', handleLaserShotKey);
  document.addEventListener('keyup', handleLaserShotKey);
};

// Стартовая заставка игры
let startgameFunc = () => {
  startgame.style.display = 'flex';
  highscoreNumber.textContent = `Highscore: ${record}`;
  // Обработчики кликов для выбора сложности устанавливаются один раз
  document.querySelector('.easy').addEventListener('click', handleEasyClick);
  document.querySelector('.medium').addEventListener('click', handleMediumClick);
  document.querySelector('.hard').addEventListener('click', handleHardClick);
  startplay.addEventListener('click', () => {
    startgame.style.display = 'none';
    setDifficulty(difficulty); // Применяем выбранную сложность
    startGame(); // Начало игры с учетом текущего уровня сложности
  });
};

//Обновление рекорда
let updateRecord = () => {
  let currentScore = parseInt(counter.textContent);
  if (currentScore > record) {
    record = currentScore;
    localStorage.setItem('record', record);
    highscoreNumber.textContent = record;
  }
};

// Проверка имени игрока и запуск игры
showStars();
let nameStorage = localStorage.getItem('name');
let record = localStorage.getItem('record') || 0;
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

toggleMusic.addEventListener('click', (event) => {
  event.stopPropagation();
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

// Управление паузой игры
pauseButton.addEventListener('click', () => {
  isPaused = !isPaused; // Переключение состояния паузы
  pauseButton.textContent = isPaused ? '||' : '▶';
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyP') {
    isPaused = !isPaused; // Переключение состояния паузы
    pauseButton.textContent = isPaused ? '||' : '▶';
  }
});