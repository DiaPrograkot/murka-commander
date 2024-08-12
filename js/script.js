let container = document.querySelector('.container');
let playerNameContainer = document.querySelector('.playerNameContainer');
let playerInput = document.querySelector('.playerInput');
let playerName = '';
let playerPlay = document.querySelector('.playerPlay');
let playerLabel = document.querySelector('.playerLabel');
let ship = document.querySelector('.ship');
let gameover = document.querySelector('.gameover');
let audio = document.querySelector('.audio');
let lasersound = document.querySelector('.lasersound');
let crash = document.querySelector('.crash');
let counter = document.querySelector('.counter');
let toggleMusic = document.querySelector('.toggleMusic');
let muteSpeaker = toggleMusic.querySelector('.muteSpeaker');
let musicButton = toggleMusic.querySelector('.musicButton');
let play = document.querySelector('.play');
let earth = document.querySelector('.earthImg');
let mars = document.querySelector('.marsImg');
let space = document.querySelector('.spaceImg');
let lives = document.querySelector('.lives');
let videoContainer = document.querySelector('.videoContainer');
let videoSource = videoContainer.querySelector('source');
let star;

let asteroidElement;
let asteroidShapeNumber;
let asteroidShapeSize;
let asteroidShape;
let asteroidX;
let asteroidY;
let stars = 3;

// Display stars
let showStars = () => {
  lives.innerHTML = '';
  while (stars > 0) {
    star = document.createElement('img');
    star.setAttribute('src', 'img/paw.png');
    star.classList.add('star');
    lives.append(star);
    stars--;
  }
  stars = 3;
};

let setCounter = () => {
  counter.textContent = parseInt(counter.textContent) + 1;
};

// Plays laser sound
let laserSound = () => {
  lasersound.pause();
  lasersound.currentTime = 0;
  lasersound.volume = 0.1;
  lasersound.play();
};

// Remove laser when asteroid is hit
let removeLaser = laser => {
  if (laser) {
    container.removeChild(laser);
  }
};

// Remove lasers when they hit the bottom of the window
let removeLasers = () => {
  let oldLasers = document.querySelectorAll('.laser');
  for (let i = 0; i < oldLasers.length; i++) {
    let laser = oldLasers[i];
    if (laser.offsetTop <= -10) {
      container.removeChild(laser);
    }
  }
};

// Laser movement without using id
let laserMovement = laser => {
  laser.style.top = window.innerHeight + 'px';
  let laserInterval = setInterval(() => {
    let asteroids = document.querySelectorAll('.asteroid');

    for (let i = 0; i < asteroids.length; i++) {
      let currentAsteroid = asteroids[i];
      let laserRect = laser.getBoundingClientRect();
      let asteroidRect = currentAsteroid.getBoundingClientRect();

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
          break; // Выходим из цикла после попадания
        }
      }
    }
  }, 10);
};

// Create laser and initial positioning
let createLaser = () => {
  let laser = document.createElement('img');
  laser.classList.add('laser');
  laser.setAttribute('src', 'img/bullet.svg');
  container.insertAdjacentElement('beforeend', laser);
  laser.style.left = ship.offsetLeft + 40 + 'px';
  laserMovement(laser);
};

// Lasershot function
let laserShot = () => {
  let asteroidExists = document.querySelector('.asteroid');
  if (asteroidExists) {
    createLaser();
    removeLasers();
    laserSound();
  }
};

// Set the asteroid position
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

// Gameover Popup
let gameoverFunc = () => {
  gameover.style.display = 'flex';
  play.addEventListener('click', e => {
    location.reload();
  });
};

// Removes stars
let removeStars = () => {
  if (stars > 1) {
    lives.removeChild(star);
    stars--;
    console.log(stars);
  } else if (stars === 1) {
    console.log('equal 1');
    lives.removeChild(star);
    stars--;
    gameoverFunc();
  }
};

let timeoutFunc = asteroid => {
  let asteroidPosition = asteroid.offsetTop;
  if (asteroidPosition <= -80) {
    if (container.contains(asteroid)) {
      container.removeChild(asteroid);

      star = document.querySelector('.star');
      removeStars();
      asteroidFunction();
      return;
    }
  }
  setTimeout(() => timeoutFunc(asteroid), 1000);
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
  container.append(asteroid);
  setAsteroidShape(asteroid);
  setAsteroidPosition(asteroid);
  removeAsteroid(asteroid);
};

showStars();
let nameStorage = localStorage.getItem('name');
console.log(nameStorage);
if (nameStorage) {
  playerLabel.textContent = nameStorage;
  asteroidFunction();
  document.addEventListener('click', () => {
    laserShot();
  });
} else {
  playerNameContainer.style.display = 'flex';
  playerPlay.addEventListener('click', () => {
    playerName = playerInput.value;
    if (playerName) {
      localStorage.setItem('name', playerName);
      playerLabel.textContent = playerName;
      playerNameContainer.style.display = 'none';
      asteroidFunction();
      // Mouse laser shot event listener
      document.addEventListener('click', () => {
        laserShot();
      });
    }
  });
}

// Music playback start after 3 seconds
let musicPlay = setTimeout(() => {
  audio.play();
  audio.volume = 0.1;
}, 4000);

// Toggle music
toggleMusic.addEventListener('click', () => {
  if (audio.paused) {
    muteSpeaker.style.opacity = '0';
    return audio.play();
  }
  audio.pause();
  audio.currentTime = 0;
  muteSpeaker.style.opacity = '1';
});

// Keyboard ship movement
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    ship.style.left = ship.offsetLeft - 40 + 'px';
  }
  if (event.key === 'ArrowRight') {
    ship.style.left = ship.offsetLeft + 40 + 'px';
  }
  if (event.key === ' ') {
    console.log('Space');
  }
});

// Mouse ship movement
document.addEventListener('mousemove', event => {
  ship.style.left = event.clientX - 60 + 'px';
});

// Touch ship movement
ship.addEventListener('touchmove', event => {
  if (Math.floor(event.touches[0].clientX) > window.innerWidth - 100) {
    ship.style.left = window.innerWidth - 100 + 'px';
  } else {
    ship.style.left = Math.floor(event.touches[0].clientX) + 'px';
  }
});

