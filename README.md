# space-balls

docker build -t webapp-backend-stg .
docker tag webapp-backend-stg:latest xxxxxxxxxxxx.dkr.ecr.us-west-2.amazonaws.com/webapp-backend-stg:latest

aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 901449301905.dkr.ecr.eu-west-1.amazonaws.com

docker push 901449301905.dkr.ecr.eu-west-1.amazonaws.com/hack-day-space-balls:latest
