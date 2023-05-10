<script lang="ts">
  import type { ingredients, recipes } from "@prisma/client";
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
  import ErrorBanner from "$lib/components/ErrorBanner.svelte";
	import { IngredientType } from "$types/models";
  
  interface IFile extends File {
    path: string;
  }

  export let actionType: 'create' | 'edit' = 'create';
  export let status: number | null = null;
  export let error: string | null = null;
  export let errorField: string | undefined = undefined;
  export let recipe: recipes & { ingredients: ingredients[] } | null = null;
  export let appearance: 'primary-tertiary' | 'secondary-primary' | 'tertiary-secondary' = 'primary-tertiary';

  let ingredients = recipe?.ingredients?.length || 1;
  let steps = recipe?.steps?.length || 1;
  let amounts = recipe?.ingredients ? recipe.ingredients.map(ingredient => ingredient.amount) : [1];
  let ingredientTypes: IIngredientTypes[] = recipe?.ingredients.map(ingredient => ({ name: ingredient.type } as IIngredientTypes)) || [IngredientTypes[0]];
  let unitsOfMeasureOptions: IDropdownOption[][] = [];
  let file: IFile;
  let preview: HTMLImageElement;

  recipe?.ingredients?.length
    ? recipe.ingredients.forEach((_, i) => setUnitsOfMeasure(i))
    : setUnitsOfMeasure(0);

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

  const fieldError = (field: string) => typeof status === 'number' && isErrorStatus(status) && errorField === field && typeof error === 'string' ? error : '';

  const onAmountChange = (i: number) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    amounts[i] = Number(target.value);
  };

  const onImageUploadChange = (event: Event) => {
    const target = event.target as HTMLInputElement;

    const reader = new FileReader();

    reader.onload = (e) => {
      preview.src = e.target?.result as string;
      preview.alt = file.name;
    };

    if (target.files) {
      file = target.files[0] as IFile
      reader.readAsDataURL(target?.files[0]);
    };
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
  <ErrorBanner
    error="This page may not work correctly because you currently have Javascript disabled. We do our best to support this, but some features will not work without Javascript. To resolve, enable Javascript and refresh the page."
  />
</noscript>

<form method="POST" use:enhance>
  <div class="primary-data-container">
    <div class="image-upload-container">
      <span class="image-upload-label">Photo</span>

      {#if recipe}
        <input type="hidden" name="id" value={recipe.id} />
      {/if}

      <div class="image-preview">
        <input
          type="file"
          id="image-upload" 
          name="image" 
          accept="image/*"
          class="focusable"
          on:change={onImageUploadChange}
        />

        {#if !file}
          <span class="image-upload-text focusable-child">
            Upload Image
          </span>
        {/if}

        <img
          src={recipe?.image?.toString() || ''}
          alt={ (file && recipe?.name) ? `Image of ${recipe.name}` : '' }
          bind:this={preview}
        />
      </div>
    </div>

    <div class="name-desc-container">
      <InputField
        label="Name"
        id="name"
        name="name"
        value={recipe?.name || ''}
        error={fieldError('name')}
        {appearance}
      />

      <TextArea
        label="Description"
        description="Add a short description of the recipe to let others know what it's like."
        id="description"
        name="description"
        value={recipe?.description || ''}
        error={fieldError('description')}
        {appearance}
      />
    </div>
  </div>

  <fieldset>
    <legend>info</legend>
    <div class="row row-3">
      <InputField
        label="Prep Time"
        id="prepTime"
        name="prepTime"
        placeholder="1 hour 30 minutes"
        value={recipe?.prepTime || ''}
        error={fieldError('prepTime')}
        {appearance}
      />

      <InputField
        label="Cook Time"
        id="cookTime"
        name="cookTime"
        placeholder="45 minutes"
        value={recipe?.cookTime || ''}
        error={fieldError('cookTime')}
        {appearance}
      />

      <InputField
        label="Servings"
        id="servings"
        name="servings"
        type="number"
        placeholder="3"
        value={recipe?.servings?.toString() || ''}
        error={fieldError('servings')}
        {appearance}
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
                {appearance}
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
                value={recipe?.ingredients?.[i]?.amount?.toString() ?? ''}
                type="number"
                step={0.01}
                label="Amount"
                {appearance}
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
                  {appearance}
                />
              </div>
            {/if}

            <div>
              <InputField
                id="ingredient-{i}-name"
                name="ingredients[].name"
                value={recipe?.ingredients?.[i]?.name ?? ''}
                label="Name"
                {appearance}
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
          {#if typeof status === 'number' && isErrorStatus(status) && error && (errorField === `ingredients.${i}.type` || errorField === `ingredients.${i}.amount` || errorField === `ingredients.${i}.unit` || errorField === `ingredients.${i}.name`)}
            <div>
              <ErrorText>{error}</ErrorText>
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
              value={recipe?.steps?.[i] ?? ''}
              {appearance}
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

          {#if typeof status === 'number' && isErrorStatus(status) && errorField === `steps.${i}`}
            <div>
              <ErrorText>{error}</ErrorText>
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
    error={fieldError('notes')}
    {appearance}
  />

  <div class="row row-2">
    <Checkbox
      id='isPublic'
      name='isPublic'
      value="true"
      text="Make Public"
      {appearance}
    />
    <Button>
      { actionType === 'create' ? 'Create Recipe' : 'Save Changes' }
    </Button>
  </div>

  {#if typeof status === 'number' && isErrorStatus(status) && !errorField && error}
    <ErrorText>{error}</ErrorText>
  {/if}
</form>


<style lang="scss">
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

  .primary-data-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    .image-upload-label {
      display: block;
      margin-bottom: 0.25rem;
      opacity: 0;
    }

    .image-upload-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: 100%;
      margin: 1rem 0 3rem;

      .image-preview {
        position: relative;
        width: 12rem;
        height: 12rem;
        min-height: 12rem;
        margin: 0 auto;
        border-radius: 0.25rem;
        object-fit: cover;
        overflow: hidden;

        input {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          width: 100%;
          height: 100%;
          opacity: 0;
          z-index: 5
        }
        
        .image-upload-text {
          position: absolute;
          top: 50%;
          left: 50%;
          padding: 0.5rem 1rem;
          background: var(--primary-500);
          border-radius: 0.25rem;
          color: var(--neutral-100);
          box-shadow: inset 5px 0 15px 0 var(--primary-300);
          transform: translate(-50%, -50%);
          text-align: center;
          white-space: nowrap;
          transition: background-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
        }

        input:hover ~ .image-upload-text {
          background: var(--primary-300);
          box-shadow: inset 5px 0 15px 0 var(--primary-200);
        }

        img {
          position: relative;
          display: block;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          border-radius: 0.25rem;
          z-index: 3;
        }
      }

      --button-width: 100%;
    }

    @media (min-width: 450px) {
      flex-direction: row-reverse;

      & > *:last-child {
        flex-grow: 1;
      }

      &:not(:last-child) {
        margin-bottom: 0;
      }

      & > .name-desc-container {
        margin-right: 1rem;
      }

      .image-upload-container {
        width: 12rem;
        margin: 0;

        .image-preview {
          img {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
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