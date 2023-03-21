<script lang="ts">
	import { log } from '$lib/services/log';
  import { fly } from 'svelte/transition';
	import ToggleMenuButton from "./ToggleMenuButton.svelte";

  let isOpen = false;

  const toggleNav = () => {
    log('toggling nav...');

    isOpen = !isOpen;
  }
</script>

<ToggleMenuButton on:click={toggleNav} {isOpen} />

{#if isOpen}
  <button
    tabindex="-1"
    class='nav-overlay'
    transition:fly={{ x: -50 }}
    on:click={toggleNav}
    aria-label="Close Navigation"
    aria-expanded={isOpen}
  >
    <div
      class="nav-container"
      on:click|stopPropagation={() => {}}
      on:keydown|stopPropagation={() => {}}
    >
      <nav>
        <a href="/signup">Sign Up</a>
      </nav>
    </div>
  </button>
{/if}

<style lang="scss">
  .nav-overlay {
    position: fixed;
    top: 85px;
    bottom: 0;
    left: 0;
    width: 100vw;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    outline: none;
  }

  .nav-container {
    width: 70vw;
    max-width: 300px;
    height: 100%;
    padding: 1rem;
    background: var(--neutral-100);
    border-right: 1px solid var(--primary-500);
    text-align: left;
  }

  nav {
    a {
      font-size: 1rem;
      text-decoration: none;

      &:hover,
      &:focus {
        color: var(--primary-500);
        text-decoration: underline;
      }
    }
  }
</style>