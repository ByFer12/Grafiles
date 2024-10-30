# Usa una imagen de Node.js
FROM node:16.14.0

# Configura el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto de Vite
EXPOSE 5173

# Comando para iniciar Vite
CMD ["npm", "run", "dev"]
