<script lang="ts">
  import { user } from '$lib/stores/user';
  import NotificationBanner from '$lib/components/banners/NotificationBanner.svelte';
  import Page from '$lib/components/Page.svelte';
  import LinkButton from '$lib/components/LinkButton.svelte';
  import Check from '$lib/icons/Check.svelte';
  import { mealPlan } from '$lib/stores/meal_plan';
  import Star from '$lib/icons/Star.svelte';
  import type { PageData } from './$types';
  import { GroceryListItemStatus } from '$types/models';

  export let data: PageData;
</script>

<Page title="Dashboard">
  <div class="dashboard-container">
    <h1>Mmm Yum!</h1>
    <section class="notifications">
      {#if $user?.settings && !$user?.settings?.defaultServingSize}
        <NotificationBanner>
          <div class="notification no-default-serving-size">
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

      {#if $mealPlan?.id}
        <NotificationBanner>
          <div class="notification active-meal-plan">
            <div>
              <Star />
            </div>
            <p>
              You have a meal plan in the works. Would you like to view it?
            </p>
            <div>
              <LinkButton href={`/mealplans/${$mealPlan?.id}`}>View meal plan</LinkButton>
            </div>
          </div>
        </NotificationBanner>
      {/if}

      {#if data.groceryLists?.length}
        {#each data.groceryLists as groceryList}
          <NotificationBanner>
            <div class="notification active-grocery-list">
              <div>
                <Star />
              </div>
              <p>
                You have an open grocery list with {groceryList.items.filter(item => item.status === GroceryListItemStatus.ACTIVE).length} item left! Would you like to view it?
              </p>
              <div>
                <LinkButton href={`/mealplans/${groceryList.mealPlanId}/grocerylist`}>View grocery list</LinkButton>
              </div>
            </div>
          </NotificationBanner>
        {/each}
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

  .notification {
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

  .no-default-serving-size {
    --icon-color: var(--tertiary-500);
  }

  .active-meal-plan {
    --icon-color: var(--tertiary-500);

    p {
      text-align: center;
    }

    @media (min-width: 768px) {
      p {
        text-align: left;
      }
    }
  }

  .active-grocery-list {
    --icon-color: var(--secondary-500);

    p {
      text-align: center;
    }

    @media (min-width: 768px) {
      p {
        text-align: left;
      }
    }
  }
</style>