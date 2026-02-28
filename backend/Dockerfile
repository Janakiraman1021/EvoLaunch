# Multi-stage build for hybrid Node.js/Python environment
FROM node:18-slim

# Install Python and build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install Node dependencies
COPY package*.json ./
RUN npm install --production

# Copy Python requirements and install
COPY src/agents/python/requirements.txt ./python_requirements.txt
RUN python3 -m venv /opt/venv \
    && . /opt/venv/bin/activate \
    && pip install --no-cache-dir -r python_requirements.txt
ENV PATH="/opt/venv/bin:$PATH"

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PYTHON_PATH=python3

# Expose the API port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
