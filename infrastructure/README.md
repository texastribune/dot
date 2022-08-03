# Dot Infrastructure
> Terraform for provisioning and managing infrastructure to run dot app

## Deploying from local machine
1. `terraform` cli  
   * Using homebrew:
      ```sh
      brew install terraform
      ```
   * You may need to login to terraform cloud (`terraform login`)
1. Create a `tfvars` file to configure terraform
   * ```sh
      # creates a gitignore'd file that terraform automatically loads at runtime
      cp ./infrastructure/.auto.tfvars.example ./infrastructure/.auto.tfvars
      ```
1. Authorize `heroku`
   * In your new `./infrastructure/.auto.tfvars` file, set:
      * `heroku_email`
      * `heroku_api_key`
   * [See here](https://devcenter.heroku.com/articles/using-terraform-with-heroku#obtaining-an-authorization-token) for instructions to authorize with the `heroku` cli (set the output in your `.auto.tfvars` file or as environment variables in your shell).  You can create the `heroku_api_key` in the UI ([dashboard.heroku.com/account/applications](https://dashboard.heroku.com/account/applications)) if you don't have the cli.
1. Initialize terraform
   * ```sh
      # from project root directory
      make terraform/init

      # this will install the local cloud providers (heroku), which essentially is taking terraform code and making heroku api calls on your behalf.
      ```

## Example Workflow
Here's an example terraform workflow (to add a redis add-on):
1. Add a `heroku_addon` resource to `infrastructure/main.tf`
   ```terraform
   resource "heroku_addon" "redis" {
      app_id  = heroku_app.dot-staging.id
      plan = "heroku-redis:hobby-dev"
   }
   ```
1. Run a `terraform plan` to see what would be changed:
   <details>
      <summary>Example output</summary>

      ```sh
      # from ./infrastructure directory
      terraform plan

      # example output
      heroku_app.dot-staging: Refreshing state... [id=1dccef3f-6171-41e8-9aef-27662fe461d9]
      heroku_addon.logging: Refreshing state... [id=d8ad2353-19a5-4338-a57e-0e25fa1ec270]
      heroku_build.dot-staging: Refreshing state... [id=cd6dae38-5fc3-4b95-950a-a7ac5f7cc94e]
      heroku_formation.dot-staging_formation: Refreshing state... [id=1ec29859-6284-48b3-84b2-015bf685a087]

      Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
      + create

      Terraform will perform the following actions:

      # heroku_addon.redis will be created
      + resource "heroku_addon" "redis" {
            + app_id            = "..."
            + config_var_values = (sensitive value)
            + config_vars       = (known after apply)
            + id                = (known after apply)
            + name              = (known after apply)
            + plan              = "heroku-redis:hobby-dev"
            + provider_id       = (known after apply)
         }

      Plan: 1 to add, 0 to change, 0 to destroy.

      ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

      Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now.
      ```
      
   </details>
1. If the plan looks good, run `terraform apply`.  Terraform Cloud will ask for confirmation before applying the change.

### Note: Deploying Application Code Changes
you can deploy code changes this same way (the `heroku_build` resource will show up as a changed resource).