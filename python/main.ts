
enum ACT {
    //% block="relu"
    'relu',
    //% block="softmax"
    'softmax'
}

//% color="#ff8000" iconWidth=50 iconHeight=40
namespace kerasMLOC{


    //% block="导入图片数据集 路径[PATH]" blockType="command"
    //% PATH.shadow="string" PATH.defl="dataset_object_classification"
    export function readData(parameter: any, block: any) {
        let path=parameter.PATH.code;
        Generator.addImport(`import tensorflow as tf\nfrom tensorflow import keras\nimport numpy as np`)
        Generator.addCode(`datagen = keras.preprocessing.image.ImageDataGenerator(preprocessing_function=keras.applications.mobilenet_v2.preprocess_input)`)
        Generator.addCode(`train_batches = datagen.flow_from_directory(directory=${path},shuffle=True,target_size=(96,96),batch_size=10)`)

 
    }

    //% block="创建神经网络模型" blockType="command"
    export function createSequential(parameter: any, block: any) {

        Generator.addCode(`model = keras.Sequential(name="object_classification_model")`)
 
    }

    //% block="创建输入层设置为 预训练模型MobilenetV2" blockType="command"
    //% PATH.shadow="string" PATH.defl="/root/dataset_object_classification"
    export function setInputLayout(parameter: any, block: any) {

        Generator.addCode(`base_model = keras.models.load_model("/root/mindplus/.lib/thirdExtension/liliang-kerasml-thirdex/mobilenet_v2_96.h5",compile=False)`)
        Generator.addCode(`base_model.trainable = False`)
        Generator.addCode(`model.add(base_model)`)


 
    }

    //% block="添加隐藏层设置为 [NER]个神经元 激活函数[ACT]" blockType="command"
    //% NER.shadow="number" NER.defl="100"
    //% ACT.shadow="dropdown" ACT.options="ACT" ACT.defl="ACT.relu"
    export function setHideLayout(parameter: any, block: any) {
        let num=parameter.NER.code;
        let act=parameter.ACT.code;
        Generator.addCode(`model.add(keras.layers.Dense(${num}, activation=${act}))`)
 
    }

    //% block="创建输出层设置为 [CLA]个分类 激活函数[ACT]" blockType="command"
    //% CLA.shadow="number" CLA.defl=" "
    //% ACT.shadow="dropdown" ACT.options="ACT" ACT.defl="ACT.softmax"
    export function setOutLayout(parameter: any, block: any) {
        let cla=parameter.CLA.code;
        let act=parameter.ACT.code;

        Generator.addCode(`model.add(keras.layers.Dense(${cla}, activation=${act}))`)

 
    }

    //% block="打印模型结构" blockType="command"
    export function viewModel(parameter: any, block: any) {


        Generator.addCode(`print(model.summary())`)

 
    }



    //% block="训练模型 设置训练次数[EPOCHS]" blockType="command"
    //% EPOCHS.shadow="number" EPOCHS.defl="5"
    export function train(parameter: any, block: any) {
        let eop=parameter.EPOCHS.code;
        Generator.addCode(`model.compile(optimizer=keras.optimizers.Adam(0.0001),loss='categorical_crossentropy',metrics=['accuracy'])`)
        Generator.addCode(`model.fit(train_batches, epochs=${eop})`)

 
    }

    //% block="保存训练后的模型到到路径[PATH]" blockType="command"
    //% PATH.shadow="string" PATH.defl="object_classification_model.h5"
    export function saveModel(parameter: any, block: any) {
        let path=parameter.PATH.code;

        Generator.addCode(`model.save(${path})`)

 
    }

    //% block="---"
    export function noteSep1() {

    }

    //% block="导入模型文件 路径[PATH]" blockType="command"
    //% PATH.shadow="string" PATH.defl="object_classification_model.h5"
    export function readModel(parameter: any, block: any) {
        let path=parameter.PATH.code;
        Generator.addImport(`import tensorflow as tf\nfrom tensorflow import keras\nimport numpy as np`)
        
        Generator.addCode(`model = tf.keras.models.load_model(${path})`)

 
    }
    

    //% block="加载预测图片 路径[PATH]" blockType="command"
    //% PATH.shadow="string" PATH.defl="dataset_object_classification/01Apple/2.jpg"
    export function loadImg(parameter: any, block: any) {
        let path=parameter.PATH.code;
        Generator.addCode(`img_src = keras.preprocessing.image.load_img(${path}, target_size=(96, 96))`)
        Generator.addCode(`img_array = keras.preprocessing.image.img_to_array(img_src)`)
        Generator.addCode(`img_array = keras.applications.mobilenet_v2.preprocess_input(img_array)`)
        Generator.addCode(`img_array = tf.expand_dims(img_array/255.0, 0)`)
    }

    //% block="加载图片 视频帧[GRAB]" blockType="command"
    //% GRAB.shadow="normal" GRAB.defl="grab"
    export function loadVideo(parameter: any, block: any) {
        let grab=parameter.GRAB.code;
        Generator.addCode(`img_src = tf.image.resize(${grab}, (96, 96))`)
        Generator.addCode(`img_array = keras.preprocessing.image.img_to_array(img_src)`)
        Generator.addCode(`img_array = tf.expand_dims(img_array, 0)`)
        Generator.addCode(`img_array = img_array/255.0`)
        
    }



    //% block="预测加载的图像 返回识别结果索引" blockType="reporter"
    //% PATH.shadow="string" PATH.defl="dataset_object_classification/01Apple/2.jpg"
    export function predict(parameter: any, block: any) {
        Generator.addCode(`model.predict(img_array).argmax()`)


    } 

    //% block="预测加载的图像 返回识别结果置信度" blockType="reporter"
    //% PATH.shadow="string" PATH.defl="dataset_object_classification/01Apple/2.jpg"
    export function predictPercentage(parameter: any, block: any) {
        Generator.addCode(`model.predict(img_array)[0][model.predict(img_array).argmax()]`)

    } 

    function replaceQuotationMarks(str:string){
            str=str.replace(/"/g, ""); //去除所有引号
            return str
    }


    
}
