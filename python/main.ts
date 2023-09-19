
enum ACT {
    //% block="relu"
    'relu',
    //% block="softmax"
    'softmax'
}

//% color="#ff8000" iconWidth=50 iconHeight=40
namespace kerasMLOC{



    //% block="初始化摄像头直到成功 编号[CAMNUM]" blockType="command"
    //% CAMNUM.shadow="number" CAMNUM.defl="0"
    export function readcap(parameter: any, block: any) {
        let num=parameter.CAMNUM.code;
 
        Generator.addImport(`import cv2\nimport numpy as np`)
        
        Generator.addCode(`cap = cv2.VideoCapture(${num})`)
        Generator.addCode(`cap.set(cv2.CAP_PROP_FRAME_WIDTH, 240)`)
        Generator.addCode(`cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 320)`)
        Generator.addCode(`cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)`)
        Generator.addCode(`cv2.namedWindow('cvwindow',cv2.WND_PROP_FULLSCREEN)`)
        Generator.addCode(`cv2.setWindowProperty('cvwindow', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)`)
        Generator.addCode(`pic_count = 0`)             
    Generator.addCode(`while not cap.isOpened():
    continue`)    
    }


    //% block="读取摄像头一帧图片" blockType="command"
    export function readcapcapture(parameter: any, block: any) {

        Generator.addCode(`cv2.waitKey(5)
cvimg_success, img_src = cap.read()
cvimg_h, cvimg_w, cvimg_c = img_src.shape
cvimg_w1 = cvimg_h*240//320
cvimg_x1 = (cvimg_w-cvimg_w1)//2
img_src = img_src[:, cvimg_x1:cvimg_x1+cvimg_w1]
img_src = cv2.resize(img_src, (240, 320))
cvimg_src=img_src.copy()
cv2.imshow('cvwindow', cvimg_src)
`)

    }


    //% block="按下[BUTTON]保存一张图片到文件夹 路径[PATH] 分类名称[NAME]" blockType="command"
    //% PATH.shadow="string" PATH.defl="/root/dataset_object_classification"
    //% NAME.shadow="string" NAME.defl="01Apple"
    //% BUTTON.shadow="dropdown" BUTTON.options="BUTTON"
    export function saveImage(parameter: any, block: any) {
        let path=parameter.PATH.code;
        let name=parameter.NAME.code;
        let button=parameter.BUTTON.code;

        path=replaceQuotationMarks(path)
        name=replaceQuotationMarks(name)

        Generator.addImport(`import datetime\nimport os`)
        Generator.addCode(`if cv2.waitKey(10) == ord('${button}'):
    img_dir_path ="${path}/${name}/"
    img_name_path=str(datetime.datetime.now().strftime('%Y%m%d_%H%M%S_%f'))+".png"
    img_save_path=img_dir_path+img_name_path
    print("save picture path:",img_save_path)
    try:
        if not os.path.exists(img_dir_path):
            print("The folder does not exist,created automatically")
            os.system("mkdir -p ${path}/${name}/")
    except IOError:
        print("IOError,created automatically")
        break
    cv2.imwrite(img_save_path, img_src)
    pic_count=pic_count+1
    print("save picture count:"+str(pic_count))
    rectangular = np.array([ [5,5],[5,40], [232,40], [232,5] ])
    cv2.fillConvexPoly(cvimg_src, rectangular, (233, 236, 239))
    cv2.putText(cvimg_src, '${name}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (50, 200, 0), 2)
    cv2.rectangle(cvimg_src, (5,5,230,310), (0,255,0), 2)
    cv2.imshow('cvwindow', cvimg_src)
    cv2.waitKey(5)
`)

 
    }
    

