from tensorflow.keras.applications.resnet50 import ResNet50
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input, decode_predictions
import numpy as np
import sys
import json

def main():
    model = ResNet50(weights='imagenet')

    if len(sys.argv) == 1:
        return
    img_path = sys.argv[1]
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)

    preds = model.predict(x)
    # decode the results into a list of tuples (class, description, probability)
    # (one such list for each sample in the batch)
    print('Predictions:', json.dumps([(x[1], float(x[2])) for x in decode_predictions(preds, top=3)[0]]))

if __name__ == '__main__':
    main()
