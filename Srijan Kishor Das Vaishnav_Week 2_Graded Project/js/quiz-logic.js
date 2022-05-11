function startButtonHandle() {
  document.getElementById("submit-button").disabled = true;
  document.getElementById("pre-quiz-view").style.display = "none";
  document.getElementById("loader-view").style.display = "block";
  setTimeout(() => {
    fetch("http://localhost:8000/data")
      .then((response) => response.json())
      .then((result) => {
        const quesId = parseInt(document.getElementById("question-id").value);
        const question = result[quesId].question;
        const options = result[quesId].options;
        const [a, b, c, d] = options;
        document.getElementById("question").innerHTML = question;
        document.getElementById("0").innerHTML = a;
        document.getElementById("1").innerHTML = b;
        document.getElementById("2").innerHTML = c;
        document.getElementById("3").innerHTML = d;
      })
      .catch((error) => null);
    document.getElementById("loader-view").style.display = "none";
    document.getElementById("quiz").style.display = "block";
  }, 500);
}

function optionHandle(event) {
  document.getElementById("submit-button").disabled = false;
  const optDivs = document.querySelectorAll("#options-container > div");
  const arrOptDivs = [...optDivs]; // nodeList converted to array, inorder to use map() on array
  arrOptDivs.map((optDiv) => {
    if (optDiv.classList.contains("user-answer"))
      optDiv.classList.remove("user-answer");
  });
  document.getElementById(event.target.id).classList.add("user-answer");
}

function submitHandle() {
  fetch("http://localhost:8000/data")
    .then((response) => response.json())
    .then((result) => {
      const answer =
        result[parseInt(document.getElementById("question-id").value)].answer;
      const usrAns = document.querySelector(".user-answer").id;
      const usrSelectedDiv = document.getElementById(usrAns);
      if (usrAns == answer) {
        const scoreHiddenIp = document.getElementById("score");
        scoreHiddenIp.value = parseInt(scoreHiddenIp.value) + 1;
        usrSelectedDiv.classList.remove("user-answer");
        usrSelectedDiv.classList.add("correct-answer");
      } else {
        usrSelectedDiv.classList.remove("user-answer");
        usrSelectedDiv.classList.add("wrong-answer");
        document.getElementById(answer).classList.add("correct-answer");
      }
    })
    .catch((error) => null);
  setTimeout(() => {
    const hiddenIpEle = document.getElementById("question-id");
    const quesId = parseInt(hiddenIpEle.value) + 1;
    if (quesId > 0 && quesId < 7) {
      const optDivs = document.querySelectorAll("#options-container > div");
      const arrOptDivs = [...optDivs]; // nodeList converted to array, inorder to use map() on array
      arrOptDivs.map((optDiv) => {
        if (optDiv.classList.contains("user-answer"))
          optDiv.classList.remove("user-answer");
        else if (optDiv.classList.contains("correct-answer"))
          optDiv.classList.remove("correct-answer");
        else if (optDiv.classList.contains("wrong-answer"))
          optDiv.classList.remove("wrong-answer");
      });
      document.getElementById("quiz").style.display = "none";
      for (let x = quesId; x < 7; x++) {
        hiddenIpEle.value = quesId;
        startButtonHandle();
      }
    } else {
      document.getElementById("quiz").style.display = "none";
      const score = document.getElementById("score").value;
      document.getElementById("score-cont").innerHTML = `${score} points`;
      document.getElementById("score-div").style.display = "block";
    }
  }, 500);
}
