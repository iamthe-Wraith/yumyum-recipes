<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/components/Button.svelte";
  import ErrorText from "$lib/components/ErrorText.svelte";
  import InputField from "$lib/components/InputField.svelte";
  import Page from "$lib/components/Page.svelte";
  import { isErrorStatus } from "$lib/helpers/response";
  import type { ActionData } from "./$types";
  
  export let form: ActionData;

  let emailError: string;
  let passwordError: string;
  let formError: string;

  $: if (form && isErrorStatus(form?.status)) {
    handleError(form.message, form.field);
  }

  function handleError(message: string, field?: string) {
    switch (field) {
      case 'email':
        emailError = message;
        break;
      case 'password':
        passwordError = message;
        break;
      default:
        formError = message;
        break;
    }
  }

  function validateUserData(data: FormData, cancel: () => void) {
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const confirmedPassword = data.get('confirmedPassword') as string;

    if (!email) emailError = 'Email is required';
    if (!password) passwordError = 'Password is required';

    if (emailError || passwordError) {
      cancel();
      return;
    }
  }
</script>

<Page title="Sign In">
  <div class="signin-container">
    <h1>Sign in</h1>
    <form
      method="POST"
      use:enhance={({ data, cancel }) => validateUserData(data, cancel)}
    >
      <div class="input-field-container">
        <InputField
          label="Email"
          type="email"
          id="email"
          name="email"
          value={form?.data?.email ?? ''}
          error={emailError}
          appearance="secondary-primary"
        />
      </div>
  
      <div class="input-field-container {isErrorStatus(form?.status) && !form?.field ? 'with-form-error' : ''}">
        <InputField
          label="Password"
          type="password"
          id="password"
          name="password"
          value={form?.data?.password ?? ''}
          error={passwordError}
          appearance="secondary-primary"
        />
      </div>
  
      {#if formError}
        <div class="error-container">
          <ErrorText>
            {form?.message}
          </ErrorText>
        </div>
      {/if}

      <Button>Sign In</Button>
      <a href="/signup">Don't have an account?</a>
    </form>
  </div>
</Page>

<style lang="scss">
  .signin-container {
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

    .input-field-container {
      --input-field-margin-bottom: 0;

      margin-bottom: 1rem;

      &.with-form-error {
        margin-bottom: 0;
      }
    }

    a {
      margin-top: 1rem;
      text-align: center;
    }
  }

  .error-container {
    margin-bottom: 1rem;
  }
</style>