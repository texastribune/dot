# VARIABLES
variable "google_organization_id" {}
variable "google_project_id" {}
variable "google_project_name" {}
variable "google_region" { default = "us-central1" }

# GLOBAL
terraform {
  required_providers {
    # https://registry.terraform.io/providers/hashicorp/google/latest
    google = {
      source  = "hashicorp/google"
      version = "4.30.0"
    }
  }
  # Configure terraform cloud for terraform backend/statefile
  cloud {
    organization = "texastribune"
    workspaces {
      name = "dot"
    }
  }
}

# PROVIDERS

## Requires GOOGLE_CREDENTIALS environment variable set at terraform runtime
## See:  https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/provider_reference
provider "google" {
  project = var.google_project_id
  region  = var.google_region
}

## DATA
### local data

# RESOURCES
resource "google_storage_bucket" "static-files" {
  name = "dot-files"
  location = var.google_region

  # terraform will destroy objects in bucket before deleting bucket
  force_destroy = true

}


# OUTPUTS

