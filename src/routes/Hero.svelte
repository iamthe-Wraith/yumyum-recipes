<script>
  import image_url from '$lib/assets/images/hero-bg.jpg';
</script>

<div class="hero-container" style="background-image: url({image_url});"></div>
<h1>Planning meals has never been easier!</h1>
<p>
  Tired of spending hours planning out your meals for the week? Let us do the work for you. We'll even build you a grocery list so
  you can spend more time doing the things you love!
</p>

<style lang="scss">
  .hero-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background-position: center;
    background-size: cover;
    height: 200px;
  }

  h1 {
    padding: 1rem 1.5rem 0;
    text-align: center;
  }

  p {
    padding: .5rem 1.5rem;
    max-width: 70rem;
    margin: 0 auto;
  }
</style>