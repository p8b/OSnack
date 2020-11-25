import React, { useEffect, useState } from 'react';
import { Category } from 'osnack-frontend-shared/src/_core/apiModels';
import { API_URL } from 'osnack-frontend-shared/src/_core/constant.Variables';
import { getBase64fromUrlImage, sleep } from 'osnack-frontend-shared/src/_core/appFunc';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import ButtonPopupConfirm from 'osnack-frontend-shared/src/components/Buttons/ButtonPopupConfirm';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { useCreateCategory } from '../../hooks/apiCallers/category/Post.Category';
import { useModifyCategory } from '../../hooks/apiCallers/category/Put.Category';
import { useDeleteCategory } from '../../hooks/apiCallers/category/Delete.Category';
import Alert, { AlertObj, AlertTypes, Error } from 'osnack-frontend-shared/src/components/Texts/Alert';

const CategoryModal = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [category, setCategory] = useState(new Category());
   const [imageBase64, setImageBase64] = useState("");
   const [originalImageBase64, setOriginalImageBase64] = useState("");
   useEffect(() => {
      setCategory(props.category);
      /// if the category already exists get the image and convert it to string base64
      if (props.category.id > 0) {
         sleep(500).then(() => { setAlert(alert.Loading); });
         getBase64fromUrlImage(`${API_URL}/${props.category.imagePath}`)
            .then(imgBase64 => {
               setImageBase64(imgBase64 as string);
            });
         getBase64fromUrlImage(`${API_URL}/${props.category.originalImagePath}`)
            .then(originalImgBase64 => {
               setOriginalImageBase64(originalImgBase64 as string);
               setAlert(alert.Clear);
            }).catch(() => {
               setAlert(alert.addSingleWarning("Image Not Found!"));
            });

      }
   }, [props.category]);

   const createCategory = async () => {

      let errors = new AlertObj([], AlertTypes.Error);

      if (category.name == "")
         errors.List.push(new Error("0", "Category name is required."));

      if (category.imageBase64 == "" || category.originalImageBase64 == "")
         errors.List.push(new Error("1", "Image Required."));

      if (errors.List.length > 0) {
         setAlert(errors);
         return;
      }
      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useCreateCategory(category).then(result => {
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            setAlert(alert.Clear);
            resetImageUpload();
            props.onSuccess();
         }
      });
   };
   const updateCategory = async () => {
      let errors = new AlertObj([], AlertTypes.Error);

      if (category.name == "")
         errors.List.push(new Error("0", "Category name is required."));

      if (category.imageBase64 == "" || category.originalImageBase64 == "")
         errors.List.push(new Error("1", "Image Required."));

      if (errors.List.length > 0) {
         setAlert(errors);
         return;
      }

      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useModifyCategory(category).then(result => {

         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            setAlert(alert.Clear);
            resetImageUpload();
            props.onSuccess();
         }
      });
   };
   const deleteCategory = async () => {

      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useDeleteCategory(category).then(result => {

         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            setAlert(alert.Clear);
            resetImageUpload();
            props.onSuccess();
         }
      });
   };

   const resetImageUpload = () => {
      setImageBase64("");
      setOriginalImageBase64("");
   };
   const onImageUploaded = (croppedImage: string, originalImage: string) => {
      category.imageBase64 = croppedImage;
      category.originalImageBase64 = originalImage;
   };
   const onImageUploadError = (errMsg: string) => {
      let errors = new AlertObj([], AlertTypes.Error);
      errors.List.push(new Error("0", errMsg));
      setAlert(errors);
   };
   const onImageUploadLoading = (progress: number) => {
      let errors = new AlertObj();
      errors.Type = AlertTypes.Warning;
      if (progress < 100)
         errors.List.push(new Error("0", `uploading ${progress}%`));
      setAlert(errors);
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

         <Alert alert={alert}
            className="col-12 mb-2"
            onClosed={() => { setAlert(alert.Clear); }}
         />

         {/***** buttons ****/}
         <div className="row col-12 p-0 m-0 ">
            {category.id === 0 ?
               <Button children="Create"
                  className="col-12 mt-2 btn-green col-sm-6 btn-lg"
                  onClick={createCategory} />
               :
               <div className="row col-12 col-sm-8 p-0 m-0">
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
               onClick={() => { setAlert(alert.Clear); resetImageUpload(); props.onClose(); }} />
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
