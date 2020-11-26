import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Container from '../../components/Container';
import { useGetAllCategory } from 'osnack-frontend-shared/src/hooks/apiCallers/category/Get.Category';
import { API_URL } from 'osnack-frontend-shared/src/_core/constant.Variables';
import { ShopContext } from '../../_core/shopContext';
import { Category } from 'osnack-frontend-shared/src/_core/apiModels';
import Carousel from '../../components/Carousel';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';

const Home = (props: IProps) => {
   const isUnmounted = useRef(false);
   const [heroImgLoaded, setHeroImgLoaded] = useState(false);
   const [carouselItems, setCarouselItems] = useState<any[]>([]);
   const { shopState, setShopState } = useContext(ShopContext);
   const history = useHistory();

   useEffect(() => {
      window.scrollTo(0, 0);
      var img = new Image();
      img.src = "public/images/hero-img.png";
      img.onload = () => {
         setHeroImgLoaded(true);
      };
      useGetAllCategory().then(result => {
         if (isUnmounted.current) return;
         if (result.alert.List.length === 0) {
            getCarouselItems(result.categoryList);
         }
      });
      return () => { isUnmounted.current = true; };
   }, []);

   const getCarouselItems = (categoryList: Category[]) => {
      let arr = [];
      for (var i = 0; i < categoryList.length; i++) {
         let category = categoryList[i];
         arr.push(
            <div className="row justify-content-center p-2">
               <div className="col p-0 shop-card ">
                  <a className="col link-shop-card-img m-0 justify-text-center"
                     onClick={() => {
                        setShopState({ ...shopState, shopCategoryFilter: category.id.toString() });
                        history.push(`/Shop/Category/${encodeURIComponent(category.name || "")}`);
                     }} >
                     <img src={`${API_URL}\\${category.imagePath}`} alt={category.name} />
                     <span>Shop Now</span>
                  </a>
                  <h1>{category.name}</h1>
               </div>
            </div>
         );
      }
      setCarouselItems(arr);
   };

   return (
      <Container className="wide-container pl-0 pr-0">
         <div className={`hero-container ${heroImgLoaded ? "imgLoaded" : ""} row`}>
            <h1 className="text-white col-12 text-center">Ready to snack?</h1>
            <h3 className="text-white col-12 text-center">
               We provide quality mediterranean products for you to enjoy.
            </h3>
            <div className="col-12 text-center">
               <Link to="/Shop" className='btn btn-orange'>Shop</Link>
            </div>
         </div>
         <div className="col-12 msg-section">
            <h3>
               Treat yourself with <i> delicious </i> and <i> healthy </i> snacks.
            </h3>
            <h5>
               Here at OSnack, we aim to select and provide the best quality snack
               so you can just enjoy the wonderful taste.
            </h5>
         </div>
         <div className="col-12 categories-section">
            <PageHeader className="line-header-lg" title="Categories" />
            <Carousel items={carouselItems} />
         </div>
      </Container >
   );
};
declare type IProps = {
};
export default Home;