    //% block="---"
    export function noteSep2() {

    }
    //% block="导入图片数据集 路径[PATH] 含[CLA]个分类" blockType="command"
    //% PATH.shadow="string" PATH.defl="/root/dataset_object_classification"
    //% CLA.shadow="number" CLA.defl=" "
    export function readData(parameter: any, block: any) {
        let path=parameter.PATH.code;
        let cla=parameter.CLA.code;
        Generator.addImport(`import tensorflow as tf\nfrom tensorflow import keras\nimport numpy as np`)
        Generator.addCode(`datagen = keras.preprocessing.image.ImageDataGenerator(preprocessing_function=keras.applications.mobilenet_v2.preprocess_input)`)
        Generator.addCode(`train_batches = datagen.flow_from_directory(directory=${path},shuffle=True,target_size=(96,96),batch_size=10)`)
        Generator.addCode(`class_quantity = ${cla}`)

 
    }

    //% block="创建神经网络模型 预训练模型为MobileNet V2 " blockType="command"
    export function createSequential(parameter: any, block: any) {
        
        Generator.addCode(`model = keras.Sequential(name="object_classification_model")`)
        Generator.addCode(`base_model = keras.models.load_model("/root/mindplus/.lib/thirdExtension/liliang-kerasmloc-thirdex/mobilenet_v2_96.h5",compile=False)`)
        Generator.addCode(`base_model.trainable = False`)
        Generator.addCode(`model.add(base_model)`)
        Generator.addCode(`model.add(keras.layers.Dense(100, activation='relu'))`)
        Generator.addCode(`model.add(keras.layers.Dense(class_quantity, activation='softmax'))`)

    }

    //% block="打印模型结构" blockType="command"
    export function viewModel(parameter: any, block: any) {
        Generator.addCode(`model.summary()`)
    }

    //% block="训练模型 设置训练次数[EPOCHS]" blockType="command"
    //% EPOCHS.shadow="number" EPOCHS.defl="5"
    export function train(parameter: any, block: any) {
        let eop=parameter.EPOCHS.code;
        Generator.addCode(`model.compile(optimizer=keras.optimizers.Adam(0.0001),loss='categorical_crossentropy',metrics=['accuracy'])`)
        Generator.addCode(`model.fit(train_batches, epochs=${eop})`)

 
    }

    //% block="保存训练后的模型到到路径[PATH]" blockType="command"
    //% PATH.shadow="string" PATH.defl="/root/object_classification_model.h5"
    export function saveModel(parameter: any, block: any) {
        let path=parameter.PATH.code;
        Generator.addCode(`model.save(${path})`)
    }

    //% block="---"
    export function noteSep1() {

    }

    //% block="导入训练后的模型文件 路径[PATH]" blockType="command"
    //% PATH.shadow="string" PATH.defl="/root/object_classification_model.h5"
    export function readModel(parameter: any, block: any) {
        let path=parameter.PATH.code;
        Generator.addImport(`import tensorflow as tf\nfrom tensorflow import keras\nimport numpy as np`)
        
        Generator.addCode(`print("loading model...")
model = tf.keras.models.load_model(${path})
print("model loaded!")`)
    }
    
    //% block="---"
    export function noteSep5() {

    }
    //% block="加载预测图片 通过路径[PATH]" blockType="command"
    //% PATH.shadow="string" PATH.defl="/root/dataset_object_classification/01Apple/2.jpg"
    export function loadImg(parameter: any, block: any) {
        let path=parameter.PATH.code;
        Generator.addCode(`img_src = keras.preprocessing.image.load_img(${path}, target_size=(96, 96))`)
        Generator.addCode(`img_array = keras.preprocessing.image.img_to_array(img_src)`)
        Generator.addCode(`img_array = keras.applications.mobilenet_v2.preprocess_input(img_array)`)
        Generator.addCode(`img_array = tf.expand_dims(img_array/255.0, 0)`)
    }
/*
    //% block="加载预测图片 通过视频帧[GRAB]" blockType="command"
    //% GRAB.shadow="normal" GRAB.defl="grab"
    export function loadVideo(parameter: any, block: any) {
        let grab=parameter.GRAB.code;

        Generator.addCode(`img_src = tf.image.resize(img_src, (96, 96))`)
        Generator.addCode(`img_array = keras.preprocessing.image.img_to_array(img_src)`)
        Generator.addCode(`img_array = tf.expand_dims(img_array, 0)`)
        Generator.addCode(`img_array = img_array/255.0`)
        
    }
*/    
    //% block="---"
    export function noteSep4() {

    }

