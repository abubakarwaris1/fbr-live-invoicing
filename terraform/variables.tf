variable "digitalocean_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "fbr-live-invoicing"
}

variable "region" {
  description = "DigitalOcean region"
  type        = string
  default     = "nyc3"
  validation {
    condition = contains([
      "nyc1", "nyc2", "nyc3", "sfo1", "sfo2", "sfo3", 
      "tor1", "ams2", "ams3", "sgp1", "lon1", "fra1", 
      "blr1", "syd1"
    ], var.region)
    error_message = "The region must be a valid DigitalOcean region."
  }
}

variable "droplet_size" {
  description = "Size of the droplet"
  type        = string
  default     = "s-1vcpu-2gb"  # Updated to 1 vCPU, 2GB RAM
  validation {
    condition = contains([
      "s-1vcpu-1gb", "s-1vcpu-2gb", "s-2vcpu-2gb", 
      "s-2vcpu-4gb", "s-4vcpu-8gb", "s-8vcpu-16gb"
    ], var.droplet_size)
    error_message = "The droplet size must be a valid DigitalOcean droplet size."
  }
}


variable "db_size" {
  description = "Size of the database cluster"
  type        = string
  default     = "db-s-1vcpu-1gb"
  validation {
    condition = contains([
      "db-s-1vcpu-1gb", "db-s-1vcpu-2gb", "db-s-2vcpu-2gb", 
      "db-s-2vcpu-4gb", "db-s-4vcpu-8gb", "db-s-8vcpu-16gb"
    ], var.db_size)
    error_message = "The database size must be a valid DigitalOcean database size."
  }
}



variable "domain_name" {
  description = "Domain name for the application (optional)"
  type        = string
  default     = ""
}
