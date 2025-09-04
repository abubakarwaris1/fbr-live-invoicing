# FBR Live Invoicing - Deployment Guide

## Environment Variables Setup

### 1. Local Development (.env file)
Create a `.env` file in the root directory:

```bash
# Application
NODE_ENV=development
PORT=3000

# Database (for local development)
MONGODB_URI=mongodb://localhost:27017/fbr-invoicing

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secure_jwt_secret_here

# FBR API
FBR_ACCESS_TOKEN=your_fbr_access_token_here

# DigitalOcean (for deployment)
TF_VAR_DIGITALOCEAN_TOKEN=your_digitalocean_token_here
```

### 2. GitHub Secrets
Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

```
DIGITALOCEAN_TOKEN=your_digitalocean_token_here
SERVER_SSH_KEY=your_private_ssh_key_content
```

### 3. Terraform Variables (terraform/terraform.tfvars)
Create `terraform/terraform.tfvars`:

```hcl
# DigitalOcean API Token
digitalocean_token = "your_digitalocean_token_here"

# Application name
app_name = "fbr-live-invoicing"

# DigitalOcean region
region = "nyc3"

# Droplet size
droplet_size = "s-2vcpu-4gb"

# Database size
db_size = "db-s-1vcpu-1gb"

# Domain name (optional - leave empty if not using custom domain)
domain_name = ""

# Enable SSL (requires domain name)
enable_ssl = false

# SSH key path
ssh_key_path = "~/.ssh/id_rsa.pub"
```

### 4. Server Environment Variables
The server will automatically create these environment variables during deployment:

```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://user:password@host:port/database?ssl=true
JWT_SECRET=auto_generated_secure_secret
FBR_ACCESS_TOKEN=your_fbr_access_token_here
STATIC_IP=your_reserved_static_ip
```

## Deployment Process

### Manual Deployment (Terraform)

1. **Set up environment variables:**
   ```bash
   export TF_VAR_DIGITALOCEAN_TOKEN=your_digitalocean_token_here
   ```

2. **Initialize Terraform:**
   ```bash
   cd terraform
   terraform init
   ```

3. **Plan deployment:**
   ```bash
   terraform plan
   ```

4. **Apply deployment:**
   ```bash
   terraform apply
   ```

### Automated Deployment (GitHub Actions)

1. **Push to main branch** - GitHub Actions will automatically:
   - Run tests
   - Build Docker image
   - Deploy infrastructure
   - Deploy application to server

## Important Notes

### Static IP for Government Integration
- The system creates a **reserved static IP** that will NOT change
- This IP is provided to government systems for API integration
- Even if you destroy and recreate the server, the static IP remains the same
- API endpoints are accessible at: `http://STATIC_IP:3000/api/*`

### Security
- All API endpoints are accessible via the static IP
- CORS headers are configured for government system integration
- Firewall rules allow direct access to port 3000 for API calls
- SSL/TLS can be enabled if using a custom domain

### Monitoring
- Health check endpoint: `http://STATIC_IP:3000/api/health`
- Application logs are available on the server
- Docker containers are configured with health checks

## Troubleshooting

### Check deployment status:
```bash
cd terraform
terraform output
```

### SSH into server:
```bash
ssh root@STATIC_IP
```

### Check application logs:
```bash
cd /opt/fbr-live-invoicing
docker-compose logs -f
```

### Restart application:
```bash
cd /opt/fbr-live-invoicing
docker-compose restart
```
