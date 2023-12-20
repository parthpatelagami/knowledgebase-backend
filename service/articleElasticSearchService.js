const { Client } = require("@elastic/elasticsearch");
require('dotenv').config();

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTICSEARCH_USER,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
});

const articleIndexParams = {
  index: "article",
};

async function checkELConnection() {
  try {
    const health = await client.cluster.health({});
    console.log("EL cluster health:", health);
  } catch (error) {
    console.error("EL - Error checking EL health:", error);
  }
}
async function addArticle(articledata) {
  try {
    articleIndexParams["body"] = articledata;

    const responsedata = await client.index(articleIndexParams);

    console.log("EL - Document added:", responsedata);
  } catch (error) {
    console.error("EL - Error adding document:", error);
  }
}

async function deleteArticleById(id) {
  let indexName = "article";
  try {
    const deleteresultres = await client.deleteByQuery({
      index: "article",
      body: {
        query: {
          match: {
            id: id,
          },
        },
      },
    });

    console.log(`EL - article with id ${id} deleted from index -> ${indexName}`);
    console.log(deleteresultres); // Output the response
  } catch (error) {
    console.error(`EL - Error deleting article: ${error}`);
  }
}

async function searchArticle(content) {
  let resultdata = [];
  try {
    const searchresultdata = await client.search({
      index: "article",
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: content,
                  fields: ["Content", "Name"],
                },
              },
            ],
            filter: [
              {
                term: {
                  Status: 1,
                },
              },
            ],
          },
        },
      },
    });

    let searchHits = [];
    if (searchresultdata) {
      searchHits = searchresultdata.hits.hits;
      resultdata = searchHits.map((hit) => hit._source);
    }
    console.log(resultdata);
  } catch (error) {
    console.error("EL - Error searching document:", error);
  }
}

async function updateArticleById(articleId, articledata) {
  try {
    await client.update({
      index: "article",
      id: articleId,
      refresh: "wait_for",
      body: {
        doc: articledata,
      },
    });
    console.log(`EL - article with ID ${articleId} updated..`);
  } catch (error) {
    console.error(`EL - Error updating article: ${error}`);
  }
}

module.exports = { addArticle,deleteArticleById,updateArticleById,searchArticle}