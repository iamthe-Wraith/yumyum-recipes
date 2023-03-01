<a href="/">
  <h1>YumYum</h1>
  <p>Recipes</p>
</a>

<style lang="scss">
  a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    text-decoration: none;

    &:focus-visible {
      outline: 1px dashed var(--primary-500);
      outline-offset: 1px;
    }
  }

  h1 {
    /* color: var(--primary-500); */
    line-height: 1.75rem;
  }

  p {
    font-family: var(--header-font);
    color: var(--primary-500);
  }
</style>