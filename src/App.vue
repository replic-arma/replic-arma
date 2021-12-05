<template>
  <router-view/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Rubik|Source+Sans+Pro|Source+Code+Pro&display=swap');

:root {
    --c-text-1: #333333;
    --c-text-2: #595959;
    --c-text-3: #7D7D7D;

    --c-surf-1: #F0F1F2; // BACKGROUND
    --c-surf-2: #2F80ED; // "ACCENT"
    --c-surf-3: rgba(0, 0, 0, 0.1); // HOVER
    --c-surf-4: #FFFFFF;

    --shadow-1:  0 0 .125rem 0 rgb(0 0 0 / 20%);
    --shadow-2:  0 0 .25rem 0 rgb(0 0 0 / 40%);
}

// TODO: Uncomment and check colors
// @media(prefers-color-scheme: dark) {
//     :root {
//         --c-text-1: #DEDEDE;
//         --c-text-2: #A6A6A6;
//         --c-text-3: #818181;

//         --c-surf-1: #222222;
//         --c-surf-2: #353535;
//     }
// }

html, body {
    margin: 0;
    font-family: Source Sans Pro, sans-serif;
    background-color: var(--c-surf-1);
    color: var(--c-text-1);
    padding: 1rem 2.5rem 0 2.5rem;
}

h1, h2, h3, h4, h5, h6 {
    font-family: Rubik, sans-serif;
    margin: 0;
}

textarea, input, pre, code {
    font-family: Source Code Pro, monospace;
}
a {
  cursor: pointer;
  color: #333333;
  text-decoration: none;
}
</style>
