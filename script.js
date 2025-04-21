let count = 0;
let pointsPerSecond = 0;
const winAmount = 10000000000;
let winShown = false;

const upgrades = {
  clickPower: { name: "Białko",                               cost: 5, clickBoost: 1, production: 0, quantity: 0 },
  helper1:    { name: "Jajka",                                cost: 50,  clickBoost: 0, production: 5, quantity: 0 },
  helper2:    { name: "Ryż z kurczakiem",                     cost: 75,  clickBoost: 0, production: 10, quantity: 0 },
  helper3:    { name: "Siłownia",                             cost: 250, clickBoost: 0, production: 25, quantity: 0 },
  helper4:    { name: "Kofeina",                              cost: 1000,clickBoost: 0, production: 100,quantity: 0 },
  helper5:    { name: "Kebab",                                cost: 5000,clickBoost: 0, production: 500,quantity: 0 },
  helper6:    { name: "Biały Monster",                        cost: 20000,clickBoost: 0, production: 2500,quantity: 0 },
  helper7:    { name: "Czarnoskóry umięśniony mężczyzna",     cost: 50000,clickBoost: 0, production: 5000,quantity: 0 },
  helper8:    { name: "Brainrot",                             cost: 200000,clickBoost: 0, production: 20000,quantity: 0 },
  helper9:    { name: "Rasizm",                               cost: 750000,clickBoost: 0, production: 50000,quantity: 0 },
  helper10:   { name: "CHAT GPT 4.0",                         cost: 1500000,clickBoost: 0, production: 100000,quantity: 0 }
};

let clicksThisSecond = 0;
let clickBlocked = false;

setInterval(() => {
clicksThisSecond = 0; // reset co sekundę
}, 1000);

function increment() {
if (clickBlocked) return;

clicksThisSecond++;
if (clicksThisSecond > 15) {
  clickBlocked = true;
  alert("Wykryto zbyt szybkie klikanie! Masz bana na 30 sekund ty kurwo.");

  // Odblokuj po 5 sekundach
  setTimeout(() => {
    clickBlocked = false;
  }, 30000);

  return;
}

spawnClickAnim();
animateClick();
const cp = upgrades.clickPower;
const clickValue = 1 + cp.clickBoost * cp.quantity;
count += clickValue;
updateCounter();
checkWin();
}


function buyUpgrade(type) {
    const up = upgrades[type];
    if (count >= up.cost) {
      count -= up.cost;
      pointsPerSecond += up.production;
      up.quantity++;
      // Zmieniamy sposób obliczania kosztu, aby losować mnożnik z zakresu 1.0 - 2.0
      up.cost = Math.max(1, Math.floor(up.cost * (1.0 + Math.random())));
      document.getElementById(`cost-${type}`).textContent = up.cost;
      document.getElementById(`qty-${type}`).textContent = up.quantity;
      updateCounter();
    } else {
      alert("Za mało białka!");
    }
  }
  

function updateCounter() {
  document.getElementById('counter').textContent = count.toLocaleString('pl-PL');
}

function checkWin() {
  if (!winShown && count >= winAmount) {
    showWinMessage();
    console.log("ROZYZ-");
    winShown = true;
  }
}

function showWinMessage() {
  const msg = document.createElement('div');
  msg.textContent = '🎉 Kliknij ZBADAJ po czym spójrz w CONSOLE 🎉';
  Object.assign(msg.style, {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
    fontSize: '2.5rem', color: '#4caf50', background: 'rgba(255,255,255,0.9)',
    padding: '20px 40px', border: '2px solid #4caf50', borderRadius: '10px', zIndex: '10'
  });
  document.body.appendChild(msg);
}

function generateShop() {
  const shop = document.getElementById('shop-items');
  shop.innerHTML = '';
  for (const key in upgrades) {
    const up = upgrades[key];
    const num = key === 'clickPower' ? '0' : key.match(/\d+$/)[0];
    const item = document.createElement('div'); item.className = 'item';
    item.innerHTML = `
      <div class="item-info">
        <strong>${up.name}</strong>
        ${up.production ? `<span>+${up.production} pkt/s</span>` : `<span>+${up.clickBoost} pkt/klik</span>`}
        <span>Koszt: <span id="cost-${key}">${up.cost}</span></span>
        <span>Posiadane: <span id="qty-${key}">${up.quantity}</span></span>
      </div>
      <button class="upgrade-btn" onclick="buyUpgrade('${key}')">
        <img src="./assets/images/upgrade${num}.png" alt="${up.name}" class="item-upgrade" />
      </button>
    `;
    shop.appendChild(item);
  }
}

function animateClick() {
  const img = document.querySelector('.click-btn');
  img.classList.add('clicked');
  setTimeout(() => img.classList.remove('clicked'), 100);
}

function spawnClickAnim() {
  const area = document.getElementById('click-area');
  const rect = area.getBoundingClientRect();
  const x = rect.left + Math.random() * rect.width;
  const y = rect.top + Math.random() * rect.height;
  const elem = document.createElement('img');
  elem.src = 'clickme.png';
  elem.className = 'floating-click';
  elem.style.left = x + 'px';
  elem.style.top = y + 'px';
  document.body.appendChild(elem);
  elem.addEventListener('animationend', () => elem.remove());
}

function spawnPassiveAnim(amount) {
  if (amount <= 0) return;
  const area = document.getElementById('click-area');
  const rect = area.getBoundingClientRect();
  const x = rect.left + Math.random() * rect.width;
  const y = rect.top + Math.random() * rect.height;
  const elem = document.createElement('div');
  elem.className = 'floating-passive';
  elem.textContent = `+${amount}`;
  elem.style.left = x + 'px';
  elem.style.top = y + 'px';
  document.body.appendChild(elem);
  elem.addEventListener('animationend', () => elem.remove());
}

generateShop();
setInterval(() => {
  if (pointsPerSecond > 0) {
    count += pointsPerSecond;
    spawnPassiveAnim(pointsPerSecond);
    updateCounter();
    checkWin();
  }
}, 1000);
