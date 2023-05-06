<script lang="ts">
  const name = "YumYum";
  export let title = name;

  let fullTitle = name;

  $: {
    if (!title) fullTitle = name;

    const _title = title.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
    fullTitle = `${name} | ${_title}`;
  }
</script>

<svelte:head>
  <title>{ fullTitle }</title>
</svelte:head>

<div class="page-container">
  <div class="page-inner-container">
    <slot />
  </div>
</div>

<style>
  .page-container {
    width: 100%;
    padding: 1rem;
  }

  .page-inner-container {
    width: 100%;
    max-width: 70rem;
    margin: 0 auto;
  }
</style>