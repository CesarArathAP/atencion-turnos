FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Instalar SQLite3
RUN apt-get update && apt-get install -y sqlite3

COPY . .

# Inicializar la base de datos
RUN sqlite3 db/datos.db "VACUUM;"

EXPOSE 3000

CMD ["node", "app.js"]