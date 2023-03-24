<script lang="ts">
  import { user } from '$lib/stores/user';
  import { authenticated } from '$lib/stores/authenticated';
</script>

<div class="dashboard-container">
  <h1>Dashboard</h1>
  {#if $authenticated}
    <p>you are logged in and your email is {$user?.email}</p>
  {:else}
    <p>you are not logged in</p>
  {/if}
</div>

<style lang="scss">
  .dashboard-container {
    width: 100%;
    padding: 1rem;
  }

  h1 {
    text-align: center;
  }
</style>