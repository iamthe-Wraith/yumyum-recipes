<script lang="ts">
  export let current = 0;
  export let max = 0;
</script>

<div class="counter-of-max {current > max ? 'max-exceeded' : ''}">
  { `${current} / ${max}` }
</div>

<style lang="scss">
  .counter-of-max {
    display: inline;
    font-size: 0.8rem;
  }

  .max-exceeded {
    color: var(--danger-500);
    font-weight: bold;
  }
</style>