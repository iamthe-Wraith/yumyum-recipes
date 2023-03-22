<script lang="ts">
	import Hero from "./Hero.svelte";
	import Steps from "./Steps.svelte";

	import { page } from '$app/stores';
	import { log } from '$lib/services/log';
  import type { PageData } from './$types';

  export let data: PageData;

	$: log('data: ', data);
  $: log('page: ', $page.data);
</script>

<Hero />
<Steps />
