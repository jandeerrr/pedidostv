const servidor =
    "https://aircraft-headphones-institution-indiana.trycloudflare.com/";

function abrirVideo(nome) {

    const player = document.getElementById("videoPlayer");

    player.src = servidor + "/video/" + nome;

    player.load();

    player.play();

}