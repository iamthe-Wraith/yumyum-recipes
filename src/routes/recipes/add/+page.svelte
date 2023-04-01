<script lang="ts">
  import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
	import Checkbox from "$lib/components/Checkbox.svelte";
	import ErrorText from "$lib/components/ErrorText.svelte";
	import IconButton from "$lib/components/IconButton.svelte";
	import InputField from "$lib/components/InputField.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import { isErrorStatus } from "$lib/helpers/response";
	import XIcon from "$lib/icons/XIcon.svelte";
  import type { ActionData } from "./$types";
  
  export let form: ActionData;

  let ingredients = 1;
  let steps = 1;
</script>

<noscript>
  <p>Javascript is required to add recipes. Please enable Javascript and try again.</p>
</noscript>

<div class="add-recipe-container">
  <h1>Add New Recipe</h1>
  <form method="POST" use:enhance>
    <InputField
      label="Name"
      id="name"
      name="name"
      error={isErrorStatus(form?.status) && form?.field === 'name' ? form.message : ''}
    />

    <TextArea
      label="Description"
      id="description"
      name="description"
      error={isErrorStatus(form?.status) && form?.field === 'description' ? form.message : ''}
    />

    <div class="row row-3">
      <InputField
        label="Prep Time"
        id="prepTime"
        name="prepTime"
        placeholder="1 hour 30 minutes"
        error={isErrorStatus(form?.status) && form?.field === 'prepTime' ? form.message : ''}
      />

      <InputField
        label="Cook Time"
        id="cookTime"
        name="cookTime"
        placeholder="45 minutes"
        error={isErrorStatus(form?.status) && form?.field === 'cookTime' ? form.message : ''}
      />

      <InputField
        label="Servings"
        id="servings"
        name="servings"
        type="number"
        placeholder="3"
        error={isErrorStatus(form?.status) && form?.field === 'servings' ? form.message : ''}
      />
    </div>

    <div>
      <fieldset>
        <legend>Ingredients</legend>
        {#each {length: ingredients} as _, i}
          <div class="ingredient-row">
            <InputField
              id="ingredient-{i}-amount"
              name="ingredients[].amount"
              value={form?.data?.ingredients?.[i]?.amount ?? ''}
              type="number"
              step={0.01}
              label="Amount"
            />

            <!-- TODO: add unit -->

            <!-- TODO: add type (liquid or dry) -->

            <InputField
              id="ingredient-{i}-amount"
              name="ingredients[].name"
              value={form?.data?.ingredients?.[i]?.name ?? ''}
              label="Name"
            />

            {#if i === ingredients - 1 && ingredients > 1}
              <IconButton
                kind="danger"
                type="button"
                on:click={() => ingredients--}
              >
                <XIcon />
              </IconButton>
            {/if}
          </div>
        {/each}

        <Button type="button" on:click={() => ingredients++}>+ Add Ingredient</Button>

        {#if isErrorStatus(form?.status) && form?.field === 'servings'}
          <ErrorText>{form?.message}</ErrorText>
        {/if}
      </fieldset>
    </div>

    <div>
      <fieldset>
        <legend>Steps</legend>
        {#each {length: steps} as _, i}
          <div class="step-row">
            <label for="step-{i}">{i + 1}.</label>
            <InputField
              id="step-{i}"
              name="steps[]"
              value={form?.data?.steps?.[i] ?? ''}
            />

            {#if i === steps - 1 && steps > 1}
              <IconButton
                kind="danger"
                type="button"
                on:click={() => steps--}
              >
                <XIcon />
              </IconButton>
            {/if}
          </div>
        {/each}

        <Button type="button" on:click={() => steps++}>+ Add Step</Button>

        {#if isErrorStatus(form?.status) && form?.field === 'servings'}
          <ErrorText>{form?.message}</ErrorText>
        {/if}
      </fieldset>
    </div>

    <TextArea
      label="Notes"
      id="notes"
      name="notes"
      error={isErrorStatus(form?.status) && form?.field === 'notes' ? form.message : ''}
    />

    <div class="row row-2">
      <Checkbox
        id='isPublic'
        name='isPublic'
        value="true"
        text="Make Public"
      />
      <Button>Add Recipe</Button>
    </div>

    {#if isErrorStatus(form?.status) && !form?.field && form?.message}
      <ErrorText>{form?.message}</ErrorText>
    {/if}

    {#if isErrorStatus(form?.status) && form?.message}
      <ErrorText>[DEBUGGING MODE]</ErrorText>
      <ErrorText>{form?.message}</ErrorText>
    {/if}
  </form>
</div>

<style lang="scss">
  .add-recipe-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  .row {
    display: grid;
    grid-gap: 1rem;
    align-items: center;
  }

  .row-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .row-3 {    
    grid-template-columns: repeat(3, 1fr);

    @media (max-width: 450px) {
      grid-template-columns: repeat(1, 1fr);
      grid-gap: 0;
    }
  }

  .row-4 {    
    grid-template-columns: repeat(4, 1fr);

    @media (max-width: 550px) {
      grid-template-columns: repeat(1, 1fr);
      grid-gap: 0;
    }
  }

  .ingredient-row,
  .step-row {
    display: grid;
    grid-gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;

    --input-field-margin-bottom: 0;
    --icon-size: 1rem;
  }

  .ingredient-row {
    grid-template-columns: 5rem auto 1.5rem;

    --icon-button-margin-top: 1.5rem;
  }

  .step-row {
    grid-template-columns: 1rem auto 1.5rem;
  }

  fieldset {
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid var(--neutral-200);
  }

  legend {
    padding: 0 0.5rem;
  }
</style>