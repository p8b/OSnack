import React, { useEffect, useRef, useState } from 'react';
import { Category, Product, ProductUnitType } from 'osnack-frontend-shared/src/_core/apiModels';
import { getBase64fromUrlImage, enumToArray } from 'osnack-frontend-shared/src/_core/appFunc';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import InputDropDown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';
import { Toggler } from 'osnack-frontend-shared/src/components/Inputs/Toggler';
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import ButtonPopupConfirm from 'osnack-frontend-shared/src/components/Buttons/ButtonPopupConfirm';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { usePostProduct, usePutProduct, useDeleteProduct } from '../../SecretHooks/useProductHook';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import { API_URL } from 'osnack-frontend-shared/src/_core/constant.Variables';
import ProductNutritionalInfoModal from './ProductNutritionalInfoModal';

const ProductModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [product, setProduct] = useState(new Product());
   const [productUnitTypeList] = useState(enumToArray(ProductUnitType));
   const [imageBase64, setImageBase64] = useState("");
   const [originalImageBase64, setOriginalImageBase64] = useState("");
   const [nutritionalInfoModalIsOpen, setNutritionalInfoModalIsOpen] = useState(false);
   const [isNewImageSet, setIsNewImageSet] = useState(false);

   useEffect(() => {
      setProduct(props.product);
      /// if the category already exists get the image and convert it to string base64
      if (props.product.id && props.product.id > 0) {
         setIsNewImageSet(false);
         errorAlert.PleaseWait(500, isUnmounted);
         getBase64fromUrlImage(`${API_URL}/${props.product.imagePath}`)
            .then(imgBase64 => {
               if (isUnmounted.current) return;
               setImageBase64(imgBase64 as string);
            });
         getBase64fromUrlImage(`${API_URL}/${props.product.originalImagePath}`)
            .then(originalImgBase64 => {
               if (isUnmounted.current) return;
               setOriginalImageBase64(originalImgBase64 as string);
               errorAlert.clear();
            }).catch(() => {
               if (isUnmounted.current) return;
               errorAlert.setSingleWarning("", "Image Not Found!");
            });
      }
   }, [props.product]);
   useEffect(() => {
      if (!props.isOpen)
         setNutritionalInfoModalIsOpen(false);
   }, [props.isOpen]);

   const createProduct = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      usePostProduct(product).then(product => {
         if (isUnmounted.current) return;
         setProduct(product);
         resetImageUpload();
         props.onSuccess();
         errorAlert.clear();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };
   const updateProduct = async () => {

      let prod = product;
      if (!isNewImageSet) {
         prod.imageBase64 = '';
         prod.originalImageBase64 = '';
      }

      errorAlert.PleaseWait(500, isUnmounted);
      usePutProduct(product).then(product => {
         if (isUnmounted.current) return;
         setProduct(product);
         resetImageUpload();
         props.onSuccess();
         errorAlert.clear();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });

   };

   const deleteProduct = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useDeleteProduct(product).then(message => {
         if (isUnmounted.current) return;
         resetImageUpload();
         errorAlert.clear();
         props.onSuccess();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });

   };
   const resetImageUpload = () => {
      setImageBase64("");
      setOriginalImageBase64("");
   };
   const onImageUploaded = (croppedImage: string, originalImage: string) => {
      product.imageBase64 = croppedImage;
      product.originalImageBase64 = originalImage;
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
         <div className="row">
            <PageHeader className="col-12 col-sm-6" title={product.id === 0 ? "New Product" : "Update Product"} />
            <div className="col-12 col-sm-6 mt-auto mb-auto" >
               <Toggler
                  className="toggler-xlg circle col pb-3"
                  lblValueTrue="Shop Status Active"
                  lblValueFalse="Shop Status Disabled"
                  value={product.status || false}
                  onChange={i => { setProduct({ ...product, status: i }); }}
               />
            </div>
         </div>
         {/***** Name ****/}
         <div className="row">
            <Input label="Name*"
               value={product.name}
               onChange={i => { setProduct({ ...product, name: i.target.value }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExistFilterRequired("Name")}
            />

            <InputDropDown dropdownTitle={product.category?.name || "Select Option"}
               label="Category*"
               showDanger={errorAlert.checkExistFilterRequired("Category")}
               className="col-12 col-sm-6 " >
               {props.categoryList.map(category =>
                  <button className="dropdown-item" key={category.id}
                     onClick={() => { setProduct({ ...product, category: category }); }} >
                     {category.name}
                  </button>
               )}
            </InputDropDown>
         </div>
         {/***** Net Quantity ****/}
         <div className="row">
            <Input label="Unit Quantity*"
               type="number"
               positiveNumbersOnly
               value={product.unitQuantity}
               onChange={i => { setProduct({ ...product, unitQuantity: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExistFilterRequired("UnitQuantity")}
            />

            <InputDropDown dropdownTitle={productUnitTypeList.find((pu) => pu.value == product.unitType)?.name || "Select Option"}
               label="Unit Type*"
               className="col-12 col-sm-6 " >
               {productUnitTypeList.map(productUnitType =>
                  <button className="dropdown-item" key={productUnitType.id}
                     onClick={() => { setProduct({ ...product, unitType: productUnitType.value as ProductUnitType }); }} >
                     {productUnitType.name}
                  </button>
               )}
            </InputDropDown>

         </div>
         {/***** Price,  Energy KJ & Kcal ****/}
         <div className="row">
            <Input label="Price* (£)"
               type="number"
               positiveNumbersOnly
               value={product.price}
               onChange={i => { setProduct({ ...product, price: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExistFilterRequired("Price")}

            />
            <div className="col-12 col-sm-6 m-auto">
               <Button className="btn btn-lg btn-blue col-12 pb-sm-2"
                  children={`Add Nutritional Info`}
                  onClick={() => { setNutritionalInfoModalIsOpen(true); }}
               />
            </div>
            {/***** Nutritional information Modal ****/}
            <ProductNutritionalInfoModal isOpen={nutritionalInfoModalIsOpen}
               alert={errorAlert}
               nutritionalInfo={product.nutritionalInfo}
               onSubmit={(info) => { setProduct({ ...product, nutritionalInfo: info }); setNutritionalInfoModalIsOpen(false); }}
            />
         </div>
         {/***** Description ****/}
         <div className="row">
            <TextArea label="Description"
               rows={5}
               value={product.description}
               onChange={i => { setProduct({ ...product, description: i.target.value }); }}
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
         <div className="row col-12 p-0 m-0 ">
            {product.id === 0 ?
               <Button children="Create"
                  className="col-12 mt-2 btn-green col-sm-6 btn-lg"
                  onClick={createProduct} />
               :
               <div className="row col-12 col-sm-8 p-0 m-0">
                  <ButtonPopupConfirm title="Update"
                     popupMessage="Are you sure?"
                     className="col-12 mt-2 col-sm-6"
                     btnClassName="btn-green"
                     onConfirmClick={updateProduct}
                  />
                  <ButtonPopupConfirm title="Delete"
                     popupMessage="Are you sure?"
                     className="col-12 col-sm-6 mt-2"
                     btnClassName="btn-red"
                     onConfirmClick={deleteProduct}
                  />
               </div>
            }
            <Button children="Cancel"
               className={`col-12 mt-2 btn-white btn-lg ${product.id === 0 ? "col-sm-6" : "col-sm-4"}`}
               onClick={() => { errorAlert.clear(); resetImageUpload(); props.onClose(); }} />
         </div>
      </Modal >
   );
};

declare type IProps = {
   product: Product;
   categoryList: Category[];
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
   modalRef?: any;
};
export default ProductModal;
