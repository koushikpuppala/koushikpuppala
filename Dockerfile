FROM node:18.3.0-buster-slim

# Create app directory
WORKDIR /puppalakoushik

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install --force

# Bundle app source
COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]
