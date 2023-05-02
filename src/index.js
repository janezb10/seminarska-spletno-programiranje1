let products = [];
let productCategorryIDs = [];
const najboljProdajani = document.getElementById("najboljProdajanoIzdelki");

if(najboljProdajani) {
    (async function getData() {
        const response = await fetch(`/podatki/data.json`);
        const jsonData = await response.json();
        products = jsonData.products;
        productCategorryIDs = jsonData.productCategorryIDs;
        const najboljProdajaniIzdelkiHTML = products
            .map(e => {
                if(e.najboljProdajano) {
                    return `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
                                <div class="card">
                                    
                                    <a class="aimg" href="izdelek.html?id=${e.ID}"><img src="${e.image}" class="card-img-top" alt="..."></a>
                                        <h5 class="card-titl">${e.name}</h5>
                                        <p class="card-tex">${e.description}</p>
                                        <h6 class="cardCena">Cena: ${e.price} eur</h6>
                                        <a href="izdelek.html?id=${e.ID}" class="btn btn-secondary cardPoglej">Poglej si</a>
                                        <button class="btn cardVKosarico vKosarico btn-primary" onclick="dodajVKosarico(${e.ID})">v Košarico</button>
                                </div>
                            </div>`;
                } else {
                    return "";
                }
            })
            .join("");
        najboljProdajani.innerHTML = najboljProdajaniIzdelkiHTML;
        pobarvaj();
    }());
}

const zadnjiClanki2 = document.getElementById("zadnjiClanki2");
if(zadnjiClanki2) {
    (async function getZadnjiClanki() {
        const response = await fetch(`/podatki/data.json`);
        const jsonData = await response.json();
        const articles = jsonData.articles;
        const zadnjiClanki2HTML = articles
            .map(e => {
                if(e.naNaslovniStrani) {
                    return `
                    <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                        <div class="card">
                            <a href="article.html?id=${e.articleID}" class="aimg"><img src="${e.image}" class="card-img-top" alt="..."></a>
                            <h5 class="card-titl">${e.title}</h5>
                            <p class="card-tex">${e.contentShort}</p>
                            <a href="article.html?id=${e.articleID}" class="btn cardPoglej">Preberi članek</a>
                        </div>
                    </div>
                `;
                }
                else {
                    return "";
                }
            })
            .join("");
            zadnjiClanki2.innerHTML = zadnjiClanki2HTML;
    }());
}

const seznamIzdelkov = document.getElementById("seznamIzdelkov");
if(seznamIzdelkov) {
    prikaziIzdelke();
}

async function prikaziIzdelke(kategorija = 0) {
    const response = await fetch(`/podatki/data.json`);
    const jsonData = await response.json();
    products = jsonData.products;
    productCategorryIDs = jsonData.productCategorryIDs;
    let izdelkiHTML = products
        .map(e => {
            if(e.productCategorryID == kategorija || kategorija == 0) {
                return `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
                            <div class="card">
                                    <a href="izdelek.html?id=${e.ID}" class="aimg"><img src="${e.image}" class="card-img-top" alt="..."></a>
                                    <h5 class="card-titl">${e.name}</h5>
                                    <p class="card-tex">${e.description}</p>
                                    <h6 class="cardCena">Cena: ${e.price} eur</h6>
                                    <a href="izdelek.html?id=${e.ID}" class="btn btn-secondary cardPoglej">Poglej si</a>
                                    <button class="btn cardVKosarico vKosarico btn-primary" onclick="dodajVKosarico(${e.ID})">v Košarico</button>
                            </div>
                        </div>`;
            } else {
                return "";
            }
            })
        .join("");
    if(izdelkiHTML == "") {
        izdelkiHTML ="<h4>V teji kategoriji ni izdelkov</h4>";
    }
    seznamIzdelkov.innerHTML = izdelkiHTML;
    pobarvaj();
    const gumb = document.getElementById("izdelkiDropdown");
    switch(kategorija) {
        case 0:
            gumb.innerText = "Vsi izdelki";
            break;
        case 1:
            gumb.innerText = "Grafične kartice";
            break;
        case 2:
            gumb.innerText = "Procesorji";
            break;
        case 3:
            gumb.innerText = "Osnovne Plošče";
            break;
        case 4:
            gumb.innerText = "RAM pomnilnik";
            break;
        case 5:
            gumb.innerText = "Napajalniki";
            break;
        case 6:
            gumb.innerText = "Računalniška ohišja";
    }

};

