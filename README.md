# Software Performing Art Gallery

The aim of this web site is to show artworks created by students in the [algorithmic art course](https://github.com/rethread-studio/algorithmic-art-course) at Université de Montréal

## Add artworks
The current version of the site only allows displaying works created using the JavaScript library p5.js.
The works must be coded in instance mode in the form of

`var sketch = function(p){(code)}`

All p5.js functions must been called as methods of this instance (e.g., p.createCanvas(), p.background()).

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

### Add sound artwork

If the artwork requires a button to be run due to the presence of sound, it must be added to the cartel in the same way as the artwork Glass (art/js/2025/algo/glass-bw.js).
To add the button to the cartel, simply add this line (line 42 of the artwork glass-bw.js):

```bash

 startButton.parent("cartel");

```

## Add a paper to bibliography

To add a paper to the bibliography page you have to add it to the biblio.json file following this format :

```bash
{
    "name": "name of paper",
    "year": "year of publication",
    "authors": "authors names",
    "link": "link to the paper"
  }
 
```

## Add a moment to art history

To add a moment to the art history page you have to add it to the art-history.json file following this format :

```bash
{
    "date": "date",
    "srcColor": "path to the colored image",
    "srcBW": "path to the black & white image",
    "page": "./moment.html?id= name of the page", (example : ./moment.html?id=1950s)
    "text": "text to show on the page"
  }
  ```
