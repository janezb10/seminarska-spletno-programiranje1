let products = [];
let productCategorryIDs = [];
const najboljProdajani = document.getElementById("najboljProdajanoIzdelki");
const seznamIzdelkov = document.getElementById("seznamIzdelkov");

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
                                    <img src="${e.image}" class="card-img-top" alt="...">
                                    
                                        <h5 class="card-titl">${e.name}</h5>
                                        <p class="card-tex">${e.description}</p>
                                        <h6 class="cardCena">Cena: ${e.price} eur</h6>
                                        <a href="#" class="btn btn-primary cardPoglej">Poglej si</a>
                                        <button class="btn cardVKosarico" onclick="dodajVKosarico(${e.ID})">v Košarico</button>
                                </div>
                            </div>`;
                } else {
                    return "";
                }
            })
            .join("");
        najboljProdajani.innerHTML = najboljProdajaniIzdelkiHTML;
    }());
}

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
                                <img src="${e.image}" class="card-img-top" alt="...">
                                
                                    <h5 class="card-titl">${e.name}</h5>
                                    <p class="card-tex">${e.description}</p>
                                    <h6 class="cardCena">Cena: ${e.price} eur</h6>
                                    <a href="#" class="btn btn-primary cardPoglej">Poglej si</a>
                                    <button class="btn cardVKosarico" onclick="dodajVKosarico(${e.ID})">v Košarico</button>
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



function dodajVKosarico(id) {
    // const response = await fetch(`/podatki/data.json`);
    // const jsonData = await response.json();
    // products = jsonData.products;
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


// prikazi izdelke v kosarici
const kosarica = document.getElementById("kosarica");


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
    const izdelkiVKosariciHTML = izdelkiVKosarici
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
                        class="img-fluid rounded-3" alt="Cotton T-shirt">
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-3">
                      <h6 class="text-muted">kategorija</h6>
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

// kosarica v sessionStorage
// [
//     {
//         id: 4
//         kolicina: 2
//     },
//     {
//         id:2
//         kolicina: 5
//     }
// ]


// // Get the text field that we're going to track
// let field = document.getElementById("field");

// // See if we have an autosave value
// // (this will only happen if the page is accidentally refreshed)
// if (sessionStorage.getItem("autosave")) {
//   // Restore the contents of the text field
//   field.value = sessionStorage.getItem("autosave");
// }

// // Listen for changes in the text field
// field.addEventListener("change", () => {
//   // And save the results into the session storage object
//   sessionStorage.setItem("autosave", field.value);
// });