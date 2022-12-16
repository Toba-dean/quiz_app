// Get reference to the dom.
const question = document.querySelector("#question");
const choiceText = document.querySelectorAll(".choice-text");
const progressText = document.querySelector('#progress-text');
const scoreCount = document.querySelector('.score');
const loader = document.querySelector('#loader');
const game = document.querySelector('#game');
const progressBarFull = document.querySelector('.progress-bar-full');

// All variables needed
let currentQuestion = {}
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

const fetchQuestions = async url => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    questions = data.map(loadedQuestion => loadedQuestion)
    // console.log(questions);
  } catch (error) {
    console.log(error.message);
  }

  startGame()
}

fetchQuestions("/html/questions.json")


const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

const startGame = () => {
  questionCounter = 0;
  score = 0;

  // spread the questions into the availableQuestion array
  availableQuestions = [...questions];
  // console.log(availableQuestions);

  // get the new question
  getNewQuestion();

  // show question
  game.classList.remove('hidden');

  // hide the loader
  loader.classList.add('hidden');
}

const getNewQuestion = () => {
  // check if the questions if finished or the array is empty
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    // set the most recent score to the local storage
    // localStorage.setItem("MostResentScore", score)

    // render the end.html page, since questions is finished
    window.location.assign('/html/end.html')
  }

  // else increment the question
  if (questionCounter < MAX_QUESTIONS) {
    questionCounter++;
  }

  progressText.innerText = `Question: ${questionCounter} / ${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  // get a random number from the total number of questions 
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);

  // get the question at the random index and set it to the current question object
  currentQuestion = availableQuestions[questionIndex];
  // console.log(currentQuestion);

  question.innerText = currentQuestion['Question'];

  // iterate through the options get the dataset number then set the inner text to the currentQuestion choice that match e.g. if number ==== 1 it matches choice1
  choiceText.forEach(choice => {
    const number = choice.dataset['number'];
    choice.innerText = currentQuestion['choice' + number];
  });

  // remove the current question from the available question array.
  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true
}

// iterate through the choice text 
choiceText.forEach(ele => {
  // console.log(ele);
  ele.addEventListener('click', e => {
    // if acceptingAnswer === true do nothing
    if (!acceptingAnswers) {
      return;
    }

    // else set it to false
    acceptingAnswers = false;

    // get a reference to the selected option by user
    const selectedChoice = e.target;

    // get the data number
    const selectedAnswer = selectedChoice.dataset['number'];
    // console.log(selectedAnswer)


    const classToApply = selectedAnswer == currentQuestion['answer'] ? 'correct' : 'incorrect';

    // add a class to the target parent
    selectedChoice.parentElement.classList.add(classToApply);

    // add to score count on every correct answer
    if (classToApply === 'correct') {
      incrementScore(CORRECT_BONUS)
    }

    // get a new question after 1s and remove the added class.
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion()
    }, 500)

  });
});

// increasing the score.
incrementScore = num => {
  score += num;
  scoreCount.innerText = score
}