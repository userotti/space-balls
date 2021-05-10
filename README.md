# Space Balls
aws configure
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 901449301905.dkr.ecr.eu-west-1.amazonaws.com
docker build -t hack-day-space-balls .
docker tag hack-day-space-balls:latest 901449301905.dkr.ecr.eu-west-1.amazonaws.com/hack-day-space-balls:latest
docker push 901449301905.dkr.ecr.eu-west-1.amazonaws.com/hack-day-space-balls:latest


# Livereload

Instant HTML/CSS change in the browser

## setup & run

`npm install -g livereload`
`livereload ./public`