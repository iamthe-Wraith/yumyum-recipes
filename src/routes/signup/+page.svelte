<script lang="ts">
	import Button from "$lib/components/Button.svelte";
import InputField from "$lib/components/InputField.svelte";
import { isErrorStatus } from "$lib/helpers/response";
	import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<div class="signup-container">
  <h1>Sign up</h1>
  <form method="POST">
    <InputField
      label="Email"
      type="email"
      id="email"
      name="email"
      value={form?.data?.email ?? ''}
      error={isErrorStatus(form?.status) && form?.field === 'email' ? form.message : ''}
    />

    <InputField
      label="Password"
      type="password"
      id="password"
      name="password"
      value={form?.data?.password ?? ''}
      error={isErrorStatus(form?.status) && form?.field === 'password' ? form.message : ''}
    />

    <InputField
      label="Confirm Password"
      type="password"
      id="confirmedPassword"
      name="confirmedPassword"
      value={form?.data?.confirmedPassword ?? ''}
      error={isErrorStatus(form?.status) && form?.field === 'confirmedPassword' ? form.message : ''}
    />

    <Button>Sign Up</Button>
  </form>
</div>

<style lang="scss">
  .signup-container {
    width: 100%;
    padding: 3rem 1rem 1rem;
  }

  h1 {
    margin-bottom: 1rem;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
</style>