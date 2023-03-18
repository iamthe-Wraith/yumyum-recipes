<script lang="ts">
	import { isErrorStatus } from "$lib/helpers/response";
	import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<div>
  <h1>Sign up</h1>
  <form method="POST">
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      value={form?.data?.email ?? ''}
    />
    {#if isErrorStatus(form?.status) && form?.field === 'email'}
      <p class="error">{form.message}</p>
    {/if}

    <label for="password">Password</label>
    <input
      type="password"
      id="password"
      name="password"
    />
    {#if isErrorStatus(form?.status) && form?.field === 'password'}
      <p class="error">{form.message}</p>
    {/if}

    <label for="confirmed">Confirm Password</label>
    <input 
      type="password"
      id="confirmed"
      name="confirmed"
    />
    {#if isErrorStatus(form?.status) && form?.field === 'confirmed'}
      <p class="error">{form.message}</p>
    {/if}
    
    <button type="submit">Sign up</button>
  </form>
</div>