<script lang="ts">
	import dayjs from "dayjs";
  import { enhance } from "$app/forms";
  import type { PageData } from './$types';
  import Page from "$lib/components/Page.svelte";
	import IconIndicator from '$lib/components/IconIndicator.svelte';
	import Eye from '$lib/icons/Eye.svelte';
	import EyeOff from '$lib/icons/EyeOff.svelte';
	import Button from '$lib/components/Button.svelte';
	import { Toast } from "$lib/stores/toast";
	import LinkButton from "$lib/components/LinkButton.svelte";

  export let data: PageData;
</script>

<Page>
  <h1>{data.mealPlan?.name}</h1>
  <p class="last-updated">last updated {dayjs(data.mealPlan?.updatedAt).format('DD MMM, YYYY')}</p>

  <ul class="list-container">
    {#if data.mealPlan?.meals?.length}
      <div class="controls-container">
        <div class="filter-container">
          filter
        </div>
        <div>
          create grocery list...
        </div>
      </div>

      {#each (data.mealPlan?.meals || []) as meal}
        <li>
          <a href="/recipes/{meal.recipe.id}">              
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
                    <span>{meal.recipe.servings}</span>
                  </div>
                </div>
              </div>
            </div>
          </a>

          <div class="row recipe-controls-container">
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
              <input type="hidden" name="meal" value={meal.id} />
              <Button type="submit" kind="transparent">
                Remove from Meal Plan
              </Button>
            </form>
          </div>
        </li>
      {/each}
    {:else}
      <li class="no-recipes">
        <p>You haven't added any recipes to this meal plan yet.</p>
        <LinkButton href="/recipes">Go to My Recipes</LinkButton>
      </li>
    {/if}
  </ul>
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
    }
  }

  .list-container {
    display: block;
    margin: 0 auto;
    padding: 0;
    width: 100%;
    max-width: 70rem;
    list-style: none;

    li:not(.no-recipes) {
      margin-bottom: 1rem;
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

      @media (min-width: 768px) {
        &:hover,
        &:has(*:hover),
        &:has(*:focus-visible) {
          transform: scale(1.02);
          transition: transform .25s ease-in-out;
        }
      }
    }

    li a {
      display: flex;
      flex-direction: column;
      text-decoration: none;

      @media (min-width: 768px) {
        flex-direction: row;
      }
    }
  }

  .recipe-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 10rem;
    border-top-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    overflow: hidden;

    img {
      width: 100%;
    }

    @media (min-width: 400px) {
      height: 15rem;
    }

    @media (min-width: 768px) {
      min-width: 15rem;
      width: 15rem;
      max-width: 15rem;
      min-height: 15rem;
      height: 15rem;
      max-height: 15rem;

      border-radius: 0.5rem;
    }
  }

  .recipe-info-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    margin-top: 0.5rem;
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

    @media (min-width: 768px) {
      margin-top: 0;
      margin-left: 0.5rem;

      h2 {
        text-align: left;
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

  .recipe-controls-container {
    display: flex;
    justify-content: flex-end;
    min-width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--neutral-100);
    border-radius: 0.5rem;

    --button-margin-right: 0;
    --button-margin-bottom: 0;
  }

  .meta-container {
    display: flex;
    align-items: center;
  }

  .no-recipes {
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
</style>