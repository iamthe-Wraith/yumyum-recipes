<script lang="ts">
  import dayjs from "dayjs";
  import { enhance } from "$app/forms";
  import type { PageData } from './$types';
  import Page from "$lib/components/Page.svelte";
  import IconIndicator from '$lib/components/IconIndicator.svelte';
  import Eye from '$lib/icons/Eye.svelte';
  import EyeOff from '$lib/icons/EyeOff.svelte';
  import { Toast } from "$lib/stores/toast";
  import LinkButton from "$lib/components/LinkButton.svelte";
  import IconButton from "$lib/components/IconButton.svelte";
  import Trash from "$lib/icons/Trash.svelte";
  import { goto } from "$app/navigation";
  import ConfirmationModal from "$lib/components/modals/ConfirmationModal.svelte";
  import { AppError } from "$lib/stores/error";
  import LoadingBasic from "$lib/components/processing-anims/LoadingBasic.svelte";
  import Button from "$lib/components/Button.svelte";
  import { mealPlan } from "$lib/stores/meal_plan";
  import Modal from "$lib/components/modals/Modal.svelte";
  import InputField from "$lib/components/InputField.svelte";
  import ErrorText from "$lib/components/ErrorText.svelte";

  export let data: PageData;

  let addForMe = false;
  let confirmClose = false;
  let confirmDelete = false;
  let addingForMe = false;
  let addingForMeError = '';
  let creating = false;
  let deleting = false;
</script>

