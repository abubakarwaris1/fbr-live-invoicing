# GitHub Environment Setup Guide

## Setting up GitHub Environments

### 1. Create Production Environment

1. Go to your GitHub repository
2. Navigate to **Settings** > **Environments**
3. Click **New environment**
4. Name it: `production`
5. Configure the environment:

#### Environment Protection Rules:
- ✅ **Required reviewers**: Add team members who can approve deployments
- ✅ **Wait timer**: Set to 0 minutes (or your preference)
- ✅ **Deployment branches**: Restrict to `main` branch only

### 2. Add Environment Secrets

In the `production` environment, add these secrets:

#### Required Secrets:
```
SERVER_IP=your_server_static_ip_here
SERVER_SSH_KEY=your_private_ssh_key_content
```

#### Optional Secrets (if using custom domain):
```
DOMAIN_NAME=your-domain.com
SSL_CERTIFICATE=your_ssl_certificate_content
SSL_PRIVATE_KEY=your_ssl_private_key_content
```

### 3. Environment Variables

You can also add environment variables (non-sensitive):

```
APP_NAME=fbr-live-invoicing
REGION=nyc3
DROPLET_SIZE=s-1vcpu-2gb
DB_SIZE=db-s-1vcpu-1gb
```

## Deployment Process

### Step 1: Create Infrastructure (Manual)
```bash
# Set your DigitalOcean token
export TF_VAR_DIGITALOCEAN_TOKEN=your_digitalocean_token_here

# Initialize and deploy infrastructure
cd terraform
terraform init
terraform plan
terraform apply
```

### Step 2: Get Server Information
After Terraform completes, get the server details:
```bash
cd terraform
terraform output api_static_ip
terraform output app_url
```

### Step 3: Add Secrets to GitHub Environment
1. Go to **Repository Settings** > **Environments** > **production**
2. Add these secrets:
   - `SERVER_IP`: The static IP from terraform output
   - `SERVER_SSH_KEY`: Your private SSH key content

### Step 4: Deploy Application (Automatic)
- **Push to main branch** → GitHub Actions will automatically deploy the application
- **Manual deployment** → Use "Actions" tab > "Deploy Application" > "Run workflow"

## Workflow Behavior

### Automatic Deployment:
- **Push to main**: Triggers automatic application deployment
- **Pull Request**: Runs tests and builds, but doesn't deploy

### Manual Deployment:
- **Workflow Dispatch**: Allows you to specify a different server IP
- **Environment Protection**: Requires approval if configured

### What the Workflow Does:
1. **Test** → **Build Docker Image** → **Deploy to Server**
2. **No Infrastructure Creation** - Only application deployment
3. **Uses existing server** - Connects to your pre-created server

## Benefits of This Approach

### Separation of Concerns:
- ✅ **Infrastructure**: Managed manually with Terraform
- ✅ **Application**: Deployed automatically with GitHub Actions
- ✅ **Control**: You control when infrastructure is created/destroyed

### Flexibility:
- ✅ **Multiple Environments**: Deploy to different servers
- ✅ **Manual Control**: Create/destroy infrastructure as needed
- ✅ **Cost Control**: Only pay for infrastructure when needed

### Security:
- ✅ **Secrets Isolation**: Server credentials only in production environment
- ✅ **Access Control**: Only authorized users can deploy
- ✅ **Audit Trail**: All deployments tracked

## Manual Deployment Commands

### Create Infrastructure:
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### Get Server Info:
```bash
terraform output api_static_ip
terraform output app_url
```

### Deploy Application Manually:
```bash
# SSH into server
ssh root@YOUR_STATIC_IP

# Deploy application
cd /opt/fbr-live-invoicing
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

### Check Infrastructure:
```bash
cd terraform
terraform show
terraform output
```

### Check Application:
```bash
ssh root@YOUR_STATIC_IP
cd /opt/fbr-live-invoicing
docker-compose logs -f
docker-compose ps
```

### Restart Application:
```bash
ssh root@YOUR_STATIC_IP
cd /opt/fbr-live-invoicing
docker-compose restart
```
