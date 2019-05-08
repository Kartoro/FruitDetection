from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
from PIL import Image

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
            cut(image, 3)
            print('file uploaded successfully')
            return '200'


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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
