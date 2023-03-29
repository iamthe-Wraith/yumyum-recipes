<script lang="ts">
  import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
	import Checkbox from "$lib/components/Checkbox.svelte";
	import ErrorText from "$lib/components/ErrorText.svelte";
	import InputField from "$lib/components/InputField.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import { isErrorStatus } from "$lib/helpers/response";
  import type { ActionData } from "./$types";
  
  export let form: ActionData;
</script>

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

    <div class="row-3">
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
      <!-- ingredients -->
    </div>

    <div>
      <!-- steps -->
    </div>

    <TextArea
      label="Notes"
      id="notes"
      name="notes"
      error={isErrorStatus(form?.status) && form?.field === 'notes' ? form.message : ''}
    />

    <div class="row-2">
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

  .row-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    align-items: center;
  }

  .row-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    align-items: center;

    @media (max-width: 450px) {
      grid-template-columns: repeat(1, 1fr);
      grid-gap: 0;
    }
  }
</style>