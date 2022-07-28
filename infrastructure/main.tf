# VARIABLES
variable "GOOGLE_ORGANIZATION_ID" {}
variable "GOOGLE_PROJECT_ID" {}
variable "GOOGLE_PROJECT_NAME" {}
variable "GOOGLE_REGION" { default = "us-central1" }
variable "SERVICE_NAME" {
  type = string
  description = "The name of the Cloud Run service/app"
  default = "dot"
}

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

module "cloud_run" {
  # https://registry.terraform.io/modules/GoogleCloudPlatform/cloud-run/google/0.3.0
  source = "GoogleCloudPlatform/cloud-run/google"
  version = "~> 0.3.0"

  service_name = var.SERVICE_NAME
  project_id = var.GOOGLE_PROJECT_ID
  location = var.GOOGLE_REGION
  image = "us.gcr.io/${var.GOOGLE_PROJECT_NAME}/${var.SERVICE_NAME}:latest"
  ports = {
    "name": "http1",
    "port": 5000
  }
  
  # allow unauthenticated requests (makes service URL public)
  members = ["allUsers"]

}

# OUTPUTS
output "cloud_run-url" {
  value = "${module.cloud_run.service_url}"
}
output "cloud_run-service-name" {
  value = "${module.cloud_run.service_name}"
}