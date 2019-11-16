module.exports.createArticleTable = client => {
  client.query(
    `
          CREATE TABLE public.articles
            (
                "articleID" varchar(10) NOT NULL,
                "articleType" varchar(10) NOT NULL,
                "posterEmail" varchar(50) NOT NULL,
                "posterUserID" varchar(7) NOT NULL,
                "groupPosted" varchar(7) NOT NULL,
                "title" varchar,
                "content" varchar NOT NULL,
                "createdOn" varchar NOT NULL,
                PRIMARY KEY ("articleID")
            );
          `,
    err => {
      if (err) {
        console.error("ERROR while creating Table : " + err);
      } else {
        console.log("articles Table Created successfully");
      }
    }
  );
};
module.exports.insertGifToArticleTable = async (client, info, res) => {
  await client.query(
    `
    INSERT INTO public.articles(
        "articleID", "articleType", "posterEmail", "posterUserID", "groupPosted", title, content, "createdOn")
        VALUES ('${info.articleID}', '${info.articleType}', '${info.posterEmail}', '${info.posterID}', '${info.groupPosted}', '${info.title}', '${info.content}', '${info.createdOn}');
    `,
    err => {
      if (err) {
        console.log("error while inserting to articles table " + err);
      } else {
        res.status(201).json({
          status: "Success",
          data: {
            gifId: info.articleID,
            message: "Gif posted successfully",
            createdOn: info.createdOn,
            title: info.title,
            imageUrl: info.content,
            articleType: info.articleType
          }
        });
      }
    }
  );
};
module.exports.updateArticleTable = async (client, info, res) => {
  client.query(
    `
  UPDATE public.articles
	SET title='${info.title}', content='${info.content}'
	WHERE "articleID"='${info.articleID}' AND "articleType"='${info.articleType}' AND "posterEmail"='${info.posterEmail}' AND "posterUserID"='${info.posterID}' AND "groupPosted"='${info.groupPosted}';
  `,
    err => {
      if (err) {
        console.log("error while updating article table" + err);
      } else {
        res.status(200).json({
          status: "success",
          data: {
            message: "Updated successfully",
            title: info.title,
            article: info.content,
            articleType: info.articleType
          }
        });
      }
    }
  );
};
module.exports.deleteArticleTable = async (client, info, res) => {
  console.log(info);
  client.query(
    `
  DELETE FROM public.articles
	WHERE "articleID"='${info.articleID}' AND "articleType"='${info.articleType}' AND "posterEmail"='${info.posterEmail}' AND "posterUserID"='${info.posterID}' AND "groupPosted"='${info.groupPosted}';
  `,
    err => {
      if (err) {
        console.log("error while deleting article" + err);
        res.status(400).json({
          status: "failed",
          error: "error while deleting article"
        });
      } else {
        console.log("Deleted successfully");
        res.status(200).json({
          status: "success",
          data: {
            message: "Deleted successfully"
          }
        });
      }
    }
  );
};
module.exports.createCommentTable = client => {
  client.query(
    `
          CREATE TABLE public.comments
            (
                "articleID" varchar(10) NOT NULL,
                "groupPosted" varchar(7) NOT NULL,
                "comment" varchar NOT NULL,
                "commentID" varchar NOT NULL,
                "commenterEmail" varchar NOT NULL,
                "commenterID" varchar NOT NULL,
                "createdOn" varchar NOT NULL,
                PRIMARY KEY ("commentID")
            );
          `,
    err => {
      if (err) {
        console.error("ERROR while creating Table : " + err);
      } else {
        console.log("articles Table Created successfully");
      }
    }
  );
};
module.exports.insertCommentToCommentTable = async (client, info, res) => {
  await client.query(
    `
    INSERT INTO public.comments(
      "articleID", "groupPosted", comment, "commentID", "commenterEmail", "commenterID", "createdOn")
      VALUES ('${info.articleID}', '${info.groupPosted}', '${info.comment}', '${info.commentID}', '${info.commenterEmail}', '${info.commenterID}', '${info.createdOn}');
    `,
    err => {
      if (err) {
        console.log("error while inserting to articles table " + err);
      } else {
        console.log("inserted successfully");
        client.query(
          `
        SELECT title, content, "createdOn"
	FROM public.articles WHERE "articleID"='${info.articleID}';
        `,
          (err, result) => {
            if (
              result.rows[0] == undefined ||
              result.rows[0] == "" ||
              result.rows[0] == []
            ) {
              console.log("Article ID does not exist");
              res.status(500).json({
                status: "Failed",
                error: "Article ID does not exist"
              });
            } else {
              if (err) {
                res.status(500).json({
                  status: "Failed",
                  error: "Could not insert comment"
                });
              } else {
                res.status(201).json({
                  status: "Success",
                  data: {
                    message: "Comment successfully created",
                    createdOn: result.rows[0].createdOn,
                    articleTitle: result.rows[0].title,
                    article: result.rows[0].content,
                    comment: info.comment
                  }
                });
              }
            }
          }
        );
      }
    }
  );
};
module.exports.selectAllArticle = async (client, res) => {
  await client.query(
    `
    SELECT "articleID" AS id, "articleType", "posterEmail" AS "authorEmail", "posterUserID" AS "authorId", title, content AS article, "createdOn", "groupPosted"
  FROM public.articles;
  `,
    (err, result) => {
      if (err) {
        console.log("error while inserting to articles table " + err);
      } else {
        console.log(result.rows[0]);
        res.status(200).json({
          status: "Success",
          data: [
            result.rows
          ]
        });
      }
    }
  );
};
module.exports.selectParticularGroupArticle = async (client, info, res) => {
  await client.query(
    `
    SELECT "articleID" AS id, "articleType", "posterEmail" AS "authorEmail", "posterUserID" AS "authorId", title, content AS article, "createdOn"
  FROM public.articles WHERE "groupPosted" = '${info.groupReq}';
  `,
    (err, result) => {
      if (err) {
        console.log("error while inserting to articles table " + err);
      } else {
        console.log(result.rows[0]);
        res.status(200).json({
          status: "Success",
          data: [
            result.rows
          ]
        });
      }
    }
  );
};
module.exports.selectParticularArticle = async (client, info, res) => {
  await client.query(
    `
    SELECT "articleID", "articleType", "posterEmail", "posterUserID", "groupPosted", title, content, "createdOn"
  FROM public.articles WHERE "groupPosted" = '${info.groupID}' AND "articleID"='${info.articleID}';
  `,
    (err, result) => {
      if (err) {
        console.log("error while fetching articles" + err);
      } else {
        // console.log(result.rows[0]);
        if (
          result.rows[0] == undefined ||
          result.rows[0] == "" ||
          result.rows[0] == [] ||
          result.rows[0].articleID == undefined
        ) {
          res.status(400).json({
            status: "Failed",
            error: "Article you requied for is empty or does not exist"
          });
        } else {
          client.query(`
          SELECT "commentID" AS "commentId", comment, "commenterID" as "authorId"
	FROM public.comments WHERE "articleID"='${info.articleID}';
          `,(err, result2)=>{
            if(err){
              console.log("error while fetching articles" + err);
            }
            else{
              res.status(200).json({
                status: "Success",
                data:{
                    id: result.rows[0].articleID,
                    createdOn: result.rows[0].createdOn,
                    title: result.rows[0].title,
                    article: result.rows[0].content,
                    articleType:result.rows[0].articleType,
                    comments:[
                      result2.rows
                    ]
    
                  }
              });
            }
          })
          
        }
      }
    }
  );
};
