<script lang="ts">
  import Error from '$lib/components/modals/Error.svelte';
	import Toast from '$lib/components/modals/Toast.svelte';
import { user } from '$lib/stores/user';
  import type { LayoutData } from './$types';
  import './global.scss';
  import Logo from './Logo.svelte';
  import Nav from './Nav.svelte';

  export let data: LayoutData;

  $: if (data?.user) {
    user.set(data.user);
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Shadows+Into+Light&display=swap" rel="stylesheet">
</svelte:head>

<Toast />

<header class="flex-row-center">
  <Logo />
  <Nav />
</header>

<main>
  <div class='main-content-wrapper'>
    <slot />
  </div>

  <Error />
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
    position: relative;
    min-height: calc(100vh - 50px);
    padding: 85px 0 1rem;

    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.15;
      z-index: 0;
    }

    &:before {
      background: radial-gradient(ellipse at top right, var(--secondary-500) 0, transparent 55%),
                  radial-gradient(ellipse at top right, var(--secondary-300) 0, transparent 65%);
      background-blend-mode: multiply;
    }

    &:after {
      background: radial-gradient(ellipse at bottom left, var(--primary-500) 0, transparent 55%),
                  radial-gradient(ellipse at bottom left, var(--primary-300) 0, transparent 65%);
      background-blend-mode: multiply;
    }

    .main-content-wrapper {
      position: relative;
      width: 100%;
      z-index: 1;
    }
  }

  footer {
    width: 100%;
    height: 50px;
    padding: 0 1rem;
    background: #000;
  }
</style>