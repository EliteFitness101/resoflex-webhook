const params = new URLSearchParams(window.location.search);

const name = params.get('name');
const goal = params.get('goal');
const plan = params.get('plan');

// PERSONALIZE TEXT
if(name){
  document.getElementById('user-name').innerText =
    `Welcome ${name}, let's build your ${goal} plan`;
}

// AUTO VIP PUSH
if(plan === "VIP"){
  document.querySelector('.vip').style.boxShadow =
    "0 0 40px gold";
}

// AUTO CTA CHANGE
if(goal === "Glute Growth"){
  document.querySelector('.sub').innerText =
    "Build your dream shape with precision.";
}
