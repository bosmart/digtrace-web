# run the container with port mapped to some port, e.g. 2222 for it's 22 ssh port. Also, disable -oom killer within the container

docker container run -d -p 2222:22 -m 20000m --memory-swap 50000m --oom-kill-disable --name apidigtace_ssh_service_v1 apidigtrace_ssh_service

docker container run -d -p 2222:22 -m 20000m --memory-swap 50000m --oom-kill-disable --name apidigtace_ssh_service_18.01_v1 apidigtrace_ssh_service_ubuntu18.01

#check if any process is being killed for out of memory:

docker exec -it apidigtrace_ssh_service_v1 dmesg | grep "Out of memory"