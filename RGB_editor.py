import os
from PIL import Image

path = input('Please input files path like: \'D:/image/\'\n')
f = os.listdir(path)

for i in f:
    img = Image.open(path + i)
    pixel = img.load()
    for x in range(img.size[0]):
        for y in range(img.size[1]):
            r, g, b = pixel[x, y]
            pixel[x, y] = (int(r / 3), int(g / 3), int(b / 3))
    img.save(path + 'temp/' + i)
