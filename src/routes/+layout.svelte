<script lang="ts">
  import Error from '$lib/components/modals/Error.svelte';
  import Toast from '$lib/components/modals/Toast.svelte';
	import CoffeeCup from '$lib/icons/CoffeeCup.svelte';
  import { mealPlan } from '$lib/stores/meal_plan';
  import { user } from '$lib/stores/user';
  import type { LayoutData } from './$types';
  import './global.scss';
  import Logo from './Logo.svelte';
  import Nav from './Nav.svelte';

  export let data: LayoutData;

  $: if (data?.user) user.set(data.user);
  $: if (data?.mealPlan) mealPlan.set(data.mealPlan);
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
  <div class="footer-row footer-top-row">
    <Logo />

    <div class="footer-links">
      <a href="/privacy">Privacy Policy</a>
    </div>
  </div>

  <div class="footer-row footer-bottom-row">
    <a
      href="https://www.buymeacoffee.com/wraith"
      class="buy-us-a-coffee"
      target="_blank"
      rel="noopener noreferrer"
    >
      <CoffeeCup />
      <span>Buy us a coffee</span>
    </a>
  </div>
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
    min-height: calc(100vh - 132px);
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
      background: radial-gradient(ellipse at top right, var(--secondary-500) 0, transparent 30%),
                  radial-gradient(ellipse at top right, var(--secondary-300) 0, transparent 45%);
      background-blend-mode: multiply;
    }

    &:after {
      background: radial-gradient(ellipse at bottom left, var(--primary-500) 0, transparent 30%),
                  radial-gradient(ellipse at bottom left, var(--primary-300) 0, transparent 45%);
      background-blend-mode: multiply;
    }

    .main-content-wrapper {
      position: relative;
      width: 100%;
      z-index: 1;
    }
  }

  footer {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 132px;
    padding: 0 1rem;
    background: #000;
  }

  .footer-row {
    width: 100%;
    padding: 0.75rem 0;

    &.footer-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &.footer-bottom-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }

  .footer-links {
    display: flex;
    flex-direction: column;
  }

  .buy-us-a-coffee {
    --icon-size: 1.5rem;

    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--neutral-100);
    border: 1px solid var(--tertiary-500);
    border-radius: 0.25rem;
    text-decoration: none;

    span {
      padding-left: 0.5rem;
      color: var(--neutral-900);
    }
  }
</style>