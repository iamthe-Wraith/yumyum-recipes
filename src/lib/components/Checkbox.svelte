<script lang="ts">
  import Check from "$lib/icons/Check.svelte";

  export let id: string;
  export let name: string;
  export let value: string = '';
  export let checked = false;
  export let text: string;
</script>

<div class="checkbox-container">
  <input
    type="checkbox"
    {id}
    {name}
    {value}
    bind:checked
  />

  <label for={id}>
    <span>
      {#if checked}
        <Check />
      {/if}
    </span>
    <p>{text}</p>
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
  }

  label > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
    border-radius: 0.2rem;
    background: var(--neutral-200);
    box-shadow: inset 10px 0 15px -15px var(--neutral-100);

    --size: 2rem;
    --stroke-color: var(--primary-500);
  }

  input:hover ~ label span,
  input:focus ~ label span {
    outline: 1px dashed var(--primary-500);
    outline-offset: 2px;
  }
</style>