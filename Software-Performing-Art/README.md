# Software Performing Art

Le but de ce site web est de présenter les oeuvres créées par les élèves du cours d'art algorithmique de l'Université de Montréal.

## Ajouter des oeuvres
La version actuelle du site ne permet d'afficher que les oeuvres réalisées à l'aide de la librairie javascript p5.js.
Les oeuvres doivent être codées en mode instance de la forme 

`var sketch = function(p){
(code)
}`

Dans la fonction setup la façon d'initialiser le canva est la suivante :

```bash
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
```


Pour ajouter les oeuvres à la galerie il suffit ensuite de les ajouter dans le fichier artworks.json en suivant le format suivant :

```bash
  {
    "name": "nom de l'oeuvre",
    "artist": "nom de l'artiste",
    "year": "année de réalisation",
    "type": "Genuary / Algorithm Based / Data Based / Exquisite Corpse",
    "repo": "lien vers le repo gitHub",
    "src": "../art/emplacement du fichier"
  }
```
À noter que pour une oeuvre Data Based il faut rajouter le lien vers le jeu de données :

```bash

"data": "lien vers le jeu de donnée",
 
```
