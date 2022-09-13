# https://cloud.google.com/architecture/serverless-pixel-tracking

# VARIABLES
variable "google_organization_id" {}
variable "google_project_id" {}
variable "google_project_name" {}
variable "google_storage_bucket_name" {}
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
## Create a storage bucket for static files
resource "google_storage_bucket" "static-files" {
  name     = var.google_storage_bucket_name
  location = var.google_region

  # terraform will destroy objects in bucket before deleting bucket
  force_destroy = true

}

# Set Access Control Policy to make bucket publicly readable
resource "google_storage_bucket_access_control" "bucket-acl-public-read" {
  bucket = google_storage_bucket.static-files.name
  role = "READER"
  entity = "allUsers"
}

# Configure the storage bucket to be able to be used 
# as a backend for an https load balancer
resource "google_compute_backend_bucket" "dot-bucket-backend" {
  name = "dot-bucket-backend"
  description = "Static pixel.js and pixel.gif files"
  bucket_name = google_storage_bucket.static-files.name
  enable_cdn = true
}

## Create a local iterable list of the static archived versions to host
### Note: there's probably a more elegant way to do this, but since the 
### versions are static hard-coding them in place here seems fine.
locals {
  versions = [
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.3.1",
    "2.3.2",
    "2.3.3",
    "2.3.4",
    "2.3.5",
    "2.3.6",
    "2.4.0",
    "2.5.0",
    "2.6.0",
    "2.6.1",
    "2.6.2",
    "2.6.3",
    "2.7.0",
    "2.8.0",
    "2.8.1",
    "2.8.2",
    "2.8.3",
    "2.8.4",
    "2.8.5",
    "2.8.6",
    "2.8.7",
    "2.8.8",
    "2.8.9",
    "2.8.10",
  ]
}
## Upload static files to storage bucket
resource "google_storage_bucket_object" "analytics" {
  for_each = toset(local.versions)
  name   = "analytics/${each.key}/pixel.js"
  source = "./static/analytics/${each.key}/pixel.js"
  bucket = google_storage_bucket.static-files.name
  
  cache_control = "no-cache, no-store, must-revalidate"
}

# OUTPUTS

