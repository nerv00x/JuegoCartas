const game = document.querySelector(".container-game");
const info_close = document.querySelector(".info-close");
const modal_close = document.querySelector(".modal-close");
const numeroCartas = 20;
const jugabilidad = 2;
const solucion = document.querySelector(".solucion");
const info = document.querySelector(".info");

modal_close.onclick = function () {
  solucion.style.display = "none";
};

info_close.onclick = function () {
  info.style.display = "none";
};

const imgs = [
  "./file/imagenes/Charcotacoron-Elhierro.jpg",
  "./file/imagenes/LaGraciosaG.png",
  "./file/imagenes/LaMacetaelHierro.jpg",
  "./file/imagenes/LaPalma.jpg",
  "./file/imagenes/LaPalma2.jpg",
  "./file/imagenes/LaurisilvaLaGomera.png",
  "./file/imagenes/PlayaCofeteFTV.png",
  "./file/imagenes/RoqueNubloGC.png",
  "./file/imagenes/TeideTNF.png",
  "./file/imagenes/TimanfayaLNZ.png",
];

const dorsos = [
  "./file/Dorso/DorsoComida.jpg",
  "./file/Dorso/DorsoComida2.jpg",
];

const nombreIslas = imgs.map((img) => {
  const letras = img.match(/[A-Z]+/g);
  return letras ? letras.join("") : "";
});

const informacion = [
  "El Hierro",
  "Fuerteventura",
  "Gran Canaria",
  "La Gomera",
  "La Graciosa",
  "La Palma",
  "Lanzarote",
  "Tenerife",
];

const conjuntoIslas = {
  EH: "El Hierro",
  FTV: "Fuerteventura",
  GC: "Gran Canaria",
  LG: "La Gomera",
  LGA: "La Graciosa",
  LP: "La Palma",
  LNZ: "Lanzarote",
  TNF: "Tenerife",
};

const imgs_partida = imgs.slice(0, numeroCartas / jugabilidad);

function concatenarArray(array, veces) {
  let resultado = [];
  for (let i = 0; i < veces; i++) {
    resultado = resultado.concat(array);
  }
  return resultado;
}

const imagenes = concatenarArray(imgs_partida, jugabilidad);

const estados = ["ocultar", "mostrar", "resuelto"];

class GameManager {
  constructor(tablero) {
    this.tablero = tablero;
    this.numeroIntentos = 0;
    this.numeroAciertos = 0;
  }

  mostrarInformacionIsla(celda) {
    let parrafo = document.querySelector(".informacion");
    let info = document.querySelector("#info");

    parrafo.textContent = informacion.find((e) => e == celda.isla);

    info.style.display = "block";
  }

  comprobarAciertos(aciertos) {
    if (aciertos === imgs_partida.length) {
      let ganar = document.querySelector("#ganar");
      let mensajeGanador = document.getElementById("mensajeGanador");
      mensajeGanador.textContent = "¡¡¡GANASTE!!!\n";
      mensajeGanador.textContent +=
        "¡Has ganado en " + this.numeroIntentos + " intentos!";
      ganar.style.display = "block";
    }
  }

  comprobarCartasMostradas(accion) {
    switch (accion) {
      case "menor":
        return (
          this.tablero.tablero.filter((e) => e.estado === "mostrar").length <
          jugabilidad
        );
      case "igual":
        return (
          this.tablero.tablero.filter((e) => e.estado === "mostrar").length ===
          jugabilidad
        );
    }
  }

  ocultarCeldasFalladas(cartasMostradas) {
    cartasMostradas.forEach((e) => {
      celdasTablero.forEach((element) => {
        let posX = element.dataset.posx;
        let posY = element.dataset.posy;

        if (e.posx == posX && e.posy == posY) {
          setTimeout(() => {
            e.show(e, "ocultar", element);
          }, 1000);
        }
      });
    });
    this.numeroIntentos++;
  }

