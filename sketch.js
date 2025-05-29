let targetX, targetY;
let found = false;
let startTime;
let attempts = 0;
let feedback = "";
let feedbackAlpha = 0;
let bestDistance = Infinity;

// Cores para feedback visual
const colors = {
  hot: '#FF0000',
  warm: '#FFA500',
  cool: '#ADD8E6',
  cold: '#0000FF',
  found: '#00FF00',
  edgeStart: 200,    // Cinza claro para o degradê
  edgeEnd: 50        // Cinza escuro para o degradê
};

function setup() {
  createCanvas(800, 800);
  resetTarget();
  startTime = millis();
  textSize(32);
  textAlign(CENTER, CENTER);
  noCursor();
}

function draw() {
  // Fundo branco com bordas em degradê
  drawGradientBackground();
  
  if (!found) {
    // Calcula distância ao alvo
    let currentDistance = dist(mouseX, mouseY, targetX, targetY);
    bestDistance = min(bestDistance, currentDistance);
    
    // Atualiza feedback
    updateFeedback(currentDistance);
    
    // Desenha o indicador de proximidade
    drawProximityIndicator(currentDistance);
    
    // Desenha dica de temperatura
    drawTemperatureHint(currentDistance);
  } else {
    // Tela de vitória
    drawWinScreen();
  }
  
  // Desenha informações do jogo
  drawGameInfo();
  
  // Desenha feedback textual
  drawTextFeedback();
  
  // Desenha cursor personalizado
  drawCustomCursor();
}

function drawGradientBackground() {
  // Fundo branco
  background(255);
  
  // Bordas com degradê de cinza
  noFill();
  for (let i = 0; i < 100; i++) {
    let alpha = map(i, 0, 100, 0, 50);
    let edgeSize = i * 8;
    stroke(colors.edgeStart, alpha);
    strokeWeight(1);
    rect(edgeSize/2, edgeSize/2, width - edgeSize, height - edgeSize);
  }
}

function resetTarget() {
  targetX = int(random(50, width - 50));
  targetY = int(random(50, height - 50));
  found = false;
  attempts = 0;
  bestDistance = Infinity;
}

function updateFeedback(distance) {
  if (distance < 10) {
    found = true;
    feedback = "ENCONTROU!";
    feedbackAlpha = 255;
    noLoop();
  } else if (distance < 30) {
    feedback = "FERVENDO!";
    feedbackAlpha = 255;
  } else if (distance < 80) {
    feedback = "QUENTE!";
    feedbackAlpha = 200;
  } else if (distance < 150) {
    feedback = "MORNO";
    feedbackAlpha = 150;
  } else if (distance < 250) {
    feedback = "FRIO";
    feedbackAlpha = 120;
  } else {
    feedback = "GELADO!";
    feedbackAlpha = 100;
  }
}

function drawProximityIndicator(distance) {
  // Círculo que muda de tamanho e cor baseado na distância
  let indicatorSize = map(distance, 0, 400, 20, 400, true);
  let indicatorColor;
  
  if (distance < 30) {
    indicatorColor = color(colors.hot);
  } else if (distance < 100) {
    indicatorColor = color(colors.warm);
  } else if (distance < 200) {
    indicatorColor = color(colors.cool);
  } else {
    indicatorColor = color(colors.cold);
  }
  
  noFill();
  strokeWeight(3);
  stroke(indicatorColor);
  circle(mouseX, mouseY, indicatorSize);
}

function drawTemperatureHint(distance) {
  // Flecha que aponta para o alvo (aparece apenas quando está longe)
  if (distance > 50) {
    let angle = atan2(targetY - mouseY, targetX - mouseX);
    let arrowSize = map(distance, 50, 400, 15, 30, true);
    
    push();
    translate(mouseX, mouseY);
    rotate(angle);
    
    noStroke();
    fill(100, 180);  // Cinza semi-transparente
    triangle(
      arrowSize, 0,
      -arrowSize/2, -arrowSize/2,
      -arrowSize/2, arrowSize/2
    );
    
    pop();
  }
}

function drawWinScreen() {
  fill(colors.found);
  textSize(64);
  text("PARABÉNS!", width/2, height/2 - 50);
  textSize(24);
  text(`Tempo: ${((millis() - startTime)/1000).toFixed(1)}s`, width/2, height/2 + 20);
  text(`Tentativas: ${attempts}`, width/2, height/2 + 60);
  
  // Desenha o alvo
  fill(colors.found);
  circle(targetX, targetY, 30);
  fill(255);
  circle(targetX, targetY, 20);
  fill(colors.found);
  circle(targetX, targetY, 10);
}

function drawGameInfo() {
  fill(0);  // Texto preto para contraste com fundo branco
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Melhor distância: ${int(bestDistance)}px`, 20, 20);
  text(`Tentativas: ${attempts}`, 20, 50);
  textAlign(LEFT, BOTTOM);
  text(`Tempo: ${((millis() - startTime)/1000).toFixed(1)}s`, 20, height - 20);
}

function drawTextFeedback() {
  if (feedbackAlpha > 0) {
    let textSizeValue = map(feedbackAlpha, 100, 255, 24, 48);
    textSize(textSizeValue);
    textAlign(CENTER, CENTER);
    fill(0, feedbackAlpha);  // Texto preto com transparência
    text(feedback, width/2, height/4);
    
    feedbackAlpha -= 1;
  }
}

function drawCustomCursor() {
  // Cursor personalizado (um pequeno círculo com ponto central)
  if (!found) {
    noStroke();
    fill(0, 150);  // Preto semi-transparente
    circle(mouseX, mouseY, 12);
    fill(0);
    circle(mouseX, mouseY, 4);
  }
}

function mouseMoved() {
  if (!found) {
    attempts++;
  }
}

function keyPressed() {
  if (key === ' ' && found) {
    resetTarget();
    startTime = millis();
    loop();
  }
}