FROM node:22-slim

WORKDIR /apps/web
COPY web /apps/web/

RUN npm install

RUN npm install node

EXPOSE 5173

CMD ["npx", "vite", "--host"]