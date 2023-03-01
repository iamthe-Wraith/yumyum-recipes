<header class="flex-row-center">
  <h1>YumYum Recipes</h1>
</header>

<main>
  <slot />
</main>

<footer class="flex-row-center">
  <p>YumYum Recipes is a project by <a href="https://github.com/iamthe-Wraith">@iamthe-Wraith</a>
</footer>

<style lang="scss">
  :global(body) {
    /* lower numbers === darker colors */
    --neutral-100: #0f0f0f;
    --neutral-200: #272727;
    --neutral-300: #3f3f3f;
    --neutral-400: #5a5959;
    --neutral-500: #747474;
    --neutral-600: #8c8b8b;
    --neutral-700: #aeaeae;
    --neutral-800: #cdcdcd;
    --neutral-900: #e4e4e4;

    width: 100vw;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    background: var(--neutral-100);
  }

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: var(--neutral-900);
  }

  :global(.flex-center) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global(.flex-row-center) {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  header {
    width: 100%;
    height: 70px;
    padding: 0 1rem;
    background: #000;
  }

  main {
    min-height: calc(100vh - 120px);
    padding: 1rem;
  }

  footer {
    width: 100%;
    height: 50px;
    padding: 0 1rem;
    background: #000;
  }
</style>