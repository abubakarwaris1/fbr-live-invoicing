output "app_url" {
  description = "URL of the application (web interface)"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "http://${digitalocean_reserved_ip.main.ip_address}"
}

output "api_static_ip" {
  description = "Static IP address for API access (for government integration)"
  value       = digitalocean_reserved_ip.main.ip_address
}

output "api_url" {
  description = "API URL using static IP"
  value       = var.domain_name != "" ? "https://${var.domain_name}/api" : "http://${digitalocean_reserved_ip.main.ip_address}/api"
}

output "api_endpoints" {
  description = "Available API endpoints"
  value = {
    health_check = "http://${digitalocean_reserved_ip.main.ip_address}/api/health"
    auth = "http://${digitalocean_reserved_ip.main.ip_address}/api/auth"
    invoices = "http://${digitalocean_reserved_ip.main.ip_address}/api/gov-invoices"
  }
}

output "database_connection_string" {
  description = "MongoDB connection string"
  value       = "mongodb://${digitalocean_database_user.main.name}:${digitalocean_database_user.main.password}@${digitalocean_database_cluster.main.host}:${digitalocean_database_cluster.main.port}/${digitalocean_database_db.main.name}?ssl=true"
  sensitive   = true
}

output "droplet_ip" {
  description = "IP address of the droplet"
  value       = digitalocean_droplet.main.ipv4_address
}

output "database_host" {
  description = "Database host"
  value       = digitalocean_database_cluster.main.host
}

output "database_port" {
  description = "Database port"
  value       = digitalocean_database_cluster.main.port
}

output "database_name" {
  description = "Database name"
  value       = digitalocean_database_db.main.name
}

output "database_user" {
  description = "Database user"
  value       = digitalocean_database_user.main.name
}

output "database_password" {
  description = "Database password"
  value       = digitalocean_database_user.main.password
  sensitive   = true
}

output "government_integration_info" {
  description = "Information for government system integration"
  value = {
    api_base_url = var.domain_name != "" ? "https://${var.domain_name}/api" : "http://${digitalocean_reserved_ip.main.ip_address}/api"
    static_ip = digitalocean_reserved_ip.main.ip_address
    port = 80
    health_check = "http://${digitalocean_reserved_ip.main.ip_address}/api/health"
    note = "This static IP will not change even if the server is destroyed and recreated"
  }
}
