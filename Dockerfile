FROM node:6.2.1

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

USER app

COPY . $HOME/
WORKDIR $HOME

RUN npm install --verbose --only=production && python migrations.py

CMD ["node", "bin/www"]
