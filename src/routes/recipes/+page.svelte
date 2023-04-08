<script lang="ts">
	import IconIndicator from "$lib/components/IconIndicator.svelte";
import Page from "$lib/components/Page.svelte";
	import Eye from "$lib/icons/Eye.svelte";
	import EyeOff from "$lib/icons/EyeOff.svelte";
	import { log } from "$lib/services/log";
  import type { PageData } from './$types';

  export let data: PageData;

  $: log('recipes page', data);
</script>

<Page>
  <h1>Recipes</h1>

  {#if data.recipes?.length}
    <ul>
      {#each data.recipes as recipe}
        <li>
          <a href="/recipes/{recipe.id}">              
            <div class="recipe-image-container">
              <img src={recipe.img} alt="Image of {recipe.name}" />
            </div>
            <div class="recipe-info-container">
              <div class="row">
                <h2>{recipe.name}</h2>
                <div class="meta-container">
                  {#if recipe.isPublic}
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
              <p>{recipe.description}</p>
              <div class="cooking-info">
                <div>
                  <span>Prep Time: </span>
                  <span>{recipe.prepTime}</span>
                </div>
                <div>
                  <span>Cook Time: </span>
                  <span>{recipe.cookTime}</span>
                </div>
                <div>
                  <span>Servings: </span>
                  <span>{recipe.servings}</span>
                </div>
              </div>
            </div>
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <div>
      <p>No recipes found</p>
    </div>
  {/if}
</Page>

<style lang="scss">
  ul {
    display: block;
    margin: 2rem auto;
    padding: 0;
    width: 100%;
    max-width: 70rem;
    list-style: none;
  }

  li:nth-child(3n+1) a {
    background: linear-gradient(90deg, var(--primary-100) 0%, var(--primary-400) 100%);
  }

  li:nth-child(3n+2) a {
    background: linear-gradient(90deg, var(--secondary-100) 0%, var(--secondary-400) 100%);
  }

  li:nth-child(3n+3) a {
    background: linear-gradient(90deg, var(--tertiary-100) 0%, var(--tertiary-400) 100%);
  }

  li a {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: transform .25s ease-in-out;

    @media (min-width: 768px) {
      flex-direction: row;

      &:hover,
      &:focus-visible {
        transform: scale(1.02);
        transition: transform .25s ease-in-out;
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
      width: 15rem;
      height: 15rem;

      border-top-right-radius: 0;
      border-bottom-left-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
    }
  }

  .recipe-info-container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;

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

    --fill-color: var(--neutral-900);
  }

  .meta-container {
    display: flex;
    align-items: center;
  }
</style>