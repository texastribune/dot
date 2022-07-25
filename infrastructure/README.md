# Dot Infrastructure
> Terraform for provisioning and managing infrastructure to run dot app on Google Cloud Run

## Prerequisites
1. **Google Cloud Project**:  a blank Google Cloud Project must be created beforehand.  A `GOOGLE_PROJECT_ID`environment variable must be set at Terraform runtime.
1. **Terraform Cloud**:  This repo assumes terraform cloud is being used as the runtime and backend to manage the terraform statefile.  The Terraform Cloud Workspace needs to point to this directory as the source for the infrastructure code from which to run.

### Terraform
#### Environment Variables
These need to be set in Terraform Cloud for the workspace:  

| Variable | Type |Description | Notes |
|---|---|---| --- |
|`GOOGLE_CREDENTIALS`| JSON|Google Service Account with privileges to deploy cloud resources within the project|See the [Google Provider Configuration Reference Authentication section](https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/provider_reference) |
|`GOOGLE_ORGANIZATION_ID`|String|Google Organization ID|-|
|`GOOGLE_PROJECT_ID`|String|The Google Project ID used for the dot application|-|
|`GOOGLE_REGION`|String|Google Region| _Optional_, defaults to `us-central1`|

#### Local Requirements
* `terraform` cli
   ```sh
   brew install terraform
   ```

### Usage
#### Developing Locally
From the project root directory:
```sh
# initialize terraform, installs providers locally and connects to terraform cloud remote backend
make terraform/init

# Run a speculative plan (will stream to terminal and show up remotely in terraform cloud workspace)
make terraform/plan

# Auto format terraform code before commiting
make terraform/format
```
While working locally, it's not possible to run `terraform apply` to provision/alter/delete cloud resources.  Terraform Cloud reads this github repo directory for changes and runs terraform remotly.

#### Deploying
Terraform Cloud runs `terraform plan` when PRs are opened against the `ping` branch (for now).

Terraform Cloud currently is set to require a manual "apply" in terraform cloud after successful runs.