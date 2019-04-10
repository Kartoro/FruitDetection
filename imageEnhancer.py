from PIL import Image
from PIL import ImageEnhance
import os

# # Enhance the brightness
# enh_bri = ImageEnhance.Brightness(image)
# brightness = 1.5
# image_brightened = enh_bri.enhance(brightness)
# image_brightened.show()
#
# # Enhance the color
# enh_col = ImageEnhance.Color(image)
# color = 1.5
# image_colored = enh_col.enhance(color)
# image_colored.show()
#
# Enhance the contrast
# enh_con = ImageEnhance.Contrast(image)
# contrast = 1.5
# image_contrasted = enh_con.enhance(contrast)
# image_contrasted.show()
#
# Enhance the sharpness
# enh_sha = ImageEnhance.Sharpness(image)
# sharpness = 3.0
# image_sharped = enh_sha.enhance(sharpness)
# image_sharped.show()

path = input('Please input files path like: \'D:/test/\'\n')
f = os.listdir(path)

for i in f:
    image = Image.open(path + i)

    enh_bri = ImageEnhance.Brightness(image)
    brightness = 0.7
    image_brightened = enh_bri.enhance(brightness)

    enh_col = ImageEnhance.Color(image_brightened)
    color = 0.3
    image_colored = enh_col.enhance(color)

    enh_con = ImageEnhance.Contrast(image_colored)
    contrast = 2
    image_contrasted = enh_con.enhance(contrast)

    image_contrasted.save(path + 'temp/' + i)
