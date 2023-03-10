var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const hbjs = require("handbrake-js");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

hbjs
  .spawn({
    input: "mobileVideoInput.mp4",
    output: "Fast 1080p30.mp4",
    preset: "Fast 1080p30",
  })
  .on("error", (err) => {
    // invalid user input, no video found etc
    console.error("Error Occured=> ", err);
  })
  .on("progress", (progress) => {
    console.log(
      "Percent complete: %s, ETA: %s",
      progress.percentComplete,
      progress.eta
    );
  });
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
