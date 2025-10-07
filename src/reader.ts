import express from "express";
import fs from "fs";
import path from "path";
import axios from "axios";

const BASE_URL = `/reader`;

const app = express();
const PORT: Number = 3010;

app.use(BASE_URL, express.static("./reader/dist/"));
app.use(`${BASE_URL}/books`, express.static("./books/"));
app.get(`${BASE_URL}/book/:id`, (req, res) => {
    res.sendFile(path.join(process.cwd(), "/reader/dist/index.html"));
});
app.get(`${BASE_URL}/api/books`, (req, res) => {
    const books = fs
        .readdirSync("./books", {
            encoding: "utf8"
        })
        .map(b => ({
            stat: fs.statSync(path.join("books", b)),
            id: b,
            name: b
        }))
        .filter(b => b.stat.isDirectory())
        .sort((prev, next) => prev.stat.mtime.getTime() - next.stat.mtime.getTime())
        .map(b => ({
            id: b.id,
            name: b.name,
            mtme: b.stat.mtime.toISOString()
        }));
    res.json(books);
});

app.get(`${BASE_URL}/api/book-info/:id`, (req, res) => {
    const filePath = path.join("books", req.params.id, "book-info.json");
    if (fs.existsSync(filePath)) {
        res.json(JSON.parse(fs.readFileSync(filePath).toString()));
        return;
    }
    const url = `https://pubcloud.ptpress.cn/pubcloud/content/onlineProject/getById?id=${req.params.id}`;
    axios.get(url).then(response => {
        const data = response.data;
        fs.writeFileSync(filePath, JSON.stringify(data));
        res.json(data);
    }).catch(error => res.json({
        success: false
    }));
});

app.listen(PORT, () => {
    console.log(`访问 http://localhost:${PORT}${BASE_URL} 阅读电子书`);
});
