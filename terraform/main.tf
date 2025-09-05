# Configure the DigitalOcean Provider
terraform {
  required_version = ">= 1.0"
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = var.digitalocean_token
}

# Create a VPC
resource "digitalocean_vpc" "main" {
  name     = "${var.app_name}-vpc"
  region   = var.region
  ip_range = "10.10.0.0/16"
}

# Create a reserved IP (static IP)
resource "digitalocean_reserved_ip" "main" {
  region = var.region
}

# Create database cluster
resource "digitalocean_database_cluster" "main" {
  name       = "${var.app_name}-db"
  engine     = "mongodb"
  version    = "8.0"
  size       = var.db_size
  region     = var.region
  node_count = 1
  private_network_uuid = digitalocean_vpc.main.id
}

# Create database
resource "digitalocean_database_db" "main" {
  cluster_id = digitalocean_database_cluster.main.id
  name       = var.app_name
}

# Create database user
resource "digitalocean_database_user" "main" {
  cluster_id = digitalocean_database_cluster.main.id
  name       = "${var.app_name}-user"
}

# Create droplet with user_data script
resource "digitalocean_droplet" "main" {
  image     = "docker-20-04"
  name      = "${var.app_name}-server"
  region    = var.region
  size      = var.droplet_size
  vpc_uuid  = digitalocean_vpc.main.id
  ssh_keys  = [digitalocean_ssh_key.main.id]
  user_data = file("${path.module}/user_data.sh")
}

# Attach reserved IP to droplet
resource "digitalocean_reserved_ip_assignment" "main" {
  ip_address = digitalocean_reserved_ip.main.ip_address
  droplet_id = digitalocean_droplet.main.id
}

# Create firewall - simplified for container-based nginx
resource "digitalocean_firewall" "main" {
  name = "${var.app_name}-firewall"

  droplet_ids = [digitalocean_droplet.main.id]

  # SSH access
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTP access - nginx inside container
  inbound_rule {
    protocol         = "tcp"
    port_range       = "3000"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS access (for future SSL setup)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
