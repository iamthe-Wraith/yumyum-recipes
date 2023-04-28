<script lang="ts">
  export let appearance: 'primary-tertiary' | 'secondary-primary' | 'tertiary-secondary' = 'primary-tertiary';
</script>

<div class="outer {appearance}">
  <div class="inner">
    <slot />
  </div>
</div>

<style lang="scss">
  .outer {
    position: relative;
    width: 100%;
    padding: 0.2rem;
    border-radius: 0.5rem;

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

  .inner {
    padding: 1rem;
    border-radius: 0.5rem;
    background: var(--neutral-100);
  }
</style>