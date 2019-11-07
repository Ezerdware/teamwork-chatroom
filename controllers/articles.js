module.exports = (
  app,
  bcrypt,
  jwt,
  cloudinary,
  authenticationToken,
  generateAccessToken
) => {
  // api to create gif image
  app.post("/api/v1/gifs", authenticationToken, (req, res) => {
    //private
    let addGif = {
      image: req.files.gif,
      title: req.files.gif.name
    };
    console.log(addGif);

    let err;
    if (addGif == null) {
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
      cloudinary.uploader.upload(addGif.image.tempFilePath, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.status(201).json({
            status: "Gif Uploaded Successfully",
            data: {
              gifId: result.public_id,
              message: "",
              createdOn: result.created_at,
              title: req.files.gif.name,
              imageUrl: result.url
            }
          });
        }
      });
    }
  });

  // api to create articles
  app.post("/api/v1/articles", authenticationToken, (req, res) => {
    //private
    let addGif = {
      title: "",
      article: ""
    };
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
          articleId: "",
          createdOn: "",
          title: ""
        }
      });
    }
  });

  //api to edit an article
  app.patch("/api/v1/articles/:articleId", authenticationToken, (req, res) => {
    //private
    let addGif = {
      title: "",
      article: ""
    };
    let err;
    if (err) {
      res.status(400).json({
        status: "",
        error: ""
      });
    } else {
      res.status(200).json({
        status: "",
        data: {
          message: "",
          title: "",
          article: ""
        }
      });
    }
  });

  // api to delete article
  app.delete("/api/v1/articles/:articleId", authenticationToken, (req, res) => {
    // private
    let err;
    if (err) {
      res.status(400).json({
        status: "",
        error: ""
      });
    } else {
      res.status(200).json({
        status: "",
        data: {
          message: ""
        }
      });
    }
  });

  // api to delete gifs
  app.delete("/api/v1/articles/:gifId", authenticationToken, (req, res) => {
    // private
    let err;
    if (err) {
      res.status(400).json({
        status: "",
        error: ""
      });
    } else {
      res.status(200).json({
        status: "",
        data: {
          message: ""
        }
      });
    }
  });

  // api to comment on articles
  app.post(
    "/api/v1/articles/:articleId/comment",
    authenticationToken,
    (req, res) => {
      // private
      let comment = {
        comment: ""
      };
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
            created: "",
            articleTitle: "",
            article: "",
            comment: ""
          }
        });
      }
    }
  );

  // api to comment on gifs post
  app.post(
    "/api/v1/articles/:gifId/comment",
    authenticationToken,
    (req, res) => {
      // private
      let comment = {
        comment: ""
      };
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
            created: "",
            gifTitle: "",
            comment: ""
          }
        });
      }
    }
  );

  // api to show all article or gif posted recent ones at the top
  app.get("/api/v1/feed", authenticationToken, (req, res) => {
    // private

    let err;
    if (err) {
      res.status(400).json({
        status: "",
        error: ""
      });
    } else {
      res.status(200).json({
        status: "",
        data: [
          {
            id: "",
            createdOn: "",
            title: "",
            articleOrUrl: "", //article for article url for gif
            authorId: ""
          }
        ]
      });
    }
  });

  // api to view a specific article
  app.get("/api/v1/articles/:articleId", authenticationToken, (req, res) => {
    // private
    let err;
    if (err) {
      res.status(400).json({
        status: "",
        error: ""
      });
    } else {
      res.status(200).json({
        status: "",
        data: {
          id: "",
          createdOn: "",
          title: "",
          article: "",
          comments: [
            {
              commentId: "",
              comment: "",
              authorId: ""
            }
          ]
        }
      });
    }
  });

  // api to view a specific gif
  app.get("/api/v1/articles/:articleId", authenticationToken, (req, res) => {
    // private
    let err;
    if (err) {
      res.status(400).json({
        status: "",
        error: ""
      });
    } else {
      res.status(200).json({
        status: "",
        data: {
          id: "",
          createdOn: "",
          title: "",
          url: "",
          comments: [
            {
              commentId: "",
              authorId: "",
              comment: ""
            }
          ]
        }
      });
    }
  });
};
