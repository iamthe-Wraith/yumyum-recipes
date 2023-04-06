<script>
  export let error = '';
</script>

<div>
  <p>
    { error }
  </p>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    width: var(--textarea-width, 100%);
    margin-bottom: 1rem;
    background: var(--danger-500);
  }

  p {
    color: var(--neutral-900);
    text-align: center;
  }
</style>