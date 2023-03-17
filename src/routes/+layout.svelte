<script>
  import './global.scss';
	import Logo from './Logo.svelte';
	import Nav from './Nav.svelte';
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Shadows+Into+Light&display=swap" rel="stylesheet">
</svelte:head>

<header class="flex-row-center">
  <Logo />
  <Nav />
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
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 85px;
    padding: 0 1rem;
    background: #000;
    z-index: 99;
  }

  main {
    min-height: calc(100vh - 50px);
    padding: 85px 0;
  }

  footer {
    width: 100%;
    height: 50px;
    padding: 0 1rem;
    background: #000;
  }
</style>