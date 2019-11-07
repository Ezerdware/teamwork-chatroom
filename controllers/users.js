module.exports = function(app, bcrypt, jwt, cloudinary) {
  require("dotenv").config();
  let articles = require("./articles");
  let db = [];
  // api to create user account
  app.post("/api/v1/auth/create-user", async (req, res) => {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    let userDetail = req.body;
    userDetail.password = hashPassword;

    // just bcos no db
    db.push({
      email: req.body.email,
      password: hashPassword
    });
    console.log(db);
    let err;
    if (err) {
      res.status(500).json({
        status: "",
        error: ""
      });
    } else {
      res.status(201).json({
        status: "",
        data: {
          message: "",
          token: "",
          userId: ""
        }
      });
    }
  });

  // api to login admin or client
  app.post("/api/v1/auth/signin", async (req, res) => {
    let err;
    const user = {
      email: req.body.email,
      password: req.body.password
    };
    // let emailChecker=db.find(db,userAuth.email)

    if (await bcrypt.compare(user.password, db[0].password)) {
      err = false;
    } else {
      err = true;
    }

    console.log(user);

    if (err) {
      res.status(500).json({
        status: "",
        error: ""
      });
    } else {
      const accessToken = await generateAccessToken(user);
      // const refreshToken = await generateRefreshToken(user)
      res.status(201).json({
        status: "",
        data: {
          message: "",
          token: accessToken,
          // refreshToken: refreshToken,
          userId: ""
        }
      });
    }
  });

  // articles operations
  articles(
    app,
    bcrypt,
    jwt,
    cloudinary,
    authenticationToken,
    generateAccessToken
  );

  function authenticationToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      return res.status(401).json({
        status: "Failed",
        error: "Access token not found"
      });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(403).json({
          status: "Failed",
          error: "You do not have access for this route"
        });
      req.user = user;
      next();
    });
  }
  function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m"
    });
  }
  // function generateRefreshToken(user){
  //   return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  // }
};
