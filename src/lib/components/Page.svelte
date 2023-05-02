<div class="page-container">
  <div class="page-inner-container">
    <slot />
  </div>
</div>

<style>
  .page-container {
    width: 100%;
    padding: 1rem;
  }

  .page-inner-container {
    width: 100%;
    max-width: 70rem;
    margin: 0 auto;
  }
</style>