# Outputs for QuickCart Deployment

output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.quickcart.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.quickcart_eip.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.quickcart.public_dns
}

output "frontend_url" {
  description = "QuickCart Frontend URL"
  value       = "http://${aws_eip.quickcart_eip.public_ip}"
}

output "frontend_url_with_port" {
  description = "QuickCart Frontend URL with port"
  value       = "http://${aws_eip.quickcart_eip.public_ip}:3000"
}

output "backend_url" {
  description = "QuickCart Backend API URL"
  value       = "http://${aws_eip.quickcart_eip.public_ip}:5000"
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${aws_eip.quickcart_eip.public_ip}"
}

output "private_key_location" {
  description = "Location of the private SSH key"
  value       = "${path.module}/${var.key_name}.pem"
}

output "security_group_id" {
  description = "Security Group ID"
  value       = aws_security_group.quickcart_sg.id
}

output "deployment_instructions" {
  description = "Post-deployment instructions"
  value       = <<-EOT
    
    ========================================
    QuickCart Deployment Successful! 🎉
    ========================================
    
    📍 Server Details:
       Instance ID: ${aws_instance.quickcart.id}
       Public IP: ${aws_eip.quickcart_eip.public_ip}
    
    🌐 Application URLs:
       Frontend: http://${aws_eip.quickcart_eip.public_ip}
       Frontend (alt): http://${aws_eip.quickcart_eip.public_ip}:3000
       Backend API: http://${aws_eip.quickcart_eip.public_ip}:5000
    
    🔑 SSH Access:
       ssh -i ${var.key_name}.pem ubuntu@${aws_eip.quickcart_eip.public_ip}
    
    ⚙️  Next Steps:
       1. Wait 2-3 minutes for Docker containers to start
       2. Access the application using the URLs above
       3. Check logs: ssh into server and run 'docker compose logs'
    
    📊 Monitor Deployment:
       SSH into server: ${var.key_name}.pem is in terraform/ directory
       Check containers: docker compose ps
       View logs: docker compose logs -f
    
    ========================================
  EOT
}
