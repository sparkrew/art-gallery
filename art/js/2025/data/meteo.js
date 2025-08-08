var sketch = function (p) {
  /* ~ VARIABLES REQUETE ~ */

  // URL de l'API Open-Meteo
  const url = "https://api.open-meteo.com/v1/forecast";

  // Paramètres de la requête
  const params = {
    latitude: 0,
    longitude: 0,
    current: ["temperature_2m", "wind_direction_10m"],
  };

  /* ~ VARIABLES CANVA ~ */
  let width;
  let height;
  const side = 800; // w & h of canva
  let nb_squares = 12; // nombre de carrées sur un côté
  let size_square; // longueure d'un côté d'un carré
  let colors = ["black", "white", "white"]; // dernière couleur ré-écrite
  let index = 0; // pour avancer dans les couleurs

  /* ~ FONCTIONS P5 ~ */

  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.colorMode(p.HSB, 360, 100, 100, 250);
    // p.background("white");
    p.draw_big();
  };

  /* ~ FONCTIONS DESSIN ~ */

  // Dessine tous les carrés dans lesquels il faut dessiner les plus
  // petit carrés
  p.draw_big = async function () {
    size_square = width / nb_squares;
    for (i = 0; i < nb_squares; i++) {
      for (j = 0; j < nb_squares; j++) {
        let data = await getData(makeURL(url, 5 * i, 5 * j, params));
        if (data === undefined) {
          // error
          data = { wind_direction: 0, temperature_2m: 0 };
        }
        p.draw_squares(
          i * size_square,
          j * size_square,
          data.wind_direction_10m,
          data.temperature_2m
        );
      }
    }
  };

  // déssine les carré intérieur en fonciton de la position, la
  // température et l'angle
  p.draw_squares = function (i, j, angle, temp) {
    let a = 0;
    let size_inner_square = size_square;
    index = 0;
    let pair = getDirFromAngle(angle);
    colors[colors.length - 1] = getColorFromTemp(temp);
    while (size_inner_square > 0) {
      let diff = size_square - size_inner_square;
      p.push();
      p.translate(pair[0] * diff, pair[1] * diff);
      p.fill(colors[index]);
      p.square(i, j, size_inner_square);
      index = (index + 1) % colors.length;
      size_inner_square = size_square - p.random(2, 2.5) * a;
      a++;
      p.pop();
    }
  };

  // détermine la couleur en fonction de la température
  function getColorFromTemp(temp) {
    let H = 0;
    let S = 0;
    let B = 50;
    if (temp > 0) {
      S = 4 * temp;
    } else if (temp < 0) {
      H = 245;
      S = -4 * temp;
    }
    return [H, S, B];
  }

  // Détermine le déplacement x et y en fonction d'un angle
  function getDirFromAngle(angle) {
    if (angle < 90) {
      return [1, 0];
    } else if (angle < 180) {
      return [1, 1];
    } else if (angle < 270) {
      return [0, 1];
    }
    return [0, 0];
  }

  /* ~ FONCTIONS REQUETES ~ */

  // Crée l'URL pour la requête avec les paramètres requis
  function makeURL(url, lat, long, params) {
    params.latitude = lat;
    params.longitude = long;
    const queryString = new URLSearchParams(params).toString();
    return `${url}?${queryString}`;
  }

  // Fait la requête avec l'url pour l'api
  async function getData(url) {
    try {
      const rep = await fetch(url);
      const data = await rep.json();
      return data.current;
    } catch (error) {
      console.error("Erreur lors de la récupération des données météo:", error);
    }
  }
};
