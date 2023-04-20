<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from './$types';
  import Page from "$lib/components/Page.svelte";
  import { getUnitOfMeasureAbbv } from '$lib/helpers/units_of_measure';
  import ConfirmationModal from '$lib/components/modals/ConfirmationModal.svelte';
  import Button from "$lib/components/Button.svelte";
  import LoadingBasic from "$lib/components/processing-anims/LoadingBasic.svelte";
  import { AppError } from "$lib/stores/error";
  import { Toast } from "$lib/stores/toast";
  import { mealPlan } from "$lib/stores/meal_plan";

  export let data: PageData;

  let confirmDelete = false;
  let deleting = false;
  let isPlanningMeal = !!data?.mealPlan;
  let recipeIsInMealPlan = isInMealPlan(data.recipe.id);
  $: recipeIsInMealPlan = isInMealPlan(data.recipe.id);

  function isInMealPlan(recipeId: number) {
    if (!$mealPlan?.id) return false;
    return $mealPlan?.recipes?.some(recipe => recipe.id === recipeId);
  }
</script>

<Page>
  <article>
    <section>
      <div class="options-container">
        <a class="back-to-recipes" href="/recipes">Back to Recipes</a>
        <div>
          <a href="/recipes/{data.recipe.id}/edit">Edit</a>

          <form
            method="POST" 
            action="?/delete"
            on:submit|preventDefault={() => confirmDelete = true}
          >
            <input type="hidden" name="id" value={data.recipe.id} />
            <button>Delete</button>
          </form>
        </div>
      </div>

      <img src={data.recipe.image} alt="Image of {data.recipe.name}" />

      <h1>{data.recipe.name}</h1>
      <p>{data.recipe.description}</p>

      <div class="meal-plan-controls">
        {#if isPlanningMeal}
          {#if recipeIsInMealPlan}
            <form method="POST" action="/mealplans?/removeFromMealPlan" use:enhance={({ data }) => {
              return ({ result, update }) => {
                if (result.type === 'success') {
                  Toast.add({ message: 'Recipe removed from meal plan.' });
                } else if (result.type === 'failure') {
                  Toast.add({ message: result.data?.message || 'There was an error removing the recipe from your meal plan. Please try again.', type: 'error' });
                }
  
                update();
              }
            }}>
              <input type="hidden" name="recipe" value={data.recipe.id} />
              <Button type="submit" kind="transparent">
                Remove from Meal Plan
              </Button>
            </form>
          {:else}
            <form method="POST" action="/mealplans?/addMealToPlan" use:enhance={() => {
              return ({ result, update }) => {
                if (result.type === 'success') {
                  recipeIsInMealPlan = true;
                  Toast.add({ message: 'Recipe added to meal plan!' });
                } else if (result.type === 'failure') {
                  Toast.add({ message: result.data?.message || 'There was an error adding the recipe to your meal plan. Please try again.', type: 'error' });
                }
  
                update();
              }
            }}>
              <input type="hidden" name="recipe" value={data.recipe.id} />
              <Button type="submit">
                Add to Meal Plan
              </Button>
            </form>
          {/if}
        {/if}
      </div>
    </section>

    <section class="cooking-times">
      <div class="cooking-time">
        <span>Prep Time:</span>
        <span>{data.recipe.prepTime}</span>
      </div>
      <div class="cooking-time">
        <span>Cook Time:</span>
        <span>{data.recipe.cookTime}</span>
      </div>
      <div class="cooking-time">
        <span>Serves:</span>
        <span>{data.recipe.servings}</span>
      </div>
    </section>

    <div class="cooking-instructions">
      <section class="ingredients">
        <h2>Ingredients</h2>
        <ul>
          {#each data.recipe.ingredients as ingredient}
            <li>
              <span>{ingredient.amount}</span>
              {#if ingredient.unit}
                <span>{getUnitOfMeasureAbbv(ingredient.unit, ingredient.amount)}.</span>
              {/if}
              <span>{ingredient.name}</span>
            </li>
          {/each}
        </ul>
      </section>
  
      <section class="steps">
        <h2>Directions</h2>
        <ol>
          {#each data.recipe.steps as step, i}
            <li>
              <span class="step-number">{i + 1}</span>
              <span class="step-text">{step}</span>
            </li>
          {/each}
        </ol>
      </section>
    </div>

    <div class="meal-plan-controls">
      {#if isPlanningMeal}
        {#if recipeIsInMealPlan}
          <form method="POST" action="/recipes?/removeFromMealPlan" use:enhance={({ data }) => {
            return ({ result, update }) => {
              if (result.type === 'success') {
                Toast.add({ message: 'Recipe removed from meal plan.' });
              } else if (result.type === 'failure') {
                Toast.add({ message: result.data?.message || 'There was an error removing the recipe from your meal plan. Please try again.', type: 'error' });
              }

              update();
            }
          }}>
            <input type="hidden" name="recipe" value={data.recipe.id} />
            <Button type="submit" kind="transparent">
              Remove from Meal Plan
            </Button>
          </form>
        {:else}
          <form method="POST" action="/mealplans?/addMealToPlan" use:enhance={() => {
            return ({ result, update }) => {
              if (result.type === 'success') {
                recipeIsInMealPlan = true;
                Toast.add({ message: 'Recipe added to meal plan!' });
              } else if (result.type === 'failure') {
                Toast.add({ message: result.data?.message || 'There was an error adding the recipe to your meal plan. Please try again.', type: 'error' });
              }

              update();
            }
          }}>
            <input type="hidden" name="recipe" value={data.recipe.id} />
            <Button type="submit">
              Add to Meal Plan
            </Button>
          </form>
        {/if}
      {/if}
    </div>

    <ConfirmationModal
      isOpen={confirmDelete}
      title="Delete Recipe?"
      message="Are you sure you want to delete this recipe?"
      appearance="secondary-primary"
      processing={deleting}
      on:close={() => confirmDelete = false}
    >
      <form
        slot="confirm"
        method="POST"
        action="?/delete"
        use:enhance={() => {
          deleting = true;

          return async ({ result, update }) => {
            deleting = false;

            if (result.type === 'failure') {
              AppError.set({
                message: result.data?.message || 'An error occurred while deleting the recipe. Please try again later.',
                title: 'Error Deleting Recipe'
              });
            }

            update();
          }
        }}
      >
        <input type="hidden" name="id" value={data.recipe.id} />
        {#if deleting}
          <div class="loading-wrapper">
            <LoadingBasic />
          </div>
        {:else}
          <Button>Delete</Button>
        {/if}
      </form>
    </ConfirmationModal>
  </article>
</Page>

<style lang="scss">
  article {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }

  section {
    margin-bottom: 3rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .options-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding: 0 0 0 1rem;

    & > div {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;

      & > *:not(:last-child) {
        margin-right: 0.75rem;
      }
    }

    a {
      text-decoration: none;

      &:hover {
        color: var(--primary-500);
        text-decoration: underline;
      }
    }

    .back-to-recipes {
      position: relative;

      &:before {
        content: ' ';
        position: absolute;
        top: 50%;
        right: calc(100% + 0.5rem);
        width: 0.5rem;
        height: 0.5rem;
        border-top: 1px solid var(--primary-500);
        border-left: 1px solid var(--primary-500);
        transform: translateY(-50%) rotate(-45deg);
        transition: 0.25s ease-in-out;
      }

      &:hover:before,
      &:focus-visible:before {
        right: calc(100% + 1rem);
        transition: 0.25s ease-in-out;
      }
    }

    button {
      background: none;
      border: none;
      color: var(--neutral-900);
      font-size: 1rem;
      text-decoration: none;
      cursor: pointer;

      &:hover,
      &:focus-visible {
        color: var(--danger-500);
        text-decoration: underline;
      }
    }
  }

  img {
    display: block;
    width: 100%;
    max-width: 20rem;
    margin: 0 auto 2rem;
    border-radius: 0.5rem;

    @media (min-width: 768px) {
      max-width: 30rem;
    }
  }

  h1 {
    margin-bottom: 1rem;
    text-align: center;
  }

  p {
    margin: 0 auto;
    text-indent: 2rem;
  }

  .cooking-times {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    max-width: 20rem;
    margin-right: auto;
    margin-left: auto;
    padding: 1rem;
    border-radius: 0.5rem;
    background: var(--primary-500);

    .cooking-time {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        display: block;
        width: 50%;
        font-size: 1rem;
        text-align: center;

        &:first-child {
          font-weight: 700;
        }

        &:last-child {
          text-align: right;
        }
      }
    }

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      max-width: 100%;
      padding: 2rem;
      background: none;
      border-top: 1px solid var(--primary-500);
      border-bottom: 1px solid var(--primary-500);
      border-radius: 0;

      .cooking-time {
        flex-direction: column;
        justify-content: flex-start;
        width: 33.3333%;
        margin-bottom: 0.75rem;

        &:last-child {
          margin-bottom: 0;
        }

        span:first-child {
          margin-bottom: 0.5rem;
        }

        span:last-child {
          text-align: center;
        }
      }
    }
  }

  .cooking-instructions {
    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
      flex-direction: row-reverse;
      justify-content: space-between;

      .ingredients {
        min-width: 20rem;
        width: 20rem;
        max-width: 20rem;
      }
    }
  }

  .ingredients {
    ul {
      padding: 1rem 1rem 1rem 2rem;

      li {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0.5rem 0;

        &:last-child {
          border-bottom: none;
        }

        &:before {
          content: ' ';
          position: absolute;
          top: 50%;
          right: calc(100% + 0.75rem);
          width: 0.3rem;
          height: 0.3rem;
          background: var(--primary-500);
          border-radius: 50%;
          transform: translateY(-50%);
        }

        span {
          display: block;
          margin-right: 0.25rem;
        }
      }
    }

    @media (min-width: 768px) {
      margin-bottom: 0;
    }
  }

  .steps {
    ol {
      list-style: none;
    }

    li {
      display: flex;
      align-items: flex-start;
      padding: 0.5rem 0;

      .step {
        &-number {
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 2rem;
          width: 2rem;
          max-width: 2rem;
          min-height: 2rem;
          height: 2rem;
          max-height: 2rem;
          margin-right: 0.75rem;
          font-weight: 600;
          border: 1px solid var(--primary-500);
          border-radius: 50%;
        }

        &-text {
          display: block;
          width: 100%;
          padding-top: 0.2rem;
        }
      }
    }

    @media (min-width: 768px) {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      
      ol {
        flex-grow: 1;
        margin-right: 1rem;
        padding-right: 1rem;
        border-right: 1px solid var(--neutral-300);
      }
    }
  }

  .meal-plan-controls {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 3rem 0 0;
  }

  .loading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 5rem;
    height: 2rem;
  }
</style>