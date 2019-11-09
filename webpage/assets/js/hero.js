var searchParams = new URLSearchParams(document.location.search.substring(1));
var oReq = new XMLHttpRequest();
oReq.addEventListener("load", render);
oReq.open("GET", `http://yui-discord-bot.glitch.me/api/hero?id=${searchParams.get("id")}`);
oReq.send();

function render() {
    let div = document.getElementById('heroInfo');
    let div1 = document.getElementById('herodata');
    let div2 = document.getElementById('heroName');
    let hero;
    try {
        hero = JSON.parse(this.responseText);
    } catch (e) {
        location.href = '/findless.html';
        return;
    }
    let heroNameH = document.createElement('h4')
    let heroName = document.createTextNode(hero.name);
    heroNameH.class = "card-title";
    heroNameH.style.padding = "20px";
    heroNameH.style.borderBottom = "2px solid black";
    heroNameH.style.textAlign = "center";
    heroNameH.appendChild(heroName);
    div2.appendChild(heroNameH);

    JSON.parse(hero.fields).forEach(elt => {
        if (elt.data == '') { return; }
        let cardDiv = document.createElement('div');
        cardDiv.class = "card-body";
        cardDiv.style.padding = "20px 200px";
        let fieldNameH = document.createElement('h4')
        let fieldName = document.createTextNode(elt.name);
        fieldNameH.class = "card-title";
        fieldNameH.appendChild(fieldName);
        cardDiv.appendChild(fieldNameH);
        let fieldTextP = document.createElement('p');
        `${elt.data}`.split('\n').forEach(parag => {
            let fieldText = document.createTextNode(parag);
            fieldTextP.appendChild(fieldText);
            let br = document.createElement("br");
            fieldTextP.appendChild(br);
        });
        cardDiv.appendChild(fieldTextP);
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
        div1.appendChild(cardDiv);
    }
}

function isValid(url) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(url)) {
        return false;
    } else {
        return true;
    }
}