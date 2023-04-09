<script lang="ts">
	import LinkButton from "$lib/components/LinkButton.svelte";
	import Page from "$lib/components/Page.svelte";
  import { user } from "$lib/stores/user";

  user.reset();
</script>

<Page>
  <div class="signout-container">
    <h1>You have been signed out.</h1>
    <p>We hope to see you again soon!</p>
  
    <LinkButton href="/signup">
      Sign Up!
    </LinkButton>
  
    <a href="/signin">
      Already have an account?
    </a>
  </div>
</Page>

<style lang="scss">
  .signout-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 5rem 1rem;

    p {
      margin-bottom: 3rem;
      color: var(--secondary-500);
    }

    a {
      margin-top: 0.5rem;
      font-size: 0.8rem;
    }
  }
</style>