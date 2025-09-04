# Generate SSH key pair
resource "tls_private_key" "main" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Create SSH key resource in DigitalOcean
resource "digitalocean_ssh_key" "main" {
  name       = "${var.app_name}-ssh-key"
  public_key = tls_private_key.main.public_key_openssh
}

# Save private key to local file
resource "local_file" "private_key" {
  content  = tls_private_key.main.private_key_pem
  filename = "${path.module}/private_key.pem"
  file_permission = "0600"
}

# Save public key to local file
resource "local_file" "public_key" {
  content  = tls_private_key.main.public_key_openssh
  filename = "${path.module}/public_key.pub"
  file_permission = "0644"
}
