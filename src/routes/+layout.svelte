<script>
  import './global.scss';
	import Logo from './Logo.svelte';
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Shadows+Into+Light&display=swap" rel="stylesheet">
</svelte:head>

<header class="flex-row-center">
  <Logo />
</header>

<main>
  <slot />
</main>

<footer class="flex-row-center">
  <p>YumYum Recipes is a project by <a href="https://github.com/iamthe-Wraith">@iamthe-Wraith</a>
</footer>

<style lang="scss">
  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    padding: 0 1rem;
    background: #000;

    h1 {
      color: var(--primary-500);
    }
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