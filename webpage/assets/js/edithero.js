var searchParams = new URLSearchParams(document.location.search.substring(1));
var oReq = new XMLHttpRequest();
oReq.addEventListener("load", render);
oReq.open("GET", `http://yui-discord-bot.glitch.me/api/hero?id=${searchParams.get("id")}`);
oReq.send();
let gSettingsG, heroG;

async function render() {
    let div = document.getElementById('heroInfo');
    let div1 = document.getElementById('herodata');
    let div2 = document.getElementById('heroName');
    let hero = JSON.parse(this.responseText);
    heroG = hero;

    let heroNameH = document.createElement('h4')
    let heroName = document.createTextNode(hero.name);
    heroNameH.class = "card-title";
    heroNameH.style.padding = "20px";
    heroNameH.style.borderBottom = "2px solid black";
    heroNameH.style.textAlign = "center";
    heroNameH.appendChild(heroName);
    div2.appendChild(heroNameH);

    makeRequest('GET', `http://yui-discord-bot.glitch.me/api/guildsettings?id=${hero.guildId}`).then(guildSettings => {
        let gsettings = JSON.parse(guildSettings);
        gSettingsG = gsettings;
        let gfields = JSON.parse(gsettings.fields).sort((relt, lelt) => {
            if (relt.id - lelt.id != 0) return relt.id - lelt.id;
            else return relt.id - lelt.id;
        })
        gfields.forEach((elt, index) => {
            let cardDiv = document.createElement('div');
            cardDiv.class = "card-body";
            cardDiv.style.padding = "20px 200px";
            let fieldNameH = document.createElement('h4')
            let fieldName = document.createTextNode(elt.name);
            fieldNameH.class = "card-title";
            fieldNameH.appendChild(fieldName);
            cardDiv.appendChild(fieldNameH);
            let fieldTextTA = document.createElement('textarea');
            fieldTextTA.style.width = '100%';
            fieldTextTA.style.resize = fieldTextTA.style.outline = 'none';
            fieldTextTA.rows = '1';
            let field = JSON.parse(hero.fields).find(field => field.id == gfields[index].id);
            if (field) fieldTextTA.value = field.data;
            fieldTextTA.id = `textAreaID${elt.id}`
            fieldTextTA.addEventListener('keyup', stylize)
            cardDiv.appendChild(fieldTextTA);
            div.appendChild(cardDiv);
        })
        if (isValid(hero.imageLink)) {
            let cardDiv = document.createElement('div');
            cardDiv.class = "card-body";
            cardDiv.style.padding = "20px 200px";
            let fieldNameH = document.createElement('h4');
            let fieldName = document.createTextNode('Zobacz zdjęcie!');
            fieldNameH.class = "card-title";
            fieldNameH.appendChild(fieldName);
            cardDiv.appendChild(fieldNameH)
            let img = document.createElement('img');
            img.src = hero.imageLink;
            img.style.width = '25%';
            img.style.height = 'auto';
            cardDiv.appendChild(img);
            let inputTile = document.createElement('input');
            inputTile.placeholder = 'Daj linka';
            inputTile.style.width = '100%';
            inputTile.id = 'inputTile1';
            inputTile.value = hero.imageLink;
            cardDiv.appendChild(inputTile);
            div1.appendChild(cardDiv)
        } else {
            let cardDiv = document.createElement('div');
            cardDiv.class = "card-body";
            cardDiv.style.padding = "20px 200px";
            let inputTile = document.createElement('input');
            inputTile.placeholder = 'Daj linka';
            inputTile.style.width = '100%';
            inputTile.id = 'inputTile1'
            cardDiv.appendChild(inputTile);
            div1.appendChild(cardDiv);
        }
        stylizeAll();
    })

}

function stylize() {
    let target = arguments[0].target;
    target.rows = Math.floor((1500 / target.clientWidth / 2) * (target.value.length / 80)) || 1;
}


function stylizeAll() {
    document.getElementById('heroInfo').childNodes.forEach(elt => {
        stylize({ target: elt.childNodes[1] })
    })
}

function isValid(url) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(url)) {
        return false;
    } else {
        return true;
    }
}

function update() {
    let data = [];
    let gfields = JSON.parse(gSettingsG.fields).sort((relt, lelt) => {
        if (relt.id - lelt.id != 0) return relt.id - lelt.id;
        else return relt.id - lelt.id;
    })
    gfields.forEach((elt, index) => {
        let val = document.getElementById(`textAreaID${elt.id}`).value.replace('\\n', '\n');
        let field = JSON.parse(heroG.fields).find(field => field.id == gfields[index].id)
        if (field) {
            if (val != `${field.data}`) {
                data.push({ type: "field", id: elt.id, dane: val })
            }
        } else {
            data.push({ type: "field", id: elt.id, dane: val })
        }
    })
    let imglink = document.getElementById('inputTile1').value;
    if (imglink != heroG.imageLink) data.push({ type: "img", dane: imglink });
    if (data.length > 0) {
        request(`http://yui-discord-bot.glitch.me/api/heroupdate?id=${searchParams.get("id")}`, JSON.stringify(data))
        alert('Dane pomyślnie zaktualizowane')
        location.reload();
    } else {
        alert('Dane nie wymagają żadnych zmian')
    }
}
function makeRequest(method, url, data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('data', JSON.stringify(data))
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

function request(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('data', encodeURIComponent(data))
    xhr.send();
}