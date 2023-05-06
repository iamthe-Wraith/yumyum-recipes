<script lang="ts">
  import type { ingredients, recipes } from "@prisma/client";
  import { isErrorStatus } from "$lib/helpers/response";
  import type { ActionData, PageData } from "./$types";
  import Page from "$lib/components/Page.svelte";
  import RecipeForm from "../../RecipeForm.svelte";

  export let form: ActionData;
  export let data: PageData;

  let formData: recipes & { ingredients: ingredients[] } | null = null;

  $: formData = form?.data as recipes & { ingredients: ingredients[] } || null;

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