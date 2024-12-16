FROM node:22-slim

# Set the working directory
WORKDIR /apps/web
COPY web /apps/web/

# Install dependencies
RUN npm install

# Expose the port
EXPOSE 5173

# Start the app
CMD ["npx", "vite", "--host"]
