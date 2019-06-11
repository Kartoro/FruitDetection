# Fruit Counter

> A web application that identifies oranges and other fruits based on Faster R-CNN model using TensorFlow object detection API.


### Demo
[App Demo Video](https://www.youtube.com/watch?v=JXQLtP5A_uI)
## Getting Started

### Prerequisites
To run this app, please make sure your environment has the following components installed:
  - Python 3.6
  - TensorFlow 1.13.1+

### Installation
Clone [TensorFlow models](https://github.com/tensorflow/models) library to your local project directory.

```
YOUR_PROJECT_DIR
└── models
```

Clone all items in `app` folder
```
THIS_PROJECT
└── app
    ├── server.py         // web server
    ├── tfprocess.py      // TensorFlow functions
    ├── html
    |   └── index.html    // app front-end
    ├── static
    |   ├── css
    |   |   └── style.css
    |   └── js
    |       └── index.js  // app functions
    └── utils
        └── visualization_utils.py

```


to `models/research/object_detection`.
```
YOUR_PROJECT_DIR
└── models
    └── research
        └── object_detection
            └── COPY_ALL_APP_ITEMS_HERE
```

### Starting the server
```bash
$ cd DIR_TO_YOUR_PROJECT/models/research/object_detection
$ python3 server.py
```
## Usage
 - Open a web browser and visit `http://localhost:5000/`
 - Click orange `camera` button to take a photo via camera or from local gallery
 - Upload it by clicking blue `upload` button
 - Wait for the result to be displayed

## External Libraries
 - [TensorFlow](https://www.tensorflow.org/)
 - [jQuery 3.4.1](https://jquery.com/)
 - [JavaScript Load Image](https://github.com/blueimp/JavaScript-Load-Image)
 - [Flask](http://flask.pocoo.org/)
 - [Google Fonts](https://fonts.google.com/)
 - [Pure CSS Loaders](https://loading.io/css/)


## Note
This app was developed for COMP90055 Computing Project supervised by Prof. Richard Sinnott.

Authors of the project are:
 - Huaqing Yu
 - Shining Song
 - Shaoxi Ma
