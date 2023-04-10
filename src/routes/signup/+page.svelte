<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
  import InputField from "$lib/components/InputField.svelte";
	import Page from "$lib/components/Page.svelte";
  import { isErrorStatus } from "$lib/helpers/response";
	import type { ActionData } from "./$types";
  
  export let form: ActionData;
</script>

<Page>
  <div class="signup-container">
    <h1>Sign up</h1>
    <form method="POST" use:enhance>
      <InputField
        label="Email"
        type="email"
        id="email"
        name="email"
        value={form?.data?.email ?? ''}
        error={isErrorStatus(form?.status) && form?.field === 'email' ? form.message : ''}
        appearance="secondary-primary"
      />
  
      <InputField
        label="Password"
        type="password"
        id="password"
        name="password"
        value={form?.data?.password ?? ''}
        error={isErrorStatus(form?.status) && form?.field === 'password' ? form.message : ''}
        appearance="secondary-primary"
      />
  
      <InputField
        label="Confirm Password"
        type="password"
        id="confirmedPassword"
        name="confirmedPassword"
        value={form?.data?.confirmedPassword ?? ''}
        error={isErrorStatus(form?.status) && form?.field === 'confirmedPassword' ? form.message : ''}
        appearance="secondary-primary"
      />
  
      <Button>Sign Up</Button>
      <a href="/signin">Already have an account?</a>
    </form>
  </div>
</Page>

<style lang="scss">
  .signup-container {
    width: 100%;
    padding-top: 2rem;
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

    a {
      margin-top: 1rem;
      text-align: center;
    }
  }
</style>