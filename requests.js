module.exports = [
    {
        adress: "/levels",
        beforeLogin: true,
        execute: (_request, response, data) => {
            data.levels.findAll().then(res => {
                res.sort((lelt, relt) => {
                    if (relt.lvl - lelt.lvl != 0) return relt.lvl - lelt.lvl;
                    else return relt.xp - lelt.xp;
                });
                response.send(res);
            });
        }
    },
    {
        adress: "/api/picture",
        beforeLogin: false,
        execute: (_request, response, data) => {
            response.send(data.Yui.user.avatarURL)
        }
    },
    {
        adress: "/api/guilds",
        beforeLogin: false,
        execute: (_request, response, data) => {
            let text = data.Yui.guilds.reduce((acc, value) => {
                let acc1 = acc;
                elt = {
                    name: value.name, id: value.id,
                    NumOfChannels: value.channels.size, NumOdMembers: value.members.size,
                    NumOfEmojis: value.emojis.size, NumOfRoles: value.roles.size,
                    owner: {
                        id: value.ownerID,
                        tag: value.owner.user.tag
                    },
                    icon: value.iconURL,
                    isKeikoThere: value.members.find(elt => elt.id == "622783718783844356") ? true : false,
                    region: value.region
                }
                acc1.push(elt);
                return acc1;
            }, []);
            response.send(text);
        }
    },
    {
        adress: "/hero",
        beforeLogin: true,
        execute: (_request, response, data) => {
            response.sendFile(__dirname + '/webpage/templateHero.html')
        }
    },
    {
        adress: "/edithero",
        beforeLogin: true,
        execute: (_request, response, data) => {
            data.Heroes.findOne({ where: { id: request.query.id } }).then(elt => {
                if (!elt) response.sendFile(__dirname + '/webpage/findless.html')
                else {
                    if (elt.userId == request.query.uid) response.sendFile(__dirname + '/webpage/templateEditHero.html')
                    else response.sendFile(__dirname + '/webpage/noperms.html')
                }
            })

        }
    },
    {
        adress: "/api/hero",
        beforeLogin: true,
        execute: (_request, response, data) => {
            data.Heroes.findOne({ where: { id: request.query.id } }).then(hero => {
                if (hero) {
                    let editedHero = hero.dataValues;
                    delete editedHero.createdAt;
                    delete editedHero.updatedAt;
                    response.send(editedHero)
                } else {
                    response.send(null)
                }

            });
        }
    },
    {
        adress: "/api/guildsettings",
        beforeLogin: true,
        execute: (_request, response, data) => {
            data.GData.findOne({ where: { guildId: request.query.id } }).then(settings => {
                let editedSettings = settings.dataValues;
                delete editedSettings.id;
                delete editedSettings.createdAt;
                delete editedSettings.updatedAt;
                response.send(editedSettings)
            });
        }
    },
    {
        adress: "/api/heroupdate",
        beforeLogin: false,
        execute: (_request, response, data) => {
            data.Heroes.findOne({ where: { id: request.query.id } }).then(elt => {
                let hero = elt.dataValues;
                data.GData.findOne({ where: { guildId: hero.guildId } }).then(guild => {
                  JSON.parse(decodeURIComponent(request.get('data'))).forEach(update => {
                    switch (update.type) {
                      case 'img':
                        hero.imageLink = update.dane;
                        break;
                      case 'field':
                        let parsedGFields = JSON.parse(guild.dataValues.fields);
                        let parsedFields = JSON.parse(hero.fields);
                        let temp = parsedFields.find(field => field.id == update.id);
                        if (temp) {
                          temp.data = update.dane;
                          parsedFields[parsedFields.findIndex(field => field.id == update.id)] = temp
                          hero.fields = JSON.stringify(parsedFields);
                        } else {
                          temp = { name: parsedGFields.find(felt => felt.id == update.id).name, data: update.dane, id: update.id }
                          parsedFields.push(temp)
                          hero.fields = JSON.stringify(parsedFields);
                          break;
                        }
                    }
            
            
                  })
                  data.Heroes.update(hero, { where: { id: request.query.id } });
                  response.send('Jest oke');
                  data.Heroes.sync();
                })
              })
        }
    },
    {
        adress: "",
        beforeLogin: false,
        execute: (_request, response, data) => {

        }
    },
]

//(_request, response, {levels, Yui, Heroes, GData})