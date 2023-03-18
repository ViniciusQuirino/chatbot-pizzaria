FROM node:slim

WORKDIR /whats_api

COPY package.json .

RUN npm install

COPY . .

EXPOSE 7005

RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

CMD [ "npm", "start" ]

# criar image
# sudo docker image build -t whats_image .
# rodar no gitbash
# sudo docker run -p 7005:7005 -i --init --rm --cap-add=SYS_ADMIN --name whats_container whats_image node -e "`cat app.js`"