
/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */
const express = require("express");
const router = express.Router();
const assert = require('assert');

router.get("/author/home_page", (req, res, next) => {
  const authorArticles = `SELECT articles.*, author.*
                          FROM articles
                          JOIN author ON articles.author_id = author.id`;
                          

  global.db.all(authorArticles, function (err, authorInfo) {
    console.log(authorInfo);
    if (err) {
      next(err); //send the error on to the error handler
    } else {     
          res.render("author_home_page.ejs", { availableArticleInfo : authorInfo});
      }
  });
});

router.get("/reader/home_page", function(req, res) {
  // query database to get all the books
  const readerArticles = `SELECT articles.*, author.*
                          FROM articles
                          JOIN author ON articles.author_id = author.id`;
  // execute sql query
  global.db.all(readerArticles, (err, result) => {
  if (err) {
  res.redirect("/");
  }
  //res.send(result)
  res.render("reader_home_page.ejs", {availableArticles: result});
  });
});  

router.get("/author/settings/:id", (req, res, next) => {
  const authorId = req.params.id;
  
  let sqlquery = `SELECT *
                  FROM author 
                  WHERE id = ?`;
  
  global.db.get(sqlquery,[authorId], function (err, currentSettings) {
    if (err) {
      next(err); //send the error on to the error handler
      // console.error(err);
      // res.sendStatus(500);
    } else {
      res.render("author_settings_page", {author: currentSettings});
    }
  });
});

router.post("/author/settings/:id", (req, res) => {
  //USE this pattern to update and insert data
  //NB. it's better NOT to use arrow functions for callbacks with this library
  const authorId = req.params.id;
  const blogTitle = req.body.blogTitle;
  const blogSubtitle = req.body.blogSubtitle;
  const authorName = req.body.authorName;
  
  let sqlquery = `UPDATE author 
                  SET blogTitle=?,
                  blogSubtitle =?, 
                  authorName = ?
                  WHERE id = ?`;
                  
  global.db.get(sqlquery,[blogTitle,blogSubtitle,authorName,authorId], function (err,testing)  {
 
    if (err) {
      console.log(err); //send the error on to the error handler
    } else {
      return res.redirect('/user/author/home_page');
    }
  });
});

router.get("/author/create_draft/:id",(req,res) =>{
  const authorId = req.params.id;
  console.log("inside createget")
  console.log(authorId);
  let sqlquery = 'SELECT * FROM author WHERE id=?';
  global.db.get(sqlquery,[authorId],function(err,results){
    console.log(results);
    if(err){
      console.error('Error inserting data:', err.message);
      return res.status(500).send('Error inserting data');
    }
     res.render("author_create_draft",{results});
  });
});

router.post("/author/create_draft/:id",(req,res) =>{
  // const authorId = parseInt(req.params.id, 10);
  const authorId = req.params.id;
  console.log(authorId);
  const title = req.body.title;
  const subtitle = req.body.subtitle;
  const article_text = req.body.article_text

  const createDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let sqlquery = `INSERT INTO articles (author_id,title,subtitle,article_text,created,modified,is_published)
                   VALUES (?,?,?,?,?,?,?)`;

  global.db.run(sqlquery,[authorId,title,subtitle,article_text,createDateTime,createDateTime,0],function(err,results){

        if(err){
          console.error('Error inserting data:', err.message);
          return res.status(500).send('Error inserting data');
        }
        const articleId = this.lastID;
        return res.redirect("/user/author/edit/"+articleId);
      });
});

router.get("/author/edit/:id", function(req, res) {
  // query database to get all the books
  //let sqlquery = "SELECT * FROM articles";
  const articleId = req.params.id;
 // execute sql query
  let sqlquery= "SELECT * FROM articles WHERE article_id = ?";
  // let sqlquery = "SELECT * FROM articles WHERE articles_id = ?";
 
  global.db.all(sqlquery,[articleId], (err, editArticle) => {
  if (err) {
    console.log(err);
    res.redirect("/");
  }
  //res.send(result)
  res.render("author_edit_article.ejs", {editArticle});
  });
});

