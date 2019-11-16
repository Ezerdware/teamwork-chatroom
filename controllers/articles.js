module.exports = (
  app,
  bcrypt,
  jwt,
  cloudinary,
  authenticationToken,
  generateAccessToken,
  client
) => {
  const articlesModel = require("./../models/articles");

  // api to create gif image
  app.post("/api/v1/gifs", authenticationToken, async (req, res) => {
    //private
    console.log(req.body)
    let addGif = {
      image: req.files.image,
      title: req.body.title,
      articleType: "gif"
    };
    console.log(addGif);

    let err;
    if (
      addGif == null ||
      addGif.image == undefined ||
      addGif.title == undefined ||
      addGif.image == "" ||
      addGif.title == ""
    ) {
      err = true;
    } else {
      err = false;
    }

    if (err) {
      res.status(403).json({
        status: "Upload Failed",
        error: "Gif Pan Empty"
      });
    } else {
      // sending gif to cloudinary
      // temp

      await cloudinary.uploader.upload(
        addGif.image.tempFilePath,
        async (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            let articleID = "";

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

            let dt = new Date();

            for (let a = 0; a < 10; a++) {
              let worker = Math.floor((Math.random() % 100) * 62);
              code.push(alpha[worker]);
              articleID = articleID + code[a];
            }

            let info = {
              articleID: articleID,
              title: addGif.title,
              posterEmail: req.user.email,
              posterID: req.user.userID,
              groupPosted: req.user.groupID,
              content: result.url,
              articleType: addGif.articleType,
              createdOn: dt.toISOString()
            };

            // saving image url to db
            await articlesModel.createArticleTable(client);
            await articlesModel.insertGifToArticleTable(client, info, res);
          }
        }
      );
    }
  });

  // api to create articles
  app.post("/api/v1/articles", authenticationToken, async (req, res) => {
    //private
    let add = {
      title: req.body.title,
      article: req.body.article,
      articleType: "article"
    };
    let err;
    if (
      add.title == undefined ||
      add.article == undefined ||
      add.title == "" ||
      add.article == "" ||
      add.title == null ||
      add.article == null
    ) {
      err = true;
    } else {
      err = false;
    }
    if (err) {
      res.status(500).json({
        status: "failed",
        error: "Article or title should not be empty"
      });
    } else {
      let articleID = "";

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
      let dt = new Date();

      for (let a = 0; a < 10; a++) {
        let worker = Math.floor((Math.random() % 100) * 62);
        code.push(alpha[worker]);
        articleID = articleID + code[a];
      }

      let info = {
        articleID: articleID,
        title: add.title,
        posterEmail: req.user.email,
        posterID: req.user.userID,
        groupPosted: req.user.groupID,
        content: add.article,
        articleType: add.articleType,
        createdOn: dt.toISOString()
      };

      // saving image url to db
      await articlesModel.createArticleTable(client);
      await articlesModel.insertGifToArticleTable(client, info, res);
    }
  });

  //api to edit an article
  app.patch(
    "/api/v1/articles/:articleId",
    authenticationToken,
    async (req, res) => {
      //private
      let add = {
        title: req.body.title,
        article: req.body.article,
        articleID: req.params.articleId,
        articleType: "article"
      };
      let err;

      if (
        add.title == undefined ||
        add.article == undefined ||
        add.articleID == undefined ||
        add.title == "" ||
        add.article == "" ||
        add.articleID == ""
      ) {
        err = true;
      } else {
        err = false;
      }

      if (err) {
        res.status(400).json({
          status: "false",
          error: "Title, article or article should not be empty"
        });
      } else {
        let info = {
          articleID: add.articleID,
          title: add.title,
          posterEmail: req.user.email,
          posterID: req.user.userID,
          groupPosted: req.user.groupID,
          content: add.article,
          articleType: add.articleType
        };
        await articlesModel.createArticleTable(client, info, res);
        await articlesModel.updateArticleTable(client, info, res);
      }
    }
  );

  // api to delete article
  app.delete("/api/v1/articles/:articleId", authenticationToken, (req, res) => {
    // private
    let add = {
      articleID: req.params.articleId,
      articleType: "article"
    };
    let err;

    if (
      add.articleID == undefined ||
      add.articleID == "" ||
      add.articleID == null
    ) {
      err = true;
    } else {
      err = false;
    }

    if (err) {
      res.status(400).json({
        status: "failed",
        error: "ArticleId should not be empty"
      });
    } else {
      let info = {
        articleID: add.articleID,
        posterEmail: req.user.email,
        posterID: req.user.userID,
        groupPosted: req.user.groupID,
        articleType: add.articleType
      };

      articlesModel.deleteArticleTable(client, info, res);
    }
  });

  // api to delete gifs
  app.delete("/api/v1/gifs/:gifId", authenticationToken, (req, res) => {
    // private
    let add = {
      gifID: req.params.gifId,
      articleType: "gif"
    };
    let err;
    if (add.gifID == undefined || add.gifID == null || add.gifID == "") {
      err = true;
    } else {
      err = false;
    }
    if (err) {
      res.status(400).json({
        status: "failed",
        error: "gifId should not be empty"
      });
    } else {
      let info = {
        articleID: add.gifID,
        posterEmail: req.user.email,
        posterID: req.user.userID,
        groupPosted: req.user.groupID,
        articleType: add.articleType
      };

      articlesModel.deleteArticleTable(client, info, res);
    }
  });

  // api to comment on articles
  app.post(
    "/api/v1/articles/:articleId/comment",
    authenticationToken,
    async (req, res) => {
      // private
      let add = {
        articleId: req.params.articleId,
        comment: req.body.comment,
        articleType: "article"
      };
      let err;
      if (
        add.articleId == undefined ||
        add.articleId == null ||
        add.articleId == "" ||
        add.comment == undefined ||
        add.comment == null ||
        add.comment == ""
      ) {
        err = true;
      } else {
        err = false;
      }
      if (err) {
        res.status(500).json({
          status: "Failed",
          error: "articleId or comment should not be empty"
        });
      } else {
        let commentID = "";

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

        for (let a = 0; a < 5; a++) {
          let worker = Math.floor((Math.random() % 100) * 62);
          code.push(alpha[worker]);
          commentID = commentID + code[a];
        }

        let dt = new Date();

        let info = {
          articleID: add.articleId,
          comment: add.comment,
          commentID: commentID,
          commenterEmail: req.user.email,
          commenterID: req.user.userID,
          groupPosted: req.user.groupID,
          createdOn: dt.toISOString(),
          articleType: add.articleType
        };

        await articlesModel.createCommentTable(client);
        await articlesModel.insertCommentToCommentTable(client, info, res);
      }
    }
  );

  // api to comment on gifs post
  app.post(
    "/api/v1/gifs/:gifId/comment",
    authenticationToken,
    async (req, res) => {
      // private
      let add = {
        articleId: req.params.gifId,
        comment: req.body.comment,
        articleType: "gif"
      };
      let err;
      if (
        add.articleId == undefined ||
        add.articleId == null ||
        add.articleId == "" ||
        add.comment == undefined ||
        add.comment == null ||
        add.comment == ""
      ) {
        err = true;
      } else {
        err = false;
      }
      if (err) {
        res.status(500).json({
          status: "Failed",
          error: "gifId or comment should not be empty"
        });
      } else {
        let commentID = "";

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

        for (let a = 0; a < 5; a++) {
          let worker = Math.floor((Math.random() % 100) * 62);
          code.push(alpha[worker]);
          commentID = commentID + code[a];
        }

        let dt = new Date();

        let info = {
          articleID: add.articleId,
          comment: add.comment,
          commentID: commentID,
          commenterEmail: req.user.email,
          commenterID: req.user.userID,
          groupPosted: req.user.groupID,
          createdOn: dt.toISOString(),
          articleType: add.articleType
        };

        await articlesModel.createCommentTable(client);
        await articlesModel.insertCommentToCommentTable(client, info, res);
      }
    }
  );

  // api to show all article and gif posted for all groups. Recent ones at the top
  app.get("/api/v1/feed", authenticationToken, (req, res) => {
    // private

    let err;
    if (err) {
      res.status(400).json({
        status: "",
        error: ""
      });
    } else {
      articlesModel.selectAllArticle(client, res)
    }
  });

    // api to show all article and gif posted for all groups. Recent ones at the top
  app.get("/api/v1/groupfeed/:groupId", authenticationToken, (req, res) => {
    // private

    let add={
      groupReq:req.params.groupId,
      groupID:req.user.groupID,
    }

    let err;
    if(add.groupReq != add.groupID){
      err=true
    }
    if (err) {
      res.status(400).json({
        status: "Failed",
        error: "You do not have to this group articles"
      });
    } else {
      let info = add
      articlesModel.selectParticularGroupArticle(client, info, res)
    }
  });

  // api to view a specific article
  app.get("/api/v1/articles/:articleId", authenticationToken, (req, res) => {
    // private
    let add = {
      articleID: req.params.articleId,
      userID: req.user.userID,
      userEmail:  req.user.email,
      groupID:  req.user.groupID
    }
    let err;
    if(add.articleID==undefined || add.articleID==null || add.articleID=='' || add.userID==undefined || add.userID==null || add.userID==''){
      err=true
    }
    else{
      err=false
    }
    
    if (err) {
      res.status(400).json({
        status: "Failed",
        error: "ArticleId should not be empty"
      });
    } else {
      let info=add
      articlesModel.selectParticularArticle(client, info, res)
    }
  });

  // api to view a specific gif
  app.get("/api/v1/gif/:gifId", authenticationToken, (req, res) => {
    // private
    let add = {
      articleID: req.params.gifId,
      userID: req.user.userID,
      userEmail:  req.user.email,
      groupID:  req.user.groupID
    }
    let err;
    if(add.articleID==undefined || add.articleID==null || add.articleID=='' || add.userID==undefined || add.userID==null || add.userID==''){
      err=true
    }
    else{
      err=false
    }
    
    if (err) {
      res.status(400).json({
        status: "Failed",
        error: "ArticleId should not be empty"
      });
    } else {
      let info=add
      articlesModel.selectParticularArticle(client, info, res)
    }
  });
};
