<script lang="ts">
	import { noop } from "$lib/helpers/noop";

  export let id: string;
  export let label: string;
  export let align: 'left' | 'center' | 'right' = 'center';
</script>

<div>
  <input
    type="checkbox"
    id={id}
    aria-labelledby={id}
    on:click|stopPropagation={noop}
  />
  <span aria-label={id} class="align-{align}">{label}</span>
  <div aria-labelledby={id}>
    <slot />
  </div>
</div>

<style lang="scss">
  div {
    position: relative;

    @media (hover:hover), (pointer:fine) {
      &:hover {
        span {
          display: block;
        }
      }
    }
  }

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 3;

    @media (hover:none), (pointer:coarse) {
      &:checked ~ span {
        display: block;
      }
    }
  }

  span {
    position: absolute;
    bottom: 105%;
    display: none;
    width: var(--icon-indicator-width, 8rem);
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    background: var(--neutral-100);
    border: 1px solid var(--neutral-900);
    border-radius: 0.25rem;
    color: var(--neutral-900);
    text-align: center;

    &.align-right {
      right: 0;
      left: auto;

    }

    &.align-center {
      left: 50%;
      transform: translateX(-50%); 
    }

    &.align-left {
      left: 0;
    }
  }
</style>