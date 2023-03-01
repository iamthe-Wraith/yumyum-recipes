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

    --primary-500: #139a49;

    --secondary-500: #ea1093;

    --tertiary-500: #9855fd;

    --error-500: #b91c1c;
    --warning-500: #b97420;

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
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    padding: 0 1rem;
    background: #000;
  }

  main {
    min-height: calc(100vh - 50px);
    padding-top: 70px;
  }

  footer {
    width: 100%;
    height: 50px;
    padding: 0 1rem;
    background: #000;
  }
</style>