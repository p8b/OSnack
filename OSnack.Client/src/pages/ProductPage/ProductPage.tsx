import React, { useEffect, useState } from 'react';

import Alert, { AlertObj } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Product } from 'osnack-frontend-shared/src/_core/apiModels';
import { enumToArray, sleep } from 'osnack-frontend-shared/src/_core/appFunc';
import { useGetProduct } from '../../hooks/apiCallers/product/Get.Product';
import { Redirect, useHistory } from 'react-router-dom';
import { API_URL, ProductUnitType } from 'osnack-frontend-shared/src/_core/constant.Variables';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import Container from '../../components/Container';
import QuantityInput from 'osnack-frontend-shared/src/components/Inputs/QuantityInput';
import Tabs from './Tabs';
import ShopItem from '../Shop/ShopItem';

const ProductPage = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [product, setProduct] = useState(new Product());
   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
   const [redirectToShop, setRedirectToShop] = useState<boolean>(false);
   const [quantity, setQuantity] = useState(0);
   const history = useHistory();

   useEffect(() => {
      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      const uriPathNameArr = window.location.pathname.split('/').filter(val => val.length > 0);
      if (uriPathNameArr.length === 4 && uriPathNameArr[1].toLowerCase() == "product") {
         useGetProduct(uriPathNameArr[2], uriPathNameArr[3]).then(result => {
            if (result.alert.List.length > 0) {
               alert.List = result.alert.List;
               alert.Type = result.alert.Type;
               setAlert(alert);
            }
            else {
               setProduct(result.product);
               window.scrollTo(0, 0);
               setRelatedProducts(result.relatedProducts);
               setAlert(alert.Clear);
            }
         });
      } else {
         setRedirectToShop(true);
      }
   }, [window.location.pathname]);

   if (redirectToShop)
      return <Redirect to="/Shop" />;
   return (
      <Container className="wide-container m-0">
         <PageHeader title="Product Details" />
         <Alert className="col-12" alert={alert} />
         <Container className="bg-white">
            {product.id > 0 &&
               <div className="col-12 p-3 ">
                  <nav >
                     <ol className="breadcrumb">
                        <li className="breadcrumb-item" onClick={() => { history.push("/Shop"); }}>Shop</li>
                        <li className="breadcrumb-item" onClick={() => { history.push(`/Shop/Category/${product.category.name}`); }}>{product.category.name}</li>
                        <li className="breadcrumb-item active" >{name}</li>
                     </ol>
                  </nav>
                  <div className="row ">
                     <div className="col-12 col-sm-4 pb-4 p-sm-4 justify-text-center">
                        <img className="shop-card-img" src={`${API_URL}/${product.imagePath}`} alt={name} />
                     </div>
                     <div className="col-12 col-sm-8 p-sm-4 ">
                        <h1>{name}</h1>
                        <p>Category: {product.category.name}</p>
                        <p className="pt-4 pb-4">{product.description}</p>
                        <b className="mb-5">£{product.price} ({product.unitQuantity} {enumToArray(ProductUnitType).filter(t => t.id == product.unitType)[0]?.name})</b>
                        <QuantityInput
                           btnOnZeroTitle="Add to basket"
                           value={quantity}
                           onChange={(val) => { setQuantity(val); }}
                           className="w-50 pt-3 pb-3"
                        />
                     </div>
                  </div>
                  <div className="row">
                     <Tabs product={product} />
                  </div>
                  <div className="row justify-content-center">
                     <PageHeader title="Related Products" className="line-header-lg col-12" />
                     <div className="row w-100 p-3 justify-content-center">
                        {relatedProducts.map((product) => <ShopItem product={product} />)}
                     </div>
                  </div>
               </div>
            }
         </Container>
      </Container>
   );
};

declare type IProps = {
};
export default ProductPage;
