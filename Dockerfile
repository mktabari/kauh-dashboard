FROM node:20.4.0-buster-slim
WORKDIR /tmp
RUN apt-get update 
RUN apt-get -y upgrade 
RUN apt-get -y dist-upgrade
RUN apt-get install -y alien libaio1 iputils-ping
# lien libaio1 for oracle : iputils-ping for ping : openssl for prosma
ADD oracle-instantclient*.rpm /tmp/
RUN alien -i --scripts oracle-instantclient*.rpm 
RUN rm -f oracle-instantclient*.rpm && apt-get -y autoremove && apt-get -y clean
WORKDIR /usr/lib/oracle/11.2/client64/lib/
RUN rm -rf *jdbc* *occi* *mysql* *jar
RUN echo /usr/lib/oracle/11.2/client64/lib > /etc/ld.so.conf.d/oracle-instantclient11.2.conf && ldconfig
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN rm -rf oracle-instantclient*.rpm
RUN npx prisma generate
RUN npm run build
RUN npm ci --prod
# CMD ["node", "build"]

FROM node:20.4.0-buster-slim

COPY --from=0  /usr/lib/oracle /usr/lib/oracle
COPY --from=0  /etc/ld.so.conf.d/oracle-instantclient11.2.conf /etc/ld.so.conf.d/oracle-instantclient11.2.conf
RUN apt-get update 
RUN apt-get -y upgrade 
RUN apt-get -y dist-upgrade
RUN apt-get install -y libaio1 iputils-ping openssl
RUN ldconfig
RUN npm install pm2 -g


USER node:node
WORKDIR /app
COPY --from=0 --chown=node:node /app/build ./build
COPY --from=0 --chown=node:node /app/node_modules ./node_modules
COPY --from=0 --chown=node:node /app/pm2.config.cjs ./

COPY --from=0 --chown=node:node /app/prisma/schema.prisma ./prisma/
COPY --from=0 --chown=node:node /app/prisma/migrations ./prisma/migrations

RUN npx prisma migrate dev --name mg1

COPY --chown=node:node package.json .
COPY --from=0 --chown=node:node /app/src/lib/config/servers/* ./build/server/chunks/servers/

EXPOSE 3000

CMD ["pm2-runtime", "pm2.config.cjs"]

# docker build . -t kauhdb:v1 
# docker run -d -p 3000:3000 -e "ORIGIN=http://localhost:3000" --name kauhdb --mount source=kd-sqlite-db,target=/app/sqliteDB kauhdb:v1
# npx prisma migrate deploy