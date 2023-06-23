# build 배포

npm test
npm run build
npm install -g serve
serve -s build

# firebase 배포

    npm install -g firebase-tools
    firebase init
      - build 디렉토리 선택
    	- overrite Y
    npm run build
    firebase deploy
