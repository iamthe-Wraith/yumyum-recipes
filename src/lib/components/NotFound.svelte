<script lang="ts">
	import Page from "./Page.svelte";

  export let header: string;
  export let message: string;
</script>

<Page title="Not Found">
  <div class='container'>
    <div class='four-o-four'>404</div>
    <h1>{ header }</h1>
    <p>{ message }</p>
  </div>
</Page>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding-top: 5rem;
  }

  .four-o-four {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 8rem;
    height: 8rem;
    margin-bottom: 2rem;
    font-family: var(--header-font);
    font-size: 5rem;
    font-weight: bold;
    border: 1px solid var(--neutral-900);
    border-radius: 50%;
    color: var(--danger-500);
    text-align: center;
  }

  h1 {
    margin-bottom: 1rem;
  }
</style>