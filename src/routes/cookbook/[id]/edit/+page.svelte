<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import Page from "$lib/components/Page.svelte";
  import RecipeForm from "../../RecipeForm.svelte";
  import type { IRecipe } from "$types/models";
  import type { IFormError } from "$types/errors";

  export let form: ActionData;
  export let data: PageData;

  let formData: IRecipe | null = null;

  $: formData = form?.data as IRecipe || null;
  let formError: IFormError | null = null;

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

<Page title={`Edit ${data.recipe.name}`}>
  <div class="edit-recipe-container">
    <h1>Edit Recipe</h1>
    <RecipeForm
      actionType="edit"
      error={formError}
      recipe={formData || data.recipe}
    />
  </div>
</Page>

<style lang="scss">
  .edit-recipe-container {
    width: 100%;
    max-width: 70rem;
    margin: 0 auto;
  }
</style>