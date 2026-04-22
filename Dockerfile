FROM node:alpine
WORKDIR /app

# Copiar el proyecto a la imagen de Docker

COPY package.json package-lock.json* ./

# Instalar las dependencias del proyecto con npm install

RUN npm install

COPY . .

# Compilar el proyecto 

RUN npm run build
EXPOSE 3000

# Colocar un comando de inicio

CMD ["node", "dist/main"]