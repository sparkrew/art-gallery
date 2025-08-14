# Software Performing Art Gallery

The aim of this web site is to show artworks created by students in the [algorithmic art course](https://github.com/rethread-studio/algorithmic-art-course) at Université de Montréal

## Ajouter des oeuvres
The current version of the site only allows displaying works created using the JavaScript library p5.js.
The works must be coded in instance mode in the form of

`var sketch = function(p){(code)}`
In the setup function, the way to initialize the canvas is as follows

```bash
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
```

To add artworks to the gallery you have to add them to the artworks.json file following this format :

```bash
{
    "name": "artwork name",
    "ref": "artwork reference",
    "artist": "artist name",
    "year": "year of creation",
    "type": "Genuary / Algorithm Based / Data Based",
    "repo": "link to the github repo",
    "data": "link to the dataset (only if type == "Data Based")",
    "src": "file path"
  }
 
```

