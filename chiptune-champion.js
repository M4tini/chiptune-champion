/*                  _____
     _____  _____  /    /____  ___
    |     \/     |/    /    /_|   |_ ___ ______  ___
    |            /    /    /\__   __|___|      \|___|
    |   \    /  /____     ___/|   | |   |   |   |   |
    |___|\__/|___|  /    /    |____\|___|___|___|___|
                   /____/     Created by: M4tini.com
*/

var canvas = document.querySelector('canvas')
canvas.width = 800
canvas.height = 400
canvas.style.marginLeft = ((window.innerWidth - canvas.width) / 2) + 'px'
canvas.style.marginTop = ((window.innerHeight - canvas.height) / 2) + 'px'

var ctx = canvas.getContext('2d')
ctx.font = 'bold 32px Courier,monospace'
ctx.fillStyle = '#fff'
ctx.fillText('LOADING', canvas.width / 2 - ctx.measureText('LOADING').width / 2, canvas.height / 2)

// roti precalculation
var rotiWavelength = 80
var roti = []
var rotPi = Math.floor(Math.PI * 2 * rotiWavelength)
var i = rotPi - 1
do {
  roti[i] = [
    Math.sin(i / rotiWavelength),
    Math.cos(i / rotiWavelength)
  ]
}
while (--i >= 0)
var rotiLength = roti.length
var rotiSindex1 = 0
var rotiCindex1 = rotiWavelength / 2.5
var rotiSindex2 = Math.floor(rotiLength * .125)
var rotiCindex2 = Math.floor(rotiLength * .125) + rotiCindex1
var rotiSindex3 = Math.floor(rotiLength * .250)
var rotiCindex3 = Math.floor(rotiLength * .250) + rotiCindex1
var rotiSindex4 = Math.floor(rotiLength * .375)
var rotiCindex4 = Math.floor(rotiLength * .375) + rotiCindex1

var hourX = canvas.width / 2
var hourY = canvas.height / 2
var hourLength = canvas.width

// multiply rgb by 10 to calculate with integers and avoid floating point issues
var r = 2000
var g = 500
var b = 500

function drawHourglass (sin, cos) {
  ctx.beginPath()
  ctx.moveTo(hourX + hourLength * roti[sin][0], hourY + hourLength * roti[sin][1])
  ctx.lineTo(hourX - hourLength * roti[sin][0], hourY - hourLength * roti[sin][1])
  ctx.lineTo(hourX - hourLength * roti[cos][0], hourY - hourLength * roti[cos][1])
  ctx.lineTo(hourX + hourLength * roti[cos][0], hourY + hourLength * roti[cos][1])
  ctx.lineTo(hourX + hourLength * roti[sin][0], hourY + hourLength * roti[sin][1])
  ctx.fill()
}

function drawBackground (fps) {
  // color fade
  if (r > 500 && b === 500) {
    r -= 3
    g += 3
  }
  if (g > 500 && r === 500) {
    g -= 3
    b += 3
  }
  if (b > 500 && g === 500) {
    r += 3
    b -= 3
  }

  ctx.fillStyle = 'rgb(0,0,0)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(' + Math.round(r / 10) + ',' + Math.round(g / 10) + ',' + Math.round(b / 10) + ', .5)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(0,0,0,.2)'

  // sun rotate
  if (++rotiSindex1 >= rotiLength) rotiSindex1 = 0
  if (++rotiCindex1 >= rotiLength) rotiCindex1 = 0
  if (++rotiSindex2 >= rotiLength) rotiSindex2 = 0
  if (++rotiCindex2 >= rotiLength) rotiCindex2 = 0
  if (++rotiSindex3 >= rotiLength) rotiSindex3 = 0
  if (++rotiCindex3 >= rotiLength) rotiCindex3 = 0
  if (++rotiSindex4 >= rotiLength) rotiSindex4 = 0
  if (++rotiCindex4 >= rotiLength) rotiCindex4 = 0

  drawHourglass(rotiSindex1, rotiCindex1)
  drawHourglass(rotiSindex2, rotiCindex2)
  drawHourglass(rotiSindex3, rotiCindex3)
  drawHourglass(rotiSindex4, rotiCindex4)
}

