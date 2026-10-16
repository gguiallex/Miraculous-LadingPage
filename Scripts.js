let nome = document.querySelector(".nome");
let portador = document.querySelector(".personagem");
let herois = document.querySelectorAll(".herois");

function mudarPersonagem(nomePortador, imagemPortador, corPortador) {
    nome.innerHTML = nomePortador;
    portador.src = imagemPortador;
    nome.style.color = corPortador;
    herois.forEach(function(item) {
        item.style.border = `3px solid ${corPortador}`;
    })

}