const izdelek = document.getElementById("izdelek");
if(izdelek) {
    prikaziIzdelek();
}
async function prikaziIzdelek() {
    const response = await fetch(`/podatki/data.json`);
    const jsonData = await response.json();
    products = jsonData.products;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const iskaniIzdelek = products.find(i => i.ID == productId);
    let izdelekHTML = "";
    if(!iskaniIzdelek) {
        izdelekHTML = '<h2>Izdelek, ki ste ga iskali ne obstaja</h2><p>Poiščite izdelke <a href="/Izdelki.html">tukaj!</a></p>';
    }
    else {
        izdelekHTML = `
            <div class="izdelekIme">
                <h2>${iskaniIzdelek.name}</h2>
            </div>
            <div class="izdelekOpis row">
                <div class="izdelekSlika col-md-12 col-lg-6">
                    <img class="img-fluid" src="${iskaniIzdelek.image}" alt="slika izdelka">
                </div>
                <div class="izdelekContent col-md-12 col-lg-6">
                    ${iskaniIzdelek.content}
                </div>
            </div>
            <div class="izdelekKosarica d-flex justify-content-end">
                <button type="button" class="btn btn-primary vKosarico" onclick="dodajVKosarico(${iskaniIzdelek.ID})">v Košarico</button>
            </div>
        `;
    }
    izdelek.innerHTML = izdelekHTML;
    pobarvaj();

}


function dodajVKosarico(id) {
    let izdelkiVKosarici = [];
    if(sessionStorage.getItem("izdelkiVKosarici")) {
        izdelkiVKosarici = [...JSON.parse(sessionStorage.getItem("izdelkiVKosarici"))];
    }
    let izdelek = izdelkiVKosarici.find(e => e.id == id);
    if(izdelek) {
        izdelek.kolicina +=1;
    }
    else {
        izdelkiVKosarici.push({id: id, kolicina: 1});
    }
    sessionStorage.setItem("izdelkiVKosarici", JSON.stringify(izdelkiVKosarici));
};

function odstraniIzKosarice(id) {
    let izdelkiVKosarici = [];
    if(sessionStorage.getItem("izdelkiVKosarici")) {
        izdelkiVKosarici = [...JSON.parse(sessionStorage.getItem("izdelkiVKosarici"))];
    }
    let izdelek = izdelkiVKosarici.find(e => e.id == id);
    if(izdelek) {
        const index = izdelkiVKosarici.indexOf(izdelek);
        if(index > -1) izdelkiVKosarici.splice(index, 1);
    }
    sessionStorage.setItem("izdelkiVKosarici", JSON.stringify(izdelkiVKosarici));
    prikaziIzdelkeVKosarici();
};


const kosarica = document.getElementById("kosarica");

// prikazi izdelke v kosarici
async function prikaziIzdelkeVKosarici() {
    const response = await fetch(`/podatki/data.json`);
    const jsonData = await response.json();
    products = jsonData.products;
    productCategorryIDs = jsonData.productCategorryIDs;

    let izdelkiVKosarici = [];
    if(sessionStorage.getItem("izdelkiVKosarici")) {
        izdelkiVKosarici = [...JSON.parse(sessionStorage.getItem("izdelkiVKosarici"))];
    }
    let cenaIzdelki = 0;
    let stIzdelkov = 0;
    let izdelkiVKosariciHTML = izdelkiVKosarici
        .map(e => {
            let produkt = products.find(p => p.ID == e.id);
            if(!produkt) return "";
            cenaIzdelki += produkt.price * e.kolicina;
            stIzdelkov += e.kolicina;
            return `
            <div class="kosarica-izdelek">
                  <div class="row mb-4 d-flex justify-content-between align-items-center">
                    <div class="col-md-2 col-lg-2 col-xl-2">
                      <img
                        src="${produkt.image}"
                        class="img-fluid rounded-3" alt="...">
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-3">
                      <h6 class="text-black mb-0">${produkt.name}</h6>
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                      <button class="btn btn-link px-2"
                        onclick="this.parentNode.querySelector('input[type=number]').stepDown(); kosaricaSpremembaKolicine(${e.id}, -1);">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                        </svg>
                      </button>

                      <input min="0" name="quantity" value="${e.kolicina}" disabled readonly type="number"
                        class="form-control form-control-sm kolicina" />

                      <button class="btn btn-link px-2"
                        onclick="this.parentNode.querySelector('input[type=number]').stepUp(); kosaricaSpremembaKolicine(${e.id}, 1);">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                      </button>
                    </div>
                    <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                      <h6 class="mb-0">€ ${Math.round(produkt.price * e.kolicina * 100) / 100}</h6>
                    </div>
                    <div class="col-md-1 col-lg-1 col-xl-1 text-end" onclick="odstraniIzKosarice(${e.id})">
                      <svg class="gumbOdstrani" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
            `;
        })
        .join("");
    // console.log(izdelkiVKosariciHTML);
    if(izdelkiVKosariciHTML == "") {
        izdelkiVKosariciHTML = '<p>V košarici trenutno ni izdelkov. Dodaj jih <a href="/Izdelki.html">Tukaj!</a></p>';
    }
    const kosaricaSeznam = document.getElementById("kosarica-izdelki-seznam");
    cenaIzdelki = Math.round(cenaIzdelki * 100) / 100;
    document.getElementById("cenaIzdelki").innerText = cenaIzdelki;
    document.getElementById("stIzdelkov").innerText = stIzdelkov;
    document.getElementById("cenaTotal").innerText = totalPriceZDostavo(cenaIzdelki);
    kosaricaSeznam.innerHTML = izdelkiVKosariciHTML;
};

