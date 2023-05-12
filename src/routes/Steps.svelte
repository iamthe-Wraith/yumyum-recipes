<script>
  import cookbooks_img from '$lib/assets/images/cookbooks.jpg';
  import menu_img from '$lib/assets/images/menu.jpg';
  import grocery_list_img from '$lib/assets/images/grocery-list.jpg';
</script>

<h2>3 easy steps</h2>

<div class="cards">
	<div class="card flex-col-center">
		<div class='card-img'>
      <img src={cookbooks_img} alt="cookbooks on a shelf" />
    </div>
    <h3>Create Your Cookbook</h3>
		<p>Create your cookbook by adding your own recipes, or upgrade to a pro account to select meals from our library of more than XXX,XXX recipes!</p>
    <span>1</span>
	</div>
	
	<div class="card flex-col-center">
		<div class='card-img'>
      <img src={menu_img} alt="a menu on the wall behind the checkout counter at a deli" />
    </div>
    <h3>Pick Your Meals</h3>
		<p>Creating a meal plan has never been easier! Just select meals from your cookbook, or even better...we can do it for you!</p>
    <span>2</span>
	</div>
	
	<div class="card flex-col-center">
		<div class='card-img'>
      <img src={grocery_list_img} alt="a grocery list written on a notepad with a pen resting on top of it" />
    </div>
    <h3>Get your Grocery List!</h3>
		<p>When you're done, we'll create a complete, easy to manage grocery list for you!</p>
    <span>3</span>
	</div>
</div>

<style lang="scss">
	.cards {
		padding: 1rem;

    @media (min-width: 768px) {
      display: flex;
      align-items: stretch;
      justify-content: center;
    }
	}

  h2 {
    padding: 3rem 1rem 0;
  }

	.card {
    position: relative;
		padding: 1rem;
		border-width: 1px;
		border-style: solid;
		border-radius: .5rem;
    overflow: hidden;
		
		&:not(:last-child) {
			margin: 0 0 1rem 0;
		}

		&:nth-child(3n+1) {
			border-color: var(--secondary-500);

      h3,
      span {
        color: var(--secondary-500);
      }
		}

		&:nth-child(3n+2) {
			border-color: var(--tertiary-500);

      h3,
      span {
        color: var(--tertiary-500);
      }
		}

		&:nth-child(3n+3) {
			border-color: var(--primary-500);

      h3,
      span {
        color: var(--primary-500);
      }
		}

    @media (min-width: 768px) {
      width: 30%;
      max-width: 25rem;

      &:not(:last-child) {
			  margin: 0 1rem 0 0;
      }
    }
	}

  .card-img,
  p {
    position: relative;
    z-index: 1;
  }

  .card-img {
    min-width: 10rem;
    max-width: 10rem;
    min-height: 10rem;
    max-height: 10rem;
    margin-bottom: .5rem;
    background: var(--neutral-500);
    border: 2px solid var(--neutral-100);
    border-radius: 0.5rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  span {
    position: absolute;
    bottom: -1rem;
    left: .5rem;
    font-size: 18rem;
    font-weight: 900;
    opacity: 0.1;
    line-height: 15rem;
  }
</style>