

class News {
    constructor(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.views = 0;
        this.createAt = new Date;
    }
}


module.exports = News;