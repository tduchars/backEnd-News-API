\c 'nc_news_test'

SELECT articles.article_id, title FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id;

-- , COUNT(comments.article_id) AS comment_count