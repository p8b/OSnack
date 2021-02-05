import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import ImageCropModal from './ImageCropModal';
import imageCompression from 'browser-image-compression';
import { getBase64fromUrlImage } from 'osnack-frontend-shared/src/_core/appFunc';
import { API_URL } from 'osnack-frontend-shared/src/_core/appConst';
import { AlertTypes } from 'osnack-frontend-shared/src/components/Texts/Alert';

const ImageUpload = (props: IProps) => {
   const isUnmounted = useRef(false);
   const [isOpenImageCropModal, setIsOpenImageCropModal] = useState(false);
   const [isPreviewImageOn, setIsPreviewImageOn] = useState(false);
   const [originalImageBase64, setOriginalImageBase64] = useState("");
   const [croppedImage, setCroppedImage] = useState("");
   const [imageLoading, setImageLoading] = useState(true);
   const [originalImageLoading, setOriginalImageLoading] = useState(true);

   useEffect(() => {
      if (props.modifiedImagePath != null)
         getBase64fromUrlImage(`${API_URL}/${props.modifiedImagePath}`)
            .then(imgBase64 => {
               if (isUnmounted.current) return;
               setCroppedImage(imgBase64 as string);
               setImageLoading(false);
            }).catch(error => {
               if (isUnmounted.current) return;
               props.onError("Image Not Found!", AlertTypes.Warning);
               // errorAlert.setSingleWarning("", "Image Not Found!");
               setImageLoading(false);
            });
   }, [props.modifiedImagePath]);
   useEffect(() => {
      if (props.originalImagePath != null)
         getBase64fromUrlImage(`${API_URL}/${props.originalImagePath}`)
            .then(imgBase64 => {
               if (isUnmounted.current) return;
               setOriginalImageBase64(imgBase64 as string);
               setOriginalImageLoading(false);
            }).catch(error => {
               if (isUnmounted.current) return;
               props.onError("Original Image Not Found!", AlertTypes.Warning);
               setOriginalImageLoading(false);
            });

   }, [props.originalImagePath]);

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
            props.onError(e.message, AlertTypes.Error);
         }
         input.value = "";
      }
   };
   const onCropCompleted = (modifiedImage: string) => {
      props.onUploaded(modifiedImage, originalImageBase64);
      setCroppedImage(modifiedImage);
      setIsOpenImageCropModal(false);
   };

   const loading = (!imageLoading && !originalImageLoading) ? false : true;

   return (
      <div className={`${props.className}`}>
         {loading &&
            <Button className="col-12 loading" children="Loading Images" />
         }
         {!loading &&
            <>
               <div className={`col-12 file-input pm-0 cursor-pointer  ${props.showDanger ? "danger" : ""}`} >
                  <label children={
                     <>
                        <span className="col pm-0 my-auto line-limit-1">Upload{croppedImage != '' ? " New" : ""} Image </span>
                        <span className="col-auto p-1 text-white bg-gray">Browse</span>
                     </>
                  } htmlFor="uploadImage"
                     className={`col-form-label row pm-0 cursor-pointer dark`} />
                  <input id="uploadImage" type="file" accept="image/*" className={` d-none `}
                     onChange={e => uploadDocument(e.target)}
                  />
               </div>

               {croppedImage != '' &&
                  <Button
                     children={` Image`}
                     className={`col-6 mb-2 mb-md-0 btn-sm radius-none  ${isPreviewImageOn ? "close-eye-icon" : "open-eye-icon"}`}
                     onClick={() => { setIsPreviewImageOn(i => !i); }} />
               }
               {croppedImage != '' && originalImageBase64 &&
                  <Button className=" col-6 btn-sm btn-blue radius-none"
                     onClick={() => { setIsOpenImageCropModal(true); }}
                     children="Edit Image"
                  />
               }
               {/***** Preview Image ****/}
               {croppedImage != '' && isPreviewImageOn &&
                  <div className="col-12 pm-0 ml-auto mr-auto">
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
            </>
         }
      </div>
   );
};

declare type IProps = {
   originalImagePath?: string;
   modifiedImagePath?: string;
   className: string;
   showDanger?: boolean;
   onUploaded: (modifiedImageBase64: string, originalImageBase64: string) => void;
   onError: (msg: string, alertType: AlertTypes) => void;
   onLoading?: (progress: number) => void;
};
export default ImageUpload;
