# Imgly

This app is a photo gallery that allows users to upload and display images at full resolution, and also runs a predictive machine learning algorithm ([ResNet50](https://arxiv.org/abs/1512.03385) trained on [imagenet](http://www.image-net.org/challenges/LSVRC/)) on all uploads to tag them.


## Developer setup
1. `git clone https://github.com/shahin-imtiaz/imgly.git`
2. Enter each of the `api` and `client` folders and run `npm install`
3. In the main folder, use `docker-compose up --build` to start the containers.


## Ephemeral environment (lasts about a week after a new commit)
To see a full stack staging server demo of the site (built with LayerCI) see http://imgly.shahinimtiaz.com


## License
This repository is licensed under GPLv3, whose license terms are attached as LICENSE
