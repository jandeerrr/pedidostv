const SERVIDOR = "https://bias-nancy-optical-animated.trycloudflare.com";

const player = document.getElementById("player");
const lista = document.getElementById("listaVideos");
const titulo = document.getElementById("titulo");
const sinopse = document.getElementById("sinopse");
const nota = document.getElementById("nota");
const ano = document.getElementById("ano");
const categoria = document.getElementById("categoria");
const pesquisa = document.getElementById("pesquisa");


/* =====================================================
   BUSCAR AUTOMATICAMENTE OS VÍDEOS DO SERVIDOR
   ===================================================== */

async function carregarVideos() {

    try {

        const resposta = await fetch(SERVIDOR + "/");

        if (!resposta.ok) {
            throw new Error("Não foi possível acessar o servidor.");
        }

        const html = await resposta.text();

        // Transforma o HTML recebido em documento
        const parser = new DOMParser();

        const documento =
            parser.parseFromString(html, "text/html");


        // Pega todos os links encontrados na página
        const links =
            documento.querySelectorAll("a");


        const videos = [];


        links.forEach(link => {

            const href = link.getAttribute("href");

            if (!href) return;


            // Procuramos somente arquivos MP4
            if (href.toLowerCase().endsWith(".mp4")) {

                let arquivo =
                    decodeURIComponent(
                        href.split("/").pop()
                    );


                // Remove duplicados
                if (
                    !videos.some(
                        video => video.arquivo === arquivo
                    )
                ) {

                    videos.push({

                        arquivo: arquivo,

                        // O nome do arquivo vira o título
                        titulo:
                            arquivo.replace(
                                /\.mp4$/i,
                                ""
                            ),

                        capa: "",

                        sinopse:
                            "Descrição ainda não cadastrada.",

                        nota: "0.0",

                        ano: "",

                        categoria: "Vídeo"

                    });

                }

            }

        });


        console.log(
            "Vídeos encontrados:",
            videos
        );


        criarCatalogo(videos);


        // Guarda para a pesquisa
        window.todosVideos = videos;


    } catch (erro) {

        console.error(
            "Erro ao carregar vídeos:",
            erro
        );


        lista.innerHTML = `
            <p class="erro">
                Não foi possível carregar os vídeos.
            </p>
        `;

    }

}


/* =====================================================
   ABRIR VÍDEO
   ===================================================== */

function abrirVideo(video) {

    const endereco =
        SERVIDOR +
        "/video/" +
        encodeURIComponent(video.arquivo);


    console.log(
        "Abrindo:",
        endereco
    );


    player.src = endereco;

    player.load();

    player.play().catch(() => {});


    titulo.textContent =
        video.titulo;

    sinopse.textContent =
        video.sinopse;

    nota.textContent =
        "★ " + video.nota;

    ano.textContent =
        video.ano;

    categoria.textContent =
        video.categoria;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   CRIAR OS CARDS
   ===================================================== */

function criarCatalogo(videos) {

    lista.innerHTML = "";


    if (videos.length === 0) {

        lista.innerHTML = `
            <p>
                Nenhum vídeo encontrado.
            </p>
        `;

        return;
    }


    videos.forEach(video => {

        const card =
            document.createElement("div");

        card.className = "card";


        card.innerHTML = `

            <div class="capa">

                ${
                    video.capa

                    ?

                    `<img
                        src="${video.capa}"
                        alt="${video.titulo}">
                    `

                    :

                    `<div class="sem-capa">
                        ▶
                    </div>`
                }

            </div>


            <div class="card-info">

                <h3>
                    ${video.titulo}
                </h3>


                <div class="card-meta">

                    <span>
                        ★ ${video.nota}
                    </span>

                    <span>
                        ${video.ano}
                    </span>

                </div>

            </div>

        `;


        card.addEventListener(
            "click",
            () => abrirVideo(video)
        );


        lista.appendChild(card);

    });

}


/* =====================================================
   PESQUISA
   ===================================================== */

pesquisa.addEventListener(
    "input",
    () => {

        const termo =
            pesquisa.value
                .toLowerCase()
                .trim();


        const resultado =
            window.todosVideos.filter(video =>

                video.titulo
                    .toLowerCase()
                    .includes(termo)

            );


        criarCatalogo(resultado);

    }
);


/* =====================================================
   INICIAR
   ===================================================== */

carregarVideos();