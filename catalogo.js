const SERVIDOR =
    "https://bias-nancy-optical-animated.trycloudflare.com";


const player =
    document.getElementById("player");

const lista =
    document.getElementById("listaVideos");

const titulo =
    document.getElementById("titulo");

const sinopse =
    document.getElementById("sinopse");

const nota =
    document.getElementById("nota");

const ano =
    document.getElementById("ano");

const categoria =
    document.getElementById("categoria");

const pesquisa =
    document.getElementById("pesquisa");


let todosVideos = [];



/* =====================================================
   CARREGAR INFORMAÇÕES DO JSON
   ===================================================== */

async function carregarCatalogo() {

    try {

        const resposta =
            await fetch("catalogo.json");

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível carregar catalogo.json"
            );
        }

        return await resposta.json();

    } catch (erro) {

        console.warn(
            "JSON não encontrado ou inválido.",
            erro
        );

        return {};

    }

}



/* =====================================================
   BUSCAR VÍDEOS DO SERVIDOR
   ===================================================== */

async function carregarVideos() {

    try {

        const catalogo =
            await carregarCatalogo();


        const resposta =
            await fetch(SERVIDOR + "/");


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível acessar o servidor."
            );

        }


        const html =
            await resposta.text();


        const parser =
            new DOMParser();


        const documento =
            parser.parseFromString(
                html,
                "text/html"
            );


        const links =
            documento.querySelectorAll("a");


        const videos = [];


        links.forEach(link => {

            const href =
                link.getAttribute("href");


            if (!href) return;


            if (
                href
                    .toLowerCase()
                    .endsWith(".mp4")
            ) {

                const arquivo =
                    decodeURIComponent(
                        href
                            .split("/")
                            .pop()
                    );


                if (
                    !videos.some(
                        video =>
                            video.arquivo === arquivo
                    )
                ) {


                    const dados =
                        catalogo[arquivo] || {};


                    const nome =
                        arquivo.replace(
                            /\.mp4$/i,
                            ""
                        );


                    videos.push({

                        arquivo: arquivo,

                        // Nome do arquivo = título
                        titulo: nome,

                        // Capa automática
                        capa:
                            SERVIDOR +
                            "/video/capas/" +
                            encodeURIComponent(nome) +
                            ".jpg",

                        sinopse:
                            dados.sinopse ||
                            "Descrição ainda não cadastrada.",

                        nota:
                            dados.nota ||
                            "0.0",

                        ano:
                            dados.ano ||
                            "",

                        categoria:
                            dados.categoria ||
                            "Vídeo"

                    });

                }

            }

        });


        todosVideos =
            videos;


        console.log(
            "Vídeos encontrados:",
            videos
        );


        criarCatalogo(videos);


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
        encodeURIComponent(
            video.arquivo
        );


    player.src =
        endereco;


    player.load();


    player.play()
        .catch(() => {});


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
   CRIAR CARDS
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


        card.className =
            "card";


        card.innerHTML = `

            <div class="capa">

                <img
                    src="${video.capa}"
                    alt="${video.titulo}"
                    loading="lazy"
                    onerror="
                        this.style.display='none';
                        this.nextElementSibling.style.display='flex';
                    "
                >

                <div
                    class="sem-capa"
                    style="display:none;">
                    ▶
                </div>

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
            todosVideos.filter(
                video =>
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