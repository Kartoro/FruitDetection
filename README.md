# Fruit Counter

> A web application that identifies oranges and other fruits based on Faster R-CNN model using TensorFlow object detection API.

## Getting Started

### Prerequisites
To run this app, please make sure your environment has the following components installed:
  - Python 3.6
  - TensorFlow 1.13.1+

### Installation
Clone TensorFlow models library to your local project directory.

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

## Note
This app was developed for COMP90055 Computing Project.

Authors of the project are:
  - Huaqing Yu
  - Shining Song
  - Shaoxi Ma
