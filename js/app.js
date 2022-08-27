import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  get,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js";

let quizDB = JSON.parse(localStorage.getItem("questions")) || [];
console.log("QUIZ: ", quizDB);
const question = document.querySelector(".question");
const option1 = document.querySelector("#option1");
const option2 = document.querySelector("#option2");
const option3 = document.querySelector("#option3");
const option4 = document.querySelector("#option4");
const submit = document.querySelector("#submit");

const answers = document.querySelectorAll(".answer");

const showScore = document.querySelector("#showScore");

let questionCount = 0;
let score = 0;
const db = getDatabase();

const loadPreviousScore = () => {
  let userId = localStorage.getItem("user");

  get(ref(db, "users/" + userId))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.obtainedScore !== undefined && data.totalScore !== undefined) {
          showScore.innerHTML = `
            <h3> You Scored ${data.obtainedScore}/${data.totalScore} </h3>
            <button id="reload-button" class="btn">Play Again </button>
        `;
          showScore.classList.remove("scoreArea");
          submit.setAttribute("disabled", "true");
          const reloadButtonEl = document.querySelector("#reload-button");
          reloadButtonEl.addEventListener("click", reloadQuiz);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

loadPreviousScore();

const loadQuestion = () => {
  const questionList = quizDB[questionCount];

  question.innerText = questionList.question;

  option1.innerText = questionList.a;
  option2.innerText = questionList.b;
  option3.innerText = questionList.c;
  option4.innerText = questionList.d;
};

loadQuestion();

const getCheckAnswer = () => {
  let answer;

  answers.forEach((curAnsElem) => {
    if (curAnsElem.checked) {
      answer = curAnsElem.id;
    }
  });
  return answer;
};

const deselectAll = () => {
  answers.forEach((curAnsElem) => (curAnsElem.checked = false));
};

const reloadQuiz = async () => {
  let userId = localStorage.getItem("user");

  await update(ref(db, "users/" + userId), {
    totalScore: null,
    obtainedScore: null,
  });
  location.reload();
};

submit.addEventListener("click", () => {
  const checkedAnswer = getCheckAnswer();
  console.log(checkedAnswer);

  if (checkedAnswer === quizDB[questionCount].ans) {
    score++;
  }

  questionCount++;
  deselectAll();

  if (questionCount < quizDB.length) {
    loadQuestion();
  } else {
    let userId = localStorage.getItem("user");

    showScore.innerHTML = `
        <h3> You Scored ${score}/${quizDB.length} </h3>
        <button id="reload-button" class="btn">Play Again </button>
        `;
    showScore.classList.remove("scoreArea");
    submit.setAttribute("disabled", "true");
    const reloadButtonEl = document.querySelector("#reload-button");
    reloadButtonEl.addEventListener("click", reloadQuiz);

    update(ref(db, "users/" + userId), {
      totalScore: quizDB.length,
      obtainedScore: score,
    });
  }
});
