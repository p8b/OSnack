import React, { useContext, useEffect, useRef, useState } from 'react';

import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Product, ProductUnitType } from 'osnack-frontend-shared/src/_core/apiModels';
import { useProductAndRelateProduct } from 'osnack-frontend-shared/src/hooks/PublicHooks/useProductHook';
import { Redirect, useHistory } from 'react-router-dom';
import { API_URL } from 'osnack-frontend-shared/src/_core/constant.Variables';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import Container from '../../components/Container';
import QuantityInput from 'osnack-frontend-shared/src/components/Inputs/QuantityInput';
import Tabs from './Tabs';
import ShopItem from '../Shop/ShopItem';
import { ShopContext } from '../../_core/shopContext';
import Carousel from '../../components/Carousel';

const ProductPage = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [product, setProduct] = useState(new Product());
   const [redirectToShop, setRedirectToShop] = useState<boolean>(false);
   const [carouselItems, setCarouselItems] = useState<any[]>([]);
   const history = useHistory();
   const basket = useContext(ShopContext);

   useEffect(() => () => { isUnmounted.current = true; }, []);

   useEffect(() => {
      errorAlert.PleaseWait(500, isUnmounted);
      const uriPathNameArr = window.location.pathname.split('/').filter(val => val.length > 0);
      if (uriPathNameArr.length === 4 && uriPathNameArr[1].toLowerCase() == "product") {
         useProductAndRelateProduct(uriPathNameArr[2], decodeURI(uriPathNameArr[3]))
            .then(result => {
               if (isUnmounted.current) return;
               setProduct(result.data.product!);
               window.scrollTo(0, 0);
               getCarouselItems(result.data.productList!);
               errorAlert.clear();
            }).catch(alert => {
               if (isUnmounted.current) return;
               errorAlert.set(alert);
            });
      } else {
         setRedirectToShop(true);
      }
   }, [window.location.pathname]);
   const getCarouselItems = (productList: Product[]) => {
      let arr: any[] = [];
      productList.map((product => {
         arr.push(<ShopItem key={product.id} product={product} />);
      }));
      setCarouselItems(arr);
   };
   if (redirectToShop)
      return <Redirect to="/Shop" />;

   return (
      <Container className="wide-container m-0">
         <PageHeader title="Product Details" />
         <Alert className="col-12" alert={errorAlert.alert} />
         <Container className="bg-white">
            {product.id && product.id > 0 &&
               <div className="col-12 p-3 ">
                  <nav >
                     <ol className="breadcrumb">
                        <li className="breadcrumb-item" onClick={() => { history.push("/Shop"); }}>Shop</li>
                        <li className="breadcrumb-item" onClick={() => { history.push(`/Shop/Category/${product.category.name}`); }}>{product.category.name}</li>
                        <li className="breadcrumb-item active" >{product.name}</li>
                     </ol>
                  </nav>
                  <div className="row ">
                     <div className="col-12 col-sm-4 pb-4 p-sm-4 justify-text-center">
                        <img className="shop-card-img" src={`${API_URL}/${product.imagePath}`} alt={name} />
                     </div>
                     <div className="col-12 col-sm-8 p-sm-4 ">
                        <h1>{product.name}</h1>
                        <p>Category: {product.category.name}</p>
                        <p className="pt-4 pb-4">{product.description}</p>
                        <b className="mb-5">£{product.price} ({product.unitQuantity} {ProductUnitType[product.unitType]})</b>
                        <QuantityInput
                           btnOnZeroTitle="Add"
                           btnOnZeroClassName="radius-none btn-green cart-icon"
                           btnMinusClassName="radius-none"
                           btnPlusClassName="radius-none"
                           value={basket.getQuantity(product)}
                           onChange={(val) => { basket.set(product, val); }}
                           className="w-50 pt-3 pb-3"
                        />
                     </div>
                  </div>
                  <div className="row">
                     <Tabs product={product} />
                  </div>
                  <div className="row justify-content-center">
                     <PageHeader title="Related Products" className="line-header-lg col-12" />
                     <Carousel items={carouselItems} />
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
