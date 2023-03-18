<script lang="ts">
  export let error = '';
  export let label = '';
  export let type = 'text';
  export let id = '';
  export let name = id;
  export let value = '';
  export let required = false;
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
  />

  {#if error}
    <p class="error">{error}</p>
  {/if}
</div>

<style lang="scss">
  .input-field-container {
    display: flex;
    flex-direction: column;
    width: var(--input-width, 100%);
    margin-bottom: 1rem;
  }

  label {
    margin-bottom: 0.25rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #000;
    border-radius: 0.25rem;
    color: var(--neutral-100);
  }

  .error {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: var(--error-500);
    line-height: 1.1rem;
  }
</style>