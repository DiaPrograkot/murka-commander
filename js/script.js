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

// Initialize score
let score = 0;

// Update score function
let updateScore = () => {
  score++;
  document.getElementById('score').innerText = score;
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
  let lasers = document.querySelectorAll('.laser');
  lasers.forEach(laser => {
    if (laser.offsetTop >= window.innerHeight) {
      container.removeChild(laser);
    }
  });
};

// Laser movement (now moving downward)
let laserMovement = (laser, asteroid) => {
  let laserInterval = setInterval(() => {
    laser.style.top = laser.offsetTop + 10 + 'px';  // Теперь пули движутся вниз

    if (
      laser.offsetTop >= asteroid.offsetTop &&
      laser.offsetTop <= asteroid.offsetTop + asteroid.offsetHeight &&
      laser.offsetLeft > asteroid.offsetLeft - asteroid.offsetWidth / 2 &&
      laser.offsetLeft < asteroid.offsetLeft + asteroid.offsetWidth
    ) {
      removeLaser(laser);
      if (asteroid.offsetWidth > 80) {
        asteroid.style.width = asteroid.offsetWidth - 40 + 'px';
        asteroid.style.height = asteroid.offsetHeight - 40 + 'px';
      } else {
        crash.play();
        crash.volume = 0.1;
        container.removeChild(asteroid);
        updateScore();
        asteroidFunction();
        clearInterval(laserInterval);
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
  laser.style.top = ship.offsetTop + 110 + 'px';
  let asteroid = document.querySelector('.asteroid');  // Assuming you have only one asteroid at a time
  laserMovement(laser, asteroid);
};

// Laser shot function
let laserShot = () => {
  createLaser();
  removeLasers();
  laserSound();
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
  let asteroidShapeNumber = Math.floor(Math.random() * 9) + 1;
  let asteroidShapeSize = Math.floor(Math.random() * 16) + 4;
  let asteroidShape;
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
  ship.style.left = event.touches[0].clientX - 60 + 'px';
});

// Video background switcher
earth.addEventListener('click', () => {
  videoSource.src = 'video/earth.mp4';
  videoContainer.load();
});
mars.addEventListener('click', () => {
  videoSource.src = 'video/mars.mp4';
  videoContainer.load();
});
space.addEventListener('click', () => {
  videoSource.src = 'video/space.mp4';
  videoContainer.load();
}); 

