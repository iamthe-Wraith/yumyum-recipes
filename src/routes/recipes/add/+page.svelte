<script lang="ts">
  import { isErrorStatus } from "$lib/helpers/response";
  import type { ActionData } from "./$types";
	import Page from "$lib/components/Page.svelte";
	import RecipeForm from "../RecipeForm.svelte";
	import type { ingredients, recipes } from "@prisma/client";

  export let form: ActionData;
  let formData: recipes & { ingredients: ingredients[] } | null = null;

  $: formData = form?.data as recipes & { ingredients: ingredients[] } || null;

  $: if (isErrorStatus(form?.status)) {
    window.scrollTo(0, 0);
  }
</script>

<Page title="Add Recipe">
  <div class="add-recipe-container">
    <h1>Add New Recipe</h1>
    <RecipeForm
      status={form?.status}
      error={form?.message}
      errorField={form?.field}
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