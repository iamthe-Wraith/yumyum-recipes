<script lang="ts">
	import LinkButton from "$lib/components/LinkButton.svelte";
	import { authenticated } from "$lib/stores/authenticated";
	import Hero from "./Hero.svelte";
	import Steps from "./Steps.svelte";
</script>

<Hero />

{#if !$authenticated}
	<div class="signup-container top">
		<LinkButton href="/dashboard">
			Sign Up!
		</LinkButton>
	</div>
{/if}

<Steps />

{#if !$authenticated}
	<div class="signup-container bottom">
		<LinkButton href="/dashboard">
			Sign Up!
		</LinkButton>
	</div>
{/if}

<style lang="scss">
	.signup-container {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
		--link-button-width: 10rem;

		@media (min-width: 768px) {
			&.bottom {
				display: none;
			}
		}
	}
</style>
