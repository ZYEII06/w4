let website;
let grasses = []; // 儲存多根水草的陣列
let bubbles = []; // 儲存氣泡的陣列
const grassCount = 80; // 稍微減少數量讓畫面不至於太擁擠
const bubbleCount = 60;  // 氣泡數量

function setup() {
  // 建立全螢幕畫布
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  
  // 重要：讓滑鼠點擊可以穿過畫布，以便操作下方的網頁內容
  canvas.style('pointer-events', 'none');

  strokeCap(ROUND);
  strokeJoin(ROUND);

  // 1. 建立滿版 iframe
  website = createElement('iframe');
  website.position(0, 0); 
  website.size(windowWidth, windowHeight); 
  website.attribute('src', 'https://www.et.tku.edu.tw/'); 
  website.style('border', 'none'); 
  website.style('z-index', '-1'); // 確保網頁在最底層

  // 2. 初始化水草 (馬卡龍色系、加粗版、微彎)
  for (let i = 0; i < grassCount; i++) {
    grasses.push(new Grass());
  }

  // 3. 初始化背景上升氣泡
  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push(new Bubble());
  }
}

function draw() {
  // 使用 clear() 保持畫布透明
  clear(); 

  // 繪製氣泡
  for (let b of bubbles) {
    b.update();
    b.display();
  }

  // 繪製水草
  for (let g of grasses) {
    g.display();
  }
}

// --- 水草類別 ---
class Grass {
  constructor() {
    this.init();
  }

  init() {
    this.startX = random(width);
    this.baseHeight = random(height * 0.2, height * 0.55); // 稍微拉高一點點
    this.swaySpeed = random(0.004, 0.012); // 擺動速度
    this.noiseOffset = random(2000);
    
    // 設定馬卡龍色系 (HSB 模式)
    colorMode(HSB, 360, 100, 100, 1);
    let h = random(360);       
    let s = random(35, 55);    // 稍微提高一點飽和度，讓粗水草顏色更紮實
    let b = random(90, 100);   
    this.color = color(h, s, b, 0.75); // 透明度稍微降低，讓顏色清楚一點
    colorMode(RGB, 255);       

    // 【修改重點】讓水草粗度明顯增加
    this.weight = random(8, 22); 
    
    // 控制基礎彎曲度
    this.curveFactor = random(-0.8, 0.8); 
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(this.weight);

    beginShape();
    vertex(this.startX, height);

    let segments = 12; 
    for (let i = 1; i <= segments; i++) {
      let t = i / segments; 
      let y = height - this.baseHeight * t;
      
      // 微彎弧度
      let curveOffset = sin(t * PI / 2) * this.curveFactor * this.baseHeight * 0.2;

      // 平滑左右微調擺動
      let n = noise(this.noiseOffset, frameCount * this.swaySpeed + t * 0.4);
      let swayOffset = map(n, 0, 1, -25, 25) * sin(t * PI / 2); 

      let x = this.startX + curveOffset + swayOffset;
      vertex(x, y);
    }
    endShape();
  }
}

// --- 氣泡類別 ---
class Bubble {
  constructor() {
    this.spawn(random(height)); 
  }

  spawn(startY) {
    this.x = random(width);
    this.y = startY;
    this.size = random(3, 10); 
    this.speedY = random(0.6, 1.8); 
    this.noiseOffset = random(1000);
    this.alpha = random(100, 160); 
  }

  update() {
    this.y -= this.speedY;
    let move = noise(this.y * 0.01, this.noiseOffset);
    this.x += map(move, 0, 1, -0.4, 0.4);

    if (this.y < -this.size) {
      this.spawn(height + random(50));
    }
  }

  display() {
    stroke(255, this.alpha);
    strokeWeight(1.2); 
    noFill();
    ellipse(this.x, this.y, this.size);
    
    noStroke();
    fill(255, this.alpha + 40);
    ellipse(this.x - this.size * 0.2, this.y - this.size * 0.2, this.size * 0.25);
  }
}

// --- 視窗縮放處理 ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (website) {
    website.size(windowWidth, windowHeight);
  }
  for (let g of grasses) {
    g.startX = random(width);
  }
}