router.post("/author/edit/:id", function(req, res) {
  const articleId = req.params.id;
  const articleTitle = req.body.articleTitle
  const articleSubtitle = req.body.articleSubtitle
  const articleText = req.body.articleText

  const createDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let sqlquery = `UPDATE articles 
                  SET title=?,
                  subtitle =?,
                  article_text=?,
                  modified =?
                  WHERE article_id =? `;

    global.db.all(sqlquery,[articleTitle,articleSubtitle,articleText,createDateTime,articleId], (err, editArticle) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      }
      return res.redirect('/user/author/home_page');
      });
});
router.post('/author/delete/:id', (req, res) => {
  const articleId = req.params.id;
  // Delete comments associated with the article first
  const deleteCommentsQuery = 'DELETE FROM comments WHERE comments.articleIdComment = ?';
  global.db.run(deleteCommentsQuery, [articleId], (err) => {
    if (err) {
      console.error('Error deleting comments:', err.message);
      return res.status(500).send('Error deleting comments');
    }
    // Then delete the article
    const deleteArticleQuery = 'DELETE FROM articles WHERE article_id = ?';
    global.db.run(deleteArticleQuery, [articleId], (err) => {
      if (err) {
        console.error('Error deleting article:', err.message);
        return res.status(500).send('Error deleting article');
      }
      // After deleting the article and comments, redirect the user back to /author/home
      return res.redirect("/user/author/home_page");
    });
  });
});
router.post('/author/published/:id', (req, res) => {
  const articleId = req.params.id;
  const createDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let sqlquery = `UPDATE articles
                  SET is_published = 1,
                  published_date = ?
                  WHERE article_id = ?`;

  global.db.all(sqlquery, [createDateTime,articleId], (err, editArticle) => {
    if (err) {
      console.error('Error updating published data:', err.message);
      return res.status(500).send('Error updating published data');
    }
    return res.redirect('/user/author/home_page');
  });
});

router.get("/reader/article/:id", (req, res, next) => {
  const articleId = req.params.id;
  global.db.all("SELECT * FROM articles WHERE article_id = ?", [articleId], function (err, articleInfo) {
    if (err) {
      next(err); //send the error on to the error handler
      // console.error(err);
      // res.sendStatus(500);
    } else if (!articleInfo) {
      res.sendStatus(404);
    } else {
      global.db.all("SELECT * FROM comments WHERE articleIdComment = ? ORDER BY created ASC", [articleId], function (err, commentInfo) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          res.render("reader_article_page.ejs", { articleInfo, commentInfo });
        }
      });
    }
  });
});

router.post("/reader/article/like_article/:id", (req, res) => {
  const articleId = req.params.id;
  
  // Perform the necessary action to update the like count for the article
  // For example, you can update the 'likes' column in the database for the specific article ID
  console.log("inside likes");
  let sqlquery = `UPDATE articles 
                  SET likes = likes + 1
                  WHERE article_id = ?`;

  global.db.run(sqlquery, [articleId], function (err) {
    if (err) {
      console.error('Error updating like count:', err.message);
      return res.status(500).send('Error updating like count');
    }
    // Like count successfully updated
    res.redirect('/user/reader/article/'+articleId);
  });
});


router.post("/reader/comment/:id", (req,res) => {
  const articleId = req.params.id;
  const comment_text = req.body.commentText;
  const createDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let sqlquery = `INSERT INTO comments (articleIdComment, comment_text, created)
                  VALUES (?, ?, ?)`;
 global.db.all(sqlquery,[articleId,comment_text,createDateTime],(err, result) => {
      if (err) {
          console.error('Error finding data:', err.message);
          return res.status(500).send('Error finding data');
      }
      res.redirect('/user/reader/article/'+articleId);
      });
       
});


module.exports = router;
