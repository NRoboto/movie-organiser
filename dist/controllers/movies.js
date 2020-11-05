"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovies = void 0;
const omdb_1 = require("../utils/omdb");
exports.getMovies = async (req, res) => {
    try {
        const data = await omdb_1.omdbRequest(req.query);
        res.send(data);
    }
    catch (err) {
        res.status(500).send({ error: err.toString() });
    }
};
