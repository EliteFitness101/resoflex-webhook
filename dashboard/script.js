const params = new URLSearchParams(window.location.search);

const email = params.get('email');
const name = params.get('name');
const goal = params.get('goal') || "Fitness";
const plan = params.get('plan') || "Basic";

// DISPLAY USER
document.getElementById('welcome').innerText = `Welcome ${name}`;
document.getElementById('user-goal').innerText = `Goal: ${goal}`;
document.getElementById('user-plan').innerText = `Plan: ${plan}`;

// REFERRAL LINK
const refCode = email.replace(/[^a-z0-9]/gi,'').toLowerCase();
document.getElementById('refLink').value =
  `${window.location.origin}/quiz?ref=${refCode}`;

// FETCH EARNINGS
fetch(`/api/affiliate-data?email=${email}`)
.then(res=>res.json())
.then(data=>{
  document.getElementById('earnings').innerText =
    `Earnings: ₦${data.earnings}`;
});

// AI CHAT
async function send(){
  let msg = document.getElementById('msg').value;

  let res = await fetch('/api/ai-coach',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ message: msg, goal, plan })
  });

  let data = await res.json();

  document.getElementById('chat-box').innerHTML +=
    `<p>You: ${msg}</p><p>B2K: ${data.reply}</p>`;
}

// WORKOUT
async function getWorkout(){
  let res = await fetch('/api/workout',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ goal, level:"Beginner" })
  });

  let data = await res.json();
  document.getElementById('output').innerText = data.plan;
}

// MEAL
async function getMeal(){
  let res = await fetch('/api/meal',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ goal })
  });

  let data = await res.json();
  document.getElementById('output').innerText = data.plan;
}

// SAVE PROGRESS
async function saveProgress(){
  let weight = document.getElementById('weight').value;
  let waist = document.getElementById('waist').value;
  let glutes = document.getElementById('glutes').value;

  await fetch('/api/save-progress',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      email, weight, waist, glutes
    })
  });

  alert("Progress saved!");
}

// VIP PAYMENT
function payVIP(){
  let handler = PaystackPop.setup({
    key:'YOUR_PAYSTACK_PUBLIC_KEY',
    email: email,
    amount: 500000,
    callback: function(){
      alert("VIP Activated!");
    }
  });

  handler.openIframe();
}
