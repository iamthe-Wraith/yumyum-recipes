<script lang="ts">
  import type { ColorKind } from '$types';

  export let kind: Exclude<ColorKind, 'transparent'> = 'primary';
  export let type: 'button' | 'submit' = 'submit';
  export let ariaLabel: string | null = null;
</script>

<button
  on:click
  {type}
  class={kind}
  aria-label={ariaLabel}
>
  <slot />
</button>

<style lang="scss">
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: var(--icon-button-margin-top, 0);
    margin-right: var(--icon-button-margin-right, 0);
    margin-bottom: var(--icon-button-margin-bottom, 0);
    margin-left: var(--icon-button-margin-left, 0);
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

  .danger {
    --fill-color: var(--danger-500);

    &:hover,
    &:focus {
      --fill-color: var(--danger-300);
    }

    &:focus-visible {
      outline: 1px dashed var(--danger-300);
    }
  }

  .warning {
    --fill-color: var(--warning-500);

    &:hover,
    &:focus {
      --fill-color: var(--warning-300);
    }

    &:focus-visible {
      outline: 1px dashed var(--warning-300);
    }
  }
</style>