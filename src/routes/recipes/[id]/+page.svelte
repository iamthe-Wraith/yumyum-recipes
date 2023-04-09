<script lang="ts">
  import type { PageData } from './$types';
	import Page from "$lib/components/Page.svelte";
	import { getUnitOfMeasureAbbv } from '$lib/helpers/unitsOfMeasure';

  export let data: PageData;
</script>

<Page>
  <article>
    <section>
      <img src={data.recipe.img} alt="Image of {data.recipe.name}" />

      <h1>{data.recipe.name}</h1>
      <p>{data.recipe.description}</p>
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

  img {
    display: block;
    width: 100%;
    max-width: 20rem;
    margin: 0 auto 2rem;

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
</style>