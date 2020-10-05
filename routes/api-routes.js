// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    // Keys match things in model
    res.json({
      email: req.user.email,
      id: req.user.id,
      playerName: req.user.playerName,
      rank: req.user.rank,
      mercenaryStatus: req.user.mercenaryStatus,
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      playerName: req.body.playerName,
      rank: req.body.rank

    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // signupTeam
  app.post("/api/teamCreate", (req, res) => {
    db.Team.create({
      teamName: req.body.teamName
    })
    .then((data) => {
      const newRow = data._previousDataValues;
      console.log(newRow);
      res.json(newRow);
      db.User.update({
        teamId: newRow.id
      }, 
      {
        where: {id: req.user.id}
      })
    })
    .catch(err => {
      res.status(401).json(err);
    });
  });

  // app.put("/api/teamLink", (req,res) => {
  //   db.User.update({
  //     teamId: req.body.id
  //   }, 
  //   {
  //     where: {id: req.user.id}
  //   }).then(() => {
  //     res.json(db.user);
  //     console.log(db.user);
  //   });
  // });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        playerName: req.user.playerName,
        rank: req.user.rank,
        mercenaryStatus: req.user.mercenaryStatus
      });
    }
  });

  // Route for getting data about user's team
  app.get("/api/teamData", (req, res) => {
      res.json({
        teamName: req.team.teamName,
        teamRank: req.team.teamRank,
        battleStatus: req.team.battleStatus,
        wins: req.team.wins,
        losses: req.team.losses,
        winRate: req.team.winRate
    });
  });
};