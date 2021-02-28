
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Container from '../../components/Container';
const About = (props: IProps) => {
   const [aboutUs, setAboutUs] = useState("");

   useEffect(() => {
      fetch(`${window.location.origin}/public/markdowns/AboutUs.md`).then((result) => {
         if (result.status == 200)
            result.text().then(termsAndCondition => {
               setAboutUs(termsAndCondition);
            });
      });
   }, []);
   return (
      <>
         <PageHeader title="About Us" />
         <Container>
            <div className="row col-12 justify-content-center  p-3 mb-5 bg-white ml-auto mr-auto">
               <img className="col-12 pm-0 mb-4" src="public/images/stand.png" />
               <div className="col-12 col-md-10 col-lg-8 py-5 about-us-text">
                  <ReactMarkdown>{aboutUs}</ReactMarkdown>
               </div>
            </div>
         </Container>
      </>
   );
};

declare type IProps = {
};
export default About;
