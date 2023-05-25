const bets = document.querySelector('.bets')

const size = 50;
const margin = 10;
const minimumBet = 0;

const red = "#BA0E30"
const black = "#2F4553"

const lastRow = ["1 To 18", "Even", "", "", "Odd", "19 To 36"]

const numbers = [20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1]
const blackNumbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]
const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]

const specials = ["Even", "Odd", "Black", "Red", "1 To 18", "19 To 36", "Row 1", "Row 2", "Row 3", "1 To 12", "13 To 24", "25 To 36"]

let spinning = false;


function generateRouletteTable(selector) {
    const sel = document.querySelector(selector)
    const zero = document.createElement('div')
    zero.classList.add("bet-zero")
    zero.innerHTML = "<p>0</p>"
    zero.addEventListener('click', () => {
        placeBet("0")
    })
    sel.appendChild(zero)
    for (let e = 0; e < 3; e++) {
        for (let i = 0; i < 13; i++) {
            if (i == 12) {
                const x = document.createElement('div')
                x.classList.add('end')
                x.innerHTML = "<p>2:1</p>"
                x.addEventListener('click', () => {
                    placeBet("Row "+parseFloat((e+1)))
                })
                x.style.marginLeft = (size+margin)+(size+margin)*i + "px"
                x.style.marginTop = (size+margin)*e + "px"
                sel.appendChild(x)

            } else {
                const x = document.createElement('div')
                x.classList.add('number')
                if (redNumbers.includes(((3)*(i+1)-e))) {
                    x.classList.add('red-color')
                } else {
                    x.classList.add('black-color')
                }
                x.style.marginLeft = (size+margin)+(size+margin)*i + "px"
                x.style.marginTop = (size+margin)*e + "px"
                x.style.color = "white"
                x.addEventListener('click', () => {
                    placeBet(x.innerHTML.replace("<p>","").replace("</p>",""))
                })
                
                x.innerHTML = `<p>${(3)*(i+1)-e}</p>`
                sel.appendChild(x)
            }
        }
    }
    for (let i = 0; i < 3; i++) {
        const x = document.createElement('div')
        x.classList.add('third-bet')
        x.innerHTML = `<p>${((i+1)*12)-11} To ${(i+1)*12}</p>`
        x.addEventListener('click', () => {
            placeBet(x.innerHTML.replace("<p>","").replace("</p>",""))
        })
        x.style.marginLeft = (size+margin)+(230+margin) * i + "px"
        x.style.marginTop = (size+margin)*3 + "px"
        sel.appendChild(x)
    }
    for (let e = 0; e < 6; e++) {
        const x = document.createElement('div')
        x.classList.add('lastrow-bet')
        x.innerHTML = `<p>${lastRow[e]}</p>`
        if (e == 2 ) {
            x.addEventListener('click', () => {
                placeBet("Red")
            })
        } else {
            if (e == 3) {
                x.addEventListener('click', () => {
                    placeBet("Black")
                })
            } else {
                x.addEventListener('click', () => {
                    placeBet(x.innerHTML.replace("<p>","").replace("</p>",""))
                })
            }
        }
        if (e == 2) {x.classList.add('red-color')}
        if (e == 3) {x.classList.add('black-color')}
        x.style.marginLeft = (size+margin)+(110+margin) * (e) + "px"
        x.style.marginTop = (size+margin)*4 + "px"
        sel.appendChild(x)
    }

}

generateRouletteTable(".roulette")

if (localStorage.bets == undefined) {
    localStorage.bets = JSON.stringify([])
}

if (localStorage.balance == undefined) {
    localStorage.balance = JSON.stringify(50000)
}


function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start) + " $";
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

function updateUI(before, after) {
      const obj = document.querySelector(".balance");
      animateValue(obj, parseFloat(before), parseFloat(after), 1000);
    document.querySelector('.balance').innerHTML = JSON.parse(localStorage.balance)+" $"
}

updateUI(0, JSON.parse(localStorage.balance))