// star rotation precalculation
var starPoints = 5
var starSpeed = .012
var starRot = []
var i = Math.floor(Math.PI / starSpeed / (starPoints + 3))
do {
  starRot[i] = (Math.PI * (i * starSpeed))
}
while (--i >= 0)
var starLength = starRot.length
var starIndex = 0

function drawStar (cx, cy, spikes, outerRadius) {
  var innerRadius = outerRadius / 2
  var rot = (Math.PI / 2 * 3) - starRot[starIndex]
  var step = Math.PI / spikes
  var x = cx + Math.cos(rot) * innerRadius
  var y = cy + Math.sin(rot) * innerRadius

  ctx.beginPath()
  ctx.moveTo(x, y)
  rot += step

  for (i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }
  ctx.closePath()
  ctx.fill()
}

function createStar () {
  var angle = Math.PI * 2 * Math.random()
  var colors = [
    '200,50,50', // red
    '50,200,50', // green
    '50,50,200', // blue
    '200,200,50', // yellow
    '200,50,200' // purple
  ]
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
    velocityX: Math.sin(angle) * 200,
    velocityY: Math.cos(angle) * 200,
    size: 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 0
  }
}

var stars = []
var i = 50
do {
  stars.push(createStar())
} while (--i > 0)

function drawStars (fps) {
  if (++starIndex >= starLength) { starIndex = 0 }
  for (var i = 0; i < stars.length; i++) {
    var star = stars[i]
    var deltaX = star.velocityX / fps
    var deltaY = star.velocityY / fps

    star.x += deltaX
    star.y += deltaY
    star.size += .05
    star.opacity = Math.min(1, star.opacity + .01)
    if (star.x < 0 || star.x > canvas.width || star.y < 0 || star.y > canvas.height) {
      // replace with a new star
      stars[stars.indexOf(star)] = createStar()
    }
    // draw star
    ctx.fillStyle = 'rgba(' + star.color + ',' + star.opacity + ')'
    drawStar(star.x, star.y, starPoints, star.size)
  }
}

var rotateDir = 1
var rotateLogo = 0
var logoWidth = 327
var logoHeight = 90

function drawLogo (fps) {
  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)
  if (rotateLogo > .15 || rotateLogo < -.15) { rotateDir *= -1 }
  rotateLogo += rotateDir * 0.009
  ctx.rotate(rotateLogo)
  var rotateWidth = logoWidth + (logoWidth * rotateLogo)
  var rotateHeight = logoHeight + (logoHeight * rotateLogo)

  ctx.drawImage(chipLogo, -(rotateWidth / 2), -(rotateHeight / 2), rotateWidth, rotateHeight)
  ctx.restore()
}

// audio setup
var audio = document.createElement('audio')
audio.controls = true
audio.volume = .5
audio.loop = true
audio.preload = 'auto'
var source = document.createElement('source')
source.src = 'Rymdkraft_-_Pulvermoose.mp3'
audio.appendChild(source)
document.body.appendChild(audio)
audio.play();

// fps
var lastTime = 0

function calculateFps(now) {
  var fps = 1000 / (now - lastTime);
  lastTime = now;

  return fps;
}

/**
 * @param {number} time
 */
function mainLoop (time) {
  var fps = calculateFps(time);

  console.log('audio.currentTime', audio.currentTime)

  drawBackground(fps)
  drawStars(fps)
  if (audio.currentTime > 0 && audio.currentTime < 6) {
    drawLogo(fps)
  }

  requestAnimationFrame(mainLoop)
}

// resources
var resources = 1
var chipLogo = new Image()
chipLogo.src = 'chiptune-champion.png'
chipLogo.onload = function () {
  resources--
}

function waitForResources () {
  if (resources === 0) {
    clearInterval(waitForResourcesInterval)
    requestAnimationFrame(mainLoop)
  }
}

var waitForResourcesInterval = setInterval(waitForResources, 137)
