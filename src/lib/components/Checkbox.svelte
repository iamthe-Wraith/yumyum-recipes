<script lang="ts">
  import Check from "$lib/icons/Check.svelte";

  export let id: string;
  export let name: string;
  export let checked = false;
  export let text = '';
  export let value = '';
  export let appearance: 'primary-tertiary' | 'secondary-primary' | 'tertiary-secondary' = 'primary-tertiary';
</script>

<div class="checkbox-container">
  <input
    type="checkbox"
    {id}
    {name}
    {value}
    bind:checked
    on:change
  />

  <label for={id} class={appearance}>
    <span>
      <span>
        {#if checked}
          <Check />
        {/if}
      </span>
    </span>
    {#if text}
      <p>{text}</p>
    {/if}
  </label>
</div>

<style lang="scss">
  .checkbox-container {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: var(--checkbox-margin-top, 0);
    margin-right: var(--checkbox-margin-right, 0);
    margin-bottom: var(--checkbox-margin-bottom, 0);
    margin-left: var(--checkbox-margin-left, 0);
  }

  input {
    position: absolute;
    opacity: 0;
  }

  label {
    display: flex;
    align-items: center;
    cursor: pointer;

    &.primary-tertiary > span {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--tertiary-300) 100%);
    }
    
    &.secondary-primary > span {
      background: linear-gradient(135deg, var(--secondary-500) 0%, var(--primary-400) 100%);
    }
    
    &.tertiary-secondary > span {
      background: linear-gradient(135deg, var(--tertiary-500) 0%, var(--secondary-400) 100%);
    }
  }

  label > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
    padding: 1px;
    border-radius: 0.2rem;
    box-shadow: inset 10px 0 15px -15px var(--neutral-100);
  }

  label > span > span {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100%;
    width: 100%;
    max-width: 100%;
    min-height: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0.2rem;
    background: var(--neutral-200);

    --size: 2rem;
    --icon-color: var(--neutral-900);
  }

  input:hover ~ label > span,
  input:focus ~ label > span {
    outline: 1px dashed var(--primary-500);
    outline-offset: 2px;
  }
</style>