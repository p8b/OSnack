import React, { useEffect, useState } from 'react';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import ImageCropModal from './ImageCropModal';
import imageCompression from 'browser-image-compression';

const ImageUpload = (props: IProps) => {
   const [isOpenImageCropModal, setIsOpenImageCropModal] = useState(false);
   const [isPreviewImageOn, setIsPreviewImageOn] = useState(false);
   const [originalImageBase64, setOriginalImageBase64] = useState("");
   const [croppedImage, setCroppedImage] = useState("");

   const uploadDocument = async (input: HTMLInputElement) => {
      if (input.files != null) {
         const imageFile = input.files[0];
         const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 720,
            useWebWorker: true,
            onProgress: props.onLoading
         };
         try {

            const compressedFile = await imageCompression(imageFile, options);
            const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
            setOriginalImageBase64(base64);
            setIsOpenImageCropModal(true);
         } catch (e) {
            props.onError(e.message);
         }
         input.value = "";
      }
   };

   const onCropCompleted = (modifiedImage: string) => {
      props.onUploaded(modifiedImage, originalImageBase64);
      setCroppedImage(modifiedImage);
      setIsOpenImageCropModal(false);
   };

   useEffect(() => {
      if (props.modifiedImageBase64 != null)
         setCroppedImage(props.modifiedImageBase64);
   }, [props.modifiedImageBase64]);

   useEffect(() => {
      if (props.originalImageBase64 != null)
         setOriginalImageBase64(props.originalImageBase64);

   }, [props.originalImageBase64]);


   return (
      <div className={props.className}>
         <div className={"col-12 p-0 "}>
            <label children={<><span>Upload Image</span><span className="float-right">Browse</span></>} htmlFor="uploadImage"
               className={`col-form-label position-absolute col-12 p-0 cursor-pointer dark`} />
            <input id="uploadImage" type="file" accept="image/*" className="upload w-100 p-0 m-0 cursor-pointer"
               onChange={e => uploadDocument(e.target)}
            />
         </div>
         {croppedImage != '' &&
            <Button
               children={` Image`}
               className={`col-6 mb-2 mb-md-0 btn-sm radius-none ${isPreviewImageOn ? "close-eye-icon" : "open-eye-icon"}`}
               onClick={() => { setIsPreviewImageOn(i => !i); }} />
         }
         {originalImageBase64 &&
            <button className="btn btn-sm btn-blue col-6 radius-none"
               onClick={() => { setIsOpenImageCropModal(true); }}
               children="Edit Image"
            />
         }
         {/***** Preview Image ****/}
         {croppedImage != '' && isPreviewImageOn &&
            <div className="col-12 p-0 m-0 ml-auto mr-auto">
               <div className="row ">
                  <img className="col shop-card-img mr-auto ml-auto" src={croppedImage} />
               </div>
            </div>
         }
         {/***** Modal Image Drop-down ****/}
         <ImageCropModal base64Image={originalImageBase64}
            isOpen={isOpenImageCropModal}
            onCancel={() => { setIsOpenImageCropModal(false); }}
            onCropComplete={onCropCompleted}
         />
      </div>
   );
};

declare type IProps = {
   originalImageBase64: string;
   modifiedImageBase64: string;
   className: string;
   onUploaded: (modifiedImageBase64: string, originalImageBase64: string) => void;
   onError: (msg: string) => void;
   onLoading?: (progress: number) => void;
};
export default ImageUpload;