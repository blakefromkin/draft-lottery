let readline = require('readline-sync');

const ODDS = {
  team1: 40,
  team2: 25,
  team3: 15,
  team4: 10,
  team5: 5,
  team6: 5
};

function announce() {
  let randIdx = Math.floor(Math.random() * teamsArray.length);
  console.clear();
  console.log(`${teamsArray[randIdx]} has Pick #${count}!`);
  return teamsArray[randIdx];
}

function removeTeam(team) {
  teamsArray = teamsArray.filter(val => val !== team);
}

for (let team in ODDS) {
  if (ODDS[team] % 2 !== 0) {
    for (let team in ODDS) {
      ODDS[team] = ODDS[team] * 2;
    }
    break;
  }
}

let teamsArray = [];
for (let team in ODDS) {
  for (let count = 0; count < ODDS[team]; count += 1) {
    teamsArray.push(team);
  }
}

let count = 0;
let acceptable = 'go';
console.clear();
while(count < 6) {
  let ready = readline.question('Type "go" when ready for the next pick.\n');
  if (acceptable === ready.toLowerCase()) {
    count += 1;
    removeTeam(announce());
  }
}

console.log('Hope you enjoyed the draft!')
