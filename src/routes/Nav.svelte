<script lang="ts">
  import { page } from '$app/stores';
  import LinkButton from "$lib/components/LinkButton.svelte";
  import { authenticated } from "$lib/stores/authenticated";
  import { mealPlan } from '$lib/stores/meal_plan';
  import { onMount } from "svelte";

  let checkbox: HTMLInputElement;
  let navOverlay: HTMLDivElement;
  let noTransitionTimer: number;

  const close = () => {
    if (checkbox) checkbox.checked = false;
  }

  $: $page.route && close();
  
  const onResize = () => {
    close();
    clearTimeout(noTransitionTimer);

    navOverlay.classList.add('no-transition');

    noTransitionTimer = window.setTimeout(() => {
      navOverlay.classList.remove('no-transition');
    }, 500);
  }

  onMount(() => {
    // could not use svelte:window here because need to be
    // able to remove the event listener when this component
    // is destroyed.
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    }
  });
</script>

<div class="nav-container-outer">
  {#if $mealPlan?.id}
    <div class="meal-plan m-meal-plan">
      <a href="/meal-plans/{$mealPlan.id}">
        <span class="meal-plan-label">Meal Plan</span>
        <span class="meal-plan-recipes-count">{$mealPlan.recipes.length}</span>
      </a>
    </div>
  {/if}

  <div class="nav-toggle-container">
    <input type="checkbox" id="nav-checkbox" class="nav-checkbox" bind:this={checkbox} />

    <label for="nav-checkbox" class="nav-toggle" aria-label="navigation toggle">
      <span class="nav-toggle-line" />
    </label>

    <div class="nav-overlay" bind:this={navOverlay}>
      <div class="nav-container">
        <nav class={$authenticated ? 'authenticated' : 'unauthenticated center-col'}>
          {#if $authenticated}
            <a href="/dashboard">Dashboard</a>
            <a href="/recipes">My Recipes</a>
            <a href="/signout" class="signout">Sign Out</a>
            {#if $mealPlan?.id}
              <div class="meal-plan dt-meal-plan">
                <a href="/meal-plans/{$mealPlan.id}">
                  <span class="meal-plan-label">Meal Plan</span>
                  <span class="meal-plan-recipes-count">{$mealPlan.recipes.length}</span>
                </a>
              </div>
            {/if}
          {:else}
            <a href="/signin">Sign In</a>
            <LinkButton href="/signup">Sign Up</LinkButton>
          {/if}
        </nav>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .nav-container-outer {
    display: flex;
    align-items: center;
  }

  .nav-toggle-container {
    position: relative;
    width: 2rem;
    height: 1.25rem;
  }

  .nav-checkbox {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 1;
    appearance: none;

    &:checked ~ .nav-toggle {
      &:before {
        top: 50%;
        transform: rotate(45deg);
      }

      &:after {
        top: 50%;
        transform: rotate(-45deg);
      }

      .nav-toggle-line {
        opacity: 0;
      }
    }
  }

  .nav-toggle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    &:hover {
      cursor: pointer;
    }

    .nav-toggle-line,
    &:before,
    &:after {
      position: relative;
      width: 100%;
      height: .1rem;
      background: var(--neutral-500);
      transition: .25s ease-in-out;
      opacity: 1;
    }

    &:before,
    &:after {
      content: ' ';
      position: absolute;
    }

    &:before {
      top: 0;
    }

    &:after {
      top: calc(100% - 0.1rem);
    }
  }

  .nav-checkbox ~ .nav-overlay {
    position: fixed;
    top: 85px;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: flex-end;
    width: 100vw;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    outline: none;
    opacity: 0;
    visibility: hidden;
  }

  .nav-checkbox:checked ~ .nav-overlay,
  .nav-checkbox:checked ~ .nav-overlay {
    visibility: visible;
    opacity: 1;
  }

  .nav-checkbox ~ .nav-overlay:not(.no-transition),
  .nav-checkbox:checked ~ .nav-overlay:not(.no-transition),
  .nav-checkbox:checked ~ .nav-overlay:not(.no-transition) {
    transition: .25s ease-in-out;
  }

  .nav-container {
    width: 70vw;
    height: 100%;
    padding: 0 1rem;
    background: var(--neutral-100);
    border-left: 1px solid var(--primary-500);
    text-align: left;
  }

  nav {
    &.center-col {
      display: flex;
      flex-direction: column;
      justify-content: center;

      &.unauthenticated {
        flex-direction: column-reverse;
      }

      a {
        text-align: center;
      }
    }

    a {
      display: block;
      padding: .5rem 0;
      font-size: 1rem;
      text-decoration: none;
      white-space: nowrap;

      &:hover,
      &:focus {
        color: var(--primary-500);
        text-decoration: underline;
      }
    }
  }

  .signout {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--neutral-300);

    &:hover,
    &:focus {
      color: var(--danger-500);
    }
  }

  .meal-plan {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    background: var(--primary-100);
    border-radius: 0.5rem;

    &.m-meal-plan {
      display: block;
    }

    &.dt-meal-plan {
      display: none;
    }

    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
      text-decoration: none;
    }

    .meal-plan-label {
      font-size: 0.6rem;
      white-space: nowrap;
    }

    .meal-plan-recipes-count {
      font-size: 1.25rem;
      color: var(--primary-500);
    }
  }

  @media (min-width: 768px) {
    .nav-toggle-container {
      width: 100%;
      height: auto;
    }

    .nav-checkbox,
    .nav-toggle {
      display: none;
    }

    .nav-checkbox ~ .nav-overlay {
      position: static;
      display: flex;
      justify-content: flex-end;
      width: 100%;
      outline: none;
      opacity: 1;
      visibility: visible;

      .nav-container {
        display: flex;
        justify-content: flex-end;
        padding-right: 0;
        border-left: none;
        background: none;

        nav {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          height: 100%;

          &.unauthenticated {
            flex-direction: row;
          }

          & > * {
            margin-left: 1.5rem;
          }
        }
      }
    }

    .signout {
      margin-top: 0;
      padding-top: 0.5rem;
      padding-left: 1.5rem;
      border-top: none;
      border-left: 1px solid var(--neutral-300);
    }

    .meal-plan {
      margin-right: 0;

      &.m-meal-plan {
        display: none;
      }

      &.dt-meal-plan {
        display: block;
      }
    }
  }
</style>