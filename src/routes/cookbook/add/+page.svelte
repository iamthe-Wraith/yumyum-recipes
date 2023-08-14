<script lang="ts">
  import { isErrorStatus } from "$lib/helpers/response";
  import type { ActionData } from "./$types";
  import Page from "$lib/components/Page.svelte";
  import RecipeForm from "../RecipeForm.svelte";
  import type { IRecipe } from "$types/models";
  import type { IFormError } from "$types/errors";

  export let form: ActionData;
  let formData: IRecipe | null = null;
  let formError: IFormError | null = null;

  $: formData = form?.data as IRecipe || null;
  $: {
    formError = form && form?.status >= 400
      ? {
        field: form.field,
        message: form.message || "Something went wrong.",
        status: form.status,
      }
      : null;
  }
</script>

<Page title="Add Recipe">
  <div class="add-recipe-container">
    <h1>Add New Recipe</h1>
    <RecipeForm
      error={ formError }
      recipe={formData}
    />
  </div>
</Page>

<style lang="scss">
  .add-recipe-container {
    width: 100%;
    max-width: 70rem;
    margin: 0 auto;
  }
</style>