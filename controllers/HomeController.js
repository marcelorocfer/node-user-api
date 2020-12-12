class HomeController {

    async index(req, res){
        res.send("App express");
    }

}

module.exports = new HomeController();