if(kosarica) {
    prikaziIzdelkeVKosarici();
}

function kosaricaSpremembaKolicine(id, vecManj) {
    let izdelkiVKosarici = [];
    if(sessionStorage.getItem("izdelkiVKosarici")) {
        izdelkiVKosarici = [...JSON.parse(sessionStorage.getItem("izdelkiVKosarici"))];
    }
    let izdelek = izdelkiVKosarici.find(e => e.id == id);
    if(izdelek) {
            if(vecManj == 1) {
            izdelek.kolicina += 1;
            }
            if(vecManj == -1) {
                izdelek.kolicina -= 1;
                if(izdelek.kolicina < 0) {
                    const index = izdelkiVKosarici.indexOf(izdelek);
                    if(index > -1) izdelkiVKosarici.splice(index, 1);
                }
            }
        }
        sessionStorage.setItem("izdelkiVKosarici", JSON.stringify(izdelkiVKosarici));
        prikaziIzdelkeVKosarici();
}

function totalPriceZDostavo(cenaIzdelki) {
    const dostavaForm = document.getElementById("kosarica-dostava");
    if(dostavaForm.value == 1) return cenaIzdelki;
    else if(dostavaForm.value == 2) return cenaIzdelki + 4.5;
    else if(dostavaForm.value == 3) return cenaIzdelki + 5;
    else return cenaIzdelki;
}

pobarvaj();
function pobarvaj() {
    const buttons = document.querySelectorAll('.vKosarico');
    
    buttons.forEach((gumb) => {
        gumb.addEventListener('click', () => {
            gumb.style.backgroundColor = "#0743B9";
            gumb.innerText = 'Dodano ✔';
        })
    })
}

const blog = document.getElementById('blog');
if(blog) {
    prikaziBlog();
}

async function prikaziBlog() {
    const response = await fetch(`/podatki/data.json`);
    const jsonData = await response.json();
    const articles = jsonData.articles;

    const blogHTML = articles
        .map(e => {
            return `
                <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                    <div class="card">
                        <a href="article.html?id=${e.articleID}" class="aimg"><img src="${e.image}" class="card-img-top" alt="..."></a>
                        <h5 class="card-titl">${e.title}</h5>
                        <p class="card-tex">${e.contentShort}</p>
                        <a href="article.html?id=${e.articleID}" class="btn cardPoglej">Preberi članek</a>
                    </div>
                </div>
            `;})
        .join("");
    blog.innerHTML = blogHTML;
    // console.log(articles);
}

const article = document.getElementById("article");
if(article) {
    showArticle();
}

async function showArticle() {
    const response = await fetch(`/podatki/data.json`);
    const jsonData = await response.json();
    articles = jsonData.articles;

    const urlParams = new URLSearchParams(window.location.search);
    const clanekId = urlParams.get('id');
    const iskaniClanek = articles.find(i => i.articleID == clanekId);

    let articleHTML = "";
    if(!iskaniClanek) {
        articleHTML = '<h2>Članek, ki ste ga iskali ne obstaja</h2><p>Preberi zanimive objave <a href="/blog.html">tukaj!</a></p>';
    }
    else {
        articleHTML = `
            <div class="articleTitle">
                <h2>${iskaniClanek.title}</h2>
            </div>
            <div class="clanekOpis row">
                <div class="clanekSlika col-md-12 col-lg-6">
                    <img class="img-fluid" src="${iskaniClanek.image}" alt="slika pri clanku">
                </div>
                <div class="clanekContent col-md-12 col-lg-6">
                    ${iskaniClanek.content}
                </div>
            </div>
            <div class="nazajNaBlog d-flex justify-content-end">
                <p>Preberi še več zanimivih objav <a href="/blog.html">tukaj!</a></p>
            </div>
        `;
    }
    article.innerHTML = articleHTML;
}

