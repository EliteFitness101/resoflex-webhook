// PERSONALIZATION
const params = new URLSearchParams(window.location.search);
const name = params.get('name');

if(name){
  document.getElementById('user-name').innerText = `Welcome, ${name}`;
}

// COUNTDOWN
let end = new Date().getTime() + 86400000;
setInterval(()=>{
  let now = new Date().getTime();
  let diff = end - now;

  let h = Math.floor(diff / (1000*60*60));
  let m = Math.floor((diff % (1000*60*60))/(1000*60));
  let s = Math.floor((diff % (1000*60))/1000);

  document.getElementById('countdown').innerText =
    `Offer ends in ${h}h ${m}m ${s}s`;
},1000);

// PAYSTACK BUTTON
function pay(){
  let handler = PaystackPop.setup({
    key: 'YOUR_PAYSTACK_PUBLIC_KEY',
    email: params.get('email') || 'user@email.com',
    amount: 100000,
    currency: 'NGN',
    ref: 'REF-'+Math.floor(Math.random()*1000000000),

    callback: function(response){
      window.location.href =
        `/thank-you?ref=${response.reference}&email=${params.get('email')}&name=${params.get('name')}`;
    }
  });

  handler.openIframe();
}

document.getElementById('pay-btn').onclick = pay;
document.getElementById('pay-btn-2').onclick = pay;
