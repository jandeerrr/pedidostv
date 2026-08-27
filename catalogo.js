const SERVIDOR =
    "https://zen-gmt-own-precious.trycloudflare.com";


const videos = [

    {
        arquivo: "Video0.mp4",

        titulo: "Meu Primeiro Vídeo",

        capa: "",

        sinopse:
            "Coloque aqui a descrição ou sinopse do vídeo.",

        nota: "8.5",

        ano: "2026",

        categoria: "Vídeo"
    },


    {
        arquivo: "Video1.mp4",

        titulo: "Video 1",

        capa: "",

        sinopse:
            "Descrição do segundo vídeo.",

        nota: "9.0",

        ano: "2026",

        categoria: "Filme"
    },


    {
        arquivo: "Video2.mp4",

        titulo: "Video 2",

        capa: "",

        sinopse:
            "Descrição do terceiro vídeo.",

        nota: "7.8",

        ano: "2026",

        categoria: "Série"
    }

];


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



function abrirVideo(video) {

    player.src =
        SERVIDOR +
        "/video/" +
        encodeURIComponent(video.arquivo);

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



function criarCatalogo(listaVideos) {

    lista.innerHTML = "";


    listaVideos.forEach(video => {

        const card =
            document.createElement("div");

        card.className =
            "card";


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



pesquisa.addEventListener(
    "input",
    () => {

        const termo =
            pesquisa.value
                .toLowerCase()
                .trim();


        const resultado =
            videos.filter(video =>
                video.titulo
                    .toLowerCase()
                    .includes(termo)
            );


        criarCatalogo(resultado);

    }
);



criarCatalogo(videos);