<Page title="Meal Plan">
  <h1>{data.mealPlan?.name}</h1>
  <p class="last-updated">last updated {dayjs(data.mealPlan?.updatedAt).format('DD MMM, YYYY')}</p>

  {#if data.mealPlan?.meals?.length}
  <div class="controls-container">
    <div class="filter-container">
      filter
    </div>

    <div>
      {#if data.groceryList}
        <LinkButton href={`/mealplans/${data.mealPlan.id}/grocerylist`}>
          View Grocery List
        </LinkButton>
      {:else}
        <form
          method="POST"
          action={`/mealplans/${data.mealPlan.id}?/addMealsForMe`}
          on:submit|preventDefault={() => {
            addForMe = true;
          }}
        >
          <Button kind="secondary">
            Add Meals For Me
          </Button>
        </form>
        <form
          method="POST"
          action={`/mealplans/${data.mealPlan.id}/grocerylist?/createGroceryList`}
          on:submit|preventDefault={() => {
            confirmClose = true;
          }}
        >
          <Button>Create Grocery List</Button>
        </form>
      {/if}

      <form
        method="POST" 
        action={`/mealplans/${data.mealPlan?.id}?/deleteMealPlan`}
        on:submit|preventDefault={() => confirmDelete = true}
      >
        <IconButton kind="danger">
          <Trash />
        </IconButton>
      </form>
    </div>
  </div>
  {/if}

  <ul class="list-container {data.mealPlan?.meals?.length ? '' : 'no-recipes'}">
    {#if data.mealPlan?.meals?.length}
      {#each (data.mealPlan?.meals || []) as meal}
        <li>
          <div class='remove-container'>
            <form method="POST" action="/mealplans?/removeFromMealPlan" use:enhance={() => {
              return ({ result, update }) => {
                if (result.type === 'success') {
                  Toast.add({ message: 'Recipe removed from meal plan.' });
                } else if (result.type === 'failure') {
                  Toast.add({ message: result.data?.message || 'There was an error removing the recipe from your meal plan. Please try again.', type: 'error' });
                }

                update();
              }
            }}>
              <input type="hidden" name="meal" value={meal.id} />
              <IconButton type="submit" kind="danger">
                <Trash />
              </IconButton>
            </form>
          </div>

          <a href="/cookbook/{meal.recipe.id}">              
            <div class="recipe-image-container">
              <img src={meal.recipe.image} alt="Image of {meal.recipe.name}" />
            </div>
            <div class="recipe-info-container">
              <div>
                <div class="row">
                  <h2>{meal.recipe.name}</h2>
                  <div class="meta-container">
                    {#if meal.recipe.isPublic}
                      <IconIndicator
                        id="public" 
                        label="Is visible to the public."
                        align="right"
                      >
                        <Eye />
                      </IconIndicator>
                    {:else}
                      <IconIndicator
                        id="public" 
                        label="Is not visible to the public."
                        align="right"
                      >
                        <EyeOff />
                      </IconIndicator>
                    {/if}
                  </div>
                </div>
                <p>{meal.recipe.description}</p>
                <div class="cooking-info">
                  <div>
                    <span>Prep Time: </span>
                    <span>{meal.recipe.prepTime}</span>
                  </div>
                  <div>
                    <span>Cook Time: </span>
                    <span>{meal.recipe.cookTime}</span>
                  </div>
                  <div>
                    <span>Servings: </span>
                    <span>{meal.serving}</span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </li>
      {/each}
    {:else}
      <li class="no-recipes">
        <p>You haven't added any recipes to this meal plan yet.</p>
        {#if data.mealPlan}
          <form
            method="POST"
            action={`/mealplans/${data.mealPlan?.id}?/addMealsForMe`}
            on:submit|preventDefault={() => {
              addForMe = true;
            }}
          >
            <Button kind="primary">
              Add Meals For Me
            </Button>
          </form>
        {/if}
        <LinkButton href="/cookbook" type="secondary">Go to My Cookbook</LinkButton>
      </li>
    {/if}
  </ul>

  <Modal
    title="We got you!"
    text="We can add meals to your meal plan for you. Just let us know how many meals you want to add and we'll take care of the rest."
    isOpen={addForMe}
    on:close={() => addForMe = false}
  >
    <form
      slot="content"
      class="add-meals-for-me-form"
      method="POST"
      action={`/mealplans/${data.mealPlan?.id}?/addMealsForUser`}
      let:onClose={onClose}
      use:enhance={({ data }) => {
        const numberOfMeals = data.get('numberOfMeals');
        addingForMe = true;

        return ({ result, update }) => {
          if (result.type === 'success') {
            Toast.add({ message: `${numberOfMeals + ' ' || ''}meals added to your meal plan.` });
            addForMe = false;
            addingForMeError = ''
          } else if (result.type === 'failure') {
            addingForMeError = result.data?.message
          }

          addingForMe = false;

          update();
        }
      }}
    >
      <div class="add-meals-for-me-fields-container">
        <InputField
          label="Number of Meals"
          name="numberOfMeals"
          type="number"
          min={1}
          required
        />

        <!-- 
          TODO: uncomment this and remove hidden field below once we
          support duplicate recipes being added.default.
          (https://github.com/iamthe-Wraith/yumyum-recipes/issues/145)
        -->
        <!-- <Checkbox
          id="allowDuplicates"
          name="allowDuplicates"
          text="Allow Duplicates"
          value="true"
          checked={true}
        /> -->

        <input type="hidden" value="false" name="allowDuplicates" />
      </div>

      {#if addingForMeError}
        <ErrorText>{addingForMeError}</ErrorText>
      {/if}

      <div class="add-meals-for-me-buttons-container">
        {#if addingForMe}   
          <LoadingBasic />
        {:else}
          <Button
            type="button"
            kind="transparent"
            disabled={addingForMe}
            on:click={onClose}
          >
            Cancel
          </Button>
          <Button kind="secondary">
            Add Meals
          </Button>
        {/if}
      </div>
    </form>
  </Modal>

  <ConfirmationModal
    isOpen={confirmClose}
    title="All Done?"
    message="Are you sure you're ready to create your grocery list? This will close your meal plan and mark it as complete."
    appearance="secondary-primary"
    processing={creating}
    on:close={() => confirmClose = false}
  >
    <form 
      slot="confirm"
      method="POST" 
      class="modal-form"
      action={`/mealplans/${data.mealPlan?.id}/grocerylist?/createGroceryList`}
      use:enhance={() => {
        creating = true;

        return ({ result, update }) => {
          if (result.type === 'success') {
            Toast.add({ message: 'Grocery list created.' });
            mealPlan.reset();
          } else if (result.type === 'failure') {
            Toast.add({ message: result.data?.message })
          }

          update();
        }
      }}
    >
      {#if creating}
        <div class="loading-wrapper">
          <LoadingBasic />
        </div>
      {:else}
        <Button>
          Create Grocery List
        </Button>
      {/if}
    </form>
  </ConfirmationModal>

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
      action={`/mealplans/${data?.mealPlan?.id}?/deleteMealPlan`}
      use:enhance={() => {
        deleting = true;

        return ({ result, update }) => {
          if (result.type === 'success' || (result.type === 'redirect' && result.status === 303)) {
            Toast.add({ message: 'Meal plan deleted.' });
            goto('/mealplans');
          } else if (result.type === 'failure') {
            AppError.set({
              message: result.data?.message || 'An error occurred while deleting the recipe. Please try again later.',
              title: 'Error Deleting Recipe'
            });
          }

          deleting = false;
          confirmDelete = false;

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
  .last-updated {
    font-size: 0.75rem;
    color: var(--primary-500);
    text-align: center;
  }

  .controls-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 70rem;
    margin: 1rem auto;

    div {
      display: flex;
      align-items: center;

      --link-button-margin-right: 0;
      --link-button-margin-left: 0.5rem;
      --button-margin-right: 0;
      --button-margin-left: 0.5rem;
      
      form {
        --icon-button-margin-left: 0.5rem;
      }
    }
  }

  .list-container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 1rem;
    justify-content: center;
    align-items: stretch;
    margin: 0 auto;
    padding: 0;
    width: 100%;
    max-width: 80rem;
    list-style: none;

    li:not(.no-recipes) {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.5rem;
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

      .remove-container {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3rem;
        height: 3rem;
        background: var(--neutral-900);
        border-radius: 50%;
        border: 1px solid var(--neutral-500);
      }

      @media (min-width: 768px) {
        &:hover,
        &:has(*:hover),
        &:has(*:focus-visible) {
          transform: scale(1.02);
          transition: transform .25s ease-in-out;
        }
      }

      @media (pointer: fine) {
        &:hover,
        &:focus-visible {
          .remove-container {
            visibility: 1;
            opacity: 1;
            transition: visibility 0s linear 0.25s, opacity 0.25s linear;
          }
        }

        .remove-container {
          visibility: 0;
          opacity: 0;
          transition: visibility 0s linear 0.25s, opacity 0.25s linear;
        }
      }
    }

    li > a {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 10rem auto;
      grid-gap: 0.5rem;
      justify-content: stretch;
      align-items: stretch;
      flex-grow: 1;
      text-decoration: none;
    }

    @media (min-width: 768px) {
      &:not(.no-recipes) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1350px) {
      &:not(.no-recipes) {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  .recipe-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100%;
    min-width: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
    object-fit: cover;

    img {
      width: 100%;
    }
  }

  .recipe-info-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    height: 100%;
    padding: 0.5rem 1rem;
    background: var(--neutral-100);
    border-radius: 0.5rem;

    p {
      margin: 0.5rem 0 1rem;
    }

    .cooking-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-right: 1rem;

      div {
        display: flex;
        align-items: row;
        margin-right: 0.5rem;

        span {
          &:first-child {
            font-weight: bold;
          }

          &:last-child {
            margin-left: 0.5rem;
          }
        }
      }
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;

    --icon-color: var(--neutral-900);
  }

  .meta-container {
    display: flex;
    align-items: center;
  }

  li.no-recipes {
    --button-margin-bottom: 0.5rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 3rem auto 0;

    p {
      margin-bottom: 1rem;
    }
  }

  .add-meals-for-me-fields-container {
    max-width: 20rem;
    margin: 0 auto 1rem;
  }

  .add-meals-for-me-buttons-container {
    --button-margin-left: 1rem;

    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }
</style>