const express = require("express");
const News = require("./models/news");
const OI = require("./utils/io")
const database = new OI("./database/news.json")
const app = express();
app.use(express.json())

app.post("/news", async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(401).json({ message: "Tittle and description are required" })
    }
    const news = await database.read();
    const id = (news[news.length - 1]?.id || 0) + 1;
    const data = new News(id, title, description);

    const result = news.length ? [...news, data] : [data]
    await database.write(result)
    res.json({ message: "Succsesfully" })

})


app.get("/news/all", async (req, res) => {
    const news = await database.read();
    res.send(news)

})


app.get("/news/:id", async (req, res) => {
    const { id } = req.params;
    const news = await database.read();
    const findNews = news.find((item) => item.id == id)
    if (!findNews) {
        res.status(404).send("News not found")
    }
    findNews.views += 1;
    await database.write(news)
    res.send(findNews)
})


app.put("/news/:id", async (req, res) => {
    const { id } = req.params
    const { title, description } = req.body;
    const news = await database.read();
    const findNews = news.find((item) => item.id == id)
    if (!findNews) {
        return res.status(404).send("News not found")
    }
    title ? findNews.title = title : findNews.title = findNews.title;
    description ? findNews.description = description : findNews.description = findNews.description;


    await database.write(news)
    res.json({ message: "Succsesfully" })

})



app.delete("/news/:id", async (req, res) => {
    const { id } = req.params
    const news = await database.read();
    const findNews = news.filter((item) => {
        return item.id != id
    })
    await database.write(findNews)
    res.json({ message: "Succsesfully" })

})


app.listen(4000, () => {
    console.log("Started server");
})