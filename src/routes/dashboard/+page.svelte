<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="dashboard-container">
  <h1>Dashboard</h1>
  <p>your email is: {data.user.email}</p>
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