function placeBet(where) {
    const bet = document.getElementById('bet').value
    if (spinning == false) {
        if (bet != "") {
            if (bet > minimumBet) {
                const b = JSON.parse(localStorage.bets)
                let exists = false;
                for (let i = 0; i < b.length; i++) {
                    if (b[i].where == where) {
                        exists = true;
                    }
                }

                if (exists == false) {
                    if (JSON.parse(localStorage.balance) > bet) {
                        b.push({where: where, bet: bet})
                        localStorage.bets = JSON.stringify(b)
                        const d = localStorage.balance
                        localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)-parseFloat(bet))
                        const a = JSON.stringify(JSON.parse(localStorage.balance))
                        updateBetsAndWins()
                        updateUI(d,a)
                    }

                }
            }
        }
    }
}

document.querySelector('.spin-btn').addEventListener('click', () => {
    if (JSON.parse(localStorage.bets).length > 0) {
        if (spinning == false) {
            spinning = true;
            rotationAngle = 0;
            rotationSpeed = (3.61*Math.random())+16;
            document.querySelector('.winningNumber').style.display = "none"
            document.querySelector('.roulettePics').style.transform = `rotate(0deg)`;
            rotate()
        }
    }
})


let rotationAngle = 0;
let rotationSpeed = 0;
// Function to perform the rotation
function rotate() {
  // Update the rotation angle
  rotationAngle += rotationSpeed;

  // Apply the rotation using CSS transform
  document.querySelector('.roulettePics').style.transform = `rotate(${rotationAngle}deg)`;

  // Gradually decrease the rotation speed
  rotationSpeed *= 0.99;

  // Request the next frame
  if (rotationSpeed > 0.01) {
    requestAnimationFrame(rotate);
  } else {
    const rotatation = parseFloat(document.querySelector('.roulettePics').style.transform.replace("rotate(","").replace("deg)",""))%360 
    calculatePrizes(calculateNumber(rotatation))
    showNumber(calculateNumber(rotatation))
    spinning = false;
  }
}



function calculatePrizes(number) {
    bets.innerHTML = ""
    let betsList = JSON.parse(localStorage.bets)
    document.querySelector('.bets-legend').innerHTML = "Bets (0)"
    for (let i = 0; i < betsList.length; i++) {
        if (parseFloat(betsList[i].where) == number) {
            const d = localStorage.balance
            localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*36)
            const a = JSON.stringify(JSON.parse(localStorage.balance))
            updateUI(d, a)
            addWin(betsList[i].where, betsList[i].bet, 36)
        } else {
            if (betsList[i].where == "1 To 12") {
                if (number >= 1 && number <= 12) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*3)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a)  
                    addWin(betsList[i].where, betsList[i].bet, 3)
                }
            }
            if (betsList[i].where == "13 To 24") {
                if (number >= 13 && number <= 24) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*3)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a)
                    addWin(betsList[i].where, betsList[i].bet, 3)  
                }
            }
            if (betsList[i].where == "25 To 36") {
                if (number >= 25 && number <= 36) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*3)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a)  
                    addWin(betsList[i].where, betsList[i].bet, 3)
                }
            }
            if (betsList[i].where == "1 To 18") {
                if (number >= 1 && number <= 18) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*2)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a)  
                    addWin(betsList[i].where, betsList[i].bet, 2)
                }
            }
            if (betsList[i].where == "19 To 36") {
                if (number >= 19 && number <= 36) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*2)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a)  
                    addWin(betsList[i].where, betsList[i].bet, 2)
                }
            }
            if (betsList[i].where == "Even") {
                if (number%2 == 0 && number != 0) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*2)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a)  
                    addWin(betsList[i].where, betsList[i].bet, 2)
                }
            }
            if (betsList[i].where == "Odd") {
                if (number%2 != 0) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*2)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a)  
                    addWin(betsList[i].where, betsList[i].bet, 2)
                }
            }
            if (betsList[i].where == "Red") {
                if (redNumbers.includes(number)) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*2)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a) 
                    addWin(betsList[i].where, betsList[i].bet, 2) 
                }
            }

            if (betsList[i].where == "Black") {
                if (blackNumbers.includes(number)) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*2)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a) 
                    addWin(betsList[i].where, betsList[i].bet, 2) 
                }
            }

            if (betsList[i].where == "Row 1") {
                if (number%3 == 0) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*3)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a)  
                    addWin(betsList[i].where, betsList[i].bet, 3)
                }
            }

            if (betsList[i].where == "Row 2") {
                if (number%3 == 2) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*3)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a)  
                    addWin(betsList[i].where, betsList[i].bet, 3)
                }
            }

            if (betsList[i].where == "Row 3") {
                if (number%3 == 1) {
                    const d = localStorage.balance
                    localStorage.balance = JSON.stringify(JSON.parse(localStorage.balance)+parseFloat(betsList[i].bet)*3)
                    const a = JSON.stringify(JSON.parse(localStorage.balance))
                    updateUI(d, a)  
                    addWin(betsList[i].where, betsList[i].bet, 3)
                }
            }
        }
    }
    localStorage.bets = JSON.stringify([])

}

