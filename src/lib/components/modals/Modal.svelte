<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  export let appearance: 'primary-tertiary' | 'secondary-primary' | 'tertiary-secondary' = 'primary-tertiary';
</script>

<div
  class="modal-outer 
  {appearance}" 
  in:fly="{{ y: 200, duration: 2000 }}" 
  out:fade
>
  <div class="modal-inner">
    <slot />
  </div>
</div>

<style lang="scss">
  .modal-outer {
    width: 90%;
    max-width: 50rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);

    &.primary-tertiary {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--tertiary-300) 100%);
    }

    &.secondary-primary {
      background: linear-gradient(135deg, var(--secondary-500) 0%, var(--primary-400) 100%);
    }

    &.tertiary-secondary {
      background: linear-gradient(135deg, var(--tertiary-500) 0%, var(--secondary-400) 100%);
    }
  }

  .modal-inner {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: var(--neutral-100);
    border-radius: 0.5rem;
  }
</style>