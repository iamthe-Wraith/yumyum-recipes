<script lang="ts">
  import { user } from '$lib/stores/user';
	import NotificationBanner from '$lib/components/banners/NotificationBanner.svelte';
	import Page from '$lib/components/Page.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import Check from '$lib/icons/Check.svelte';
</script>

<Page>
  <div class="dashboard-container">
    <h1>Dashboard</h1>
  
    <section class="notifications">
      {#if $user?.settings && !$user?.settings?.defaultServingSize}
        <NotificationBanner>
          <div class="no-default-serving-size">
            <div>
              <Check />
            </div>
            <p>
              Set your default serving size and we'll adjust your grocery lists so you always get the right amount to serve all your family and friends!
            </p>
            <div>
              <LinkButton href="/settings">Go to settings</LinkButton>
            </div>
          </div>
        </NotificationBanner>
      {/if}
    </section>
  </div>
</Page>

<style lang="scss">
  .dashboard-container {
    width: 100%;
    max-width: 70rem;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
  }

  section {
    margin: 1rem 0;
  }

  .notifications {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  .no-default-serving-size {
    --icon-color: var(--tertiary-500);
    --icon-size: 4rem;

    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;


    div {
      justify-self: center;
    }

    @media (min-width: 768px) {
      --icon-size: 2rem;

      grid-template-columns: 3rem 1fr 10rem;
      align-items: center;
    }
  }
</style>