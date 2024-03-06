const express = require('express');
const userRouter = require('./routes/users');
const exphbs = require('express-handlebars');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

require('dotenv').config();

// Flash Middleware Start //
app.use(cookieParser("rastgeleScript"));
app.use(session({
  cookie: { maxAge: 60000 },
  resave: true,
  secret: "uwd+B5-Y=UMg-=MD",
  saveUninitialized: true
}));
app.use(flash());
// Flash Middleware End //

// Passport Initialize Start //
app.use(passport.initialize());
app.use(passport.session());

// Passport Initialize End //


// Global Res.Locals Start //
app.use((req, res, next) => {
  res.locals.flashSuccess = req.flash("flashSuccess");
  res.locals.flashError = req.flash("flashError");

  res.locals.passportSuccess = req.flash("success");
  res.locals.passportFailure = req.flash("error");

  res.locals.user = req.user;
  next();
});
// Global Res.Locals End //

 
// MongoDB Connection Start //
const mongoDbConnection = mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

mongoose.connection.on("open", () => {
  console.log("MongoDB Bağlantısı Kuruldu");
});
mongoose.connection.on("error", (err) => {
  console.log("MongoDB Bağlantısı Kurulamadı", err);
});
// MongoDB Connection End //



// Handlebars Engine Middleware Start
const hbs = exphbs.create({
  defaultLayout: 'layout',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.use(express.static('public'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// Handlebars Engine Middleware End

// BodyParser Middleware Start //
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// BodyParser Middleware End //

// Router Middleware Start
app.use('/', userRouter); // "userRouter" middleware'i root path '/' altında kullanmak için
app.use((req, res, next) => {
  res.render("./pages/404");
});
// Router Middleware End



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu "http://localhost:${PORT}/" adresinde çalışacak.`);
});