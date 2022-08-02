# VARIABLES
variable "heroku_email" {}
variable "heroku_api_key" {sensitive = true}
variable "heroku_region" { default = "us" }
variable "app_name" {
  type        = string
  description = "The name of the app"
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

# RESOURCES
resource "heroku_app" "dot-staging" {
  name =  "${var.app_name}-staging"
  region = var.heroku_region
  stack = "heroku-22"
}

# OUTPUTS
output "dot-staging-url" {
  value = heroku_app.dot-staging.web_url
}
