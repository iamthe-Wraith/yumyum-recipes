<script lang="ts">
  import { isErrorStatus } from "$lib/helpers/response";
  import type { ActionData, PageData } from "./$types";
  import Page from "$lib/components/Page.svelte";
  import RecipeForm from "../../RecipeForm.svelte";
  import type { IRecipe } from "$types/models";

  export let form: ActionData;
  export let data: PageData;

  let formData: IRecipe | null = null;

  $: formData = form?.data as IRecipe || null;

  $: if (isErrorStatus(form?.status)) {
    window.scrollTo(0, 0);
  }
</script>

<Page title={`Edit ${data.recipe.name}`}>
  <div class="edit-recipe-container">
    <h1>Edit Recipe</h1>
    <RecipeForm
      status={form?.status}
      error={form?.message}
      errorField={form?.field}
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