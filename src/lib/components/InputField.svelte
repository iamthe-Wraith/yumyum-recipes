<script lang="ts">
	import ErrorText from "./ErrorText.svelte";

  export let error = '';
  export let label = '';
  export let type = 'text';
  export let id = '';
  export let name = id;
  export let step = 1
  export let value = '';
  export let required = false;
  export let placeholder = '';
</script>

<div class='input-field-container'>
  {#if label}
    <label for={id}>{label}</label>
  {/if}

  <input
    {type}
    {id}
    {name}
    {value}
    {required}
    {placeholder}
    step={type === 'number' ? step : undefined} 
    on:change
    on:blur
    on:focus
  />

  {#if error}
    <ErrorText>{error}</ErrorText>
  {/if}
</div>

<style lang="scss">
  .input-field-container {
    display: flex;
    flex-direction: column;
    width: var(--input-width, 100%);
    margin-top: var(--input-field-margin-top, 0);
    margin-right: var(--input-field-margin-right, 0);
    margin-bottom: var(--input-field-margin-bottom, 1rem);
    margin-left: var(--input-field-margin-left, 0);
  }

  label {
    margin-bottom: 0.25rem;
  }

  input {
    position: relative;
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #000;
    border-radius: 0.25rem;
    background: var(--neutral-300);
    color: var(--neutral-900);
    border: 1px solid var(--neutral-500);
    box-shadow: inset 10px 0 15px -15px var(--neutral-100);
    overflow: hidden;

    &::placeholder {
      color: var(--neutral-700);
    }

    &:focus {
      border-right: 4px solid var(--primary-500);
    }
  }
</style>