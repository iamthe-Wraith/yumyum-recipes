<script>
  import image_url from '$lib/assets/images/hero-bg.jpg';
</script>

<div class="hero-container" style="background-image: url({image_url});">
  <p>Planning meals has never been easier!</p>
</div>

<style lang="scss">
  .hero-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background-position: center;
    background-size: cover;
    height: 200px;

    &:before {
      content: ' ';
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        0deg,
        #000 0%,
        transparent 100%
      );
    }

    p {
      position: relative;
      padding: 1.5rem;
      z-index: 1;
    }
  }
</style>