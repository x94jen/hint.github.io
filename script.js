// script.js
let isCooldown = false;
let cooldownTimer = null;
let selectedZone = null;

const cooldownDisplay = document.getElementById("cooldown");
const gachaBtn = document.getElementById("gachaBtn");
const egg = document.getElementById("egg");
const resultText = document.getElementById("resultText");
const historyList = document.getElementById("historyList");
const hintBox = document.getElementById("hintBox");

const zoneMessages = {
  五葉松: [
    "五葉松:日本の伝統的な松で、庭でよく見かける",
    "五葉松:それぞれの枝には5本のフォークがあるため、五葉松と呼ばれている",
    "五葉松:多次元デザイン研究所棟の前にある"
  ],
  サツキツツジ: [
    "サツキツツジ:ツツジは比較的低い低木",
    "サツキツツジ:花芽はカラフル。通常、花弁は5枝で、葉は卵形か極大纵形",
    "サツキツツジ:5号館前のグリーンベルトにいる"
  ],
  クスノキ: [
    "クスノキ:学校のシンボルツリー",
    "クスノキ:一年中常绿で、树冠は半球状か傘状で広く、開いた绿の傘のようで、缠は丸く膜らんでいる",
    "クスノキ:学校の中央"
  ],
  蘇鉄: [
    "蘇鉄:太い幹に羽毛のような深绿色の葉が汰を弥いて生え、優雅な姿勢をしている",
    "蘇鉄:茶色の枝には鼓のような跡がある",
    "蘇鉄:号館前のグリーンベルトにいる"
  ],
  鳶尾: [
    "鳶尾:低い地装植物である",
    "鳶尾:剣のような葉と蝶の羽のように広がる花が特徴。色は青、紫、黄、白など。",
    "鳶尾:学校図書館の裏"
  ]
};

let usedMessages = {
  五葉松: [],
  サツキツツジ: [],
  クスノキ: [],
  蘇鉄: [],
  鳶尾: []
};

const savedUsed = localStorage.getItem('usedMessages');
if (savedUsed) {
  usedMessages = JSON.parse(savedUsed);
  Object.keys(usedMessages).forEach(zone => {
    usedMessages[zone].forEach(msg => {
      const li = document.createElement("li");
      li.textContent = msg;
      historyList.appendChild(li);
    });
  });
}

const savedStart = localStorage.getItem('cooldownStartTime');
if (savedStart) {
  const elapsed = Math.floor((Date.now() - parseInt(savedStart)) / 1000);
  if (elapsed < 10) {
    let remaining = 10 - elapsed;
    startCooldown(remaining);
  } else {
    localStorage.removeItem('cooldownStartTime');
  }
}

function selectZone(zone) {
  selectedZone = zone;
  gachaBtn.disabled = false;
  resultText.textContent = ` ${zone}を選びました。ガチャを回せます！`;
}

function getOneRandomMessage(zone) {
  const available = zoneMessages[zone].filter(m => !usedMessages[zone].includes(m));
  if (available.length === 0) return null;
  const msg = available[Math.floor(Math.random() * available.length)];
  usedMessages[zone].push(msg);
  localStorage.setItem('usedMessages', JSON.stringify(usedMessages));
  return msg;
}

function spinGacha() {
  if (isCooldown || !selectedZone) return;

  const message = getOneRandomMessage(selectedZone);
  if (!message) {
    resultText.textContent = "すべてのヒントを引き終わりました！";
    return;
  }

  isCooldown = true;
  gachaBtn.disabled = true;

  egg.className = "";
  hintBox.classList.add("hidden");
  hintBox.classList.remove("show");
  hintBox.textContent = "";

  egg.style.top = "100px";
  egg.style.transform = "translateX(-50%) scale(0)";

  setTimeout(() => {
    egg.classList.add("drop");
  }, 100);

  setTimeout(() => {
    hintBox.textContent = message;
    hintBox.classList.remove("hidden");
    hintBox.classList.add("show");

    const li = document.createElement("li");
    li.textContent = message;
    historyList.appendChild(li);
    historyList.scrollTop = historyList.scrollHeight;
  }, 2000);

  localStorage.setItem('cooldownStartTime', Date.now().toString());
  startCooldown(10);
}

function startCooldown(seconds) {
  let remaining = seconds;
  cooldownDisplay.textContent = `あと ${remaining} 秒お待ちください...`;
  cooldownTimer = setInterval(() => {
    remaining--;
    if (remaining > 0) {
      cooldownDisplay.textContent = `あと ${remaining} 秒お待ちください...`;
    } else {
      clearInterval(cooldownTimer);
      isCooldown = false;
      gachaBtn.disabled = false;
      cooldownDisplay.textContent = "";
      localStorage.removeItem('cooldownStartTime');
    }
  }, 1000);
}

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('すべての記録を消して最初から始めますか？')) {
    localStorage.removeItem('usedMessages');
    localStorage.removeItem('cooldownStartTime');
    location.reload();
  }
});