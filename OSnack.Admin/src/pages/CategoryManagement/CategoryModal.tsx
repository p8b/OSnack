import React, { useEffect, useRef, useState } from 'react';
import { Category } from 'osnack-frontend-shared/src/_core/apiModels';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import ModalFooter from 'osnack-frontend-shared/src/components/Modals/ModalFooter';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { useDeleteCategory, usePostCategory, usePutCategory } from '../../SecretHooks/useCategoryHook';

const CategoryModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [category, setCategory] = useState(new Category());
   const [isNewImageSet, setIsNewImageSet] = useState(false);

   useEffect(() => {
      return () => { isUnmounted.current = true; };
   }, []);

   useEffect(() => {
      setCategory(props.category);
   }, [props.category]);

   useEffect(() => {
      errorAlert.clear();
   }, [props.isOpen]);

   const createCategory = (loadingCallBack?: () => void) => {
      let errors = new AlertObj([], AlertTypes.Error);

      if (category.name == "")
         errors.List.push(new ErrorDto("0", "Category name is required."));

      if (category.imageBase64 == "" || category.originalImageBase64 == "")
         errors.List.push(new ErrorDto("1", "Image Required."));

      if (errors.List.length > 0) {
         errorAlert.set(errors);
         return;
      }
      errorAlert.pleaseWait(isUnmounted);
      usePostCategory(category).then(() => {
         if (isUnmounted.current) return;
         loadingCallBack!();
         errorAlert.clear();
         props.onSuccess();
      }).catch((errors) => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
      });
   };

   const updateCategory = (loadingCallBack?: () => void) => {
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
      }
      if (isUnmounted.current) return;

      errorAlert.pleaseWait(isUnmounted);
      usePutCategory(cat).then(() => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         props.onSuccess();
         loadingCallBack!();
      }).catch((errors) => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
      });
   };

   const deleteCategory = (loadingCallBack?: () => void) => {
      errorAlert.pleaseWait(isUnmounted);
      useDeleteCategory(category.id!).then(() => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         props.onSuccess();
         loadingCallBack!();
      }).catch((errors) => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
      });
   };


   const onImageUploaded = (croppedImage: string, originalImage: string) => {
      category.imageBase64 = croppedImage;
      category.originalImageBase64 = originalImage;
      setIsNewImageSet(true);
   };
   const onImageUploadError = (errMsg: string, alertType: AlertTypes) => {
      let errors = new AlertObj([], alertType);
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
      <Modal className="col-12 col-sm-11 col-md-9 col-lg-6"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title={category.id === 0 ? "New Category" : "Update Category"} />

         {/***** Name ****/}
         <div className="row">
            <Input label="Name*"
               value={category.name}
               onChange={i => { setCategory({ ...category, name: i.target.value }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExistFilterRequired("Name")} />

            {/***** Image upload and show preview button ****/}
            <ImageUpload className="col-12 col-sm-6 mt-4"
               modifiedImagePath={category.imagePath}
               originalImagePath={category.originalImagePath}
               onUploaded={onImageUploaded}
               onError={onImageUploadError}
               onLoading={onImageUploadLoading}
               showDanger={errorAlert.checkExistFilterRequired("ImageBase64")}
            />
         </div>

         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />
         <ModalFooter
            onCreate={category.id != 0 ? undefined : createCategory}
            onUpdate={category.id === 0 ? undefined : updateCategory}
            onDelete={category.id === 0 ? undefined : deleteCategory}
            enableLoadingCreate={isUnmounted}
            enableLoadingUpdate={isUnmounted}
            enableLoadingDelete={isUnmounted}
            onCancel={() => { errorAlert.clear(); props.onClose(); }} />
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
