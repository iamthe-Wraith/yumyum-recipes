<script>
	import Container from "../Container.svelte";

</script>
<div class="notification-banner-container">
  <Container>
    <slot />
  </Container>
</div>

<style>
  .notification-banner-container {
    width: var(--notification-banner-width, 100%);
  }
</style>