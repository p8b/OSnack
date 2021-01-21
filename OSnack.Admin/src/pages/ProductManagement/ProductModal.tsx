import React, { useEffect, useRef, useState } from 'react';
import { Category, Product, ProductUnitTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import { getBase64fromUrlImage } from 'osnack-frontend-shared/src/_core/appFunc';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import InputDropDown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';
import { Toggler } from 'osnack-frontend-shared/src/components/Inputs/Toggler';
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { usePostProduct, usePutProduct, useDeleteProduct } from '../../SecretHooks/useProductHook';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import { API_URL } from 'osnack-frontend-shared/src/_core/constant.Variables';
import ProductNutritionalInfoModal from './ProductNutritionalInfoModal';
import ModalFooter from 'osnack-frontend-shared/src/components/Modals/ModalFooter';

const ProductModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [product, setProduct] = useState(new Product());
   const [productUnitTypeList] = useState(ProductUnitTypeList);
   const [imageBase64, setImageBase64] = useState("");
   const [originalImageBase64, setOriginalImageBase64] = useState("");
   const [nutritionalInfoModalIsOpen, setNutritionalInfoModalIsOpen] = useState(false);
   const [isNewImageSet, setIsNewImageSet] = useState(false);

   useEffect(() => {
      return () => { isUnmounted.current = true; };
   }, []);
   useEffect(() => {
      setProduct(props.product);
      if (props.product.id && props.product.id > 0) {
         setIsNewImageSet(false);
         errorAlert.pleaseWait(isUnmounted);
         getBase64fromUrlImage(`${API_URL}/${props.product.imagePath}`)
            .then(imgBase64 => {
               if (isUnmounted.current) return;
               setImageBase64(imgBase64 as string);
            }).catch(error => { if (isUnmounted.current) return; console.log(error); });
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
      errorAlert.clear();
   }, [props.isOpen]);

   const createProduct = (loadingCallBack?: () => void) => {
      console.log(product);
      errorAlert.pleaseWait(isUnmounted);
      usePostProduct(product).then(result => {
         if (isUnmounted.current) return;
         setProduct(result.data);
         resetImageUpload();
         props.onSuccess();
         errorAlert.clear();
         loadingCallBack!();
      }).catch(errors => {
         if (isUnmounted.current) return;
         console.log(errors);
         errorAlert.set(errors);
         loadingCallBack!();
      });
   };
   const updateProduct = (loadingCallBack?: () => void) => {

      let prod = product;
      if (!isNewImageSet) {
         prod.imageBase64 = '';
         prod.originalImageBase64 = '';
      }

      errorAlert.pleaseWait(isUnmounted);
      usePutProduct(product).then(result => {
         if (isUnmounted.current) return;
         setProduct(result.data);
         resetImageUpload();
         props.onSuccess();
         errorAlert.clear();
         loadingCallBack!();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
      });

   };

   const deleteProduct = (loadingCallBack?: () => void) => {
      errorAlert.pleaseWait(isUnmounted);
      useDeleteProduct(product.id!).then(() => {
         if (isUnmounted.current) return;
         resetImageUpload();
         errorAlert.clear();
         props.onSuccess();
         loadingCallBack!();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
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
      <Modal className="col-12 col-sm-10 col-md-9 col-lg-6"
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
            <Input label="Name*"
               value={product.name}
               onChange={i => { setProduct({ ...product, name: i.target.value }); }}
               className="col-12"
               showDanger={errorAlert.checkExistFilterRequired("Name")}
            />
            <Input label="Stock Quantity*"
               type="number"
               positiveNumbersOnly
               value={product.stockQuantity}
               onChange={i => { setProduct({ ...product, stockQuantity: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExistFilterRequired("UnitQuantity")}
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
            <Input label="Unit Quantity*"
               type="number"
               positiveNumbersOnly
               value={product.unitQuantity}
               onChange={i => { setProduct({ ...product, unitQuantity: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExistFilterRequired("UnitQuantity")}
            />

            <InputDropDown dropdownTitle={productUnitTypeList.find((pu) => pu.Value == product.unitType)?.Name || "Select Option"}
               label="Unit Type*"
               showDanger={errorAlert.checkExistFilterRequired("UnitType")}
               className="col-12 col-sm-6 " >
               {productUnitTypeList.map(productUnitType =>
                  <button className="dropdown-item" key={productUnitType.Id}
                     onClick={() => { setProduct({ ...product, unitType: productUnitType.Value }); }} >
                     {productUnitType.Name}
                  </button>
               )}
            </InputDropDown>

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
            <ProductNutritionalInfoModal
               isOpen={nutritionalInfoModalIsOpen}
               alert={errorAlert}
               nutritionalInfo={product.nutritionalInfo}
               onSubmit={(info) => { setProduct({ ...product, nutritionalInfo: info }); setNutritionalInfoModalIsOpen(false); }}
            />
            <TextArea label="Description"
               rows={5}
               value={product.description}
               onChange={i => { setProduct({ ...product, description: i.target.value }); }}
               className="col-12 col-sm-6" />

            <ImageUpload className="col-12 col-sm-6 mt-4"
               modifiedImageBase64={imageBase64}
               originalImageBase64={originalImageBase64}
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
            onCreate={product.id != 0 ? undefined : createProduct}
            onUpdate={product.id === 0 ? undefined : updateProduct}
            onDelete={product.id === 0 ? undefined : deleteProduct}
            enableLoadingCreate={isUnmounted}
            enableLoadingUpdate={isUnmounted}
            enableLoadingDelete={isUnmounted}
            onCancel={() => { errorAlert.clear(); resetImageUpload(); props.onClose(); }} />
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
