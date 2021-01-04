
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
      <Container>
         <PageHeader title="About Us" />
         <div className="col-12 p-3 mb-3 bg-white ml-auto mr-auto">
            <img className="col-12 pm-0 mb-4" src="public/images/stand.png" />
            <ReactMarkdown>{aboutUs}</ReactMarkdown>
         </div>
      </Container>
   );
};

declare type IProps = {
};
export default About;
