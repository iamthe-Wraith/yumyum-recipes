<script lang="ts">
	import ErrorText from "./ErrorText.svelte";

  export let error = '';
  export let label = '';
  export let text = '';
  export let type = 'text';
  export let id = '';
  export let max: number = 999999999;
  export let min: number = 0;
  export let name = id;
  export let step = 1
  export let value = '';
  export let required = false;
  export let placeholder = '';
  export let appearance: 'primary-tertiary' | 'secondary-primary' | 'tertiary-secondary' = 'primary-tertiary';
</script>

<div class='input-field-container {appearance}'>
  {#if label}
    <label for={id}>{label}</label>
  {/if}

  {#if text}
    <p>{text}</p>
  {/if}

  <span>
    {#if type === 'number'}
      <input
        {type}
        {id}
        {name}
        {value}
        {required}
        {max}
        {min}
        {placeholder}
        {step} 
        on:change
        on:blur
        on:focus
        on:keydown
        on:keypress
        on:keyup
      />
    {:else}
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
        on:keydown
        on:keypress
        on:keyup
      />
    {/if}
  </span>

  {#if error}
    <ErrorText>{error}</ErrorText>
  {/if}
</div>

<style lang="scss">
  .input-field-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: var(--input-width, 100%);
    margin-top: var(--input-field-margin-top, 0);
    margin-right: var(--input-field-margin-right, 0);
    margin-bottom: var(--input-field-margin-bottom, 1rem);
    margin-left: var(--input-field-margin-left, 0);

    &.primary-tertiary > span {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--tertiary-300) 100%);

      input:focus {
        border-right: 4px solid var(--tertiary-300);
      }
    }
    
    &.secondary-primary > span {
      background: linear-gradient(135deg, var(--secondary-500) 0%, var(--primary-400) 100%);

      input:focus {
        border-right: 4px solid var(--primary-400);
      }
    }
    
    &.tertiary-secondary > span {
      background: linear-gradient(135deg, var(--tertiary-500) 0%, var(--secondary-400) 100%);

      input:focus {
        border-right: 4px solid var(--secondary-400);
      }
    }
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

  span {
    display: block;
    padding: 1px;
    border-radius: 0.25rem;
  }

  input {
    position: relative;
    width: 100%;
    padding: 0.5rem;
    background: var(--neutral-300);
    color: var(--neutral-900);
    border: none;
    border-radius: 0.25rem;
    box-shadow: inset 10px 0 15px -15px var(--neutral-100);
    overflow: hidden;

    &::placeholder {
      color: var(--neutral-700);
    }
  }
</style>