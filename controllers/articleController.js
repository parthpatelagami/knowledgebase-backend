const DBConfig = require('../configs/connection')
const Article = require('../models/articleModel')

async function getArticle(req,res){

    try{
        const sql = `SELECT * from article`;
        DBConfig.query(sql, (err, results) => {
            console.log(results)

            if (err) {
                console.error('Error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Oops! Something Went Wrong.',
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Article Send Successfully',
                    articles: results
                })
            }
        })

    }catch(error){
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }

}

async function CreateArticle(req,res){
    try{
        const {  ID,
            Name,
            Category_id,
            SubCategory_id,
            Created_by,
            Created_date,
            Updated_by,
            Updated_date,
            Content } = req.body
            console.log(req.body)
            const article = new Article(ID,Name, Category_id, SubCategory_id, Created_by, Created_date, Updated_by, Updated_date, Content);
            const result = await article.insert()
            console.log(result);
            res.status(201).json({
                success: true,
                message: 'article created successfully',
                article: result,
            })


    }catch(error){

    }
}

module.exports={getArticle,CreateArticle}