
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

-- -- Create the author table
CREATE TABLE IF NOT EXISTS author (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blogTitle TEXT NOT NULL,
    blogSubtitle TEXT,
    authorName TEXT NOT NULL
);

-- -- Create the articles table
CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    article_text TEXT,
    created TEXT,
    modified TEXT,
    published_date TEXT,
    is_published BOOLEAN DEFAULT 0, -- 0 for draft, 1 for published
    likes INTEGER DEFAULT 0,
    author_id INTEGER,
    FOREIGN KEY (author_id) REFERENCES author(id)
);
-- -- Create the comments table
CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_text TEXT NOT NULL,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    articleIdComment INT, 
    FOREIGN KEY (articleIdComment) REFERENCES articles(article_id)
);

-- -- Insert author and blog details
INSERT INTO author (blogTitle, blogSubtitle, authorName) VALUES ('My Blog', 'A collection of my thoughts', 'John Doe');

-- INSERT INTO articles (title, subtitle, article_text, author_id)
-- VALUES ('Sample Article Title', 'Sample Article Subtitle', 'This is the content of the article...', 1);
-- -- Insert article 1
INSERT INTO articles (title, subtitle, article_text, created, modified, published_date, is_published, likes, author_id) VALUES ('Understanding People', 'This article is about the exploration of humans psychology', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', DATETIME('now'), DATETIME('now'), DATETIME('now'), 1, 2, 1);
-- Insert article 2
INSERT INTO articles (title, subtitle, article_text, created, modified, published_date, is_published, likes, author_id) VALUES ('Article 2', 'Subtitle 2', 'Praesent condimentum magna a massa facilisis, eu euismod lectus varius.', DATETIME('now'), DATETIME('now'), DATETIME('now'), 1, 0, 1);
-- Insert article 3
INSERT INTO articles (title, subtitle, article_text, created, modified, published_date, is_published, likes, author_id) VALUES ('Article 3', 'Subtitle 3', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ', DATETIME('now'), DATETIME('now'), DATETIME('now'), 0, 0, 1);
-- Insert article 4
INSERT INTO articles (title, subtitle, article_text, created, modified, published_date, is_published, likes, author_id) VALUES ('Article 4', 'Subtitle 4', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', DATETIME('now'), DATETIME('now'), DATETIME('now'), 1, 3, 1);
-- Insert article 5
INSERT INTO articles (title, subtitle, article_text, created, modified, published_date, is_published, likes, author_id) VALUES ('Article 5', 'Subtitle 5', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ', DATETIME('now'), DATETIME('now'), DATETIME('now'), 0, 0, 1);



-- -- Insert comment for article 1
INSERT INTO comments (comment_text, created, likes, dislikes, articleIdComment) VALUES ('This is a comment, wow i realy enjoyed this article', DATETIME('now'), 0, 0, 1);
-- -- Insert comment for article 2
INSERT INTO comments (comment_text, created, likes, dislikes, articleIdComment) VALUES ('This is a comment, wow i realy enjoyed this article', DATETIME('now'), 0, 0, 2);
-- -- Insert comment for article 3
INSERT INTO comments (comment_text, created, likes, dislikes, articleIdComment) VALUES ('This is a comment, wow i realy enjoyed this article', DATETIME('now'), 0, 0, 3);
-- -- Insert comment for article 4
INSERT INTO comments (comment_text, created, likes, dislikes, articleIdComment) VALUES ('This is a comment, wow i realy enjoyed this article', DATETIME('now'), 0, 0, 4);


COMMIT;




-- -- Create the articles table
-- CREATE TABLE articles (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   title TEXT NOT NULL,
--   subtitle TEXT,
--   text TEXT,
--   created DATETIME DEFAULT CURRENT_TIMESTAMP,
--   modified DATETIME DEFAULT CURRENT_TIMESTAMP,
--   published INTEGER DEFAULT 0,
--   likes INTEGER DEFAULT 0
-- );

-- -- Create the settings table
-- CREATE TABLE settings (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   blogTitle TEXT NOT NULL,
--   blogSubtitle TEXT,
--   authorName TEXT NOT NULL
-- );

-- -- Create the comments table
-- CREATE TABLE comments (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   articleId INTEGER NOT NULL,
--   text TEXT NOT NULL,
--   date DATETIME DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (articleId) REFERENCES articles(id)
-- );

-- -- Insert authors
-- INSERT INTO settings (blogTitle, blogSubtitle, authorName)
-- VALUES ('My Blog', 'A place for thoughts', 'Author1');

-- INSERT INTO settings (blogTitle, blogSubtitle, authorName)
-- VALUES ('My Blog', 'A place for thoughts', 'Author2');

-- INSERT INTO settings (blogTitle, blogSubtitle, authorName)
-- VALUES ('My Blog', 'A place for thoughts', 'Author3');

-- -- Insert article 1
-- INSERT INTO articles (title, subtitle, text, created, modified, published, likes)
-- VALUES ('Article 1', 'Subtitle 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', DATETIME('now'), DATETIME('now'), 1, 0);

-- -- Insert article 2
-- INSERT INTO articles (title, subtitle, text, created, modified, published, likes)
-- VALUES ('Article 2', 'Subtitle 2', 'Praesent condimentum magna a massa facilisis, eu euismod lectus varius.', DATETIME('now'), DATETIME('now'), 1, 0);

