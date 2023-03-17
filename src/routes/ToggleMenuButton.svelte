<script lang="ts">
	import Button from "$lib/components/Button.svelte";
  import XIcon from "$lib/icons/XIcon.svelte";
  import MenuIcon from "$lib/icons/MenuIcon.svelte";	
	import IconButton from "$lib/components/IconButton.svelte";

  export let isOpen = false;
</script>

<IconButton
  on:click
  kind="neutral"
  ariaLabel="Toggle Navigation"
>
  {#if isOpen}
    <XIcon />
  {:else}
    <MenuIcon />
  {/if}
</IconButton>