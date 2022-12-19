const highScoresList = document.querySelector('.high-scores-list');

// Get the High scores from the local storage and convert it to an object, if null === []
const highScores = JSON.parse(localStorage.getItem("HighScores")) || [];

// List out the 5 highest scores
highScoresList.innerHTML = highScores.map(score => {
  return `<li class="list-score">${score.name.toUpperCase()} - ${score.score}</li>`
}).join('');