    //% block="加载预测图片 通过读取摄像头实时画面" blockType="command"
    export function readandcapcapture(parameter: any, block: any) {

        Generator.addCode(`cv2.waitKey(5)
cvimg_success, img_src = cap.read()
cvimg_h, cvimg_w, cvimg_c = img_src.shape
cvimg_w1 = cvimg_h*240//320
cvimg_x1 = (cvimg_w-cvimg_w1)//2
img_src = img_src[:, cvimg_x1:cvimg_x1+cvimg_w1]
img_src = cv2.resize(img_src, (240, 320))
cvimg_src=img_src.copy()
img_resize = tf.image.resize(cvimg_src, (96, 96))
img_array = keras.preprocessing.image.img_to_array(img_resize)
img_array = tf.expand_dims(img_array, 0)
img_array = img_array/255.0
#cv2.imshow('cvwindow', img_src)
`)


    }

    
    //% block="在摄像头画面上显示文字[TEXT] 颜色R[R]G[G]B[B] 坐标X[X]Y[Y]" blockType="command"
    //% TEXT.shadow="string" TEXT.defl="id1"
    //% R.shadow="range"   R.params.min=0    R.params.max=255    R.defl=50
    //% G.shadow="range"   G.params.min=0    G.params.max=255    G.defl=200
    //% B.shadow="range"   B.params.min=0    B.params.max=255    B.defl=0
    //% X.shadow="number"   X.defl="10"
    //% Y.shadow="number"   Y.defl="20"
    export function drawText(parameter: any, block: any) {
        let txt=parameter.TEXT.code;
        let r=parameter.R.code;
        let g=parameter.G.code;
        let b=parameter.B.code;
        let x=parameter.X.code;
        let y=parameter.Y.code;
 
        
        Generator.addImport(`from PIL import ImageFont, ImageDraw, Image\nimport site\nimport os`)
        Generator.addDeclaration("drawChineseFunction",`def drawChinese(text,x,y,size,r, g, b, a,img):
    site_packages_path = site.getsitepackages()
    for pack_path in site_packages_path:
        font_path=f"{pack_path}/unihiker/HYQiHei_50S.ttf"
        if os.path.isfile(font_path):
            #print(font_path,",Y")
            break
        else:
            #print(font_path,",N")
            font_path="HYQiHei_50S.ttf"    
    font = ImageFont.truetype(font_path, size)
    img_pil = Image.fromarray(img)
    draw = ImageDraw.Draw(img_pil)
    draw.text((x,y), text, font=font, fill=(b, g, r, a))
    frame = np.array(img_pil)
    return frame
`)

    Generator.addCode(`
try:
    img_src = drawChinese(text=${txt},x=${x},y=${y},size=25,r=${r},g=${g},b=${b},a=50,img=img_src)
except Exception as e:
    print(e)
    cv2.putText(img_src, str(${txt}), (${x}, ${y}), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (${r}, ${g}, ${b}), 2)
`)     
    }


   
    //% block="将摄像头画面显示到屏幕上" blockType="command"
    export function imShowVideo(parameter: any, block: any) {
        Generator.addCode(`cv2.imshow('cvwindow', img_src)\ncv2.waitKey(5)`)
    }
  

    //% block="---"
    export function noteSep3() {

    }
    //% block="预测加载的图像 存入识别结果" blockType="command"
    export function predictPercentageResult(parameter: any, block: any) {
        Generator.addCode(`predict_result=model.predict(img_array)`)

    } 

    //% block="从识别结果中取索引" blockType="reporter"
    export function predict(parameter: any, block: any) {
        Generator.addCode(`predict_result.argmax()`)
    } 

    //% block="从识别结果中取置信度" blockType="reporter"
    export function predictPercentage(parameter: any, block: any) {
        Generator.addCode(`predict_result[0][predict_result.argmax()]`)

    } 

    function replaceQuotationMarks(str:string){
            str=str.replace(/"/g, ""); //去除所有引号
            return str
    }


    
}
