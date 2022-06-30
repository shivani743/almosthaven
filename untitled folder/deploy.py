import os, time 
start = time.time()

print('deploying started')

os.system('aws ecr get-login-password --region ap-south-1 --profile almostheav | docker login --username AWS --password-stdin 976429499557.dkr.ecr.ap-south-1.amazonaws.com')
os.system('docker build -t almostheaven .')
os.system('docker tag almostheaven:latest 976429499557.dkr.ecr.ap-south-1.amazonaws.com/almostheaven:latest')
os.system('docker push 976429499557.dkr.ecr.ap-south-1.amazonaws.com/almostheaven:latest')
print('deploying completed', time.time() - start)