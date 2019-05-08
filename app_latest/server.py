from flask import Flask, request, render_template
from werkzeug.utils import secure_filename

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
            print('file uploaded successfully')
            return '200'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
