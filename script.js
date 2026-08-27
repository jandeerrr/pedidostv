const servidor =
    "https://zen-gmt-own-precious.trycloudflare.com";

function abrirVideo(nome) {

    const player = document.getElementById("videoPlayer");

    player.src = servidor + "/video/" + nome;

    player.load();

    player.play();

}