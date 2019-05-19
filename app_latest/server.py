from flask import Flask, request, render_template, jsonify
from werkzeug.utils import secure_filename
from PIL import Image

import numpy as np
import os
import six.moves.urllib as urllib
import sys
import tarfile
import tensorflow as tf
import zipfile
import base64

from distutils.version import StrictVersion
from collections import defaultdict
from io import StringIO
from matplotlib import pyplot as plt
from PIL import Image

sys.path.append("..")
from utils import ops as utils_ops

from utils import label_map_util
from protos import string_int_label_map_pb2

from utils import visualization_utils as vis_util


app = Flask(__name__, template_folder='html')


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def parse_upload():
    if request.method == 'POST':
        print(len(request.files))
        if 'image' not in request.files:
            print('No such file')
            return '404'
        else:
            f = request.files['image']
            f.save(secure_filename(f.filename))
            image = Image.open('pic.jpg')
            #cut(image, 2)
            print('file uploaded successfully')
            count = model()
            print('model processed successfully')
            res_dict = {}
            with open('pic1.jpg', 'rb') as res_img:
                res_dict['img'] = str(base64.b64encode(res_img.read()))
                res_dict['code'] = 200
                res_dict['count'] = count

            return jsonify(res_dict)


def cut(image, n):
    width, height = image.size
    item_width = int(width / 3)
    box_list = []
    for i in range(0, n):
        for j in range(0, n):
            box = (j * item_width, i * item_width, (j + 1) * item_width, (i + 1) * item_width)
            box_list.append(box)

    image_list = [image.crop(box) for box in box_list]
    index = 1
    for image in image_list:
        image.save('./img/' + str(index) + '.jpg', 'JPEG')
        index += 1


def load_image_into_numpy_array(image):
  (im_width, im_height) = image.size
  return np.array(image.getdata()).reshape(
      (im_height, im_width, 3)).astype(np.uint8)


def run_inference_for_single_image(image, graph):
  with graph.as_default():
    with tf.Session() as sess:
      # Get handles to input and output tensors
      ops = tf.get_default_graph().get_operations()
      all_tensor_names = {output.name for op in ops for output in op.outputs}
      tensor_dict = {}
      print('aaaaaaa')
      for key in [
          'num_detections', 'detection_boxes', 'detection_scores',
          'detection_classes', 'detection_masks'
      ]:
        tensor_name = key + ':0'
        if tensor_name in all_tensor_names:
          tensor_dict[key] = tf.get_default_graph().get_tensor_by_name(
              tensor_name)
      if 'detection_masks' in tensor_dict:
        # The following processing is only for single image
        detection_boxes = tf.squeeze(tensor_dict['detection_boxes'], [0])
        detection_masks = tf.squeeze(tensor_dict['detection_masks'], [0])
        # Reframe is required to translate mask from box coordinates to image coordinates and fit the image size.
        real_num_detection = tf.cast(tensor_dict['num_detections'][0], tf.int32)
        detection_boxes = tf.slice(detection_boxes, [0, 0], [real_num_detection, -1])
        detection_masks = tf.slice(detection_masks, [0, 0, 0], [real_num_detection, -1, -1])
        detection_masks_reframed = utils_ops.reframe_box_masks_to_image_masks(
            detection_masks, detection_boxes, image.shape[0], image.shape[1])
        detection_masks_reframed = tf.cast(
            tf.greater(detection_masks_reframed, 0.5), tf.uint8)
        # Follow the convention by adding back the batch dimension
        tensor_dict['detection_masks'] = tf.expand_dims(
            detection_masks_reframed, 0)
      image_tensor = tf.get_default_graph().get_tensor_by_name('image_tensor:0')

      # Run inference
      output_dict = sess.run(tensor_dict,
                             feed_dict={image_tensor: np.expand_dims(image, 0)})

      # all outputs are float32 numpy arrays, so convert types as appropriate
      output_dict['num_detections'] = int(output_dict['num_detections'][0])
      output_dict['detection_classes'] = output_dict[
          'detection_classes'][0].astype(np.uint8)
      output_dict['detection_boxes'] = output_dict['detection_boxes'][0]
      output_dict['detection_scores'] = output_dict['detection_scores'][0]
      if 'detection_masks' in output_dict:
        output_dict['detection_masks'] = output_dict['detection_masks'][0]
  return output_dict