function undo() {
    if (spinning == false) {
        let betsAmount = 0;
        for (let i = 0; i < JSON.parse(localStorage.bets).length;i++) {
            betsAmount = betsAmount + parseFloat(JSON.parse(localStorage.bets)[i].bet)
        }
        const x = JSON.parse(localStorage.bets)
        x.pop()
        addMoney(betsAmount)
        localStorage.bets = JSON.stringify(x)
        updateBetsAndWins()
    }
}

function clearBets() {
    if (spinning == false) {
        let betsAmount = 0;
        for (let i = 0; i < JSON.parse(localStorage.bets).length;i++) {
            betsAmount = betsAmount + parseFloat(JSON.parse(localStorage.bets)[i].bet)
        }
        localStorage.bets = JSON.stringify([])
        addMoney(betsAmount)
        updateBetsAndWins()
    }
}

function addMoney(amount) {
    localStorage.balance = JSON.stringify(parseFloat(JSON.parse(localStorage.balance))+amount)
    updateUI(parseFloat(JSON.parse(localStorage.balance))-amount,parseFloat(JSON.parse(localStorage.balance)))
}

function showNumber(n) {
    document.querySelector('.winningNumber').innerHTML = n
    if (redNumbers.includes(n)) {
        document.querySelector('.winningNumber').style.color = "#f00520"
    }
    if (blackNumbers.includes(n)) {
        document.querySelector('.winningNumber').style.color = "white"
    }

    if (n == 0) {
        document.querySelector('.winningNumber').style.color = "#419e3f" 
    }
    document.querySelector('.winningNumber').style.display = "block"

}




function testSpin() {
    document.querySelector('.roulettePics').style.transform = `rotate(0deg)`;
    const rotatationAngle = 360 * Math.random()
    document.querySelector('.roulettePics').style.transform = `rotate(${rotatationAngle}deg)`;

    return calculateNumber(rotatationAngle)
}

function calculateNumber(r) {
    length = 360 / numbers.length
    if (numbers[(36)-Math.floor((r-2.57)/length)] == undefined) {
        return 20;
    }
    return(numbers[(36)-Math.floor((r-2.57)/length)])
}

