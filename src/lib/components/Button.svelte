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
    font-size: 1rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
    transition: .2s ease-in-out background, .2s ease-in-out box-shadow;
  }

  .primary {
    background: var(--primary-500);
    color: var(--neutral-900);
    box-shadow: inset 5px 0 15px 0 var(--primary-300);

    &:hover,
    &:focus {
      background: var(--primary-400);
      box-shadow: inset 5px 0 15px 0 var(--primary-200);
    }
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