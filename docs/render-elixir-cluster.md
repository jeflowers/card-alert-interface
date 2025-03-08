# Elixir Cluster Deployment on Render

## Prerequisites
- Elixir project with clustering support
- Release configuration
- Render.com account

## Deployment Configuration

### Dockerfile Example
```dockerfile
FROM hexpm/elixir:1.14.3-erlang-25.3-debian-bullseye-20230227-slim

# Install build dependencies
RUN apt-get update && \
    apt-get install -y build-essential git nodejs npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install hex and rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Copy project files
COPY . .

# Install dependencies
RUN mix deps.get --only prod
RUN MIX_ENV=prod mix compile

# Build release
RUN MIX_ENV=prod mix release

# Final stage
FROM debian:bullseye-slim

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y libssl-dev ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy release from builder
COPY --from=0 /app/_build/prod/rel/your_app ./

# Expose ports
EXPOSE 4000
EXPOSE 4369
EXPOSE 9000-9100

# Set runtime environment
ENV RELEASE_DISTRIBUTION=name
ENV RELEASE_NODE=your_app@127.0.0.1

# Entrypoint
CMD ["bin/your_app", "start"]
```

### Render Configuration
- Web Service Type
- Docker Environment
- Free/Paid Tier Selection

### Clustering Configuration
```elixir
# config/runtime.exs
import Config

# Render-specific node configuration
if config_env() == :prod do
  app_name = System.get_env("RENDER_SERVICE_NAME")
  
  config :your_app, YourApp.Cluster,
    topologies: [
      render: [
        strategy: Cluster.Strategy.Epmd,
        config: [
          hosts: [
            :"
app1@#{app_name}.internal",
            :"
app2@#{app_name}.internal"
          ]
        ]
      ]
    ]
end
```

### Cluster Library
```elixir
# Use libcluster for automatic clustering
{:libcluster, "~> 3.3"}
```

### Environment Variables
- `RENDER_SERVICE_NAME`
- `RELEASE_DISTRIBUTION`
- `RELEASE_NODE`

### Networking Considerations
- Internal service communication
- Port ranges for clustering
- Firewall configuration

### Troubleshooting
- Verify node connectivity
- Check BEAM distributed erlang settings
- Monitor cluster state

### Best Practices
- Use consistent release configurations
- Implement proper node naming
- Secure inter-node communication
- Handle network partitions gracefully