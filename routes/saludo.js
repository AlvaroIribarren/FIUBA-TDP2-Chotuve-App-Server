const express = require("express")
const router = express.Router();

router.get("/", (req, res) => {
    res.render("saludo.ejs")
})

router.get("/more", (req,res) => {
    res.send("Saludo adicional");
})

module.exports = router;