import React, { useEffect, useRef, useState } from 'react';
import { Category } from 'osnack-frontend-shared/src/_core/apiModels';
import { API_URL } from 'osnack-frontend-shared/src/_core/constant.Variables';
import { getBase64fromUrlImage } from 'osnack-frontend-shared/src/_core/appFunc';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import ButtonPopupConfirm from 'osnack-frontend-shared/src/components/Buttons/ButtonPopupConfirm';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { useDeleteCategory, usePostCategory, usePutCategory } from '../../SecretHooks/useCategoryHook';

const CategoryModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [category, setCategory] = useState(new Category());
   const [imageBase64, setImageBase64] = useState("");
   const [originalImageBase64, setOriginalImageBase64] = useState("");
   const [isNewImageSet, setIsNewImageSet] = useState(false);
   useEffect(() => {
      setCategory(props.category);
      /// if the category already exists get the image and convert it to string base64
      if (props.category.id && props.category.id > 0) {
         setIsNewImageSet(false);

         errorAlert.PleaseWait(500, isUnmounted);
         getBase64fromUrlImage(`${API_URL}/${props.category.imagePath}`)
            .then(imgBase64 => {
               if (isUnmounted.current) return;

               setImageBase64(imgBase64 as string);
            });
         getBase64fromUrlImage(`${API_URL}/${props.category.originalImagePath}`)
            .then(originalImgBase64 => {
               if (isUnmounted.current) return;

               setOriginalImageBase64(originalImgBase64 as string);
               errorAlert.clear();
            }).catch(() => {
               if (isUnmounted.current) return;
               errorAlert.setSingleWarning("", "Image Not Found!");
            });
      }
   }, [props.category]);

   const createCategory = async () => {
      let errors = new AlertObj([], AlertTypes.Error);

      if (category.name == "")
         errors.List.push(new ErrorDto("0", "Category name is required."));

      if (category.imageBase64 == "" || category.originalImageBase64 == "")
         errors.List.push(new ErrorDto("1", "Image Required."));

      if (errors.List.length > 0) {
         errorAlert.set(errors);
         return;
      }
      errorAlert.PleaseWait(500, isUnmounted);
      usePostCategory(category).then(() => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         resetImageUpload();
         props.onSuccess();
      }).catch((alert) => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };
   const updateCategory = async () => {
      let errors = new AlertObj([], AlertTypes.Error);

      if (category.name == "")
         errors.List.push(new ErrorDto("0", "Category name is required."));

      if (category.imageBase64 == "" || category.originalImageBase64 == "")
         errors.List.push(new ErrorDto("1", "Image Required."));

      if (errors.List.length > 0) {
         errorAlert.set(errors);
         return;
      }

      let cat = category;
      if (!isNewImageSet) {
         cat.imageBase64 = '';
         cat.originalImageBase64 = '';
      } if (isUnmounted.current) return;

      errorAlert.PleaseWait(500, isUnmounted);
      usePutCategory(cat).then(() => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         resetImageUpload();
         props.onSuccess();
      }).catch((alert) => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };
   const deleteCategory = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useDeleteCategory(category).then(() => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         resetImageUpload();
         props.onSuccess();
      }).catch((alert) => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };

   const resetImageUpload = () => {
      setImageBase64("");
      setOriginalImageBase64("");
   };
   const onImageUploaded = (croppedImage: string, originalImage: string) => {
      category.imageBase64 = croppedImage;
      category.originalImageBase64 = originalImage;
      setIsNewImageSet(true);
   };
   const onImageUploadError = (errMsg: string) => {
      let errors = new AlertObj([], AlertTypes.Error);
      errors.List.push(new ErrorDto("0", errMsg));
      errorAlert.set(errors);
   };
   const onImageUploadLoading = (progress: number) => {
      let errors = new AlertObj();
      errors.Type = AlertTypes.Warning;
      if (progress < 100)
         errors.List.push(new ErrorDto("0", `uploading ${progress}%`));
      errorAlert.set(errors);
   };

   return (
      <Modal className="col-11 col-sm-10 col-md-8 col-lg-6 pl-4 pr-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title={category.id === 0 ? "New Category" : "Update Category"} />

         {/***** Name ****/}
         <div className="row">
            <Input label="Name"
               value={category.name}
               onChange={i => { setCategory({ ...category, name: i.target.value }); }}
               className="col-12 col-sm-6" />

            {/***** Image upload and show preview button ****/}
            <ImageUpload className="col-12 col-sm-6 mt-4"
               modifiedImageBase64={imageBase64}
               originalImageBase64={originalImageBase64}
               onUploaded={onImageUploaded}
               onError={onImageUploadError}
               onLoading={onImageUploadLoading}
            />
         </div>

         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />

         {/***** buttons ****/}
         <div className="row col-12 pm-0 ">
            {category.id === 0 ?
               <Button children="Create"
                  className="col-12 mt-2 btn-green col-sm-6 btn-lg"
                  onClick={createCategory} />
               :
               <div className="row col-12 col-sm-8 pm-0">
                  <ButtonPopupConfirm title="Update"
                     popupMessage="Are you sure?"
                     className="col-12 mt-2 col-sm-6"
                     btnClassName="btn-green"
                     onConfirmClick={updateCategory}
                  />
                  <ButtonPopupConfirm title="Delete"
                     popupMessage="Are you sure?"
                     className="col-12 col-sm-6 mt-2"
                     btnClassName="btn-red"
                     onConfirmClick={deleteCategory}
                  />
               </div>
            }
            <Button children="Cancel"
               className={`col-12 mt-2 btn-white btn-lg ${category.id === 0 ? "col-sm-6" : "col-sm-4"}`}
               onClick={() => { errorAlert.clear(); resetImageUpload(); props.onClose(); }} />
         </div>
      </Modal >
   );
};

declare type IProps = {
   category: Category;
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
   modalRef?: any;
};
export default CategoryModal;
