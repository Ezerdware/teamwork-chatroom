module.exports = function(app, bcrypt, jwt, cloudinary, client) {
  require("dotenv").config();
  const articles = require("./articles");
  const usersModel = require("./../models/users");
  // api to create user account
  app.post("/api/v1/auth/create-user", async (req, res) => {
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    let userDetail = req.body;
    userDetail.password = hashPassword;

    // console.log(userDetail);

    if (
      userDetail.firstName == null ||
      userDetail.firstName == undefined ||
      userDetail.firstName == ""
    )
      res.status(500).json({
        status: "Error",
        error: "Firstname should not be empty"
      });
    if (
      userDetail.lastName == null ||
      userDetail.lastName == undefined ||
      userDetail.lastName == ""
    )
      res.status(500).json({
        status: "Error",
        error: "LastName should not be empty"
      });
    if (
      userDetail.email == null ||
      userDetail.email == undefined ||
      userDetail.email == ""
    )
      res.status(500).json({
        status: "Error",
        error: "Email should not be empty"
      });
    if (
      userDetail.password == null ||
      userDetail.password == undefined ||
      userDetail.password == ""
    )
      res.status(500).json({
        status: "Error",
        error: "Password should not be empty"
      });
    if (
      userDetail.gender == null ||
      userDetail.gender == undefined ||
      userDetail.gender == ""
    )
      res.status(500).json({
        status: "Error",
        error: "Gender should not be empty"
      });
    if (
      userDetail.jobRole == null ||
      userDetail.jobRole == undefined ||
      userDetail.jobRole == ""
    )
      res.status(500).json({
        status: "Error",
        error: "JobRole should not be empty"
      });
    if (
      userDetail.department == null ||
      userDetail.department == undefined ||
      userDetail.department == ""
    )
      res.status(500).json({
        status: "Error",
        error: "Department should not be empty"
      });
    if (
      userDetail.address == null ||
      userDetail.address == undefined ||
      userDetail.address == ""
    )
      res.status(500).json({
        status: "Error",
        error: "Address should not be empty"
      });
      if (
        userDetail.groupID == null ||
        userDetail.groupID == undefined ||
        userDetail.groupID == ""
      )
        res.status(500).json({
          status: "Error",
          error: "groupID should not be empty"
        });
    let userID = "";

    let alpha = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ];

    let code = [];

    for (let a = 0; a < 7; a++) {
      let worker = Math.floor((Math.random() % 100) * 62);
      code.push(alpha[worker]);
      userID = userID + code[a];
    }
    console.log(userID);
    usersModel.createTableUsers(client);
    usersModel.insertIntoTableUsers(client, userDetail, userID);
  });

  // api to login admin or client
  app.post("/api/v1/auth/signin", async (req, res) => {
    let err;
    const user = {
      email: req.body.email,
      password: req.body.password
    };

    client.query(
      `
    SELECT email, password, "userID", "groupID"
    FROM public.users WHERE email='${user.email}';
    `,
      async (err, result) => {
        if (err) {
          isUserEmailValid = false;
          console.log(err);
        } else {
          isUserEmailValid = true;
          userHashedPassword= result.rows[0].password
          fullUser=result.rows[0]
          // console.log(result.rows[0]);
          if(isUserEmailValid){
            if (await bcrypt.compare(user.password, userHashedPassword)) {
      
              const accessToken = await generateAccessToken(fullUser);
      
              
              res.status(200).json({
                status: "success",
                data: {
                  message: "Access granted",
                  token: accessToken,
                  userId: fullUser.userID
                }
              });
            } else {
              res.status(500).json({
                status: "failed",
                error: "Invalid Password"
              });
            }
          }
          else{
            res.status(500).json({
              status: "failed",
              error: "Invalid email"
            });
          }
        }
      }
    );

   
    

  });

  // articles operations
  articles(
    app,
    bcrypt,
    jwt,
    cloudinary,
    authenticationToken,
    generateAccessToken,
    client
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
      req.user = user
      console.log('From token : '+user.email);
      next();
    });
  }
  function generateAccessToken(fullUser) {
    return jwt.sign(fullUser, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m"
    });
  }
};
