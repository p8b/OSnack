import React from 'react';
import PageHeader from '../components/Texts/PageHeader';
const PageNotFound = (props: IProps) => {
   return (
      <div className="container wide-container">
         <PageHeader title="(404)" />
         <div className="row">
            <img className="col-md-6 col-12 ml-auto mr-auto"
               src={`/public/images/IdkFace(Mango).png`}
               alt='Page Not Found' />
         </div>
         <div className="row">
            <h4 children="Page Not Found" className="col-md-6 col-12 ml-auto mr-auto text-center" />
         </div>
      </div>
   );
};

declare type IProps = {
};
export default PageNotFound;
