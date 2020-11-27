import React, { useEffect, useRef, useState } from 'react';
import { Category, Product } from 'osnack-frontend-shared/src/_core/apiModels';
import { getBase64fromUrlImage, enumToArray, sleep } from 'osnack-frontend-shared/src/_core/appFunc';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import InputDropDown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';
import { Toggler } from 'osnack-frontend-shared/src/components/Inputs/Toggler';
import Alert, { AlertObj, AlertTypes, Error } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import ButtonPopupConfirm from 'osnack-frontend-shared/src/components/Buttons/ButtonPopupConfirm';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { useCreateProduct } from '../../hooks/apiCallers/product/Post.Product';
import { useModifyProduct } from '../../hooks/apiCallers/product/Put.Product';
import { useDeleteProduct } from '../../hooks/apiCallers/product/Delete.Product';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import { API_URL, ProductUnitType } from 'osnack-frontend-shared/src/_core/constant.Variables';
import ProductNutritionalInfoModal from './ProductNutritionalInfoModal';

const ProductModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const [alert, setAlert] = useState(new AlertObj());
   const [product, setProduct] = useState(new Product());
   const [productUnitTypeList] = useState(enumToArray(ProductUnitType));
   const [imageBase64, setImageBase64] = useState("");
   const [originalImageBase64, setOriginalImageBase64] = useState("");
   const [nutritionalInfoModalIsOpen, setNutritionalInfoModalIsOpen] = useState(false);
   const [isNewImageSet, setIsNewImageSet] = useState(false);

   useEffect(() => {
      setProduct(props.product);
      /// if the category already exists get the image and convert it to string base64
      if (props.product.id > 0) {
         setIsNewImageSet(false);
         sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });
         getBase64fromUrlImage(`${API_URL}/${props.product.imagePath}`)
            .then(imgBase64 => {
               if (isUnmounted.current) return;
               setImageBase64(imgBase64 as string);
            });
         getBase64fromUrlImage(`${API_URL}/${props.product.originalImagePath}`)
            .then(originalImgBase64 => {
               if (isUnmounted.current) return;
               setOriginalImageBase64(originalImgBase64 as string);
               setAlert(alert.Clear);
            }).catch(() => {
               if (isUnmounted.current) return;
               setAlert(alert.addSingleWarning("Image Not Found!"));
            });
      }
   }, [props.product]);
   useEffect(() => {
      if (!props.isOpen)
         setNutritionalInfoModalIsOpen(false);
   }, [props.isOpen]);

   const createProduct = async () => {
      sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });
      useCreateProduct(product).then(result => {
         if (isUnmounted.current) return;
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            resetImageUpload();
            props.onSuccess();
            setAlert(alert.Clear);
         }
      });
   };
   const updateProduct = async () => {

      let prod = product;
      if (!isNewImageSet) {
         prod.imageBase64 = '';
         prod.originalImageBase64 = '';
      }

      sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });

      useModifyProduct(product).then(result => {
         if (isUnmounted.current) return;

         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            resetImageUpload();
            props.onSuccess();
            setAlert(alert.Clear);
         }
      });
   };

   const deleteProduct = async () => {
      sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });
      useDeleteProduct(product).then(result => {
         if (isUnmounted.current) return;
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            resetImageUpload();
            setAlert(alert.Clear);
            props.onSuccess();
         }
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
         <div className="row">
            <PageHeader className="col-12 col-sm-6" title={product.id === 0 ? "New Product" : "Update Product"} />
            <div className="col-12 col-sm-6 mt-auto mb-auto" >
               <Toggler
                  className="toggler-xlg circle col pb-3"
                  lblValueTrue="Shop Status Active"
                  lblValueFalse="Shop Status Disabled"
                  value={product.status}
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
               showDanger={alert.checkExistFilterRequired("Name")}
            />

            <InputDropDown dropdownTitle={product.category?.name || "Select Option"}
               label="Category*"
               showDanger={alert.checkExistFilterRequired("Category")}
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
               showDanger={alert.checkExistFilterRequired("UnitQuantity")}
            />

            <InputDropDown dropdownTitle={productUnitTypeList.find((pu) => pu.id == product.unitType)?.name || "Select Option"}
               label="Unit Type*"
               className="col-12 col-sm-6 " >
               {productUnitTypeList.map(productUnitType =>
                  <button className="dropdown-item" key={productUnitType.id}
                     onClick={() => { setProduct({ ...product, unitType: productUnitType.id }); }} >
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
               showDanger={alert.checkExistFilterRequired("Price")}

            />
            <div className="col-12 col-sm-6 m-auto">
               <Button className="btn btn-lg btn-blue col-12 pb-sm-2"
                  children={`Add Nutritional Info`}
                  onClick={() => { setNutritionalInfoModalIsOpen(true); }}
               />
            </div>
            {/***** Nutritional information Modal ****/}
            <ProductNutritionalInfoModal isOpen={nutritionalInfoModalIsOpen}
               alert={alert}
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


         <Alert alert={alert}
            className="col-12 mb-2"
            onClosed={() => { setAlert(alert.Clear); }}
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
               onClick={() => { setAlert(alert.Clear); resetImageUpload(); props.onClose(); }} />
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
