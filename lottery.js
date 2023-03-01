let express = require('Express');
let morgan = require('morgan');
let app = express();

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

const LAST_PICK = 6;

function createTeamsArray() {
  for (let team in ODDS) {
    if (ODDS[team] % 1 !== 0) {
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
  return teamsArray;
}

function selectTeam(teamsArray) {
  let randIdx = Math.floor(Math.random() * teamsArray.length);
  return teamsArray[randIdx];
}

function removeTeam(team, teamsArray) {
  return teamsArray.filter(val => val !== team);
}

function generateOrder(teamsArray) {
  let order = [];
  while (order.length < 6) {
    let team = selectTeam(teamsArray);
    teamsArray = removeTeam(team, teamsArray);
    order.unshift(team);
  }
  return order;
}

let teamsArray = createTeamsArray();
let order = generateOrder(teamsArray);
let pickNum = LAST_PICK;

// SERVER 
app.set('view engine', 'pug');
app.set("views", "./views");

app.use(express.static('public'));
app.use(morgan("common"));

app.get('/', (req, res) => {
  res.render('landing.pug');
});

app.get('/pick', (req, res) => {
  let team = order[LAST_PICK - pickNum];
  let img = PICS[team];
  res.render('pick.pug', {img: img, pickNum: pickNum});
  pickNum -= 1;
});

app.get('/summary', (req, res) => {
  res.render('summary.pug', {order: order});
});

app.listen(3000, "localhost", () => {
  console.log("Listening to port 3000.");
});


