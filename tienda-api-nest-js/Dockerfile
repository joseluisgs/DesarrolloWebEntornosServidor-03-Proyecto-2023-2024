# Etapa de compilación, un docker especifico, que se etiqueta como build
FROM node:16-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copia el package.json
COPY package*.json ./

# Instala las dependencias con ci es mas rapido y optimizado para docker
# iestalamos todo porque vamos a hacer test, si no podríamos hacer npm ci --only=production
RUN npm ci

# Copia el resto de archivos del proyecto al directorio de trabajo
COPY . .

# Realiza los test
RUN npm run test

# Compila la aplicación
RUN npm run build

# Elimina las dependencias de prueba (devDependencies ya han pasado los test)
RUN npm prune --production

# Etapa de ejecución, un docker especifico, que se etiqueta como run
FROM node:16-alpine AS run

# Directorio de trabajo
WORKDIR /app

# Copia el node_modules
COPY --from=build /app/node_modules/ /app/node_modules/

# Copia el directorio build de la etapa de compilación
COPY --from=build /app/dist/ /app/dist/

# Copia el package.json
COPY package*.json /app/

# Expone el puerto 3000
EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:prod"]
