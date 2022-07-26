# VARIABLES
variable "GOOGLE_ORGANIZATION_ID" {}
variable "GOOGLE_PROJECT_ID" {}
variable "GOOGLE_REGION" { default = "us-central1" }

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
# Requires GOOGLE_CREDENTIALS environment variable set at terraform runtime
# See:  https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/provider_reference
provider "google" {
  project = var.GOOGLE_PROJECT_ID
  region  = var.GOOGLE_REGION
}

## DATA
### local data
locals {
  # google project api services to enable
  services = [
    "iam.googleapis.com",
    "artifactregistry.googleapis.com",
    "run.googleapis.com",
  ]
}

## RESOURCES
### Enable/configure the needed Google Project api services
resource "google_project_service" "enabled_service" {
  for_each = toset(local.services)
  project  = var.GOOGLE_PROJECT_ID
  service  = each.key
}