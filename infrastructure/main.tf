# VARIABLES
variable "heroku_email" {}
variable "heroku_api_key" {sensitive = true}
variable "SERVICE_NAME" {
  type        = string
  description = "The name of the Cloud Run service/app"
  default     = "dot"
}

# GLOBAL
terraform {
  required_providers {
    # https://registry.terraform.io/providers/heroku/heroku/latest
    heroku = {
      source  = "heroku/heroku"
      version = "~> 5.1.1"
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
provider "heroku" {
  email   = var.heroku_email
  api_key = var.heroku_api_key
}

## DATA
### local data

## RESOURCES
# OUTPUTS
