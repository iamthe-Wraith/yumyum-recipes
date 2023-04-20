<script lang="ts">
  import { enhance } from "$app/forms";
	import dayjs from "dayjs";
  import Page from "$lib/components/Page.svelte";
  import type { PageData } from "../$types";
	import Button from "$lib/components/Button.svelte";
	import { Toast } from "$lib/stores/toast";

  export let data: PageData;
</script>

<Page>
  <h1>Meal Plans</h1>
  <div class="list-container">
    {#if !data?.mealPlans?.length}
      <div class="no-meal-plans">
        <p>You don't have any meal plans yet. Create one to get started!</p>
        <form method="POST" action="/recipes?/createMealPlan" use:enhance={() => {
          return ({ result, update }) => {
            if (result.type === 'success') {
              Toast.add({ message: 'Meal plan created! Start adding meals to your plan!' });
            } else if (result.type === 'error') {
              Toast.add({ message: 'There was an error creating your meal plan. Please try again.', type: 'error' });
            }

            update();
          }
        }}>
          <Button type="submit">Create Meal Plan</Button>
        </form>
      </div>
    {:else}
      {#each data.mealPlans as mealPlan}
        <div class="meal-plan-container">
          <div class="meal-plan-container-inner">
            <a href="/mealplans/{mealPlan.id}" class='meal-plan-info'>
              <div>
                <h2>{mealPlan.name}</h2>
                <p class="last-updated">last updated: {dayjs(mealPlan.updatedAt).format('DD MMM, YYYY')}</p>
              </div>
  
              <div class='status m-status {mealPlan.status.toLowerCase()}'>{mealPlan.status.toLowerCase()}</div>
            </a>
            
            <p class="meal-plan-recipes"><span>{mealPlan._count.recipes}</span> Recipe{mealPlan._count.recipes === 1 ? '' : 's'}</p>
  
            <div class='status dt-status {mealPlan.status.toLowerCase()}'>{mealPlan.status.toLowerCase()}</div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</Page>

<style lang="scss">
  .list-container {
    max-width: 1000px;
    margin: 0 auto;
    padding-top: 1rem;
  }

  .no-meal-plans {
    text-align: center;

    p {
      margin: 2rem 0;
    }
  }

  .meal-plan-container {
    padding: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    transition: transform .25s ease-in-out;

    &:nth-child(3n+1) {
      background: linear-gradient(90deg, var(--primary-500) 0%, var(--tertiary-300) 100%);
    }

    &:nth-child(3n+2) {
      background: linear-gradient(90deg, var(--secondary-100) 0%, var(--primary-400) 100%);
    }

    &:nth-child(3n+3) {
      background: linear-gradient(90deg, var(--tertiary-500) 0%, var(--secondary-400) 100%);
    }

    @media (min-width: 768px) {
      &:hover,
      &:has(*:hover),
      &:has(*:focus-visible) {
        transform: scale(1.02);
        transition: transform .25s ease-in-out;
      }
    }
  }

  .meal-plan-container-inner {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-radius: 0.5rem;
    background: var(--neutral-100);

    h2 {
      text-align: left;
    }

    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 7rem 7rem;
      align-items: center;
    }
  }

  .meal-plan-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    text-decoration: none;

    & > div:first-child {
      flex: 1;
      padding-right: 1rem;
    }

    .last-updated {
      font-size: 0.8rem;
    }

    @media (min-width: 768px) {
      margin-bottom: 0;
    }
  }

  .meal-plan-recipes {
    span {
      font-size: 2rem;
      font-weight: 600;
      color: var(--secondary-500);
    }
  }

  .status {
    justify-self: end;
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 0.25rem;
    color: var(--neutral-100);
    text-transform: uppercase;

    &.dt-status {
      display: none;
    }

    &.active {
      background: var(--primary-500);
    }

    &.inactive {
      background: var(--gray-500);
    }

    @media (min-width: 768px) {
      &.m-status {
        display: none;
      }

      &.dt-status {
        display: inline-block;
      }
    }
  }
</style>