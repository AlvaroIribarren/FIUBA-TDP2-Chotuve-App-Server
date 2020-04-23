const express = require("express")
const router = express.Router();

router.get("*", (req, res) => {
    res.end("Todavia el virgo del desarrollador no creo esta pestaña")
})

module.exports = router;