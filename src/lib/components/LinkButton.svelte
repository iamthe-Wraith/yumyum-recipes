<script lang="ts">
	import type { ColorKind } from '$types';

  export let href: string;
  export let type: ColorKind = 'primary';
</script>

<a
  on:click
  {href}
  class={type}
>
  <slot />
</a>

<style lang="scss">
  a {
    display: inline-block;
    width: var(--link-button-width, 'auto');
    height: var(--link-button-height, 'auto');
    margin: var(--link-button-margin, 0.5rem);
    padding: 0.5rem 1rem;
    font-size: var(--link-button-font-size, 1rem);
    border-radius: 0.25rem;
    text-decoration: none;
    text-align: center;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  }

  a:hover {
    background-color: #eee;
  }

  a.primary {
    background-color: var(--primary-500);
    color: var(--neutral-900);

    &:hover,
    &:focus {
      background-color: var(--primary-300);
      color: var(--neutral-700);
    }
  }

  a.secondary {
    background-color: var(--secondary-500);
    color: var(--neutral-900);

    &:hover {
      background-color: var(--secondary-300);
      color: var(--neutral-700);
    }

    &:focus {
      outline-color: var(--secondary-500);
    }
  }

  a.tertiary {
    background-color: var(--tertiary-500);
    color: var(--neutral-900);

    &:hover {
      background-color: var(--tertiary-300);
      color: var(--neutral-700);
    }

    &:focus {
      outline-color: var(--tertiary-500);
    }
  }

  a.neutral {
    background-color: var(--neutral-500);
    color: var(--neutral-900);

    &:hover {
      background-color: var(--neutral-300);
      color: var(--neutral-700);
    }

    &:focus {
      outline-color: var(--neutral-500);
    }
  }
</style>