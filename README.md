# Webflow template - Refokus

`jQuery` is already installed and declared as an external dependency.

## Files structure

In this project, all `.js` files located within the `pages` folder are automatically generated as individual bundles. This approach ensures that you can write page-specific JavaScript, keeping your website's code organized and efficient.

### How to Use

- **Individual Page Scripts**: Simply add your JavaScript file to the `pages` folder. Name it corresponding to the page's slug. For example, for a home page script, you could create `home.js` within this folder.

- **Global Scripts**: If you have JavaScript that needs to run on every page, create a file named `global.js` in the `pages` folder. This script will be universally applied across your site.

### Example

```js
// Example of a page-specific script in pages/home.js
console.log("This script runs only on the home page.");

// Example of a global script in pages/global.js
console.log("This script runs on every page of the website.");
```

## How to use with Webflow

Add the folllowing code in the global custom code of the project:

```js
<script>
  function addScript(src, module) {
    const s = document.createElement( 'script' );
    if (module) s.setAttribute('type', 'module')
    s.setAttribute( 'src', src );
    document.body.appendChild( s );
  }
  const urlParams = new URLSearchParams(window.location.search);
  const debug = urlParams.get('debug');
  const path = window.location.pathname.split('/')[1]

  if (debug) {
    addScript('http://localhost:3000/@vite/client', true)
    addScript('http://localhost:3000/src/pages/global.js', true)

    if(path.length) {
      addScript(`http://localhost:3000/src/pages/${path}.js`, true)
    } else {
      addScript(`http://localhost:3000/src/pages/home.js`, true)
    }
  } else {
    addScript('Here goes the prod URL/global.js')

    if(path.length) {
      addScript(`Here goes the prod URL/${path}.js`)
    } else {
      addScript(`Here goes the prod URL/home.js`)
    }
  }
  
</script>
```

