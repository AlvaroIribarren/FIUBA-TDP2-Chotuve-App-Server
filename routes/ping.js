const express = require('express');
const router = express.Router();

router.get("/", async (req,res) => {
    const msg = "Todo piola";
    res.status(200).send({msg});
})

module.exports = router;