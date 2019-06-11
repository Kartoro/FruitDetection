import os

path = input('Please input xml files path like: \'D:/xml/\'\n')

y = 'D:\\img\\'
s = '/Users/ssn8023/Desktop/projImages/downloads/green orange tree/'
m = 'X:\\Capstone\\img\\'

f = os.listdir(path)

for i in f:

    f1 = open(path + i, 'r+')
    infos = f1.readlines()
    f1.seek(0, 0)

    for line in infos:
        if line.__contains__(y):
            line_new = line.replace(y, s)
        elif line.__contains__(m):
            line_new = line.replace(m, s)
        else:
            line_new = line
        f1.write(line_new)

    f1.close()
