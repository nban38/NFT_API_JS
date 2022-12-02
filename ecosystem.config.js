'use strict';

module.exports = {
    apps: [
        {
            name: "App name", // pm2로 실행한 프로세스 목록에서 이 애플리케이션의 이름으로 지정될 문자열
            script: "server/app.js", // pm2로 실행될 파일 경로
            watch: true, // 파일이 변경되면 자동으로 재실행 (true || false)
            instances : "max",  // 실행시킬 프로세스의 갯수(max로 입력할 경우 최대 갯수로 설정한다.)
            exec_mode: "cluster",
            env: {
                "NODE_ENV": "development" // 개발환경시 적용될 설정 지정
            },
            env_production: {
                "NODE_ENV": "production" // 배포환경시 적용될 설정 지정
            }
        }
    ]
};