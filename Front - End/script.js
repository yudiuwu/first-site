// Botão de compra
const buyButton = document.getElementById("buyButton");
const cartMessage = document.getElementById("cartMessage");

let itensCarrinho = 0;

buyButton.addEventListener("click", () => {
    itensCarrinho++;

    cartMessage.textContent =
        `✅ LEGO Batman adicionado ao carrinho! (${itensCarrinho} item(ns))`;

    cartMessage.style.color = "#a4d007";
    cartMessage.style.marginTop = "10px";
});

// Galeria de screenshots
const imagens = document.querySelectorAll(".gallery img");

imagens.forEach((imagem) => {
    imagem.addEventListener("click", () => {

        const overlay = document.createElement("div");

        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0,0,0,0.9)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        const imagemGrande = document.createElement("img");

        imagemGrande.src = imagem.src;
        imagemGrande.style.maxWidth = "80%";
        imagemGrande.style.maxHeight = "80%";
        imagemGrande.style.borderRadius = "10px";

        overlay.appendChild(imagemGrande);

        overlay.addEventListener("click", () => {
            document.body.removeChild(overlay);
        });

        document.body.appendChild(overlay);
    });

    const imagens = [
    "LEGO-Batman_-Legacy-of-the-Dark-Knight-Combat-Key-Art-16x9-1-scaled1.jpg",
    "LEGO-Batman_-Legacy-of-the-Dark-Knight-Combat-Key-Art-16x9-1-scaled2.jpg",
    "LEGO-Batman_-Legacy-of-the-Dark-Knight-Combat-Key-Art-16x9-1-scaled3.jpg",
    "LEGO-Batman_-Legacy-of-the-Dark-Knight-Combat-Key-Art-16x9-1-scaled4.jpg"
];

let indice = 0;

const imagem = document.getElementById("carouselImage");
const btnPrev = document.querySelector(".prev");
const btnNext = document.querySelector(".next");

btnNext.addEventListener("click", () => {
    indice++;

    if(indice >= imagens.length){
        indice = 0;
    }

    imagem.src = imagens[indice];
});

btnPrev.addEventListener("click", () => {
    indice--;

    if(indice < 0){
        indice = imagens.length - 1;
    }

    imagem.src = imagens[indice];
});

const buyButton = document.getElementById("buyButton");
const statusPagamento = document.getElementById("statusPagamento");

buyButton.addEventListener("click", () => {

    statusPagamento.innerHTML = "⏳ Processando pagamento...";

    setTimeout(() => {
        statusPagamento.innerHTML =
            "✅ Pagamento aprovado! LEGO Batman adicionado à sua biblioteca.";
    }, 2000);

});

function trocarTema(){
    document.body.classList.toggle("claro");
}
});