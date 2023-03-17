<script lang="ts">
  import type { ColorKind } from '$types';

  export let kind: ColorKind | 'transparent' = 'primary';
  export let ariaLabel: string | null = null;
</script>

<button on:click class={kind} aria-label={ariaLabel}>
  <slot />
</button>

<style lang="scss">
  button {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
  }

  .primary {
    background: var(--primary-500);
    color: var(--neutral-900);
  }

  .secondary {
    background: var(--secondary-500);
    color: var(--neutral-900);
  }

  .tertiary {
    background: var(--tertiary-500);
    color: var(--neutral-900);
  }

  .neutral {
    background: var(--neutral-500);
    color: var(--neutral-900);
  }

  .transparent {
    background: none;
    color: var(--primary-500);
  }
</style>