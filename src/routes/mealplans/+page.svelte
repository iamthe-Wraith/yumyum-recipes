<script lang="ts">
  import { enhance } from "$app/forms";
  import dayjs from "dayjs";
  import Page from "$lib/components/Page.svelte";
  import type { PageData } from "../$types";
  import Button from "$lib/components/Button.svelte";
  import { Toast } from "$lib/stores/toast";
  import IconButton from "$lib/components/IconButton.svelte";
  import Trash from "$lib/icons/Trash.svelte";
  import { mealPlan } from '$lib/stores/meal_plan';
  import ConfirmationModal from '$lib/components/modals/ConfirmationModal.svelte';
  import { AppError } from '$lib/stores/error';
  import LoadingBasic from '$lib/components/processing-anims/LoadingBasic.svelte';

  export let data: PageData;

  let confirmDelete = false;
  let mealPlanToDelete: number | null = null;
  let deleting = false;

  const updateCurrentMealPlanAfterPlanDeletion = (mealPlanId: number | null) => {
    if (mealPlanId !== null && $mealPlan?.id === mealPlanId) mealPlan.reset();
  }
</script>

<Page>
  <h1>Meal Plans</h1>

  <ul>
    {#if !data?.mealPlans?.length}
      <li class="no-meal-plans">
        <p>You don't have any meal plans yet. Create one to get started!</p>
        <form method="POST" action="/mealplans?/createMealPlan" use:enhance={() => {
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
      </li>
    {:else}
      {#each data.mealPlans as mealPlan}
        <li class="meal-plan-container">
          <div class="meal-plan-container-inner">
            <div class='meal-plan-info'>
              <a href="/mealplans/{mealPlan.id}">
                <div>
                  <h2>{mealPlan.name}</h2>
                  <p class="last-updated">last updated: {dayjs(mealPlan.updatedAt).format('DD MMM, YYYY')}</p>
                </div>
    
                <div class='status m-status {mealPlan.status.toLowerCase()}'>{mealPlan.status.toLowerCase()}</div>
              </a>
  
              <form
                class="m-delete-meal-plan"
                method="POST" 
                action={`/mealplans/${data.mealPlan?.id}?/deleteMealPlan`}
                on:submit|preventDefault={() => {
                  confirmDelete = true;
                  mealPlanToDelete = mealPlan.id;
                }}
              >
                <IconButton kind="danger">
                  <Trash />
                </IconButton>
              </form>
            </div>
            
            <p class="meal-plan-recipes"><span>{mealPlan._count.meals}</span> Recipe{mealPlan._count.meals === 1 ? '' : 's'}</p>
  
            <div class='status dt-status {mealPlan.status.toLowerCase()}'>{mealPlan.status.toLowerCase()}</div>

            <form
              class="dt-delete-meal-plan"
              method="POST" 
              action={`/mealplans/${data.mealPlan?.id}?/deleteMealPlan`}
              on:submit|preventDefault={() => {
                confirmDelete = true;
                mealPlanToDelete = mealPlan.id;
              }}
            >
              <IconButton kind="danger">
                <Trash />
              </IconButton>
            </form>
          </div>
        </li>
      {/each}
    {/if}
  </ul>

  <ConfirmationModal
    isOpen={confirmDelete}
    title="Delete Meal Plan?"
    message="Are you sure you want to delete this meal plan?"
    appearance="secondary-primary"
    processing={deleting}
    on:close={() => confirmDelete = false}
  >
    <form 
      slot="confirm"
      method="POST" 
      action={`/mealplans/${mealPlanToDelete}?/deleteMealPlan`}
      use:enhance={() => {
        deleting = true;

        return ({ result, update }) => {
          if (result.type === 'success' || (result.type === 'redirect' && result.status === 303)) {
            Toast.add({ message: 'Meal plan deleted.' });
            updateCurrentMealPlanAfterPlanDeletion(mealPlanToDelete);
          } else if (result.type === 'failure') {
            AppError.set({
              message: result.data?.message || 'An error occurred while deleting the recipe. Please try again later.',
              title: 'Error Deleting Recipe'
            });
          }

          deleting = false;
          confirmDelete = false;
          mealPlanToDelete = null;

          update();
        }
      }
    }>
      {#if deleting}
        <div class="loading-wrapper">
          <LoadingBasic />
        </div>
      {:else}
        <IconButton kind="danger">
          <Trash />
        </IconButton>
      {/if}
    </form>
  </ConfirmationModal>
</Page>

<style lang="scss">
  ul {
    max-width: 1000px;
    margin: 0 auto;
    padding-top: 1rem;
    list-style: none;
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

    .m-delete-meal-plan {
      display: block;
    }

    .dt-delete-meal-plan {
      display: none;
    }

    h2 {
      text-align: left;
    }

    form {
      --icon-button-padding-top: 0;
      --icon-button-padding-bottom: 0;
      --icon-size: 1.5rem;
    }

    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 7rem 7rem 4rem;
      justify-content: end;
      align-items: center;

      form {
        justify-self: end;

        &.m-delete-meal-plan {
          display: none;
        }

        &.dt-delete-meal-plan {
          display: block;
        }
      }
    }
  }

  .meal-plan-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    a {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      text-decoration: none;
      flex-grow: 1;
    }

    form {
      margin-left: 1rem;
    }

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