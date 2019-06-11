from flask import Flask, request, render_template, jsonify
from werkzeug.utils import secure_filename
from PIL import Image
import base64
import datetime
import tfprocess

app = Flask(__name__, template_folder='html')

'''
Process request for main page
Return index.html
'''
@app.route('/')
def home():
    return render_template('index.html')


'''
Process request for uploading image file
Return labelled image and count
'''
@app.route('/upload', methods=['POST'])
def parse_upload():
    if request.method == 'POST':
        # Check if image is received
        if 'image' not in request.files:
            print('Error: No image file')
            res_dict = {}
            res_dict['code'] = 404
            return jsonify(res_dict)
        else:
            f = request.files['image']
            # Save image to local storage
            f.save(secure_filename(f.filename))
            image = Image.open('pic.jpg')
            print('file received successfully')

            # Record processing time
            start = datetime.datetime.now()
            # TensorFlow start running
            count = tfprocess.model()
            end = datetime.datetime.now()
            duration = end - start
            print('Processing time: {:0.2f}'.format(duration.total_seconds()))
            print('model processed successfully')

            # Construct JSON response
            res_dict = {}
            with open('pic1.jpg', 'rb') as res_img:
                res_dict['img'] = str(base64.b64encode(res_img.read()))
                res_dict['code'] = 200
                res_dict['count'] = count

            return jsonify(res_dict)

'''
Cut large image into n^2 pieces
save them to local storage
'''
def cut(image, n):
    width, height = image.size
    item_width = int(width / 3)
    box_list = []
    for i in range(0, n):
        for j in range(0, n):
            box = (j * item_width, i * item_width, (j + 1) * item_width,
                   (i + 1) * item_width)
            box_list.append(box)

    image_list = [image.crop(box) for box in box_list]
    index = 1
    for image in image_list:
        image.save('./img/' + str(index) + '.jpg', 'JPEG')
        index += 1

'''
Main function to run Flask server
'''
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