function updateBetsAndWins() {
    bets.innerHTML = ""
    let color;
    for (let i = 0; i < JSON.parse(localStorage.bets).length; i++) {
        if (redNumbers.includes(parseFloat(JSON.parse(localStorage.bets)[i].where))) {
            color = "#BA0E30"
        } 
        if (blackNumbers.includes(parseFloat(JSON.parse(localStorage.bets)[i].where))) {
            color = "#2F4553"
        } 
        if (parseFloat(JSON.parse(localStorage.bets)[i].where) == 0) {
            color = "#419e3f"
        } 

        if (specials.includes(JSON.parse(localStorage.bets)[i].where)) {
            let into;
            color = "white"
            let tcolor = "black"
            if (JSON.parse(localStorage.bets)[i].where == "Black") {
                into = "B"
                tcolor = "white"
                color = "#2F4553"
            }
            if (JSON.parse(localStorage.bets)[i].where == "Red") {
                into = "R"
                tcolor = "white"
                color = "#BA0E30"
            }
            if (JSON.parse(localStorage.bets)[i].where == "Odd") {
                into = "O"
            }

            if (JSON.parse(localStorage.bets)[i].where == "Even") {
                into = "E"
            }

            if (JSON.parse(localStorage.bets)[i].where == "Row 1") {
                into = "R1"
            }
            if (JSON.parse(localStorage.bets)[i].where == "Row 2") {
                into = "R2"
            }
            if (JSON.parse(localStorage.bets)[i].where == "Row 3") {
                into = "R3"
            }

            if (JSON.parse(localStorage.bets)[i].where == "1 To 12") {
                into = "1-12"
            }

            if (JSON.parse(localStorage.bets)[i].where == "13 To 24") {
                into = "13-24"
            }

            if (JSON.parse(localStorage.bets)[i].where == "25 To 36") {
                into = "25-36"
            }

            if (JSON.parse(localStorage.bets)[i].where == "1 To 18") {
                into = "1-18"
            }

            if (JSON.parse(localStorage.bets)[i].where == "19 To 36") {
                into = "19-36"
            }

            bets.innerHTML = bets.innerHTML + `
            <div class="betShown">
                <div class="betShownWhereWrapper" style="background:${color}">
                    <p class="betShownWhere" style="color: ${tcolor}">${into}</p>
                </div>
                <p class="betShownBet">${JSON.parse(localStorage.bets)[i].bet}$</p>
            </div>
            `
        } else {
            bets.innerHTML = bets.innerHTML + `
            <div class="betShown">
                <div class="betShownWhereWrapper" style="background:${color}">
                    <p class="betShownWhere">${JSON.parse(localStorage.bets)[i].where}</p>
                </div>
                <p class="betShownBet">${JSON.parse(localStorage.bets)[i].bet}$</p>
            </div>
            `
        }
    }
    document.querySelector('.bets-legend').innerHTML = "Bets ("+JSON.parse(localStorage.bets).length+")"
}

function addWin(where2, bet2, times) {
    let where = parseFloat(where2)
    let bet = parseFloat(bet2)
    let color;
    if (redNumbers.includes(where)) {
        color = "#BA0E30"
    } 
    if (blackNumbers.includes(where)) {
        color = "#2F4553"
    } 
    if (where == 0) {
        color = "#419e3f"
    } 

    if (specials.includes(where2)) {
        let into;
        color = "white"
        let tcolor = "black"
        if (where2 == "Black") {
            into = "B"
            tcolor = "white"
            color = "#2F4553"
        }
        if (where2 == "Red") {
            into = "R"
            tcolor = "white"
            color = "#BA0E30"
        }
        if (where2 == "Odd") {
            into = "O"
        }

        if (where2 == "Even") {
            into = "E"
        }

        if (where2 == "Row 1") {
            into = "R1"
        }
        if (where2 == "Row 2") {
            into = "R2"
        }
        if (where2 == "Row 3") {
            into = "R3"
        }

        if (where2 == "1 To 12") {
            into = "1-12"
        }

        if (where2 == "13 To 24") {
            into = "13-24"
        }

        if (where2 == "25 To 36") {
            into = "25-36"
        }

        if (where2 == "1 To 18") {
            into = "1-18"
        }

        if (where2 == "19 To 36") {
            into = "19-36"
        }

        bets.innerHTML = bets.innerHTML + `
        <div class="betShown">
            <div class="betShownWhereWrapper" style="background:${color}">
                <p class="betShownWhere" style="color: ${tcolor}">${into}</p>
            </div>
            <p class="betShownBet" style="color: #419e3f">${bet}$ > ${bet*times}$</p>
        </div>
        `
    } else {
        bets.innerHTML = bets.innerHTML + `
        <div class="betShown">
            <div class="betShownWhereWrapper" style="background:${color}">
                <p class="betShownWhere">${where}</p>
            </div>
            <p class="betShownBet" style="color: #419e3f">${bet}$ > ${bet*times}$</p>
        </div>
        `
    }
    document.querySelector('.bets-legend').innerHTML = "Wins"
}



updateBetsAndWins()