const iskanje = document.getElementById("iskanje");
if(iskanje) {
    isci();
}
async function isci() {
    const response = await fetch(`/podatki/data.json`);
    const jsonData = await response.json();
    articles = jsonData.articles;
    products = jsonData.products;

    const urlParams = new URLSearchParams(window.location.search);
    const niz = urlParams.get('niz');
    const zadetkiProducts = [];
    for(i=0; i<products.length; i++) {
        for(key in products[i]) {
            if(key == "name" || key == "description" || key == "content") {
                let regex = new RegExp(niz, "i");
                if(products[i][key].search(regex) != -1) {
                    if(!zadetkiProducts.includes(products[i])) {
                        zadetkiProducts.push(products[i]);
                    }
                }
            }
        }
    }
    const zadetkiArticles = [];
    for(i=0; i<articles.length; i++) {
        for(key in articles[i]) {
            if(key == "title" || key == "contentShort" || key == "content") {
                let regex = new RegExp(niz, "i");
                if(articles[i][key].search(regex) != -1) {
                    if(!zadetkiArticles.includes(articles[i])) {
                        zadetkiArticles.push(articles[i]);
                    }
                }
            }
        }
    }
    console.log(zadetkiProducts);

    let zadetkiHTML = '<h2>Zadetki iskanja - Izdelki: </h2> <div class="row zadetkiProducts">';
    let umes = zadetkiProducts
        .map(e => {
            return `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
                        <div class="card">
                            <img src="${e.image}" class="card-img-top" alt="...">
                            
                                <h5 class="card-titl">${e.name}</h5>
                                <p class="card-tex">${e.description}</p>
                                <h6 class="cardCena">Cena: ${e.price} eur</h6>
                                <a href="izdelek.html?id=${e.ID}" class="btn btn-secondary cardPoglej">Poglej si</a>
                                <button class="btn cardVKosarico vKosarico btn-primary" onclick="dodajVKosarico(${e.ID})">v Košarico</button>
                        </div>
                    </div>`;
        })
        .join("");
    if(umes != "") {
        zadetkiHTML += umes;
    }
    else {
        zadetkiHTML += "<p>Žal nismo našli nobenega izdelka z vašim iskalnim nizem.</p>";
    }
    zadetkiHTML += '</div> <h2>Zadetki iskanja - Blog:</h2><div class="row zadetkiArticles">';
    let umes2 = zadetkiArticles
        .map(e => {
            return `
            <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div class="card">
                    <img src="${e.image}" class="card-img-top" alt="...">
                    <h5 class="card-titl">${e.title}</h5>
                    <p class="card-tex">${e.contentShort}</p>
                    <a href="article.html?id=${e.articleID}" class="btn cardPoglej">Preberi članek</a>
                </div>
            </div>
        `;})
        .join("");
    if(umes2 !== "") {
        zadetkiHTML += umes2;
    }
    else {
        zadetkiHTML += "<p>Žal nismo našli nobenega članka z vašim iskalnim nizem.</p>";
    }
    zadetkiHTML += '</div>';
    iskanje.innerHTML = zadetkiHTML;
    pobarvaj();
}

const formIskanje = document.getElementById("formIskanje");
formIskanje.addEventListener("submit", function(e) {
    e.preventDefault();
    const text = document.getElementById("iskanjeText").value;
    if(text !== "") {
        window.location.href = `iskanje.html?niz=${text}`;
    }
});


function kontaktPreveri() {
    const imePriimek = document.getElementById("f-imePriimek");
    const podjetje = document.getElementById("f-podjetje");
    const telefon = document.getElementById("f-telefon");
    const email = document.getElementById("f-email");
    const opis = document.getElementById("f-opis");

    let test = true;
    let alert = "";

    if(!/^[A-Za-z\s]*$/.test(imePriimek.value) || imePriimek.value == "") {
        test = false;
        alert += `
            <div class="alert alert-warning" role="alert">
                Ime in Priimek nista pravilno Vnešena!
            </div>
        `;
        imePriimek.style = "border: 2px solid #FF4676;";
    }
    if(!/^[A-Za-z0-9]*$/.test(podjetje.value) || podjetje.value == "") {
        test = false;
        alert += `
            <div class="alert alert-warning" role="alert">
                Podjetje ni pravilno vnešeno v polje!
            </div>
        `;
        podjetje.style = "border: 2px solid #FF4676;";
    }
    if(!/^\d+$/.test(telefon.value) || telefon.value == "") {
        test = false;
        alert += `
            <div class="alert alert-warning" role="alert">
                Telefon ni pravilno vnešen!
            </div>
        `;
        telefon.style = "border: 2px solid #FF4676;";
    }
    if(!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email.value) || email.value == "") {
        test = false;
        alert += `
            <div class="alert alert-warning" role="alert">
                Vnesite pravi email naslov!
            </div>
        `;
        email.style = "border: 2px solid #FF4676;";
    }
    if(opis.value == "") {
        test = false;
        alert += `
            <div class="alert alert-warning" role="alert">
                Opis ne sme biti prazen!
            </div>
        `;
        opis.style = "border: 2px solid #FF4676;";
    }

    if(!test) {
        fAlert = document.getElementById("f-alert");
        fAlert.innerHTML = alert;
    }
    return test;
}