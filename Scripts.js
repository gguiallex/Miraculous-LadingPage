
let nome = document.querySelector(".nome");
let portador = document.querySelector(".personagem");
let herois = document.querySelectorAll(".herois");

const inputFoto = document.getElementById("inputFoto");
const carregamento = document.getElementById("carregamento");
const mensagemCarregamento = document.getElementById(
    "mensagemCarregamento"
);

function mudarPersonagem(nomePortador, imagemPortador, corPortador) {
    nome.textContent = nomePortador;
    portador.src = imagemPortador;
    portador.alt = `Imagem de ${nomePortador}`;
    nome.style.color = corPortador;

    herois.forEach(function (item) {
        item.style.border = `3px solid ${corPortador}`;
    });
}

function mostrarCarregamento(mensagem) {
    mensagemCarregamento.textContent = mensagem;
    carregamento.hidden = false;
}

function esconderCarregamento() {
    carregamento.hidden = true;
}

async function lerFoto(input) {
    const arquivo = input.files[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
        alert("Selecione um arquivo de imagem válido.");
        input.value = "";
        return;
    }

    mostrarCarregamento(
        "Estamos preparando sua transformação. Isso pode levar alguns instantes."
    );

    input.disabled = true;

    try {
        const leitor = new FileReader();

        const resultadoLeitura = await new Promise((resolve, reject) => {
            leitor.onload = () => resolve(leitor.result);
            leitor.onerror = () => reject(
                new Error("Não foi possível ler a foto selecionada.")
            );

            leitor.readAsDataURL(arquivo);
        });

        mensagemCarregamento.textContent =
            "Criando sua versão de Miraculous...";

        const desenho = await puter.ai.txt2img(
            "Transforme a pessoa da imagem em um personagem de " +
            "Miraculous, inspirado no estilo visual da temporada 6. " +
            "Escolha aleatoriamente um miraculous da caixa principal, " +
            "entre os seguintes: Joaninha, Gato, Borboleta, Abelha, " +
            "Raposa, Pavão, Tartaruga, Rato, Boi, Tigre, Coelho, " +
            "Dragão, Cobra, Cavalo, Cão, Macaco, Cabra, Galo ou Porco. " +
            "Crie um traje heroico original inspirado no miraculous escolhido. " +
            "Preserve as características reconhecíveis da pessoa da foto. " +
            "Mostre o personagem de corpo inteiro, em uma pose heroica, " +
            "com estética de animação. Não inclua kwami. " +
            "Gere a imagem em PNG com fundo transparente.",
            {
                model: "replicate:openai/gpt-image-2.5-flare",
                provider: "openai",
                input_image: resultadoLeitura,
                quality: "medium",
                providerOptions: {
                    background: "transparent"
                }
            }
        );

        const imagemGerada =
            desenho instanceof HTMLImageElement
                ? desenho.src
                : desenho?.src || desenho;

        if (typeof imagemGerada !== "string" || !imagemGerada) {
            throw new Error(
                "O serviço não retornou um endereço de imagem válido."
            );
        }

        mudarPersonagem("Você", imagemGerada, "#E3000B");

    } catch (erro) {
        console.error("Erro ao transformar a foto:", erro);

        alert(
            "Não foi possível realizar sua transformação. " +
            "Verifique sua conexão e tente novamente."
        );
    } finally {
        esconderCarregamento();
        input.disabled = false;

        input.value = "";
    }
}
