#!/bin/bash
# Script to remove MongoDB security group rule from AWS

echo "Removing MongoDB port 27017 from security group..."
aws ec2 revoke-security-group-ingress \
  --group-id sg-038b50ce9b15e8ba4 \
  --region us-east-1 \
  --protocol tcp \
  --port 27017 \
  --cidr 0.0.0.0/0

echo "Verifying the rule has been removed..."
aws ec2 describe-security-groups \
  --group-ids sg-038b50ce9b15e8ba4 \
  --region us-east-1 \
  --query 'SecurityGroups[0].IpPermissions[*].[FromPort,ToPort,IpProtocol]' \
  --output table

echo "Done! MongoDB port 27017 should now be removed."
