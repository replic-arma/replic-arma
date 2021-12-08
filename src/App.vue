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

    --space-xxs: .25rem;
    --space-xs:  .5rem;
    --space-sm:  1rem;
    --space-md:  1.5rem;
    --space-lg:  2rem;
    --space-xl:  3rem;
    --space-xxl: 6rem;
}

* {
  box-sizing: border-box;
}

html {
  block-size: 100%;
}

body {
    min-block-size: 100%;
    padding-block-start: var(--space-xs);
    padding-block-end: var(--space-xs);
    padding-inline: var(--space-xl);
    font-family: system-ui, sans-serif;
    background-color: var(--c-surf-1);
    color: var(--c-text-1);
}

a {
  cursor: pointer;
  color: #333333;
  text-decoration: none;
}
</style>
