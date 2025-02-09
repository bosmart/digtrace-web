FROM ubuntu:18.04
##### the digtrace binaries for 3d generation
# Set the working directory to /app
# install dependencies


RUN apt-get update && apt-get install -y openssh-server

RUN mkdir /var/run/sshd
RUN echo 'root:akandakanda' | chpasswd
RUN sed -ir 's/^#*PermitRootLogin .*/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
ADD . /apidigtrace/



RUN apt-get update && apt-get install -y \
software-properties-common \
apt-utils \
git \
libpng-dev \
libjpeg-dev \
libtiff-dev \
libxxf86vm1 \
libxxf86vm-dev \
libxi-dev \
libxrandr-dev \
cmake \
build-essential \
wget \
tmux \
nano \
libpng-dev \
libboost-all-dev

RUN apt-get install -y build-essential python3.6 python3.6-dev python3-pip python3.6-venv
RUN apt-get install -y git

# update pip
RUN python3.6 -m pip install pip --upgrade
RUN python3.6 -m pip install wheel
RUN pip install pysftp
RUN pip install plyfile
RUN pip install numpy
RUN pip install pillow
# Build PoissonRecon

WORKDIR /clibsources

# Clone the repos
RUN git clone https://github.com/mkazhdan/PoissonRecon.git
RUN git clone --recursive https://github.com/openMVG/openMVG.git
RUN git clone https://github.com/pmoulon/CMVS-PMVS

#Build PoissonRecon
WORKDIR /clibsources/PoissonRecon
RUN git checkout 20b17f5
RUN make -j$(cat /proc/cpuinfo | grep processor | wc -l)

#Build openMVG
WORKDIR /clibsources/openMVG/openMVG_Build
RUN cmake -DCMAKE_BUILD_TYPE=RELEASE . ../src/
RUN make -j$(cat /proc/cpuinfo | grep processor | wc -l)
RUN make install

#Build CMVS-PMVS
WORKDIR /clibsources/CMVS-PMVS/OutputLinux
RUN cmake . ../program
RUN make -j$(cat /proc/cpuinfo | grep processor | wc -l)
RUN make install


#copy binaries into the apidigtrace target location #/clibsources/CMVS-PMVS_build/main

RUN cp -a /clibsources/PoissonRecon/Bin/Linux/. /apidigtrace/lib/Unix/
RUN cp -a /clibsources/CMVS-PMVS/OutputLinux/main/. /apidigtrace/lib/Unix/
RUN cp -a /clibsources/openMVG/openMVG_Build/Linux-x86_64-RELEASE/. /apidigtrace/lib/Unix/
# 777 to all lib bins
RUN chmod -R 777 /apidigtrace/lib/Unix/


