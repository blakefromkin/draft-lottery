const ODDS = {
  team1: 40,
  team2: 25,
  team3: 15,
  team4: 10,
  team5: 5,
  team6: 5
};

const PICS = {
  team1: 'image1.jpeg',
  team2: 'image2.jpeg',
  team3: 'image3.jpeg',
  team4: 'image4.jpeg',
  team5: 'image5.jpeg',
  team6: 'image6.jpeg',
};

const NUM_OF_TEAMS = 6;

// Return an array of team objects with name, odds, and pic properties.
function createTeamsArray() {
  let teamsArray = [];
  for (let team in ODDS) {
      teamsArray.push({
        name: team,
        odds: ODDS[team],
        pic: PICS[team]
      });
    }
  return teamsArray;
}

// Created an array representing the weighted odds for each team
function createWeightedArray() {
  for (let teamName in ODDS) {
    if (ODDS[teamName] % 1 !== 0) {
      for (let team in ODDS) {
        ODDS[team] = ODDS[team] * 2;
      }
      break;
    }
  }

  let weightedArray = [];
  for (let teamName in ODDS) {
    for (let count = 0; count < ODDS[teamName]; count += 1) {
      weightedArray.push(teamName);
    }
  }
  return weightedArray;
}

let teams = createTeamsArray();
let weightedArray = createWeightedArray();

module.exports = class TeamsManager {
  constructor(session) {
    this._teams = session.teams || teams;
    this.totalTeams = NUM_OF_TEAMS;
    this._weightedArray = session.weightedArray || weightedArray;

    session.teams = this._teams;
    session.weightedArray = this._weightedArray;
  }

  // Returns a shallow copy of the _teams array
  getTeams() {
    return [...this._teams];
  }

  // Deletes the weightedArray property
  deleteWeighted() {
    delete this._weightedArray;
  }

  // Return a randomly selected team name from the weighted array
  selectRandomTeam() {
    let randomIdx = Math.floor(Math.random() * this._weightedArray.length);
    return this._weightedArray[randomIdx];
  }

  // Returns a new weighted array with instances of the specified team name removed
  removeTeam(teamName) {
    return this._weightedArray.filter(team => team !== teamName);
  }

  // Returns an array with the order of team objects randomized
  randomizeDraftOrder() {
    let order = [];
    while (order.length < this.totalTeams) {
      let teamName = this.selectRandomTeam();
      this._weightedArray = this.removeTeam(teamName);
      order.unshift(teamName);
    }
    return order;
  }
};