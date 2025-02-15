const colors = ["red", "green", "blue", "yellow"];
let colorSequence = [];
let playerSequence = [];
let level = 0;
let score = 0;
let highScore = 0;
let playerName = "";

const playSound = (color) => {
  const soundMap = {
    red: "sounds/sonido_rojo.mp3",
    green: "sounds/sonido_verde.mp3",
    blue: "sounds/sonido_azul.mp3",
    yellow: "sounds/sonido_amarillo.mp3",
  };
  const audio = new Audio(soundMap[color]);
  audio.play();
};
/* Función que permite reproducir el sonido asignado por color*/

const flashColor = (color) => {
  const button = document.getElementById(`btn-${color}`);
  button.style.opacity = "1";
  setTimeout(() => {
    button.style.opacity = "0.5";
  }, 500);
};
/*Funcion que permite que el boton tenga el efecto de que esta 
flasheando cuando lo clickean*/

const updateScore = (points) => {
  score += points;
  document.getElementById("current-score").innerText = score;
};
/*Funcion que permite actualizar los puntos obtenidos y
su visualizacion.*/

const saveHighScore = () => {
  const storedHighScore = localStorage.getItem(playerName);
  if (!storedHighScore || score > storedHighScore) {
    localStorage.setItem(playerName, score);
    highScore = score;
    document.getElementById("best-score").innerText = highScore;
  }
};
/*Funcion que permite guardar el mejor puntaje con el uso de
localStorage*/

const displayHighScores = () => {
  const scoreList = document.getElementById("lista-puntajes");
  scoreList.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    const name = localStorage.key(i);
    const score = localStorage.getItem(name);
    const listItem = document.createElement("tr");
    listItem.innerHTML = `<td>${name}</td><td>${score}</td>`;
    scoreList.appendChild(listItem);
  }
};
/*Funcion que permite mostrar los mejores puntajes del juego*/

const checkPlayerSequence = () => {
  for (let i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] !== colorSequence[i]) {
      alert(
        "Game Over. Te equivocaste, el juego ha terminado, intenta nuevamente."
      );
      saveHighScore();
      document.getElementById("pantalla-juego").style.display = "none";
      document.getElementById("pantalla-inicial").style.display = "block";
      return false;
    }
  }
  if (playerSequence.length === colorSequence.length) {
    updateScore(level);
    setTimeout(nextLevel, 1000);
  }
  return true;
};
/*Funcion que permite verificar que la secuencia del jugador 
sea igual a la secuencia dada por el juego*/

const playSequence = () => {
  colorSequence.forEach((color, index) => {
    setTimeout(() => {
      flashColor(color);
      playSound(color);
    }, (index + 1) * 1000);
  });
};
/*Funcion que permite mostrar la secuencia que se debe jugar*/

const nextLevel = () => {
  level++;
  document.getElementById("level").innerText = level;
  playerSequence = [];
  colorSequence.push(colors[Math.floor(Math.random() * colors)]);
  playSequence();
};
/*Funcion que permite que se avance de nivel, agregando un nuevo color a la 
secuencia que ya estaba y la reproduce de nuevo agregando el nuevo color*/

const resetGame = () => {
  colorSequence = [];
  playerSequence = [];
  level = 0;
  score = 0;
  document.getElementById("level").innerText = level;
  document.getElementById("current-score").innerText = score;
  document.getElementById("pantalla-juego").style.display = "none";
  document.getElementById("pantalla-inicial").style.display = "block";
};
/*Funcion que permite reiniciar el juego*/

const isValidName = (name) => {
  const regex = /^[a-zA-Z0-9\s]+$/;
  return regex.test(name) && name.trim().length > 0;
};
/*Funcion que permite validar el nombre del jugador*/

document.getElementById("submit-name").addEventListener("click", (Event) => {
  Event.preventDefault();
  playerName = document.getElementById("player-name").value.trim();
  if (isValidName(playerName)) {
    document.getElementById("pantalla-inicial").style.display = "none";
    document.getElementById("pantalla-juego").style.display = "block";
    colorSequence = [];
    playerSequence = [];
    level = 0;
    score = 0;
    document.getElementById("level").innerText = level;
    document.getElementById("current-score").innerText = score;
    document.getElementById("best-score").innerText =
      localStorage.getItem(playerName) || 0;
    nextLevel();
  } else {
    alert(
      "Por favor, ingrese su nombre. Y asegurese de no tener caracteres distintos a numeros o letras"
    );
  }
});
/*Evento que permite iniciar el juego cuando el jugador ingresa
su nombre*/

document.getElementById("restart-button").addEventListener("click", () => {
  displayHighScores();
  document.getElementById("pantalla-juego").style.display = "none";
  document.getElementById("tabla-puntajes").style.display = "block";
  document.getElementById("pantalla-inicial").style.display = "block";
  resetGame();
});
/*Evento que muestra la tabla de puntajes altos y que posteriormente
permite que se reinicie el juego.*/

document.querySelectorAll(".color-button").forEach((button) => {
  button.addEventListener("click", (Event) => {
    const color = Event.target.id.replace("btn-", "");
    if (colors.includes(color)) {
      playSound(color);
      flashColor(color);
      playerSequence.push(color);
      checkPlayerSequence();
    }
  });
});
/*Evento que se activa cuando se hace click a cualquiera de los 
4 botones de colores. Permite que verifique el sonido, efecto 
de flash, agrega el color a la secuencia del jugador y verifica
si la secuencia es correcta.*/
