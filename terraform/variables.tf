# Variables for QuickCart AWS Deployment

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "quickcart"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"  # AWS Free Tier eligible
}

variable "allowed_ssh_cidr" {
  description = "CIDR blocks allowed to SSH into EC2 instance"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # WARNING: Open to all - restrict in production
}

variable "dockerhub_username" {
  description = "Docker Hub username"
  type        = string
  default     = "sadanijayarathna"
}

variable "key_name" {
  description = "Name for the SSH key pair"
  type        = string
  default     = "quickcart-key"
}