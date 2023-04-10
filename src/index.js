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
                                        <button class="btn cardVKosarico">v Košarico</button>
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
                                    <button class="btn cardVKosarico">v Košarico</button>
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