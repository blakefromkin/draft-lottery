const express = require('Express');
const morgan = require('morgan');
const session = require("express-session");
const store = require("connect-loki")
const TeamsClass = require('./lib/teams.js');

const app = express();
const LokiStore = store(session);

app.set('view engine', 'pug');
app.set("views", "./views");

app.use(express.static('lib'));
app.use(morgan("common"));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 100 * 24 * 60 * 60 * 1000, // 100 days in millseconds
    path: "/",
    secure: false,
  },
  name: "draft-lottery-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "not secure",
  store: new LokiStore({}),
}));

// Initialize res.locals properties
app.use((req, res, next) => {
  res.locals.teamsManager = new TeamsClass(req.session); 
  res.locals.order = req.session.order || res.locals.teamsManager.randomizeDraftOrder();
  req.session.order = res.locals.order;
  next();
});

app.get('/', (req, res) => {
  res.render('landing.pug');
});

app.get('/pick/:pickNum', (req, res) => {
  let pickNum = +req.params.pickNum;
  let teamsManager = res.locals.teamsManager;

  let team = teamsManager.getTeams().find(team => {
    return team.name === res.locals.order[teamsManager.totalTeams - pickNum];
  });
  let img = team.pic;

  res.render('pick.pug', {img, pickNum});
  pickNum -= 1;
});

app.get('/summary', (req, res) => {
  let teamsManager = res.locals.teamsManager;
  let order = res.locals.order.map(teamName => {
    return teamsManager.getTeams().find(team => {
      return teamName === team.name;
    });
  }).reverse();
  res.render('summary.pug', {order});
});

app.get('/reset', (req, res) => {
  delete req.session.order;
  res.locals.teamsManager.deleteWeighted();
  res.redirect('/');
});

app.listen(3000, "localhost", () => {
  console.log("Listening to port 3000.");
});


