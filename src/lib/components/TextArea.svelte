<script lang="ts">
  import ErrorText from "./ErrorText.svelte";

  export let error = '';
  export let label = '';
  export let description = '';
  export let id = '';
  export let name = id;
  export let value = '';
  export let required = false;
</script>

<div class='input-field-container'>
  {#if label}
    <label for={id}>{label}</label>
  {/if}

  {#if description}
    <p>{description}</p>
  {/if}

  <textarea
    {id}
    {name}
    {value}
    {required}
  />

  {#if error}
    <ErrorText>{error}</ErrorText>
  {/if}
</div>

<style lang="scss">
  .input-field-container {
    display: flex;
    flex-direction: column;
    width: var(--textarea-width, 100%);
    margin-bottom: var(--text-area-margin-bottom, 1rem);
  }

  label {
    margin-bottom: 0.25rem;
  }

  p {
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    color: var(--neutral-600);
    line-height: 1.2rem;
  }

  textarea {
    width: var(--textarea-width, 100%);
    height: var(--textarea-height, 5rem);
    padding: 0.5rem;
    border: 1px solid #000;
    border-radius: 0.25rem;
    background: var(--neutral-200);
    color: var(--neutral-900);
    border: 1px solid #000;
    box-shadow: inset 10px 0 30px -10px var(--neutral-100);
    resize: none;
    
    &::placeholder {
      color: var(--neutral-600);
    }

    &:focus {
      border-right: 4px solid var(--primary-500);
    }
  }
</style>