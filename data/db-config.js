const knex = require("knex");

const knexfile = require("../knexfile");

const enviroment = process.env.NODE_ENV || "development";

module.exports = knex(knexfile[enviroment]);

/*
clone1  || 1535bf55-f31c-4adb-b561-67b30c7bb2aa || Growr
clone2  || f6860275-2819-48d3-8da9-9bfee9a429f8 || Growr
clone3  || eaf528af-7b15-4909-b1e5-c0b146bd5503 || Dwellr
clone4  || fe1b09dc-f72a-46fd-a85c-cad77d89dc63 || Dwellr
clone5  || 9572cebd-5df7-4682-88b4-3544183e98e9 || Growr
clone6  || 20a3e016-72ba-4a53-9742-bd66fe796c33 || Growr
clone7  || 1c58a3c0-6cad-4f85-89d6-62fea79f6492 || Growr
clone8  || e5a9adfb-5059-4831-91bd-e3854981ee14 || Dwellr
clone9  || b8b6ccd2-6fcc-4876-bb8e-6ddd807e7d7a || Dwellr
clone10 || a94f43e6-6df1-4099-971f-57af570211cd || Dwellr
clone11 || 956b04f8-7ec3-4340-95a7-9d5b1a76a456 || Dwellr
clone12 || 6db06f0a-2fa6-410b-845b-94aa0ef39f3e || Growr
clone13 || 57c6c831-2cc8-47e6-8672-c916b2e48c78 || Growr
clone14 || 18bad9bc-7de6-4614-a9e2-2035a0a3744a || Dwellr
*/
