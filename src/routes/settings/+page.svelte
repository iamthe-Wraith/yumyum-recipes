<script lang="ts">
  import { enhance } from "$app/forms";
	import InputField from "$lib/components/InputField.svelte";
	import Page from "$lib/components/Page.svelte";
	import { isErrorStatus } from "$lib/helpers/response";
	import LoadingBasic from "$lib/components/processing-anims/LoadingBasic.svelte";
	import Button from "$lib/components/Button.svelte";
	import { user } from "$lib/stores/user";
	import type { ActionData } from "./$types";
	import { Toast } from "$lib/stores/toast";

  export let form: ActionData;
  let processing = false;

  let defaultServingSize = $user?.settings?.defaultServingSize;
  let changesMade = false;

  $: defaultServingSize = form?.data?.defaultServingSize ?? $user?.settings?.defaultServingSize;
  $: changesMade = defaultServingSize !== $user?.settings?.defaultServingSize

  const onDefaultServingSizeChange = (e: Event) => {
    defaultServingSize = parseInt((e.target as HTMLInputElement)?.value);
  }
</script>
<Page>
  <div class="form-container">
    <h1>Settings</h1>
    <p>Change your account settings here.</p>
  
    <form
      method="POST" 
      action="?/updateUserSettings" 
      use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'success') {
            Toast.add({ message: 'Settings updated!' });
            user.updateSettings(result.data?.settings);
          }
        }
      }}
    >
      <div class="setting-group col-2">
        <InputField
          label="Default Serving Size"
          text="How many people do you regularly cook for?"
          type="number"
          id="defaultServingSize"
          name="defaultServingSize"
          value={(defaultServingSize ?? '').toString()}
          error={isErrorStatus(form?.status) && form?.field === 'defaultServingSize' ? form.message : ''}
          appearance="primary-tertiary"
          on:keypress={onDefaultServingSizeChange}
          on:blur={onDefaultServingSizeChange}
        />
      </div>
  
      <div class="buttons-container">
        {#if processing}
          <LoadingBasic />
        {:else}
          <Button disabled={!changesMade}>Save Settings</Button>
        {/if}
      </div>
    </form>
  </div>
</Page>

<style lang="scss">
  .form-container {
    max-width: 70rem;
    margin: 1rem auto;

    & > p {
      text-align: center;
    }
  }

  form {
    margin-top: 1rem;
  }

  .col-2 {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 1rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .col-3 {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 1rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .setting-group {
    padding: 1rem 0;
  }

  .buttons-container {
    display: flex;
    justify-content: flex-end;
    min-width: 100%;
  }
</style>