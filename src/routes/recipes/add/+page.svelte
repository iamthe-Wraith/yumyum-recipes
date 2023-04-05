<script lang="ts">
	import { IngredientType } from "@prisma/client";
  import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
	import Checkbox from "$lib/components/Checkbox.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import ErrorText from "$lib/components/ErrorText.svelte";
	import IconButton from "$lib/components/IconButton.svelte";
	import InputField from "$lib/components/InputField.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import { IngredientTypes, UnitsOfMeasure, type IIngredientTypes } from "$lib/constants/ingredients";
	import { isErrorStatus } from "$lib/helpers/response";
	import XIcon from "$lib/icons/XIcon.svelte";
	import type { IDropdownOption } from "$types/dropdown";
  import type { ActionData } from "./$types";
	import { log } from "$lib/services/log";
  
  export let form: ActionData;

  let ingredients = 1;
  let steps = 1;
  let amounts = [1];
  let ingredientTypes: IIngredientTypes[] = [IngredientTypes[0]];
  let unitsOfMeasureOptions: IDropdownOption[][] = [];

  $: if (isErrorStatus(form?.status)) {
    window.scrollTo(0, 0);
  }

  setUnitsOfMeasure(0);

  $: if (ingredients !== ingredientTypes.length) {
    if (ingredients < ingredientTypes.length) {
      ingredientTypes.splice(ingredients, ingredientTypes.length - ingredients);
      unitsOfMeasureOptions.splice(ingredients, unitsOfMeasureOptions.length - ingredients);
    }

    if (ingredients > ingredientTypes.length) {
      for (let i = ingredientTypes.length; i < ingredients; i++) {
        ingredientTypes.push(IngredientTypes[0]);
        setUnitsOfMeasure(i);
      }
    }
  }

  const onAmountChange = (i: number) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    amounts[i] = Number(target.value);
  };

  const onIngredientTypeChange = (i: number) => (option: IDropdownOption) => {
    ingredientTypes[i] = IngredientTypes.find((type) => type.name === option.value)!;
    setUnitsOfMeasure(i);
  };

  function setUnitsOfMeasure(index: number) {
    if (ingredientTypes[index].name === IngredientType.COUNT) {
      unitsOfMeasureOptions[index] = [];
      return;
    };

    const uom = UnitsOfMeasure.filter((u) => u.type === ingredientTypes[index].name);
    unitsOfMeasureOptions[index] = uom.map((unit) => ({
      value: unit.name,
      label: unit.name,
    })) as IDropdownOption[];
  }
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
      value={form?.data?.name || ''}
      error={isErrorStatus(form?.status) && form?.field === 'name' ? form.message : ''}
    />

    <TextArea
      label="Description"
      description="Add a short description of the recipe to let others know what it's like."
      id="description"
      name="description"
      value={form?.data?.description || ''}
      error={isErrorStatus(form?.status) && form?.field === 'description' ? form.message : ''}
    />

    <fieldset>
      <legend>info</legend>
      <div class="row row-3">
        <InputField
          label="Prep Time"
          id="prepTime"
          name="prepTime"
          placeholder="1 hour 30 minutes"
          value={form?.data?.prepTime || ''}
          error={isErrorStatus(form?.status) && form?.field === 'prepTime' ? form.message : ''}
        />
  
        <InputField
          label="Cook Time"
          id="cookTime"
          name="cookTime"
          placeholder="45 minutes"
          value={form?.data?.cookTime || ''}
          error={isErrorStatus(form?.status) && form?.field === 'cookTime' ? form.message : ''}
        />
  
        <InputField
          label="Servings"
          id="servings"
          name="servings"
          type="number"
          placeholder="3"
          value={form?.data?.servings || ''}
          error={isErrorStatus(form?.status) && form?.field === 'servings' ? form.message : ''}
        />
      </div>
    </fieldset>

    <div>
      <fieldset>
        <legend>Ingredients</legend>
        {#each {length: ingredients} as _, i}
          <div class="ingredient-row">
            <div class="ingredient-row-inputs {ingredientTypes[i].name === IngredientType.COUNT ? 'partial-row' : 'full-row'}">
              <div>
                <Dropdown
                  id="ingredient-{i}-type"
                  name="ingredients[].type"
                  label="Type"
                  onChange={onIngredientTypeChange(i)}
                  options={IngredientTypes.map((type) => ({
                    value: type.name,
                    label: type.name,
                    selected: type.name === ingredientTypes[i].name,
                  }))}
                />
              </div>

              <div>
                <InputField
                  id="ingredient-{i}-amount"
                  name="ingredients[].amount"
                  value={form?.data?.ingredients?.[i]?.amount ?? ''}
                  type="number"
                  step={0.01}
                  label="Amount"
                  on:change={onAmountChange(i)}
                />
              </div>

              {#if unitsOfMeasureOptions[i].length}
                <div>
                  <Dropdown
                    id="ingredient-{i}-unit"
                    name="ingredients[].unit"
                    label="Unit"
                    options={unitsOfMeasureOptions[i]}
                  />
                </div>
              {/if}

              <div>
                <InputField
                  id="ingredient-{i}-name"
                  name="ingredients[].name"
                  value={form?.data?.ingredients?.[i]?.name ?? ''}
                  label="Name"
                />
              </div>

              {#if i === ingredients - 1 && ingredients > 1}
                <div>
                  <IconButton
                    kind="danger"
                    type="button"
                    on:click={() => ingredients--}
                  >
                    <XIcon />
                  </IconButton>
                </div>
              {/if}

              {#if !unitsOfMeasureOptions[i].length}
                <input
                  type="hidden" 
                  name="ingredients[].unit" 
                  value=""
                />
              {/if}
            </div>
            {#if isErrorStatus(form?.status) && form?.message && (form?.field === `ingredients.${i}.type` || form?.field === `ingredients.${i}.amount` || form?.field === `ingredients.${i}.unit` || form?.field === `ingredients.${i}.name`)}
              <div>
                <ErrorText>{form?.message}</ErrorText>
              </div>
            {/if}
          </div>
        {/each}

        <Button type="button" on:click={() => ingredients++}>+ Add Ingredient</Button>
      </fieldset>
    </div>

    <div>
      <fieldset>
        <legend>Steps</legend>
        {#each {length: steps} as _, i}
          <div class="step-row">
            <div class="step-row-inputs">
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
  
            {#if isErrorStatus(form?.status) && form?.field === `steps.${i}`}
              <div>
                <ErrorText>{form?.message}</ErrorText>
              </div>
            {/if}
          </div>
        {/each}

        <Button type="button" on:click={() => steps++}>+ Add Step</Button>
      </fieldset>
    </div>

    <TextArea
      label="Notes"
      description="These are notes just for you. They will not be shared with the public."
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
    align-items: start;
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

  .ingredient-row-inputs,
  .step-row-inputs {
    display: grid;
    grid-gap: 1rem;

    --input-field-margin-bottom: 0;
    --icon-size: 1rem;
    --dropdown-margin-bottom: 0;
  }

  .ingredient-row,
  .step-row {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--neutral-200);
  }

  .ingredient-row-inputs {
    align-items: start;

    &.full-row {
      & > :first-child {
        grid-area: type;
      }

      & > :nth-child(2) {
        grid-area: amount;
      }

      & >:nth-child(3) {
        grid-area: unit;
      }

      & > :nth-child(4) {
        grid-area: name;
      }

      & > :nth-child(5) {
        grid-area: remove;
        place-self: start end;
      }

      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: auto;
      grid-template-areas:
        "type type . remove"
        "amount amount unit unit"
        "name name name name";


      @media(min-width: 768px) {
        grid-template-columns: 7rem 5rem 10rem auto 1.5rem 0;
        grid-template-areas: "type amount unit name remove";

        & > :nth-child(5) {
          place-self: center end;
        }
      }
    }

    &.partial-row {
      & > :first-child {
        grid-area: type;
      }

      & > :nth-child(2) {
        grid-area: amount;
      }

      & > :nth-child(3) {
        grid-area: name;
      }

      & > :nth-child(4) {
        grid-area: remove;
        place-self: start end;
      }

      & > :nth-child(5) {
        grid-area: unit;
      }

      grid-template-columns: 1fr 1fr 1fr 1fr 1.5rem;
      grid-template-rows: auto;
      grid-template-areas:
        "type type amount amount remove"
        "name name name name .";

      @media(min-width: 767px) {
        grid-template-columns: 7rem 5rem auto 1.5rem 0;
        grid-template-areas: "type amount name remove unit";

        & > :nth-child(4) {
          place-self: center end;
        }
      }
    }

    @media(min-width: 768px) {
      --icon-button-margin-top: 1.5rem;
    }
  }

  .step-row-inputs {
    grid-template-columns: 1rem auto 1.5rem;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  input[type="hidden"] {
    display: none;
  }

  fieldset {
    padding: 1rem;
    margin: 3rem 0;
    border: 1px solid var(--neutral-200);
  }

  legend {
    padding: 0 0.5rem;
    color: var(--secondary-500);
  }
</style>