  resolverCeldasResueltas(cartasMostradas) {
    cartasMostradas.forEach((e) => {
      celdasTablero.forEach((element) => {
        let posX = element.dataset.posx;
        let posY = element.dataset.posy;

        if (e.posx == posX && e.posy == posY) {
          e.show(e, "resuelto", element);
        }
      });
    });
    this.numeroIntentos++;
    this.numeroAciertos++;
    this.mostrarInformacionIsla(cartasMostradas[0]);
    this.comprobarAciertos(this.numeroAciertos);
  }
}

class Celda {
  constructor(posx, posy, estado) {
    this.imagen = this.mezclarArray(imagenes).pop();
    this.posx = posx;
    this.posy = posy;
    this.isla = this.obtenerNombreIsla(this.imagen);
    this.estado = estados.find((e) => e === estado);
    this.dorso = dorsos[Math.round(Math.random())];
  }

  mezclarArray(imagenes) {
    return imagenes.sort(() => Math.random() - 0.5);
  }

  obtenerNombreIsla(imagenURL) {
    let letras = imagenURL.match(/[A-Z]+/g);
    let nombreArchivo = letras ? letras.join("") : "";

    const nombreIsla = conjuntoIslas[nombreArchivo];

    return nombreIsla;
  }

  show(celda, estado, casilla) {
    let img = casilla.querySelector("img");
    switch (estado) {
      case "ocultar":
        celda.estado = "ocultar";
        img.src = celda.dorso;
        break;
      case "mostrar":
        celda.estado = "mostrar";
        img.src = celda.imagen;
        break;
      case "resuelto":
        celda.estado = "resuelto";
        img.classList.add("resolver-imagen");
        break;
    }
  }
}

class Tablero {
  constructor() {
    this.alto;
    this.ancho;
    this.tablero = [];
    this.img_mostradas = [];
    this.establecerAnchoAlto();
    this.rellenar();
  }

  establecerAnchoAlto() {
    for (let alto = Math.floor(Math.sqrt(numeroCartas)); alto > 0; alto--) {
      if (numeroCartas % alto === 0) {
        let ancho = numeroCartas / alto;
        this.alto = alto;
        this.ancho = ancho;
        break;
      }
    }
  }

  rellenar() {
    for (let i = 0; i < this.alto; i++) {
      let row = document.createElement("div");
      row.classList.add("row");

      row.style.width = 100 * this.ancho + 100;

      for (let j = 0; j < this.ancho; j++) {
        let casilla = document.createElement("div");

        casilla.classList.add("celda");
        casilla.classList.add("ocultar-imagen");
        casilla.dataset.posx = i;
        casilla.dataset.posy = j;

        let celda = new Celda(i, j, "ocultar");
        this.tablero.push(celda);

        row.appendChild(casilla);

        let img = document.createElement("img");
        img.src = celda.dorso;

        casilla.appendChild(img);
      }

      game.appendChild(row);
    }
  }
}
let tablero = new Tablero();

const celdasTablero = document.querySelectorAll(".celda");
const juego = new GameManager(tablero);

pulsarCarta();

function pulsarCarta() {
  document.addEventListener("DOMContentLoaded", function () {
    celdasTablero.forEach((celda) => {
      celda.addEventListener("click", function (event) {
        const posx = event.target.parentElement.dataset.posx;
        const posy = event.target.parentElement.dataset.posy;

        const celdaPulsada = juego.tablero.tablero.find(
          (e) => e.posx == posx && e.posy == posy && e.estado === "ocultar"
        );

        if (juego.comprobarCartasMostradas("menor")) {
          celdaPulsada.show(celdaPulsada, "mostrar", celda);

          if (juego.comprobarCartasMostradas("igual")) {
            let mostradas = juego.tablero.tablero.filter(
              (e) => e.estado === "mostrar"
            );
            if (mostradas.every((e) => e.imagen === mostradas[0].imagen)) {
              juego.resolverCeldasResueltas(mostradas);
            } else {
              juego.ocultarCeldasFalladas(mostradas);
            }
          }
        }
      });
    });
  });
}
