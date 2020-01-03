module.exports = [
    {
        adress: "/levels",
        execute: (_request, response, data) => {
            data.levels.findAll().then(res => {
                res.sort((lelt, relt) => {
                    if (relt.lvl - lelt.lvl != 0) return relt.lvl - lelt.lvl;
                    else return relt.xp - lelt.xp;
                });
                response.send(res);
            });
        }
    }
]

//(_request, response, {levels, Yui, Heroes})