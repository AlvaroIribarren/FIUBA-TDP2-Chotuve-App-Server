const express = require('express')
const router = express.Router();
const TokenManager = require("../databases/TokensManager")

router.get("/", async (req, res) => {
    const relations = await TokenManager.getAllTokens();
    res.send(relations);
})

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const token = await TokenManager.getTokenById(id);
    res.send(token);
})

router.post("/", async (req, res) => {
    await TokenManager.validateInput(req.body);
    await TokenManager.postToken(req.body, res);
})

module.exports = router;