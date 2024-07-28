const express = require('express');
const router = express.Router();
const PLAYER_URL = process.env.PLAYER_URL;

// if the server receives a post request from the client - in this case the mahjogn backend 
router.post("/", async (req, res, next) => {
    try {
        const { message } = req.body;
        console.log(`received message: ${message}`);
        let resString;

        if (message === "Players Updated") {
            // fetch the players from the database
            // res.status(200).json({ message: "Hello from Yui. Players updated." });
            req.body.message = "Players Updated";
            console.log("Players Update");
            next();
        }

        else if (message === "Games Updated") {
            // fetch the games from the database
            // resString = await fetchRanking(PLAYER_URL);
            // res.status(200).json({ message: "Hello from Yui. Games updated." });
            req.body.message = "Games Updated";
            console.log("Games Update");
        }

        else {
            res.status(200).json({ message: "Hello from Yui. Whatayatrynasay?" });
            console.log("Hello from Yui");
        }
        next();
        
    } catch (error) {
        console.error(`error in generalRoutes: ${error}`);
        res.status(500).json({ message: "Error" });
    }
});

module.exports = router;