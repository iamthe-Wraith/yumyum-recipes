<script lang="ts">
  import type { ColorKind } from '$types';

  export let kind: ColorKind | 'transparent' = 'primary';
  export let type: 'button' | 'submit' = 'submit';
  export let ariaLabel: string | null = null;
  export let disabled = false;
</script>

<button
  on:click
  {disabled}
  {type}
  class={kind}
  aria-label={ariaLabel}
>
  <slot />
</button>

<style lang="scss">
  button {
    margin-top: var(--button-margin-top, 0);
    margin-right: var(--button-margin-right, 0);
    margin-bottom: var(--button-margin-bottom, 0);
    margin-left: var(--button-margin-left, 0);
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
    transition: .2s ease-in-out background, .2s ease-in-out box-shadow;
    white-space: nowrap;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .primary {
    background: var(--primary-500);
    color: var(--neutral-100);
    box-shadow: inset 5px 0 15px 0 var(--primary-300);

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background: var(--primary-400);
      box-shadow: inset 5px 0 15px 0 var(--primary-200);
    }
  }

  .secondary {
    background: var(--secondary-300);
    color: var(--neutral-900);

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background: var(--secondary-100);
      box-shadow: inset 5px 0 15px 0 var(--secondary-300);
    }
  }

  .tertiary {
    background: var(--tertiary-500);
    color: var(--neutral-100);

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background: var(--tertiary-400);
      box-shadow: inset 5px 0 15px 0 var(--tertiary-200);
    }
  }

  .neutral {
    background: var(--neutral-500);
    color: var(--neutral-900);

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background: var(--neutral-400);
      box-shadow: inset 5px 0 15px 0 var(--neutral-200);
    }
  }

  .danger {
    background: var(--danger-500);
    color: var(--neutral-900);

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background: var(--danger-400);
      box-shadow: inset 5px 0 15px 0 var(--danger-200);
    }

    &:focus:not(:disabled),
    &:focus-visible:not(:disabled) {
      outline-color: var(--danger-500);
    }
  }

  .transparent {
    background: none;
    color: var(--primary-500);
  }
</style>