<script lang="ts">
  import ErrorText from "./ErrorText.svelte";

  export let error = '';
  export let label = '';
  export let description = '';
  export let id = '';
  export let name = id;
  export let value = '';
  export let required = false;
  export let appearance: 'primary-tertiary' | 'secondary-primary' | 'tertiary-secondary' = 'primary-tertiary';
</script>

<div class='input-field-container {appearance}'>
  {#if label}
    <label for={id}>{label}</label>
  {/if}

  {#if description}
    <p>{description}</p>
  {/if}

  <span>
    <textarea
      {id}
      {name}
      {value}
      {required}
    />
  </span>

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

    &.primary-tertiary > span {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--tertiary-300) 100%);

      textarea:focus {
        border-right: 4px solid var(--tertiary-300);
      }
    }
    
    &.secondary-primary > span {
      background: linear-gradient(135deg, var(--secondary-500) 0%, var(--primary-400) 100%);

      textarea:focus {
        border-right: 4px solid var(--primary-400);
      }
    }
    
    &.tertiary-secondary > span {
      background: linear-gradient(135deg, var(--tertiary-500) 0%, var(--secondary-400) 100%);

      textarea:focus {
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
    padding: 1px;
    border-radius: 0.25rem;
  }

  textarea {
    width: var(--textarea-width, 100%);
    height: var(--textarea-height, 5rem);
    padding: 0.5rem;
    background: var(--neutral-300);
    color: var(--neutral-900);
    border: none;
    border-radius: 0.25rem;
    box-shadow: inset 10px 0 15px -15px var(--neutral-100);
    resize: none;
    
    &::placeholder {
      color: var(--neutral-700);
    }
  }
</style>