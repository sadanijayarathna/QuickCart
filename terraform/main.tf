# QuickCart AWS Infrastructure with Terraform

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
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

provider "aws" {
  region = var.aws_region
}

# Data source for latest Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd*/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Generate SSH key pair
resource "tls_private_key" "quickcart_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "quickcart_key" {
  key_name   = var.key_name
  public_key = tls_private_key.quickcart_key.public_key_openssh

  tags = {
    Name        = "${var.project_name}-key"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Save private key locally
resource "local_file" "private_key" {
  content         = tls_private_key.quickcart_key.private_key_pem
  filename        = "${path.module}/${var.key_name}.pem"
  file_permission = "0400"
}

# Get default VPC
data "aws_vpc" "default" {
  default = true
}

# Security Group for QuickCart
resource "aws_security_group" "quickcart_sg" {
  name        = "${var.project_name}-sg"
  description = "Security group for QuickCart application"
  vpc_id      = data.aws_vpc.default.id

  # SSH access
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr
  }

  # Frontend (React)
  ingress {
    description = "Frontend"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend (Express)
  ingress {
    description = "Backend API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All outbound traffic
  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}

# EC2 Instance for QuickCart
resource "aws_instance" "quickcart" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = aws_key_pair.quickcart_key.key_name

  vpc_security_group_ids = [aws_security_group.quickcart_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.ssm_profile.name

  # Root volume optimized for Free Tier
  root_block_device {
    volume_size           = 20  # Free Tier: Up to 30GB
    volume_type           = "gp2"  # Free Tier: gp2 only
    delete_on_termination = true
    
    tags = {
      Name        = "${var.project_name}-root-volume"
      Environment = var.environment
      Project     = var.project_name
    }
  }

  user_data = templatefile("${path.module}/user-data.sh", {
    dockerhub_username = var.dockerhub_username
  })

  tags = {
    Name        = "${var.project_name}-server"
    Environment = var.environment
    Project     = var.project_name
  }

  # Wait for instance to be ready
  provisioner "local-exec" {
    command = "echo 'Waiting for instance to be ready...' && sleep 60"
  }
}

# Elastic IP for consistent public IP
resource "aws_eip" "quickcart_eip" {
  instance = aws_instance.quickcart.id
  vpc      = true

  tags = {
    Name        = "${var.project_name}-eip"
    Environment = var.environment
    Project     = var.project_name
  }

  depends_on = [aws_instance.quickcart]
}
