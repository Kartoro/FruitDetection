
import os
path=input('Please input path like: \'D:/ProjImage/\'\n')

f=os.listdir(path)

n=0
for i in f:

    oldname=path+f[n]
    newname=path+'Img'+str(n+1)+'.jpg'

    os.rename(oldname,newname)
    print(oldname,'======>',newname)

    n+=1