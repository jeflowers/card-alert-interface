# Docker Deployment on Render.com

## Prerequisites
- Docker project
- Render.com account
- GitHub/GitLab repository with Dockerfile

## Deployment Steps

### 1. Prepare Dockerfile
```dockerfile
# Use an official base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Expose port (adjust as needed)
EXPOSE 8000

# Define environment variables (optional)
ENV PORT=8000

# Run command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "$PORT"]
```

### 2. Create render.yaml (Optional)
```yaml
services:
  - type: web
    name: card-alert-interface
    env: docker
    plan: free
    branch: main
    healthCheckPath: /health
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: card-alert-db
          property: connectionString
```

### 3. Render Configuration
- Connect GitHub/GitLab repository
- Select repository and branch
- Choose Docker environment
- Configure environment variables
- Set build and runtime settings

### Docker Deployment Considerations
- Use multi-stage builds for smaller images
- Minimize layer count
- Use .dockerignore file
- Implement health checks
- Optimize dependency caching

### Sample .dockerignore
```
.git
.gitignore
README.md
venv/
*.pyc
__pycache__/
.env
```

### Environment Variables
- `PORT`: Render assigns dynamic port
- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Application secrets

### Debugging Tips
- Check Docker build logs
- Verify Dockerfile syntax
- Test locally before deployment
- Use Render's web console for troubleshooting

### Best Practices
- Keep images lightweight
- Use official base images
- Implement proper error handling
- Secure sensitive information
- Regular dependency updates