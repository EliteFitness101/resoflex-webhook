const questions = [
  {
    q: "What is your goal?",
    a: ["Weight Loss","Muscle Gain","Glute Growth"]
  },
  {
    q: "Your gender?",
    a: ["Male","Female"]
  },
  {
    q: "Your fitness level?",
    a: ["Beginner","Intermediate","Advanced"]
  },
  {
    q: "Budget?",
    a: ["₦1k","₦5k"]
  }
];

let step = 0;
let answers = {};

function load(){
  document.getElementById('question').innerText = questions[step].q;

  let html = '';
  questions[step].a.forEach(ans=>{
    html += `<div><input type="radio" name="a" value="${ans}"> ${ans}</div>`;
  });

  document.getElementById('answers').innerHTML = html;
}

document.getElementById('next').onclick = ()=>{
  let selected = document.querySelector('input[name="a"]:checked');
  if(!selected) return alert("Select answer");

  answers[step] = selected.value;
  step++;

  if(step < questions.length){
    load();
  } else {
    finish();
  }
};

function finish(){
  let goal = answers[0];
  let budget = answers[3];

  // AI DECISION
  let plan = budget === "₦5k" ? "VIP" : "BASIC";

  let url = `/landing/index.html?name=User&goal=${goal}&plan=${plan}`;

  window.location.href = url;
}

load();
