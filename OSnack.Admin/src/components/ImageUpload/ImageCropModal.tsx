import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Slider from 'osnack-frontend-shared/src/components/Inputs/Slider';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';

const ImageCropModal = (props: IProps) => {
   const [crop, setCrop] = useState(new cropPosition());
   const [zoom, setZoom] = useState(1);
   const [rotation, setRotation] = useState<number>(0);
   const [aspectRatio] = useState(4 / 3);
   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>(new Area());

   const getCroppedImg = async () => {
      const image = await createImage(props.base64Image);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as any;
      const maxSize = Math.max(image.width, image.height);
      const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

      // set each dimensions to double largest dimension to allow for a safe area for the
      // image to rotate in without being clipped by canvas context
      canvas.width = safeArea;
      canvas.height = safeArea;

      // translate canvas context to a central location on image to allow rotating around the center.
      ctx?.translate(safeArea / 2, safeArea / 2);
      ctx?.rotate((rotation * Math.PI) / 180);
      ctx?.translate(-safeArea / 2, -safeArea / 2);

      // draw rotated image and store data.
      ctx?.drawImage(
         image,
         safeArea / 2 - image.width * 0.5,
         safeArea / 2 - image.height * 0.5
      );

      const data = ctx.getImageData(0, 0, safeArea, safeArea);

      // set canvas width to final desired crop size - this will clear existing context
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // paste generated rotate image with correct offsets for x,y crop values.
      ctx.putImageData(
         data,
         0 - safeArea / 2 + image.width * 0.5 - croppedAreaPixels.x,
         0 - safeArea / 2 + image.height * 0.5 - croppedAreaPixels.y
      );

      // As Base64 string
      const base64Image = canvas.toDataURL('image/png');
      props.onCropComplete(base64Image);

      //const blobImage = new Promise((resolve, reject) => {
      //   canvas.toBlob((blob) => {
      //      if (blob != null)
      //         blob.name = "UploadedImage";
      //      resolve(blob);
      //   }, 'image/png', 1);
      //});
   };

   const createImage: (url: string) => Promise<HTMLImageElement> = async (url) => {
      return new Promise((resolve, reject) => {
         const image = new Image();
         image.addEventListener('load', () => resolve(image));
         image.addEventListener('error', error => reject(error));
         image.src = url;
      });
   };

   return (
      <Modal className="col-11 col-sm-10 col-md-8 col-lg-6"
         isOpen={props.isOpen}>
         <PageHeader title='Edit Image' />
         <Cropper
            classes={{ containerClassName: "col-12 col-sm-9 ml-auto mr-auto cropper-relative" }}
            image={props.base64Image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onZoomChange={z => { setZoom(z); }}
            onCropChange={c => { setCrop(c); }}
            onRotationChange={r => { setRotation(r); }}
            onCropComplete={(croppedArea, croppedAreaPixels) => { setCroppedAreaPixels(croppedAreaPixels); }}
         />
         <div className="row col-12 pm-0 my-4">
            <label children="Zoom" className="col-3 pm-0 px-2" />
            <Slider
               className="col my-auto"
               min={1}
               max={10}
               step={0.1}
               value={zoom}
               onChange={(z) => { setZoom(z); }}
            />
         </div>
         <div className="row col-12 pm-0 my-4">
            <label children="Rotation" className="col-3 pm-0 px-2" />
            <Slider
               className="col my-auto"
               min={0}
               max={360}
               step={0.1}
               value={rotation}
               onChange={(r) => { setRotation(r); }}
            />
         </div>

         <Button children="Confirm"
            className="col-12 col-sm-6 mt-2 btn-green btn-lg"
            onClick={getCroppedImg}
         />
         <Button children="Cancel"
            className="col-12 col-sm-6 mt-2 btn-white btn-lg"
            onClick={props.onCancel} />
      </Modal>
   );
};

declare type IProps = {
   base64Image: string;
   isOpen: boolean;
   onCancel: () => void;
   onCropComplete: (croppedImageBase64: string) => void;
};
export default ImageCropModal;

class cropPosition {
   x: number = 0;
   y: number = 0;
}

class Area {
   width: number = 0;
   height: number = 0;
   x: number = 0;
   y: number = 0;
}
