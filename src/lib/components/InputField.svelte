<script lang="ts">
  export let error = '';
  export let label = '';
</script>

<div class='input-field-container'>
  {#if label}
    <label for={$$props.id}>{label}</label>
  {/if}

  <input
    type={$$props.type ?? 'text'}
    id={$$props.id}
    name={$$props.name}
    value={$$props.value ?? ''}
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