def model():
    path = os.path.abspath(os.path.join(os.getcwd(), "../../.."))
    #print(path.split('/models')[0])
    app.logger.info('!!!!! %s', path)
    MODEL_NAME = 'faster_rcnn_inception_v2_coco_2018_01_28'
    MODEL_FILE = MODEL_NAME + '.tar.gz'
    #DOWNLOAD_BASE = 'http://download.tensorflow.org/models/object_detection/'

    # Path to frozen detection graph. This is the actual model that is used for the object detection.
    PATH_TO_FROZEN_GRAPH = os.path.join(path, 'workspace/training_demo/trained-inference-graphs/output_inference_graph_v1.pb/frozen_inference_graph.pb'.replace('/', os.sep))

    # List of the strings that is used to add correct label for each box.
    PATH_TO_LABELS = os.path.join(path, 'workspace/training_demo/annotations/label_map.pbtxt'.replace('/', os.sep))

    tar_file = tarfile.open(os.path.join(path, 'workspace/training_demo/faster_rcnn_inception_v2_coco_2018_01_28.tar.gz'.replace('/', os.sep)))
    for file in tar_file.getmembers():
        file_name = os.path.basename(file.name)
        if 'frozen_inference_graph.pb' in file_name:
            tar_file.extract(file, os.getcwd())

    detection_graph = tf.Graph()
    with detection_graph.as_default():
        od_graph_def = tf.GraphDef()
        with tf.gfile.GFile(PATH_TO_FROZEN_GRAPH, 'rb') as fid:
            serialized_graph = fid.read()
            od_graph_def.ParseFromString(serialized_graph)
            tf.import_graph_def(od_graph_def, name='')

    category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS, use_display_name=True)

    PATH_TO_TEST_IMAGES_DIR = os.path.join(path, 'models/research/object_detection'.replace('/', os.sep))
    # TEST_IMAGE_PATHS = [ os.path.join(PATH_TO_TEST_IMAGES_DIR, 'pic{}.jpg'.format(i)) for i in range(1, 9) ]
    TEST_IMAGE_PATHS = [os.path.join(PATH_TO_TEST_IMAGES_DIR, 'pic.jpg')]

    # Size, in inches, of the output images.
    IMAGE_SIZE = (120, 80)

    total_count = 0
    for image_path in TEST_IMAGE_PATHS:
        image = Image.open(image_path)
        fileName = os.path.basename(image_path).split('.')[0]
        # the array based representation of the image will be used later in order to prepare the
        # result image with boxes and labels on it.
        image_np = load_image_into_numpy_array(image)
        # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
        image_np_expanded = np.expand_dims(image_np, axis=0)
        # Actual detection.
        output_dict = run_inference_for_single_image(image_np, detection_graph)
        # Visualization of the results of a detection.
        k = vis_util.visualize_boxes_and_labels_on_image_array(
            image_np,
            output_dict['detection_boxes'],
            output_dict['detection_classes'],
            output_dict['detection_scores'],
            category_index,
            instance_masks=output_dict.get('detection_masks'),
            use_normalized_coordinates=True,
            line_thickness=8,
            skip_labels = True)

        print(k)
        total_count += k
        plt.figure(figsize=IMAGE_SIZE)
        fig = plt.gcf()
        fig.set_size_inches(12, 9)
        plt.imshow(image_np)
        plt.savefig(fileName + '1.jpg', bbox_inches='tight')
    return total_count

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
