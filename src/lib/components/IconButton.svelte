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
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border: none;
    background: none;
    cursor: pointer;
  }

  .primary {
    --fill-color: var(--primary-500);

    &:hover,
    &:focus {
      --fill-color: var(--primary-300);
    }
  }

  .secondary {
    --fill-color: var(--secondary-500);

    &:hover,
    &:focus {
      --fill-color: var(--secondary-300);
    }

    &:focus-visible {
      outline: 1px dashed var(--secondary-300);
    }
  }

  .tertiary {
    --fill-color: var(--tertiary-500);

    &:hover,
    &:focus {
      --fill-color: var(--tertiary-300);
    }

    &:focus-visible {
      outline: 1px dashed var(--tertiary-300);
    }
  }

  .neutral {
    --fill-color: var(--neutral-500);

    &:hover,
    &:focus {
      --fill-color: var(--neutral-300);
    }

    &:focus-visible {
      outline: 1px dashed var(--neutral-300);
    }
  }
</style>