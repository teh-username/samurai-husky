FROM node:6.2.1

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app NODE_ENV=production

USER app

COPY . $HOME/
WORKDIR $HOME

RUN npm install --only=production && python migrations.py

EXPOSE 3000

ENTRYPOINT ["node"]

CMD ["bin/www"]
