let products = [];
let productCategorryIDs = [];

(async function getData() {
    // odstrani /src
    const response = await fetch(`/podatki/data.json`);
    const jsonData = await response.json();
    products = jsonData.products;
    productCategorryIDs = jsonData.productCategorryIDs;
    const najboljProdajani = document.getElementById("najboljProdajanoIzdelki");
    const najboljProdajaniIzdelkiHTML = products
        .map(e => {
            return `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
                        <div class="card">
                            <img src="${e.image}" class="card-img-top" alt="...">
                            
                                <h5 class="card-titl">${e.name}</h5>
                                <p class="card-tex">${e.description}</p>
                                <h6 class="cardCena">Cena: ${e.price} eur</h6>
                                <a href="#" class="btn btn-primary cardPoglej">Poglej si</a>
                                <button class="btn cardVKosarico">v Košarico</button>
                        </div>
                    </div>`;})
        .join("");
    najboljProdajani.innerHTML = najboljProdajaniIzdelkiHTML;
}());
