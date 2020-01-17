![project logo](/icon128.png)

# WebSysMon
Stands for 'Web System Monitor'. Simple flask based application to monitor a remote computer.
Monitor CPU usage, CPU Speed, Memory usage, Network usage and Disk reads/writes with WebSysMon.

Uses [picograph.js](https://github.com/RainingComputers/picograph.js) library to draw graphs.

# Installation
+ Install pipenv
```
python3 -m pip install pipenv
```
+ Clone the repo using `git clone`
```
git clone https://github.com/RainingComputers/WebSysMon.git
cd WebSysMon
```
+ Create virtual environment and install dependencies
```
pipenv shell
pipenv install
```
# Deploying using `gunicorn`
```
pipenv shell
gunicorn -w 4 -b 127.0.0.1:5000 websysmon:app
```




